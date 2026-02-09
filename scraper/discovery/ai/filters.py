CALENDAR_HINTS = [
    "google.com/calendar",
    ".ics",
    "add-to-calendar",
    "calendar/event",
]

DEADLINE_HINTS = [
    "abstract due",
    "full paper due",
    "submission due",
    "resubmission due",
    "decisions notification",
    "notification of acceptance",
    "paper due",
    "metadata due",
    "submission deadline",
    "call for contribution",
]


def is_calendar_link(url: str) -> bool:
    url = url.lower()
    return any(hint in url for hint in CALENDAR_HINTS)


def has_deadline_signal(text: str) -> bool:
    text = text.lower()
    return any(hint in text for hint in DEADLINE_HINTS)
