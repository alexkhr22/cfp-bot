def clean_markdown_for_extraction(md: str) -> str:
    if not md:
        return ""

    lines = md.splitlines()
    cleaned = [l.strip() for l in lines if len(l.strip()) > 1]
    return "\n".join(cleaned[:800])
