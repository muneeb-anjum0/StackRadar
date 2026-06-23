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
    if "raw_jobs" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("raw_jobs")}
    statements: list[str] = []
    dialect = engine.dialect.name
    text_type = "TEXT" if dialect == "sqlite" else "VARCHAR(500)"
    datetime_type = "DATETIME" if dialect == "sqlite" else "TIMESTAMP"

    if "job_url" not in columns:
        statements.append(f"ALTER TABLE raw_jobs ADD COLUMN job_url {text_type}")
    if "posted_at" not in columns:
        statements.append(f"ALTER TABLE raw_jobs ADD COLUMN posted_at {datetime_type}")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
