import json
import asyncio
from pathlib import Path
from crawl4ai import AsyncWebCrawler

from .crawler import get_relevant_links
from .robots import is_allowed_by_robots


BASE_DIR = Path(__file__).resolve().parent
SCRAPER_DIR = BASE_DIR.parents[1]

OUTPUTS_DIR = SCRAPER_DIR / "outputs"
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

SITES_PATH = SCRAPER_DIR / "sites.json"
CONFIG_PATH = SCRAPER_DIR / "config.json"
FILTERED_LINKS_PATH = OUTPUTS_DIR / "filtered_links.json"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"config.json nicht gefunden unter: {CONFIG_PATH}")

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


async def main():
    config = load_config()

    with open(SITES_PATH, "r", encoding="utf-8") as f:
        urls = json.load(f).get("urls", [])

    results: dict[str, list[dict]] = {}

    async with AsyncWebCrawler(headless=True) as crawler:
        for url in urls:
            print(f"\n🚀 Start: {url}")

            if not is_allowed_by_robots(url):
                print("🚫 robots.txt verbietet Scraping")
                continue

            results[url] = await get_relevant_links(
                crawler=crawler,
                url=url,
                config=config,
            )

    with open(FILTERED_LINKS_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n🏁 CFP Discovery abgeschlossen")


if __name__ == "__main__":
    asyncio.run(main())
