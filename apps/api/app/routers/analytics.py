from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.analytics import CountItem, OverviewOut, RoleAnalyticsOut, SkillGapRequest, SkillGapResponse, SkillTrendOut, SourceSummaryOut
from app.services.analytics_service import distribution, overview, role_analytics, skill_gap, skill_trends, source_summary, top_roles, top_skills

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview", response_model=OverviewOut)
def get_overview(db: Session = Depends(get_db)):
    return overview(db)


@router.get("/top-skills", response_model=list[CountItem])
def get_top_skills(db: Session = Depends(get_db)):
    return top_skills(db)


@router.get("/top-roles", response_model=list[CountItem])
def get_top_roles(db: Session = Depends(get_db)):
    return top_roles(db)


@router.get("/work-modes", response_model=list[CountItem])
def get_work_modes(db: Session = Depends(get_db)):
    return distribution(db, "work_mode")


@router.get("/seniority", response_model=list[CountItem])
def get_seniority(db: Session = Depends(get_db)):
    return distribution(db, "seniority")


@router.get("/role/{role}", response_model=RoleAnalyticsOut)
def get_role(role: str, db: Session = Depends(get_db)):
    return role_analytics(db, role)


@router.get("/skill-trends", response_model=list[SkillTrendOut])
def get_skill_trends(db: Session = Depends(get_db)):
    return skill_trends(db)


@router.get("/sources", response_model=SourceSummaryOut)
def get_sources(db: Session = Depends(get_db)):
    return source_summary(db)


@router.post("/skill-gap", response_model=SkillGapResponse)
def post_skill_gap(payload: SkillGapRequest, db: Session = Depends(get_db)):
    return skill_gap(db, payload.target_role, payload.current_skills)
