import asyncio
import subprocess
import logging
import uuid
import time

from pathlib import Path
from scraper.discovery.rules.start_discovering import main as start_discovering
from scraper.discovery.ai.run_filter import main as run_filter
from scraper.extract.run_extraction import main as run_cfp_extraction
from scraper.postprocess.run_postprocess import main as run_postprocess
from scraper.logging_config import setup_logging


BASE_DIR = Path(__file__).resolve().parent
NODE_SCRIPT = BASE_DIR / "scripts" / "importActiveCfps.cjs"
setup_logging()
RUN_ID = uuid.uuid4().hex[:8]
logger = logging.getLogger(f"{__name__}.{RUN_ID}")

async def scrape_pipeline():
    start_total = time.time()
    logger.info("Starting Pipeline Process")

    try:
        logger.info("Start Rule-based Discovery")
        await start_discovering()

        logger.info("Start AI-based Discovery")
        await run_filter()

        logger.info("Start CFP Extraction")
        await run_cfp_extraction()

        logger.info("Post-Processing (Deadlines)")
        run_postprocess()

        logger.info("Importing CFPs in DB (Node.js)")
        subprocess.run([
            "docker", "compose", "exec",
            "-T",
            "web",
            "node",
            "scripts/importActiveCfps.cjs"
        ], check=True)

        logger.info("Pipeline successfully completed")

    except Exception:
        logger.exception("Pipeline aborted")

    finally:
        duration = time.time() - start_total
        logger.info(f"Pipeline Duration: {duration:.2f}s")


def run():
    asyncio.run(scrape_pipeline())


if __name__ == "__main__":
    run()
