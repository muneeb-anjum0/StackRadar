from __future__ import annotations

import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.ai.provider import AiProviderError, BaseAiProvider


class OpenRouterProvider(BaseAiProvider):
    name = "openrouter"

    def __init__(self, api_key: str, model: str, site_url: str, app_name: str) -> None:
        self.api_key = api_key
        self.model = model
        self.site_url = site_url
        self.app_name = app_name

    def generate(self, report_type: str, prompt: str, context: dict, token_budget: int) -> str:
        if not self.api_key:
            raise AiProviderError("OpenRouter is not configured. Add OPENROUTER_API_KEY on the backend or use Mock mode.")

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are StackRadar's career intelligence assistant. Use only the provided analytics context. "
                        "Do not invent stats, salaries, companies, jobs, or market-wide claims."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.25,
            "max_tokens": token_budget,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": self.site_url,
            "X-Title": self.app_name,
        }
        request = Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
        try:
            with urlopen(request, timeout=35) as response:
                data = json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")[:260]
            raise AiProviderError(f"OpenRouter request failed: {exc.code}. {detail}. Try Mock mode if quota or credits are unavailable.") from exc
        except URLError as exc:
            raise AiProviderError(f"OpenRouter request failed: {exc.reason}. Try Mock mode.") from exc

        choices = data.get("choices") or []
        message = (choices[0].get("message") if choices else {}) or {}
        text = str(message.get("content") or "").strip()
        if not text:
            raise AiProviderError("OpenRouter returned an empty response. Try Mock mode or retry later.")
        return text
