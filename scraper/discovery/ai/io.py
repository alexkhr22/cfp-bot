import json
import logging

from pathlib import Path

logging = logging.getLogger(__name__)

def load_json(path: Path) -> list:
    if not path.exists():
        logging.warning(f"JSON file does not exist: {path}")    
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        logging.exception(f"Unable to load JSON from {path}")
        return []


def save_json(path: Path, data: list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
