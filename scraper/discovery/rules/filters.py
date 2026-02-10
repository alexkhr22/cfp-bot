NEGATIVE_HINTS = {
    "home", "menu", "about", "overview",
    "program", "schedule", "proceedings",
    "workshop", "tutorial", "panel",
    "student", "volunteer", "meet",
    "committee", "organizers", "speakers",
    "registration", "tickets", "venue",
    "news", "blog",
}


def is_calendar_link(url: str) -> bool:
    return any(x in url.lower() for x in (
        "google.com/calendar",
        ".ics",
        "add-to-calendar",
    ))
