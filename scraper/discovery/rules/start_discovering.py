import json
import asyncio
import logging
import os

from pathlib import Path
from crawl4ai import AsyncWebCrawler
from .crawler import get_relevant_links
from .robots import is_allowed_by_robots
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parent
SCRAPER_DIR = BASE_DIR.parents[1]

OUTPUTS_DIR = SCRAPER_DIR / "outputs"
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

SITES_PATH = SCRAPER_DIR / "sites.json"
CONFIG_PATH = SCRAPER_DIR / "config.json"
FILTERED_LINKS_PATH = OUTPUTS_DIR / "filtered_links.json"


def load_config() -> dict:
    load_dotenv()

    logger.debug("Lade config.json + ENV")

    if not CONFIG_PATH.exists():
        logger.critical("config.json fehlt")
        raise FileNotFoundError(f"config.json could not be found: {CONFIG_PATH}")

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)

    # ENV Overrides
    config["MAX_DEPTH"] = int(os.getenv("MAX_DEPTH", config.get("MAX_DEPTH", 5)))
    config["LINKS_PER_LEVEL"] = int(os.getenv("LINKS_PER_LEVEL", config.get("LINKS_PER_LEVEL", 50)))
    config["TIMEOUT_PER_PAGE"] = int(os.getenv("TIMEOUT_PER_PAGE", config.get("TIMEOUT_PER_PAGE", 30)))

    return config


async def main():
    config = load_config()

    with open(SITES_PATH, "r", encoding="utf-8") as f:
        urls = json.load(f).get("urls", [])

    results: dict[str, list[dict]] = {}

    async with AsyncWebCrawler(headless=True) as crawler:
        for url in urls:
            logger.info(f"🚀 Start: {url}")

            if not is_allowed_by_robots(url):
                logger.warning("robots.txt not allowing Scraping")
                continue

            results[url] = await get_relevant_links(
                crawler=crawler,
                url=url,
                config=config,
            )
            logger.info(f"{len(results[url])} found relevant links {url}")

    with open(FILTERED_LINKS_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    logger.info("🏁 CFP Discovery finished")


if __name__ == "__main__":
    asyncio.run(main())
