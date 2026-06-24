from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.ai.provider import AiProviderError
from app.ai.schemas import AiReportOut, AiReportRequest, AiStatusOut, AiUsageOut
from app.core.db import get_db
from app.services.ai_service import ai_status, generate_report, get_report, list_reports, usage

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/status", response_model=AiStatusOut)
def status():
    return ai_status()


def _generate(report_type: str, payload: AiReportRequest, db: Session) -> AiReportOut:
    try:
        return generate_report(db, report_type, payload)
    except (ValueError, AiProviderError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/career-report", response_model=AiReportOut)
def career_report(payload: AiReportRequest, db: Session = Depends(get_db)):
    return _generate("career_report", payload, db)


@router.post("/learning-roadmap", response_model=AiReportOut)
def learning_roadmap(payload: AiReportRequest, db: Session = Depends(get_db)):
    return _generate("learning_roadmap", payload, db)


@router.post("/project-suggestions", response_model=AiReportOut)
def project_suggestions(payload: AiReportRequest, db: Session = Depends(get_db)):
    return _generate("project_suggestions", payload, db)


@router.post("/role-fit", response_model=AiReportOut)
def role_fit(payload: AiReportRequest, db: Session = Depends(get_db)):
    return _generate("role_fit", payload, db)


@router.post("/skill-gap-brief", response_model=AiReportOut)
def skill_gap_brief(payload: AiReportRequest, db: Session = Depends(get_db)):
    return _generate("skill_gap_brief", payload, db)


@router.post("/job-quality", response_model=AiReportOut)
def job_quality(payload: AiReportRequest, db: Session = Depends(get_db)):
    return _generate("job_quality", payload, db)


@router.get("/reports", response_model=list[AiReportOut])
def reports(
    report_type: str | None = Query(default=None),
    provider: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return list_reports(db, report_type=report_type, provider=provider)


@router.get("/reports/{report_id}", response_model=AiReportOut)
def report_detail(report_id: int, db: Session = Depends(get_db)):
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="AI report not found.")
    return report


@router.get("/usage", response_model=AiUsageOut)
def ai_usage(db: Session = Depends(get_db)):
    return usage(db)
