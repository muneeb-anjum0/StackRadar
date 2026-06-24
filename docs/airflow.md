# Airflow

Airflow is behind a Docker Compose profile so the normal StackRadar app stays light.

Start Airflow:

```bash
bash scripts/airflow-up.sh
```

PowerShell:

```powershell
.\scripts\airflow-up.ps1
```

Open `http://localhost:8080` and sign in with:

- username: `admin`
- password: `admin`

DAG:

- `stackradar_refresh_pipeline`

Tasks:

1. `collect_remotive`
2. `collect_adzuna`
3. `consume_kafka_events`
4. `clean_jobs`
5. `build_analytics`
6. `run_quality_checks`

The DAG uses the same Python modules as the scripts. In direct mode, the Kafka consume task logs that it is skipped. In Kafka mode, it drains the `raw_jobs` topic before cleaning.

Stop Airflow:

```bash
bash scripts/airflow-down.sh
```
