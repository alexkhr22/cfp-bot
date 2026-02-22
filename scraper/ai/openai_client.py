import os
import json
from dotenv import load_dotenv
from openai import OpenAI, AsyncOpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
CHAT_AI_API_KEY = os.getenv("CHAT_AI_API_KEY", "").strip()

MODEL = os.getenv("CHAT_MODEL", "gpt-4o")

# -----------------------------------------
# Provider Detection
# -----------------------------------------

if CHAT_AI_API_KEY:
    PROVIDER = "chat_ai"
    API_KEY = CHAT_AI_API_KEY
    BASE_URL = "https://chat-ai.academiccloud.de/v1"
elif OPENAI_API_KEY:
    PROVIDER = "openai"
    API_KEY = OPENAI_API_KEY
    BASE_URL = None
else:
    raise RuntimeError("No API key configured. Set OPENAI_API_KEY or CHAT_AI_API_KEY.")

# -----------------------------------------
# Clients
# -----------------------------------------

if BASE_URL:
    _sync_client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    _async_client = AsyncOpenAI(api_key=API_KEY, base_url=BASE_URL)
else:
    _sync_client = OpenAI(api_key=API_KEY)
    _async_client = AsyncOpenAI(api_key=API_KEY)


# -----------------------------------------
# Chat Wrapper
# -----------------------------------------

async def async_chat(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.0,
) -> dict:

    model = MODEL

    response = await _async_client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)