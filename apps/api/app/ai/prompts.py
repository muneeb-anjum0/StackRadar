from __future__ import annotations

import json


PROMPT_VERSION = "v2-openrouter"

REPORT_INSTRUCTIONS = {
    "career_report": "Create a Career Brief with Snapshot, Fit score interpretation, Strong skills, Missing high-value skills, Next 3 moves and Warning/limitation note.",
    "learning_roadmap": "Create a 4-Week Roadmap with Week 1, Week 2, Week 3, Week 4 and End-of-roadmap deliverable.",
    "role_fit": "Explain the user's fit for the target role with evidence, risks, and next moves.",
    "project_suggestions": "Create a Portfolio Project Plan with Best project, Why it fits the role, Required features, Stack, backend/data requirements, README proof and a recruiter-facing bullet.",
    "skill_gap_brief": "Write a short skill-gap intelligence brief with priorities and sequencing.",
    "job_quality": "Explain the quality and limitations of the current dataset for this role.",
}


def build_prompt(report_type: str, context: dict) -> str:
    instruction = REPORT_INSTRUCTIONS.get(report_type, REPORT_INSTRUCTIONS["career_report"])
    compact_context = json.dumps(context, ensure_ascii=True, separators=(",", ":"))
    return (
        "You are StackRadar's career intelligence assistant. "
        "Use only the provided StackRadar analytics context. "
        "Do not invent stats, salaries, companies, jobs, or market-wide claims. "
        "Mention that conclusions are based on the current StackRadar dataset. "
        "Keep the output concise, practical, and organized in clear sections. "
        "Make the advice specific enough to become a career plan, not generic learning advice. "
        f"Task: {instruction}\n"
        f"Context: {compact_context}"
    )
