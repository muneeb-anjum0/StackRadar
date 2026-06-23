from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.quality import QualityIssue, QualitySummary
from app.services.quality_service import latest_summary, quality_issues

router = APIRouter(prefix="/quality", tags=["quality"])


@router.get("/summary", response_model=QualitySummary)
def summary(db: Session = Depends(get_db)):
    return latest_summary(db)


@router.get("/issues", response_model=list[QualityIssue])
def issues(db: Session = Depends(get_db)):
    return quality_issues(db)
