from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.quality import PipelineRunOut, QualityIssue, QualitySummary, SourceHealthOut, ValidationCheckOut
from app.services.quality_service import latest_pipeline_runs, latest_summary, latest_validations, quality_issues, source_health

router = APIRouter(prefix="/quality", tags=["quality"])


@router.get("/summary", response_model=QualitySummary)
def summary(db: Session = Depends(get_db)):
    return latest_summary(db)


@router.get("/issues", response_model=list[QualityIssue])
def issues(db: Session = Depends(get_db)):
    return quality_issues(db)


@router.get("/pipeline-runs", response_model=list[PipelineRunOut])
def pipeline_runs(db: Session = Depends(get_db)):
    return latest_pipeline_runs(db)


@router.get("/source-health", response_model=list[SourceHealthOut])
def health_by_source(db: Session = Depends(get_db)):
    return source_health(db)


@router.get("/validations", response_model=list[ValidationCheckOut])
def validations(db: Session = Depends(get_db)):
    return latest_validations(db)
