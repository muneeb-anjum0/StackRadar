from __future__ import annotations

from datetime import datetime
from pathlib import Path

from airflow import DAG
from airflow.operators.bash import BashOperator


PROJECT_ROOT = Path("/opt/stackradar")
DEPS_PATH = "/opt/airflow/stackradar_deps"
BASE_ENV = {
    "PYTHONPATH": f"{DEPS_PATH}:/opt/stackradar/apps/api:/opt/stackradar",
}


def stackradar_command(command: str) -> str:
    install_deps = (
        f"if [ ! -d {DEPS_PATH}/sqlalchemy ]; then "
        f"python -m pip install --quiet --no-warn-conflicts --target {DEPS_PATH} -r {PROJECT_ROOT}/apps/api/requirements.txt; "
        "fi"
    )
    return f"cd {PROJECT_ROOT} && {install_deps} && export PYTHONPATH={DEPS_PATH}:/opt/stackradar/apps/api:/opt/stackradar && {command}"


with DAG(
    dag_id="stackradar_refresh_pipeline",
    start_date=datetime(2026, 1, 1),
    schedule=None,
    catchup=False,
    tags=["stackradar", "local"],
) as dag:
    collect_remotive = BashOperator(
        task_id="collect_remotive",
        bash_command=stackradar_command(
            "python pipelines/collectors/live_collect.py --source remotive --limit ${LIVE_COLLECT_LIMIT:-500} --mode ${PIPELINE_MODE:-direct} --skip-pipeline"
        ),
        env=BASE_ENV,
        append_env=True,
    )

    collect_adzuna = BashOperator(
        task_id="collect_adzuna",
        bash_command=stackradar_command(
            "python pipelines/collectors/live_collect.py --source adzuna --limit ${LIVE_COLLECT_LIMIT:-500} --mode ${PIPELINE_MODE:-direct} --skip-pipeline"
        ),
        env=BASE_ENV,
        append_env=True,
    )

    consume_kafka_events = BashOperator(
        task_id="consume_kafka_events",
        bash_command=stackradar_command(
            'if [ "${PIPELINE_MODE:-direct}" = "kafka" ]; then python pipelines/events/consumer.py --topic raw_jobs --max-messages 1000 --timeout-seconds 30; else echo "Direct mode: no Kafka consume needed."; fi'
        ),
        env=BASE_ENV,
        append_env=True,
    )

    clean_jobs = BashOperator(
        task_id="clean_jobs",
        bash_command=stackradar_command(
            "python -c \"from app.core.db import SessionLocal, create_tables; from pipelines.cleaners.clean_jobs import clean_raw_jobs; create_tables(); db=SessionLocal(); print(clean_raw_jobs(db)); db.close()\""
        ),
        env=BASE_ENV,
        append_env=True,
    )

    build_analytics = BashOperator(
        task_id="build_analytics",
        bash_command=stackradar_command(
            "python -c \"from app.core.db import SessionLocal, create_tables; from pipelines.analytics.build_analytics import build_analytics; create_tables(); db=SessionLocal(); build_analytics(db); db.close()\""
        ),
        env=BASE_ENV,
        append_env=True,
    )

    run_quality_checks = BashOperator(
        task_id="run_quality_checks",
        bash_command=stackradar_command(
            "python -c \"from app.core.db import SessionLocal, create_tables; from pipelines.quality.run_quality_checks import run_quality_checks; create_tables(); db=SessionLocal(); run_quality_checks(db); db.close()\""
        ),
        env=BASE_ENV,
        append_env=True,
    )

    [collect_remotive, collect_adzuna] >> consume_kafka_events >> clean_jobs >> build_analytics >> run_quality_checks
