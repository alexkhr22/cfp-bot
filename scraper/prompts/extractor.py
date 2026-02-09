from datetime import datetime


def build_cfp_extraction_prompt() -> str:
    today = datetime.now().strftime("%Y-%m-%d")

    return f"""
You are a senior research assistant. Extract Call for Papers (CFP) details.
Today is {today}.

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
