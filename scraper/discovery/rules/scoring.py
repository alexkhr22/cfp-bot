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

def cfp_score(text: str, keywords: list[str]) -> int:
    score = 0

    for kw in keywords:
        if kw in text:
            score += 1

    for kw in STRONG_CFP_HINTS:
        if kw in text:
            score += 2

    return score
