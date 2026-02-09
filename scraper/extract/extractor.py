import json
from datetime import datetime
from openai import AsyncOpenAI

from .ids import generate_canonical_id

MODEL = "gpt-4o-mini"


async def extract_cfp(
    client: AsyncOpenAI,
    markdown: str,
    url: str,
) -> dict | None:

    prompt = f"""
You are a senior research assistant. Extract Call for Papers (CFP) details.
Today is {datetime.now().strftime('%Y-%m-%d')}.

MANDATORY RULES:
1. NEVER return null for the entire object.
2. If a specific field is missing, use "n/a".
3. Title: If no specific title is found, use the name of the website/event.
4. Dates: Use ISO format (YYYY-MM-DD). If missing, use "n/a".
5. Tracks: Many pages are sub-tracks (e.g., "Posters", "Critiques"). Extract them as individual CFPs.

JSON STRUCTURE:
{{
  "title": "Full name of the track or conference (MANDATORY)",
  "conferenceSeries": "Short acronym or n/a",
  "deadline": "YYYY-MM-DD or n/a",
  "conferenceDate": "YYYY-MM-DD or n/a",
  "location": "City, Country or n/a",
  "submissionForm": "URL or n/a",
  "wordCharacterLimit": "string or n/a",
  "tags": ["hci", "etc"],
  "reviewModel": "Double-blind | Single-blind | n/a",
  "notes": "Extra info or n/a"
}}
"""

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
        return None
