from __future__ import annotations

import json


PROMPT_VERSION = "v1"

REPORT_INSTRUCTIONS = {
    "career_report": "Create a concise career report with Snapshot, Current fit, Strong skills, Missing high-value skills, Next best moves and Dataset limitation note.",
    "learning_roadmap": "Create a practical 4-week learning roadmap with weekly focus, exercises and portfolio proof.",
    "role_fit": "Explain the user's fit for the target role with evidence, risks, and next moves.",
    "project_suggestions": "Suggest three portfolio projects grounded in the missing and high-demand skills.",
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
        f"Task: {instruction}\n"
        f"Context: {compact_context}"
    )
