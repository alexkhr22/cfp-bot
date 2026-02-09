import json
from concurrent.futures import ThreadPoolExecutor
import asyncio
from openai import OpenAI


def build_prompt(links: list, target_year: int) -> str:
    link_block = "\n".join(
        f"ID: {i} | TEXT: '{l.get('text', 'N/A')}' | URL: {l['url']}"
        for i, l in enumerate(links)
    )

    return f"""
You are an expert academic scout for the year {target_year}.
Your goal is to find pages where researchers can find submission details.

### CRITICAL INSTRUCTION FOR TAG/CATEGORY LINKS:
- Academic conferences often use URLs like '/tag/papers' as CFP landing pages.
- IF the URL contains '{target_year}' AND keywords like 'papers', classify as 'cfp'.

### CLASSIFICATIONS:
1. cfp
2. supporting
3. irrelevant

### INPUT:
{link_block}

### OUTPUT FORMAT (JSON ONLY):
{{
  "results": [
    {{
      "index": 0,
      "classification": "cfp | supporting | irrelevant",
      "confidence": 0.0-1.0,
      "reason": "Why"
    }}
  ]
}}
"""


async def classify_batch(
    client: OpenAI,
    links: list,
    target_year: int,
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
                    "content": build_prompt(links, target_year),
                },
            ],
            temperature=0.0,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content).get("results", [])

    with ThreadPoolExecutor() as pool:
        return await loop.run_in_executor(pool, _sync_call)
