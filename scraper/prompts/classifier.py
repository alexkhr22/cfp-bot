def build_classifier_prompt(links: list[dict]) -> str:
    link_block = "\n".join(
        f"ID: {i} | TEXT: '{l.get('text', 'N/A')}' | URL: {l['url']}"
        for i, l in enumerate(links)
    )

    return f"""
You are an expert academic scout for upcoming academic conferences.
Your goal is to find pages where researchers can find submission details.

### CRITICAL INSTRUCTION FOR TAG/CATEGORY LINKS:
- Academic conferences often use URLs like '/tag/papers' as CFP landing pages.
- If a page clearly refers to paper submissions, classify as 'cfp'.

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