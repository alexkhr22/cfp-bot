import os
import json
import asyncio
import re
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
from openai import AsyncOpenAI

# =====================================
# ENV
# =====================================

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o-mini"

# =====================================
# PATHS
# =====================================

BASE_DIR = Path(__file__).resolve().parent
SCRAPER_DIR = BASE_DIR.parent

INPUT_PATH = SCRAPER_DIR / "outputs" / "cfp_links_only.json"
OUTPUT_PATH = SCRAPER_DIR / "outputs" / "final_cfps.json"
OUTPUT_PATH.parent.mkdir(exist_ok=True, parents=True)

# =====================================
# HELPER & NORMALIZER
# =====================================

def generate_canonical_id(cfp: dict) -> str:
    series = str(cfp.get("conferenceSeries", "unknown")).lower().strip()
    title = str(cfp.get("title", "unknown")).lower()
    
    # Jahr extrahieren
    year_match = re.search(r"20\d{2}", f"{title} {cfp.get('deadline')} {cfp.get('conferenceDate')}")
    year = year_match.group(0) if year_match else "2026"

    # URL-basiertes Fragment für Einzigartigkeit bei Tracks
    url_slug = re.sub(r'[^a-z0-9]', '', cfp.get("url", "")[-15:])
    
    clean_series = re.sub(r'[^a-z0-9]', '', series)
    return f"{clean_series}_{year}_{url_slug}"

def clean_markdown_for_extraction(md: str) -> str:
    if not md: return ""
    lines = md.splitlines()
    cleaned = [l.strip() for l in lines if len(l.strip()) > 1]
    return "\n".join(cleaned[:800])

# =====================================
# KI EXTRAKTION (Kein NULL-Mode)
# =====================================

async def extract_cfp(markdown: str, url: str) -> dict:
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
                {"role": "user", "content": f"URL: {url}\n\nCONTENT:\n{markdown}"} 
            ],
            temperature=0.0,
            response_format={"type": "json_object"}
        )

        data = json.loads(response.choices[0].message.content)
        
        # Sicherstellen, dass essentielle Felder da sind
        data["url"] = url
        data["id"] = generate_canonical_id(data)
        data["extractedAt"] = datetime.utcnow().isoformat() + "Z"

        return data
    except Exception as e:
        print(f"❌ KI-Fehler für {url}: {e}")
        return None

# =====================================
# MAIN LOOP
# =====================================

async def main():
    if not INPUT_PATH.exists(): return

    links = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
    
    # Load existing
    existing_data = []
    if OUTPUT_PATH.exists():
        try:
            existing_data = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
        except: pass

    existing_urls = {item["url"] for item in existing_data}
    
    print(f"📊 Start: {len(existing_urls)} bereits verarbeitet.")
    
    run_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    async with AsyncWebCrawler(headless=True) as crawler:
        for entry in links:
            url = entry["url"]
            if url in existing_urls: continue

            print(f"🔍 Scrape & Extract: {url}")
            
            try:
                result = await crawler.arun(url=url, config=run_config)
                
                if not result.success or not result.markdown:
                    print(f"⚠️ Skip: {url} konnte nicht geladen werden.")
                    continue

                clean_md = clean_markdown_for_extraction(result.markdown)
                cfp = await extract_cfp(clean_md, url)

                if cfp:
                    existing_data.append(cfp)
                    existing_urls.add(url)
                    print(f"✅ Extrahiert: {cfp['title']} (Deadline: {cfp['deadline']})")
                    
                    # Sofort speichern
                    OUTPUT_PATH.write_text(json.dumps(existing_data, indent=2, ensure_ascii=False))
                
            except Exception as e:
                print(f"🔥 Fehler bei {url}: {e}")

    print(f"\n🏁 Fertig! Alle Links verarbeitet.")

if __name__ == "__main__":
    asyncio.run(main())