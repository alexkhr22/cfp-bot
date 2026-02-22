import os
import asyncio
import logging

from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from .batch_utils import chunked
from .filters import is_calendar_link, has_deadline_signal
from .classifier import classify_batch
from .io import load_json, save_json

logger = logging.getLogger(__name__)

def build_entry(link, result):
    return {
        "url": link["url"],
        "text": link.get("text", ""),
        "reason": result.get("reason", "AI classification"),
        "classification": "cfp",
        "confidence": result.get("confidence", 0.0),
        "discoveredAt": datetime.utcnow().isoformat() + "Z",
    }


async def main():
    load_dotenv()

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    BASE_DIR = Path(__file__).resolve().parents[2]
    INPUT_PATH = BASE_DIR / "outputs" / "filtered_links.json"
    OUTPUT_PATH = BASE_DIR / "outputs" / "cfp_candidates.json"

    BATCH_SIZE = 12

    grouped = load_json(INPUT_PATH)

    all_links = [
        l for links in grouped.values()
        for l in links
        if isinstance(l, dict) and "url" in l
    ]

    existing = load_json(OUTPUT_PATH)
    existing_urls = {e["url"] for e in existing}

    new_links = [l for l in all_links if l["url"] not in existing_urls]

    results_acc = []

    logger.info(f"{len(new_links)} new links to classify with AI")

    for i, batch in enumerate(chunked(new_links, BATCH_SIZE), start=1):
        logger.info(f"➡️ Batch {i}: AI-Classification for {len(batch)} urls")
        ai_results = await classify_batch(client, batch)
        logger.debug(f"AI Response Batch {i}: {ai_results}")
        
        for res in ai_results:
            idx = res.get("index")
            if idx is None or idx >= len(batch):
                continue

            link = batch[idx]
            classification = res.get("classification", "irrelevant")

            if classification != "cfp" and has_deadline_signal(link.get("text", "")):
                classification = "cfp"

            if classification == "cfp" and not is_calendar_link(link["url"]):
                results_acc.append(build_entry(link, res))

        save_json(OUTPUT_PATH, existing + results_acc)

    logger.info(f"AI Discovery finished: {len(results_acc)} new CFPs")


if __name__ == "__main__":
    asyncio.run(main())
