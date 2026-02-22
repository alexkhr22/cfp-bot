import json
import logging

from datetime import datetime
from openai import AsyncOpenAI
from scraper.prompts.extractor import build_cfp_extraction_prompt
from .ids import generate_canonical_id

logger = logging.getLogger(__name__)

MODEL = "gpt-4o"

async def extract_cfp(
    client: AsyncOpenAI,
    markdown: str,
    url: str,
) -> dict | None:

    prompt = build_cfp_extraction_prompt()
    logger.debug(f"OpenAI Extraction für {url}")

    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": prompt},
                {
                    "role": "user",
                    "content": f"URL: {url}\n\nCONTENT:\n{markdown}",
                },
            ],
            temperature=0.0,
            response_format={"type": "json_object"},
        )

        data = json.loads(response.choices[0].message.content)

        data["url"] = url
        data["id"] = generate_canonical_id(data)
        data["extractedAt"] = datetime.utcnow().isoformat() + "Z"

        return data

    except Exception:
        logger.exception(f"OpenAI Extraction failed: {url}")
        return None
