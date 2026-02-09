from urllib.parse import urljoin, urlparse
from crawl4ai import AsyncWebCrawler

from .robots import is_allowed_by_robots
from .scoring import cfp_score
from scraper.utils.years import is_relevant_year
from .filters import is_calendar_link, NEGATIVE_HINTS


async def get_relevant_links(
    crawler: AsyncWebCrawler,
    url: str,
    config: dict,
    depth: int = 0,
    seen: set[str] | None = None,
) -> list[dict]:

    if not is_allowed_by_robots(url):
        print(f"{'  '*depth}🚫 robots.txt blockiert: {url}")
        return []

    if seen is None:
        seen = set()

    if depth > config["MAX_DEPTH"] or url in seen:
        return []

    seen.add(url)
    print(f"{'  '*depth}🔍 Ebene {depth} | {url}")

    try:
        result = await crawler.arun(
            url=url,
            bypass_cache=True,
            page_timeout=config["TIMEOUT_PER_PAGE"] * 1000,
        )
    except Exception:
        return []

    if not result.success or not result.links:
        return []

    found: list[dict] = []
    base_domain = urlparse(url).netloc

    all_links = (
        result.links.get("internal", [])
        + result.links.get("external", [])
    )

    for link in all_links:
        full_url = urljoin(url, link.get("href", ""))

        if urlparse(full_url).netloc == base_domain:
            if not is_allowed_by_robots(full_url):
                continue

        text = (link.get("text") or "").lower().strip()
        combined = f"{full_url} {text}".lower()

        if any(bad in combined for bad in config["BLACKLIST"]):
            continue

        if any(bad in combined for bad in NEGATIVE_HINTS):
            continue

        if not is_relevant_year(combined):
            continue

        score = cfp_score(combined, config["KEYWORDS"])

        if is_calendar_link(full_url) or score >= 2:
            found.append({
                "text": text or "CFP Link",
                "url": full_url,
            })

    if depth < config["MAX_DEPTH"]:
        next_urls = [
            entry["url"]
            for entry in found
            if urlparse(entry["url"]).netloc == base_domain
        ][:config["LINKS_PER_LEVEL"]]

        for next_url in next_urls:
            for sub in await get_relevant_links(
                crawler,
                next_url,
                config,
                depth + 1,
                seen,
            ):
                if sub["url"] not in {f["url"] for f in found}:
                    found.append(sub)

    return found
