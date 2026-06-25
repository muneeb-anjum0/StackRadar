from __future__ import annotations

from app.ai.provider import BaseAiProvider


class MockProvider(BaseAiProvider):
    name = "mock"
    model = "local-mock-v1"

    def generate(self, report_type: str, prompt: str, context: dict, token_budget: int) -> str:
        role = context["target_role"]
        matched = context.get("matched_skills", [])
        missing = context.get("missing_skills", [])
        recommended = context.get("recommended_next_skills", [])
        top_skills = context.get("top_role_skills", [])
        role_count = context.get("role_job_count", 0)
        quality = context.get("data_quality_score", 0)
        confidence = context.get("confidence_note")

        top_line = ", ".join(skill["name"] for skill in top_skills[:5]) or "no dominant skills yet"
        matched_line = ", ".join(matched) or "no matched top-role skills yet"
        missing_line = ", ".join(missing[:6]) or "no major gaps against the current top-role list"
        next_line = ", ".join(recommended[:3]) or (missing[0] if missing else "build one polished role-aligned project")

        if report_type == "learning_roadmap":
            body = (
                f"Snapshot\nBased on the current StackRadar dataset, {role} has {role_count} clean postings and a data quality score of {quality}%.\n\n"
                f"Week 1\nTighten the core fit around {next_line}. Build small exercises and document what you learned.\n\n"
                f"Week 2\nConnect {missing_line} to a practical service or analysis workflow.\n\n"
                f"Week 3\nTurn the work into a portfolio-ready project using the strongest observed role skills: {top_line}.\n\n"
                "Week 4\nPolish the README, add screenshots, write tradeoffs, and map every feature to a job requirement.\n\n"
                f"End-of-roadmap deliverable\nA role-shaped project that proves {next_line} and references the observed top skills: {top_line}.\n\n"
                "Dataset limitation note\nThis is guidance from the local StackRadar dataset, not a claim about the full global market."
            )
        elif report_type == "project_suggestions":
            body = (
                f"Snapshot\nBased on the current StackRadar dataset, the strongest {role} skill signals are {top_line}.\n\n"
                f"Best project\nBuild a Dockerized role-intelligence service that demonstrates {next_line} against realistic job-market data.\n\n"
                f"Why it fits the role\nIt directly closes the visible gaps: {missing_line}.\n\n"
                "Required features\nAdd a REST API, persistence, filtering, validation, tests, and a small documented workflow.\n\n"
                f"Stack\nUse the technologies you already know, then layer in the highest-value missing skills: {missing_line}.\n\n"
                "What to show in README\nShow architecture, setup, screenshots, API examples, tradeoffs, and which job requirements each feature proves.\n\n"
                f"Recruiter-facing bullet\nBuilt a production-style {role} project that proves {next_line} using evidence from StackRadar role-skill demand.\n\n"
                "Dataset limitation note\nUse these as portfolio bets from current StackRadar evidence, not universal hiring truth."
            )
        elif report_type == "role_fit":
            body = (
                f"Snapshot\nBased on the current StackRadar dataset, {role} appears in {role_count} clean postings.\n\n"
                f"Your current fit\nYou already match: {matched_line}.\n\n"
                f"Risk areas\nThe highest-value missing skills are: {missing_line}.\n\n"
                f"Next best move\nPrioritize {next_line}, then show it in one complete project.\n\n"
                "Dataset limitation note\nFit is estimated from observed StackRadar role-skill patterns only."
            )
        elif report_type == "skill_gap_brief":
            body = (
                f"Brief\nFor {role}, your strongest alignment is {matched_line}. The main gap cluster is {missing_line}.\n\n"
                f"Priority\nStart with {next_line}; it is the shortest route from current skills to observed demand.\n\n"
                "Proof\nShip one role-shaped project and explicitly list the skills it demonstrates.\n\n"
                "Dataset limitation note\nThis brief is grounded in the current StackRadar dataset."
            )
        elif report_type == "job_quality":
            body = (
                f"Dataset quality\nThe current quality score is {quality}%, with {role_count} clean postings for {role}.\n\n"
                f"Signal strength\nTop skills are {top_line}. {confidence or ''}\n\n"
                "Usefulness\nThe dataset is useful for directional planning, project selection, and skill sequencing.\n\n"
                "Limitation\nIt should not be treated as a complete view of the global job market."
            )
        else:
            body = (
                f"Snapshot\nBased on the current StackRadar dataset, {role} has {role_count} clean postings. Top skills: {top_line}.\n\n"
                f"Fit score interpretation\nYour current match is {context.get('match_percentage', 0)}%. You match {matched_line}.\n\n"
                f"Missing high-value skills\nFocus on {missing_line}.\n\n"
                f"Next 3 moves\n1. Learn {next_line} through a focused mini-build.\n2. Turn it into one complete portfolio project.\n3. Update your README and resume bullets with measurable proof.\n\n"
                "Dataset limitation note\nThis report uses local StackRadar analytics and does not claim to represent the whole market."
            )

        return f"{body}\n\nGenerated using local mock AI provider."
