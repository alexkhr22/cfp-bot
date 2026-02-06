from datetime import datetime
import json

CURRENT_YEAR = datetime.utcnow().year

with open("cfp_links_only.json", "r", encoding="utf-8") as f:
    data = json.load(f)

cleaned = [c for c in data if c.get("targetYear", CURRENT_YEAR) >= CURRENT_YEAR]

with open("cfp_links_only.json", "w", encoding="utf-8") as f:
    json.dump(cleaned, f, indent=2, ensure_ascii=False)
