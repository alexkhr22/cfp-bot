import re


STRONG_CFP_HINTS = {
    "cfp",
    "call for papers",
    "paper submission",
    "submit paper",
    "submission deadline",
    "important dates",
    "camera ready",
    "deadline",
    "dates",
    "date",
    "submission",
    "papers",
    "submit",
}


def is_relevant_year(text: str, target_year: int) -> bool:
    years = re.findall(r"(20\d{2})", text)
    if not years:
        return True
    return target_year in map(int, years)


def cfp_score(text: str, keywords: list[str]) -> int:
    score = 0

    for kw in keywords:
        if kw in text:
            score += 1

    for kw in STRONG_CFP_HINTS:
        if kw in text:
            score += 2

    return score
