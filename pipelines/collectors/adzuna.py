from __future__ import annotations

import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from pipelines.collectors.base import RawJobRecord, html_to_text, parse_datetime


def fetch_adzuna_jobs(
    query: str = "software developer",
    country: str | None = None,
    limit: int = 500,
    max_pages: int | None = None,
    timeout: int = 20,
) -> list[RawJobRecord]:
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    if not app_id or not app_key:
        print("Skipping Adzuna: ADZUNA_APP_ID and ADZUNA_APP_KEY are not set.")
        return []

    country = country or os.getenv("ADZUNA_COUNTRY", "gb")
    page_size = min(50, max(limit, 1))
    pages = max_pages or max(1, (limit + page_size - 1) // page_size)
    records: list[RawJobRecord] = []

    for page in range(1, pages + 1):
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "what": query,
            "results_per_page": page_size,
            "content-type": "application/json",
        }
        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/{page}?{urlencode(params)}"
        try:
            request = Request(url, headers={"User-Agent": "StackRadar local portfolio collector"})
            with urlopen(request, timeout=timeout) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            print(f"Adzuna request failed on page {page}: {exc}")
            break

        for job in payload.get("results", []):
            location = ", ".join(job.get("location", {}).get("area", []) or [])
            salary_min = job.get("salary_min")
            salary_max = job.get("salary_max")
            salary = None
            if salary_min and salary_max:
                salary = f"{salary_min} - {salary_max}"
            records.append(
                RawJobRecord(
                    source="adzuna",
                    source_job_id=str(job.get("id")) if job.get("id") is not None else None,
                    raw_title=job.get("title"),
                    raw_company=(job.get("company") or {}).get("display_name"),
                    raw_location=location or country.upper(),
                    raw_description=html_to_text(job.get("description")),
                    raw_salary=salary,
                    raw_json=job,
                    job_url=job.get("redirect_url"),
                    posted_at=parse_datetime(job.get("created")),
                )
            )
            if len(records) >= limit:
                return records
    return records[:limit]
