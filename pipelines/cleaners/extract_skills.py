import re


SKILL_DICTIONARY: dict[str, dict[str, list[str] | str]] = {
    "Python": {"category": "Language", "aliases": ["python"]},
    "JavaScript": {"category": "Language", "aliases": ["javascript", "js"]},
    "TypeScript": {"category": "Language", "aliases": ["typescript", "ts"]},
    "C#": {"category": "Language", "aliases": ["c#", "c sharp"]},
    ".NET": {"category": "Backend", "aliases": [".net", "dotnet", "asp.net"]},
    "React": {"category": "Frontend", "aliases": ["react", "react.js", "reactjs", "react js"]},
    "Node.js": {"category": "Backend", "aliases": ["node", "node.js", "nodejs"]},
    "Express.js": {"category": "Backend", "aliases": ["express", "express.js", "expressjs"]},
    "FastAPI": {"category": "Backend", "aliases": ["fastapi", "fast api"]},
    "Django": {"category": "Backend", "aliases": ["django"]},
    "Flask": {"category": "Backend", "aliases": ["flask"]},
    "REST APIs": {"category": "Backend", "aliases": ["rest api", "rest apis", "restful"]},
    "GraphQL": {"category": "Backend", "aliases": ["graphql"]},
    "SQL": {"category": "Database", "aliases": ["sql"]},
    "PostgreSQL": {"category": "Database", "aliases": ["postgresql", "postgres", "psql"]},
    "MongoDB": {"category": "Database", "aliases": ["mongodb", "mongo"]},
    "Redis": {"category": "Database", "aliases": ["redis"]},
    "Docker": {"category": "DevOps", "aliases": ["docker"]},
    "Kubernetes": {"category": "DevOps", "aliases": ["kubernetes", "k8s"]},
    "CI/CD": {"category": "DevOps", "aliases": ["ci/cd", "ci cd", "pipelines"]},
    "Linux": {"category": "DevOps", "aliases": ["linux"]},
    "AWS": {"category": "Cloud", "aliases": ["aws", "amazon web services"]},
    "Azure": {"category": "Cloud", "aliases": ["azure"]},
    "Git": {"category": "Tools", "aliases": ["git", "github", "gitlab"]},
    "Kafka": {"category": "Data Science", "aliases": ["kafka"]},
    "Airflow": {"category": "Data Science", "aliases": ["airflow"]},
    "Pandas": {"category": "Data Science", "aliases": ["pandas"]},
    "NumPy": {"category": "Data Science", "aliases": ["numpy", "num py"]},
    "Scikit-learn": {"category": "AI/ML", "aliases": ["scikit-learn", "sklearn", "scikit learn"]},
    "TensorFlow": {"category": "AI/ML", "aliases": ["tensorflow"]},
    "PyTorch": {"category": "AI/ML", "aliases": ["pytorch", "torch"]},
    "Power BI": {"category": "Data Science", "aliases": ["power bi", "powerbi"]},
    "Excel": {"category": "Data Science", "aliases": ["excel"]},
    "Testing": {"category": "Tools", "aliases": ["testing", "pytest", "unit tests", "qa"]},
}


def extract_skills(text: str | None) -> list[dict[str, str | float]]:
    if not text:
        return []
    normalized = f" {text.lower()} "
    found: list[dict[str, str | float]] = []
    for skill, meta in SKILL_DICTIONARY.items():
        aliases = meta["aliases"]
        if any(re.search(rf"(?<![\w+#.]){re.escape(alias.lower())}(?![\w+#.])", normalized) for alias in aliases):
            found.append({"name": skill, "category": str(meta["category"]), "confidence": 1.0})
    return found
