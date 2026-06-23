from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from pipelines.collectors.base import RawJobRecord, html_to_text, parse_datetime


REMOTIVE_URL = "https://remotive.com/api/remote-jobs"


def fetch_remotive_jobs(query: str | None = None, limit: int = 500, timeout: int = 20) -> list[RawJobRecord]:
    params = {}
    if query:
        params["search"] = query
    url = f"{REMOTIVE_URL}?{urlencode(params)}" if params else REMOTIVE_URL

    request = Request(url, headers={"User-Agent": "StackRadar local portfolio collector"})
    with urlopen(request, timeout=timeout) as response:
        payload = json.loads(response.read().decode("utf-8"))

    records: list[RawJobRecord] = []
    for job in payload.get("jobs", [])[:limit]:
        location = job.get("candidate_required_location") or job.get("job_type") or "Remote"
        records.append(
            RawJobRecord(
                source="remotive",
                source_job_id=str(job.get("id")) if job.get("id") is not None else None,
                raw_title=job.get("title"),
                raw_company=job.get("company_name"),
                raw_location=location,
                raw_description=html_to_text(job.get("description")),
                raw_salary=job.get("salary"),
                raw_json=job,
                job_url=job.get("url"),
                posted_at=parse_datetime(job.get("publication_date")),
            )
        )
    return records
