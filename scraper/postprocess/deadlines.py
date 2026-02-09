from datetime import date
from dateutil.parser import parse


def is_deadline_valid(deadline: str) -> bool:
    if not deadline or deadline == "n/a":
        return True  # bewusst behalten

    try:
        deadline_date = parse(deadline).date()
        return deadline_date >= date.today()
    except Exception:
        return True  # nichts verwerfen bei Unsicherheit
