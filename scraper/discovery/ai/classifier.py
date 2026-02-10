import json
from concurrent.futures import ThreadPoolExecutor
import asyncio
from openai import OpenAI
from scraper.prompts.classifier import build_classifier_prompt

async def classify_batch(
    client: OpenAI,
    links: list,
) -> list:
    loop = asyncio.get_event_loop()

    def _sync_call():
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise classifier for academic events. Output only JSON.",
                },
                {
                    "role": "user",
                    "content": build_classifier_prompt(links),
                },
            ],
            temperature=0.0,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content).get("results", [])

    with ThreadPoolExecutor() as pool:
        return await loop.run_in_executor(pool, _sync_call)
