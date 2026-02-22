import requests
import logging

from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

logger = logging.getLogger(__name__)
_robot_cache: dict[str, RobotFileParser | None] = {}


def get_robots_parser(url: str) -> RobotFileParser | None:
    parsed = urlparse(url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    if base in _robot_cache:
        return _robot_cache[base]

    robots_url = f"{base}/robots.txt"

    try:
        response = requests.get(robots_url, timeout=10)
        if response.status_code != 200:
            _robot_cache[base] = None
            return None

        parser = RobotFileParser()
        parser.parse(response.text.splitlines())
        _robot_cache[base] = parser
        return parser

    except Exception:
        _robot_cache[base] = None
        logger.warning(f"robots.txt could not be fetched: {robots_url}")
        return None

def is_allowed_by_robots(url: str, user_agent: str = "*") -> bool:
    parser = get_robots_parser(url)

    if parser is None:
        return True

    return parser.can_fetch(user_agent, url)