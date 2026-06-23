from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from html.parser import HTMLParser
from typing import Any


@dataclass
class RawJobRecord:
    source: str
    source_job_id: str | None
    raw_title: str | None
    raw_company: str | None
    raw_location: str | None
    raw_description: str | None
    raw_salary: str | None
    raw_json: dict[str, Any]
    job_url: str | None = None
    posted_at: datetime | None = None


class _HTMLTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        value = data.strip()
        if value:
            self.parts.append(value)


def html_to_text(value: str | None) -> str | None:
    if not value:
        return value
    parser = _HTMLTextExtractor()
    parser.feed(value)
    text = " ".join(parser.parts)
    return text or value


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    normalized = value.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(normalized).replace(tzinfo=None)
    except ValueError:
        return None
