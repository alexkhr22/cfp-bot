from datetime import date
import re


def get_allowed_years() -> set[int]:
    current_year = date.today().year
    return {current_year, current_year + 1}


def is_relevant_year(text: str) -> bool:
    years = re.findall(r"(20\d{2})", text)

    if not years:
        return True  # kein Jahr → nicht blockieren

    allowed = get_allowed_years()
    return any(int(y) in allowed for y in years)
