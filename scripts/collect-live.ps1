$env:PYTHONPATH = "apps/api;."
$query = if ($env:DEFAULT_JOB_QUERY) { $env:DEFAULT_JOB_QUERY } else { "software developer" }
$limit = if ($env:LIVE_COLLECT_LIMIT) { $env:LIVE_COLLECT_LIMIT } else { "1000" }
$country = if ($env:ADZUNA_COUNTRY) { $env:ADZUNA_COUNTRY } else { "gb" }

python pipelines/collectors/live_collect.py --source all --limit $limit --query $query --country $country
