import json
import logging

from datetime import datetime
from scraper.prompts.extractor import build_cfp_extraction_prompt
from .ids import generate_canonical_id
from scraper.ai.openai_client import async_chat

logger = logging.getLogger(__name__)

async def extract_cfp(
    markdown: str,
    url: str,
) -> dict | None:

    prompt = build_cfp_extraction_prompt()
    logger.debug(f"OpenAI Extraction für {url}")

    try:
        data = await async_chat(
            system_prompt=prompt,
            user_prompt=f"URL: {url}\n\nCONTENT:\n{markdown}",
            temperature=0.0,
        )

        data["url"] = url
        data["id"] = generate_canonical_id(data)
        data["extractedAt"] = datetime.utcnow().isoformat() + "Z"

        return data

    except Exception:
        logger.exception(f"OpenAI Extraction failed: {url}")
        return None