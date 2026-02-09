import asyncio

from scraper.discovery.rules.start_discovering import main as start_discovering
from scraper.discovery.ai.run_filter import main as run_filter
from scraper.extract.run_extraction import main as run_cfp_extraction

async def scrape_pipeline():
    print("🧭 Starte Rule-based Discovery")
    await start_discovering()

    print("🤖 Starte AI-based Discovery")
    await run_filter()

    print("🤖 Starte CFP Extraction")
    await run_cfp_extraction()

    print("✅ Scrape Pipeline abgeschlossen")


def run():
    asyncio.run(scrape_pipeline())


if __name__ == "__main__":
    run()
