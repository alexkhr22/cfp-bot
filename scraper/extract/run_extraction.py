import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
from openai import AsyncOpenAI

from .io import load_json, save_json
from .normalize import clean_markdown_for_extraction
from .sanitize import sanitize_markdown
from .extractor import extract_cfp


async def main():
    load_dotenv()
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    BASE_DIR = Path(__file__).resolve().parents[1]
    INPUT_PATH = BASE_DIR / "outputs" / "cfp_links_only.json"
    OUTPUT_PATH = BASE_DIR / "outputs" / "final_cfps.json"

    links = load_json(INPUT_PATH)
    existing = load_json(OUTPUT_PATH)
    existing_urls = {e["url"] for e in existing}

    run_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    async with AsyncWebCrawler(headless=True) as crawler:
        for entry in links:
            url = entry["url"]
            if url in existing_urls:
                continue

            try:
                result = await crawler.arun(url=url, config=run_config)
                if not result.success or not result.markdown:
                    continue

                md = clean_markdown_for_extraction(result.markdown)
                md = sanitize_markdown(md)

                cfp = await extract_cfp(client, md, url)
                if cfp:
                    existing.append(cfp)
                    existing_urls.add(url)
                    save_json(OUTPUT_PATH, existing)

            except Exception:
                continue

    print(f"📄 Extraction abgeschlossen: {len(existing)} CFPs")


if __name__ == "__main__":
    asyncio.run(main())
