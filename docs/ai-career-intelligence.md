# AI Career Intelligence

StackRadar v4 adds manual AI career reports on top of deterministic analytics. AI does not replace cleaning, skill extraction, role analytics or quality checks.

## Providers

Mock is the default provider:

- works without an API key
- uses real StackRadar analytics
- produces deterministic demo-ready reports
- labels output as local mock AI

Gemini is optional:

- uses `GEMINI_API_KEY` from backend environment variables
- uses `GEMINI_MODEL`, defaulting to `gemini-1.5-flash`
- is never called from the frontend
- is never called on page load, refresh or normal skill-gap analysis
- returns a clear error if the key is missing

## Configuration

Use placeholders only:

```bash
AI_PROVIDER=mock
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

Never commit API keys. Never expose keys to the frontend.

## Cost Controls

Gemini is treated like a premium manual action:

- Mock is default.
- Gemini must be selected in the UI.
- The UI warns that Gemini uses API quota.
- The frontend disables repeated Gemini clicks during cooldown.
- The backend enforces a 20-second Gemini cooldown.
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

BYOK can let users bring their own model keys. Managed AI can use a platform key with paid usage controls. The local product already keeps provider choice, backend-only calls, history and usage tracking in the right shape for that future.
