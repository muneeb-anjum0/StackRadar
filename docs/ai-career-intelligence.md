# AI Career Intelligence

StackRadar v4 adds manual AI career reports on top of deterministic analytics. AI does not replace cleaning, skill extraction, role analytics, fit analysis or quality checks.

## Providers

Mock is the default provider:

- works without an API key
- uses real StackRadar analytics
- produces deterministic demo-ready reports
- labels output as local mock AI

OpenRouter is optional:

- uses `OPENROUTER_API_KEY` from backend environment variables
- uses `OPENROUTER_MODEL`, defaulting to `openrouter/auto`
- is never called from the frontend directly
- is never called on page load, navigation, history viewing or normal fit analysis
- returns a clear error if the key is missing, rate-limited or out of credits

## Configuration

Use placeholders only:

```bash
AI_PROVIDER=mock
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/auto
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_APP_NAME=StackRadar
AI_REPORT_CACHE_HOURS=24
AI_OPENROUTER_COOLDOWN_SECONDS=20
```

Never commit API keys. Never expose keys to the frontend.

## Career Plan Flow

The Fit page is now a guided Career Plan:

1. Analyze Fit: deterministic StackRadar analytics, no AI.
2. Generate Career Brief: manual Mock/OpenRouter report grounded in the fit result.
3. Build 4-Week Roadmap: manual roadmap based on missing skills.
4. Generate Portfolio Project Plan: manual project plan tied to target-role gaps.

Mock can be used freely for demos. OpenRouter is selected manually and confirmed before use.

UI clarity rules:

- Analyze Fit shows `AI used: No` and uses only StackRadar role-skill analytics.
- Manual report outputs show `AI used: Yes`, provider, cache state and source data.
- Switching providers does not call OpenRouter.
- Reading AI Reports history does not call OpenRouter.
- OpenRouter can run only from an explicit generation button in Career Plan.

## Cost Controls

OpenRouter is treated like a premium manual action:

- Mock is default.
- OpenRouter must be selected in the UI.
- The UI warns that OpenRouter uses API quota/credits.
- The frontend disables repeated OpenRouter clicks during cooldown.
- The backend enforces a 20-second OpenRouter cooldown.
- Reports with the same role, skills, report type and provider are reused for 24 hours.
- Prompts are compact and use structured analytics only.
- No raw job descriptions or full job dumps are sent.
- Output is capped with a small token budget.

## Grounding

AI reports receive:

- target role
- current skills
- matched skills
- missing skills
- recommended next skills
- top role skills and demand percentages
- role job count
- top companies
- salary range when available
- work mode distribution
- data quality score
- source summary and freshness

Reports must say they are based on the current StackRadar dataset and must not claim to represent the global market.

## Future SaaS Path

BYOK can let users bring their own model keys. Managed AI can use a platform OpenRouter key with paid usage controls. The local product already keeps provider choice, backend-only calls, history and usage tracking in the right shape for that future.
