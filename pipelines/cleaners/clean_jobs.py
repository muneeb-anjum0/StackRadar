from datetime import datetime
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.job import CleanJob, RawJob
from app.models.skill import JobSkill, Skill
from pipelines.cleaners.extract_skills import extract_skills
from pipelines.cleaners.normalize import clean_company, classify_role, description_hash, detect_seniority, detect_work_mode, normalize_title, parse_location
from pipelines.cleaners.parse_salary import parse_salary


def clean_raw_jobs(db: Session) -> dict[str, int]:
    db.execute(delete(JobSkill))
    db.execute(delete(CleanJob))
    db.commit()

    seen: set[tuple[str | None, str, str | None, str]] = set()
    duplicate_count = 0
    invalid_salary_count = 0
    jobs_without_skills = 0
    skill_cache = {skill.name: skill for skill in db.scalars(select(Skill)).all()}

    for raw in db.scalars(select(RawJob).order_by(RawJob.id)).all():
        title = normalize_title(raw.raw_title)
        role = classify_role(f"{raw.raw_title} {raw.raw_description}")
        company = clean_company(raw.raw_company)
        city, country = parse_location(raw.raw_location)
        salary = parse_salary(raw.raw_salary)
        invalid_salary_count += int(bool(salary["invalid_salary"]))
        fingerprint = (company, title, city, description_hash(raw.raw_description))
        if raw.source_job_id:
            fingerprint = (raw.source, raw.source_job_id, company, "")
        if fingerprint in seen:
            duplicate_count += 1
            continue
        seen.add(fingerprint)

        clean = CleanJob(
            raw_job_id=raw.id,
            normalized_title=title,
            normalized_role=role,
            company=company,
            city=city,
            country=country,
            work_mode=detect_work_mode(raw.raw_location, raw.raw_description),
            seniority=detect_seniority(raw.raw_title, raw.raw_description),
            salary_min=salary["salary_min"],
            salary_max=salary["salary_max"],
            currency=salary["currency"],
            posted_at=None,
            job_url=(raw.raw_json or {}).get("job_url"),
            description_hash=description_hash(raw.raw_description),
            created_at=datetime.utcnow(),
        )
        db.add(clean)
        db.flush()

        extracted = extract_skills(raw.raw_description)
        jobs_without_skills += int(not extracted)
        for item in extracted:
            skill = skill_cache.get(str(item["name"]))
            if not skill:
                skill = Skill(name=str(item["name"]), category=str(item["category"]))
                db.add(skill)
                db.flush()
                skill_cache[skill.name] = skill
            db.add(JobSkill(job_id=clean.id, skill_id=skill.id, confidence=float(item["confidence"])))

    db.commit()
    return {
        "duplicate_count": duplicate_count,
        "invalid_salary_count": invalid_salary_count,
        "jobs_without_skills_count": jobs_without_skills,
    }
