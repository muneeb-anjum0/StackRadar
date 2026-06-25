# Future SaaS

Free plan: limited dashboard access, a small number of saved searches and basic skill-gap checks.

BYOK plan: users provide their own AI key for enhanced extraction, resume comparison or personalized recommendations. StackRadar stores key metadata securely but does not own the AI usage bill. Local v4 already keeps OpenRouter as a backend-only manual action, which is the right shape for a future BYOK plan.

Managed plan: the platform key is used for AI-powered features. Pricing can reflect managed inference cost and convenience.

Mock AI remains useful for free demos and development because it uses real StackRadar analytics without spending inference quota.

Paid users should access processed intelligence, saved workflows and premium AI features. They should not receive separate market pipelines unless enterprise isolation becomes a requirement.

The current lens model is the SaaS product surface:

- Jobs proves the evidence behind recommendations.
- Pipeline proves the data can be trusted.
- Career Plan converts market demand into a personal roadmap.
- AI Reports makes provider usage and report history auditable.

Payment flow can be added with checkout sessions, subscription state stored on user accounts and webhook handlers that update plan entitlements.
