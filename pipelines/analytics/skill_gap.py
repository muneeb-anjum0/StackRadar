from app.core.db import SessionLocal
from app.services.analytics_service import skill_gap


def analyze_gap(target_role: str, current_skills: list[str]):
    db = SessionLocal()
    try:
        return skill_gap(db, target_role, current_skills)
    finally:
        db.close()
