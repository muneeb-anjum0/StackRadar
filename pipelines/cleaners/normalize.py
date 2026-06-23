import hashlib
import re


ROLE_PATTERNS = [
    ("AI Engineer", ["ai engineer", "machine learning engineer", "ml engineer", "llm"]),
    ("Data Scientist", ["data scientist", "ml scientist", "machine learning"]),
    ("Data Analyst", ["data analyst", "business analyst", "power bi", "excel analyst"]),
    ("DevOps Engineer", ["devops", "site reliability", "sre", "cloud engineer"]),
    ("Mobile Developer", ["mobile", "android", "ios", "flutter", "react native"]),
    ("QA Engineer", ["qa", "quality assurance", "test engineer"]),
    ("Full Stack Developer", ["mern", "fullstack", "full stack", "full-stack"]),
    ("Frontend Developer", ["frontend", "front-end", "react"]),
    ("Backend Developer", ["backend", "back-end", "node.js", "django", "fastapi", "python developer"]),
    (".NET Developer", [".net", "dotnet", "c#"]),
    ("Software Engineer", ["software engineer", "software developer", "entry level software"]),
]

SENIORITY_PATTERNS = [
    ("Intern", ["intern", "internship"]),
    ("Entry Level", ["entry level", "fresh", "graduate", "associate"]),
    ("Junior", ["junior", "jr "]),
    ("Senior", ["senior", "sr "]),
    ("Lead", ["lead", "principal", "staff"]),
    ("Mid-Level", ["mid", "2+ years", "3+ years"]),
]

CITY_COUNTRY = {
    "islamabad": ("Islamabad", "Pakistan"),
    "rawalpindi": ("Rawalpindi", "Pakistan"),
    "lahore": ("Lahore", "Pakistan"),
    "karachi": ("Karachi", "Pakistan"),
    "pakistan": (None, "Pakistan"),
    "uae": (None, "UAE"),
    "uk": (None, "UK"),
    "usa": (None, "USA"),
}


def clean_company(company: str | None) -> str | None:
    if not company:
        return None
    value = re.sub(r"\s+", " ", company.strip())
    aliases = {"systems limited": "Systems Ltd", "systems ltd": "Systems Ltd", "remote startup": "Remote Startup"}
    return aliases.get(value.lower(), value)


def normalize_title(title: str | None) -> str:
    if not title:
        return "Unknown"
    text = title.lower()
    replacements = {
        "mern": "Full Stack",
        "fullstack js": "Full Stack",
        "front-end": "Frontend",
        "jr ": "Junior ",
        "dev": "Developer",
    }
    normalized = title
    for old, new in replacements.items():
        normalized = re.sub(old, new, normalized, flags=re.IGNORECASE)
    role = classify_role(normalized)
    return role if role != "Unknown" else normalized.strip()


def classify_role(text: str | None) -> str:
    haystack = (text or "").lower()
    for role, patterns in ROLE_PATTERNS:
        if any(pattern in haystack for pattern in patterns):
            return role
    return "Unknown"


def detect_seniority(title: str | None, description: str | None) -> str:
    haystack = f"{title or ''} {description or ''}".lower()
    for seniority, patterns in SENIORITY_PATTERNS:
        if any(pattern in haystack for pattern in patterns):
            return seniority
    return "Unknown"


def detect_work_mode(location: str | None, description: str | None) -> str:
    haystack = f"{location or ''} {description or ''}".lower()
    if "remote" in haystack:
        return "Remote"
    if "hybrid" in haystack:
        return "Hybrid"
    if any(city in haystack for city in ["islamabad", "rawalpindi", "lahore", "karachi", "onsite", "on-site"]):
        return "Onsite"
    return "Unknown"


def parse_location(location: str | None) -> tuple[str | None, str | None]:
    if not location:
        return None, None
    text = location.lower()
    for key, value in CITY_COUNTRY.items():
        if key in text:
            return value
    return location.strip(), None


def description_hash(description: str | None) -> str:
    normalized = re.sub(r"\s+", " ", (description or "").lower()).strip()
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
