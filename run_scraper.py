import asyncio
import subprocess

from pathlib import Path
from scraper.discovery.rules.start_discovering import main as start_discovering
from scraper.discovery.ai.run_filter import main as run_filter
from scraper.extract.run_extraction import main as run_cfp_extraction
from scraper.postprocess.run_postprocess import main as run_postprocess

BASE_DIR = Path(__file__).resolve().parent
NODE_SCRIPT = BASE_DIR / "scripts" / "importActiveCfps.js"


async def scrape_pipeline():
    print("🧭 Starte Rule-based Discovery")
    await start_discovering()

    print("🤖 Starte AI-based Discovery")
    await run_filter()

    print("🤖 Starte CFP Extraction")
    await run_cfp_extraction()

    print("🗓️ Post-Processing (Deadlines)")
    run_postprocess()

    print("📦 Importiere CFPs in DB (Node.js)")
    subprocess.run(
        ["node", str(NODE_SCRIPT)],
        cwd=BASE_DIR,
        check=True
    )

    print("✅ Scrape Pipeline abgeschlossen")


def run():
    asyncio.run(scrape_pipeline())


if __name__ == "__main__":
    run()
