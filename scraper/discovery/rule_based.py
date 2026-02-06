import json
import asyncio
import re
from urllib.parse import urljoin, urlparse
from crawl4ai import AsyncWebCrawler
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

SCRAPER_DIR = BASE_DIR.parent
SITES_PATH = SCRAPER_DIR / "sites.json"
FILTERED_LINKS_PATH = SCRAPER_DIR / "outputs" / "filtered_links.json"
CONFIG_PATH = SCRAPER_DIR / "config.json"

def load_config():
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"config.json nicht gefunden unter: {CONFIG_PATH}")

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

CONFIG = load_config()

NEGATIVE_HINTS = [
    "home", "menu", "about", "overview",
    "program", "schedule", "proceedings",
    "workshop", "tutorial", "panel",
    "student", "volunteer", "meet",
    "committee", "organizers", "speakers",
    "registration", "tickets", "venue",
    "news", "blog"
]

STRONG_CFP_HINTS = [
    "cfp",
    "call for papers",
    "paper submission",
    "submit paper",
    "submission deadline",
    "important dates",
    "camera ready",
    "deadline", 
    "dates", 
    "date", 
    "submission",
    "papers",
    "submit"
]

def is_relevant_year(text: str) -> bool:
    years = re.findall(r"(20\d{2})", text)
    if not years:
        return True
    return CONFIG["TARGET_YEAR"] in map(int, years)

def cfp_score(text: str) -> int:
    score = 0
    for kw in CONFIG["KEYWORDS"]:
        if kw in text:
            score += 1
    for kw in STRONG_CFP_HINTS:
        if kw in text:
            score += 2
    return score

async def get_relevant_links(crawler, url, depth=0, seen=None):
    if seen is None:
        seen = set()

    if depth > CONFIG["MAX_DEPTH"] or url in seen:
        return []

    seen.add(url)
    print(f"{'  '*depth}🔍 Ebene {depth} | {url}")

    try:
        res = await crawler.arun(
            url=url,
            bypass_cache=True,
            page_timeout=CONFIG["TIMEOUT_PER_PAGE"] * 1000
        )
    except Exception:
        return []

    if not res.success or not res.links:
        return []

    found = []
    base_domain = urlparse(url).netloc
    all_links = res.links.get("internal", []) + res.links.get("external", [])

    for link in all_links:
        full_url = urljoin(url, link.get("href", ""))
        text = (link.get("text") or "").lower().strip()
        combined = (full_url + " " + text).lower()

        # harte Ausschlüsse
        if any(bad in combined for bad in CONFIG["BLACKLIST"]):
            continue
        if any(bad in combined for bad in NEGATIVE_HINTS):
            continue
        if not is_relevant_year(combined):
            continue

        is_calendar = any(x in full_url.lower() for x in [
            "google.com/calendar", ".ics", "add-to-calendar"
        ])

        score = cfp_score(combined)

        # Entscheidungsregel
        if is_calendar or score >= 2:
            found.append({
                "text": text or "CFP Link",
                "url": full_url
            })

    # Rekursion NUR auf gute Kandidaten
    if depth < CONFIG["MAX_DEPTH"]:
        next_urls = [
            l["url"] for l in found
            if urlparse(l["url"]).netloc == base_domain
        ][:CONFIG["LINKS_PER_LEVEL"]]

        for nurl in next_urls:
            for sub in await get_relevant_links(crawler, nurl, depth + 1, seen):
                if sub["url"] not in {f["url"] for f in found}:
                    found.append(sub)

    return found

async def main():
    with open(SITES_PATH, "r", encoding="utf-8") as f:
        urls = json.load(f).get("urls", [])

    results = {}

    async with AsyncWebCrawler(headless=True) as crawler:
        for url in urls:
            print(f"\n🚀 Start: {url}")
            results[url] = await get_relevant_links(crawler, url)

    with open(FILTERED_LINKS_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n🏁 CFP Discovery abgeschlossen")

if __name__ == "__main__":
    asyncio.run(main())
