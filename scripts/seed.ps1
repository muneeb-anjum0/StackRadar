$env:PYTHONPATH = "apps/api;."
Write-Host "Seeding repeatable demo jobs from pipelines/collectors/sample_jobs.json"
python pipelines/collectors/seed_jobs.py
