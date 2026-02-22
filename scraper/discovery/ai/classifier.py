import asyncio
import logging
from scraper.prompts.classifier import build_classifier_prompt
from scraper.ai.openai_client import async_chat

logger = logging.getLogger(__name__)

async def classify_batch(
    links: list,
) -> list:
    loop = asyncio.get_event_loop()

    try:
        logger.debug(f"AI-Classification for {len(links)} Links")
        result = await async_chat(
            model=None,
            system_prompt="You are a precise classifier for academic events. Output only JSON.",
            user_prompt=build_classifier_prompt(links),
            temperature=0.0,
        )

        return result.get("results", [])
    except Exception:
        logger.exception("Error during AI classification")
        return []    

