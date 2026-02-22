import logging

from pathlib import Path
from scraper.postprocess.na import is_na
from .deadlines import is_deadline_valid
from scraper.extract.io import load_json, save_json

logger = logging.getLogger(__name__)

def main():
    BASE_DIR = Path(__file__).resolve().parents[1]

    INPUT_PATH = BASE_DIR / "outputs" / "all_cfps.json"
    OUTPUT_PATH = BASE_DIR / "outputs" / "active_cfps.json"

    all_cfps = load_json(INPUT_PATH)
    logger.info(f"{len(all_cfps)} CFPs before Postprocessing")

    active_cfps = [
        cfp for cfp in all_cfps
        if (
            not (
                is_na(cfp.get("deadline"))
                and is_na(cfp.get("location"))
            )
            and is_deadline_valid(cfp.get("deadline"))
        )
    ]

    save_json(OUTPUT_PATH, active_cfps)
    logger.info(f"{len(active_cfps)} active CFPs")