import logging

from urllib.parse import urljoin, urlparse, urlunparse
from crawl4ai import AsyncWebCrawler
from .robots import is_allowed_by_robots
from .scoring import cfp_score
from scraper.utils.years import is_relevant_year
from .filters import is_calendar_link, NEGATIVE_HINTS

logger = logging.getLogger(__name__)

def normalize_url(url: str) -> str:
    """
    Canonical URL:
    - drop query + fragment
    - normalize trailing slash
    - lowercase scheme + netloc
    """
    parsed = urlparse(url)
    return urlunparse((
        parsed.scheme.lower(),
        parsed.netloc.lower(),
        parsed.path.rstrip("/"),
        "",  # params
        "",  # query
        "",  # fragment
    ))


async def get_relevant_links(
    crawler: AsyncWebCrawler,
    url: str,
    config: dict,
    depth: int = 0,
    seen: set[str] | None = None,
) -> list[dict]:

    if seen is None:
        seen = set()

    norm_url = normalize_url(url)

    if depth > config["MAX_DEPTH"] or norm_url in seen:
        logger.debug(f"Max depth erreicht: {norm_url}")
        return []

    if not is_allowed_by_robots(norm_url):
        logger.debug(f"{'  '*depth}robots.txt blocking: {norm_url}")
        return []

    seen.add(norm_url)
    logger.debug(f"Crawling: {norm_url} | depth={depth}")

    try:
        result = await crawler.arun(
            url=norm_url,
            bypass_cache=True,
            page_timeout=config["TIMEOUT_PER_PAGE"] * 1000,
        )
    except Exception:
        logger.exception(f"Crawler ERROR at {norm_url}")
        return []

    if not result.success or not result.links:
        return []

    found: list[dict] = []
    found_urls: set[str] = set()

    base_domain = urlparse(norm_url).netloc

    all_links = (
        result.links.get("internal", [])
        + result.links.get("external", [])
    )

    for link in all_links:
        raw_href = link.get("href", "")
        if not raw_href:
            continue

        full_url = normalize_url(urljoin(norm_url, raw_href))

        if full_url in seen or full_url in found_urls:
            continue

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
            found_urls.add(full_url)

    if depth < config["MAX_DEPTH"]:
        next_urls = [
            entry["url"]
            for entry in found
            if urlparse(entry["url"]).netloc == base_domain
        ][:config["LINKS_PER_LEVEL"]]

        for next_url in next_urls:
            sub_links = await get_relevant_links(
                crawler,
                next_url,
                config,
                depth + 1,
                seen,
            )

            for sub in sub_links:
                if sub["url"] not in found_urls:
                    found.append(sub)
                    found_urls.add(sub["url"])

    return found
