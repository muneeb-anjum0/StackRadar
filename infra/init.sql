CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE IF EXISTS raw_jobs ADD COLUMN IF NOT EXISTS job_url VARCHAR(500);
ALTER TABLE IF EXISTS raw_jobs ADD COLUMN IF NOT EXISTS posted_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS ai_reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(80) NOT NULL,
    target_role VARCHAR(120) NOT NULL,
    current_skills JSONB NOT NULL,
    provider VARCHAR(40) NOT NULL,
    model VARCHAR(120),
    prompt_version VARCHAR(40) NOT NULL DEFAULT 'v1',
    input_hash VARCHAR(64) NOT NULL,
    input_snapshot JSONB NOT NULL,
    output_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reused_from_cache BOOLEAN NOT NULL DEFAULT FALSE,
    token_budget_hint INTEGER NOT NULL DEFAULT 900
);

CREATE INDEX IF NOT EXISTS ix_ai_reports_report_type ON ai_reports(report_type);
CREATE INDEX IF NOT EXISTS ix_ai_reports_target_role ON ai_reports(target_role);
CREATE INDEX IF NOT EXISTS ix_ai_reports_provider ON ai_reports(provider);
CREATE INDEX IF NOT EXISTS ix_ai_reports_input_hash ON ai_reports(input_hash);
CREATE INDEX IF NOT EXISTS ix_ai_reports_created_at ON ai_reports(created_at);
