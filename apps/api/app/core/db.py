from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


settings = get_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    from app.models import analytics, job, skill  # noqa: F401

    Base.metadata.create_all(bind=engine)
    ensure_schema()


def ensure_schema() -> None:
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    if "raw_jobs" not in table_names:
        return

    statements: list[str] = []
    dialect = engine.dialect.name
    text_type = "TEXT" if dialect == "sqlite" else "VARCHAR(500)"
    short_text_type = "VARCHAR(80)"
    datetime_type = "DATETIME" if dialect == "sqlite" else "TIMESTAMP"
    integer_type = "INTEGER"
    float_type = "FLOAT"

    raw_columns = {column["name"] for column in inspector.get_columns("raw_jobs")}
    if "job_url" not in raw_columns:
        statements.append(f"ALTER TABLE raw_jobs ADD COLUMN job_url {text_type}")
    if "posted_at" not in raw_columns:
        statements.append(f"ALTER TABLE raw_jobs ADD COLUMN posted_at {datetime_type}")

    if "pipeline_runs" in table_names:
        pipeline_columns = {column["name"] for column in inspector.get_columns("pipeline_runs")}
        pipeline_additions = {
            "run_type": f"{short_text_type} DEFAULT 'manual'",
            "source": short_text_type,
            "raw_inserted": f"{integer_type} DEFAULT 0",
            "clean_created": f"{integer_type} DEFAULT 0",
            "duplicates_skipped": f"{integer_type} DEFAULT 0",
            "failed_count": f"{integer_type} DEFAULT 0",
        }
        for column, definition in pipeline_additions.items():
            if column not in pipeline_columns:
                statements.append(f"ALTER TABLE pipeline_runs ADD COLUMN {column} {definition}")

    if "source_health" in table_names:
        health_columns = {column["name"] for column in inspector.get_columns("source_health")}
        if "avg_clean_rate" not in health_columns:
            statements.append(f"ALTER TABLE source_health ADD COLUMN avg_clean_rate {float_type} DEFAULT 0")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
