from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.job import JobDetail, JobSearchResponse
from app.services.jobs_service import get_job, list_jobs, search_jobs

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobSearchResponse)
def jobs(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db)):
    total, rows = list_jobs(db, limit=limit, offset=offset)
    return JobSearchResponse(total=total, jobs=rows)


@router.get("/search", response_model=JobSearchResponse)
def search(
    query: str | None = None,
    role: str | None = None,
    skill: str | None = None,
    work_mode: str | None = None,
    seniority: str | None = None,
    source: str | None = None,
    db: Session = Depends(get_db),
):
    total, rows = search_jobs(db, query=query, role=role, skill=skill, work_mode=work_mode, seniority=seniority, source=source)
    return JobSearchResponse(total=total, jobs=rows)


@router.get("/{job_id}", response_model=JobDetail)
def detail(job_id: int, db: Session = Depends(get_db)):
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
