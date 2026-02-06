import os
import json
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
import openai
from concurrent.futures import ThreadPoolExecutor

# =====================================
# ENV & CONFIG
# =====================================

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

TARGET_YEAR = 2026
BATCH_SIZE = 12 

# =====================================
# PATHS
# =====================================

BASE_DIR = Path(__file__).resolve().parent
SCRAPER_DIR = BASE_DIR.parent

INPUT_PATH = SCRAPER_DIR / "outputs" / "filtered_links.json"
OUTPUT_PATH = SCRAPER_DIR / "outputs" / "cfp_links_only.json"

# =====================================
# HELPER
# =====================================

CALENDAR_HINTS = ["google.com/calendar", ".ics", "add-to-calendar", "calendar/event"]
DEADLINE_HINTS = [
    "abstract due", "full paper due", "submission due", "resubmission due",
    "decisions notification", "notification of acceptance", "paper due",
    "metadata due", "submission deadline", "call for contribution"
]

def is_calendar_link(url: str) -> bool:
    url = url.lower()
    return any(hint in url for hint in CALENDAR_HINTS)

def has_deadline_signal(text: str) -> bool:
    text = text.lower()
    return any(hint in text for hint in DEADLINE_HINTS)

def chunked(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i:i + size]

def load_existing_results(path: Path) -> list:
    if not path.exists():
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

# =====================================
# KI: OPTIMIERTE KLASSIFIKATION
# =====================================

async def ai_classify_batch(links: list) -> list:
    """Führt den synchronen OpenAI Call in einem Thread aus, um asyncio nicht zu blockieren."""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        return await loop.run_in_executor(pool, _sync_ai_classify, links)

def _sync_ai_classify(links: list) -> list:
    link_block = "\n".join(
        f"ID: {i} | TEXT: '{l.get('text', 'N/A')}' | URL: {l['url']}"
        for i, l in enumerate(links)
    )

    prompt = f"""
You are an expert academic scout for the year {TARGET_YEAR}.
Your goal is to find pages where researchers can find submission details.

### CRITICAL INSTRUCTION FOR TAG/CATEGORY LINKS:
- Academic conferences (like CHI, CSCW, NeurIPS) often use URLs like '/tag/papers', '/tracks/', or '/authors' as their MAIN CFP landing page.
- IF the URL contains '{TARGET_YEAR}' AND a keyword like 'papers', 'submissions', or 'authors', classify it as 'cfp' even if the link text is short.

### CLASSIFICATIONS:
1. **cfp**: 
   - Direct Call for Papers.
   - Landing pages for submission tracks (e.g., /tag/papers, /call-for-participation).
   - "Important Dates" or "Submission Guidelines".
2. **supporting**: Templates, login to EasyChair, or general info.
3. **irrelevant**: Past years (2025 and older), non-author info (venue, travel, committee).

### INPUT:
{link_block}

### OUTPUT FORMAT (JSON ONLY):
{{
  "results": [
    {{
      "index": 0,
      "classification": "cfp | supporting | irrelevant",
      "confidence": 0.0-1.0,
      "reason": "Why is this (not) a CFP?"
    }}
  ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a precise classifier for academic events. Output only JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        return data.get("results", [])
    except Exception as e:
        print(f"❌ KI Fehler: {e}")
        return []

# =====================================
# MAIN
# =====================================

async def main():
    if not INPUT_PATH.exists():
        print(f"❌ Input nicht gefunden: {INPUT_PATH}")
        return

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        grouped = json.load(f)

    # Flache Liste aller Links erstellen
    all_links = []
    for links in grouped.values():
        if isinstance(links, list):
            for l in links:
                if isinstance(l, dict) and "url" in l:
                    all_links.append(l)

    print(f"🔗 Gesamt Links im Input: {len(all_links)}")

    existing_results = load_existing_results(OUTPUT_PATH)
    existing_urls = {item["url"] for item in existing_results}
    
    new_links = [l for l in all_links if l["url"] not in existing_urls]
    print(f"🆕 Neue Links für KI: {len(new_links)}")

    if not new_links:
        print("✅ Alles bereits verarbeitet.")
        return

    processed_entries = []

    for batch in chunked(new_links, BATCH_SIZE):
        print(f"\n🤖 Analysiere Batch ({len(batch)} Links)...")
        results = await ai_classify_batch(batch)

        # Mapping der Ergebnisse zurück auf die Links
        for r in results:
            idx = r.get("index")
            if idx is None or idx >= len(batch): continue
            
            link = batch[idx]
            url = link["url"]
            text = link.get("text", "")

            # 1. Filter: Kalender
            if is_calendar_link(url):
                continue

            classification = r.get("classification", "irrelevant")

            # 2. Filter: Manuelles Override bei starken Signalen
            if classification != "cfp" and has_deadline_signal(text):
                classification = "cfp"

            if classification == "cfp":
                entry = {
                    "url": url,
                    "text": text,
                    "reason": r.get("reason", "KI Classification"),
                    "classification": "cfp",
                    "discoveredAt": datetime.utcnow().isoformat() + "Z",
                    "targetYear": TARGET_YEAR,
                    "confidence": r.get("confidence", 0.0)
                }
                processed_entries.append(entry)
                print(f"➕ CFP gefunden: {url}")
            else:
                pass 

        # Zwischenspeichern nach jedem Batch
        current_all = existing_results + processed_entries
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(current_all, f, indent=2, ensure_ascii=False)

    print(f"\n🏁 Fertig! {len(processed_entries)} neue CFPs identifiziert.")

if __name__ == "__main__":
    asyncio.run(main())