import re


def generate_canonical_id(cfp: dict) -> str:
    series = str(cfp.get("conferenceSeries", "unknown")).lower().strip()
    title = str(cfp.get("title", "unknown")).lower()

    year_match = re.search(
        r"20\d{2}",
        f"{title} {cfp.get('deadline')} {cfp.get('conferenceDate')}",
    )
    year = year_match.group(0) if year_match else "2026"

    url_slug = re.sub(
        r"[^a-z0-9]",
        "",
        cfp.get("url", "")[-15:],
    )

    clean_series = re.sub(r"[^a-z0-9]", "", series)

    return f"{clean_series}_{year}_{url_slug}"
