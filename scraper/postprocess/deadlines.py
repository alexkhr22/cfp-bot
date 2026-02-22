import logging

from datetime import date
from dateutil.parser import parse

logger = logging.getLogger(__name__)

def is_deadline_valid(deadline: str) -> bool:
    if not deadline or deadline == "n/a":
        return True  

    try:
        deadline_date = parse(deadline).date()
        return deadline_date >= date.today()
    except Exception:
        logger.exception(f"Unable to parse deadline: {deadline}")
        return True  
