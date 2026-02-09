from pathlib import Path

from scraper.postprocess.na import is_na

from .deadlines import is_deadline_valid
from scraper.extract.io import load_json, save_json


def main():
    BASE_DIR = Path(__file__).resolve().parents[1]

    INPUT_PATH = BASE_DIR / "outputs" / "all_cfps.json"
    OUTPUT_PATH = BASE_DIR / "outputs" / "active_cfps.json"

    all_cfps = load_json(INPUT_PATH)

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

    print(
        f"🗓️ Post-Processing: "
        f"{len(active_cfps)} / {len(all_cfps)} CFPs aktiv"
    )
