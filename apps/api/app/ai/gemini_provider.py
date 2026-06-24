from __future__ import annotations

import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.ai.provider import AiProviderError, BaseAiProvider


class GeminiProvider(BaseAiProvider):
    name = "gemini"

    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    def generate(self, report_type: str, prompt: str, context: dict, token_budget: int) -> str:
        if not self.api_key:
            raise AiProviderError("Gemini is not configured. Add GEMINI_API_KEY on the backend or use Mock mode.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": token_budget,
                "topP": 0.8,
            },
        }
        request = Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")[:240]
            raise AiProviderError(f"Gemini request failed: {exc.code}. {detail}") from exc
        except URLError as exc:
            raise AiProviderError(f"Gemini request failed: {exc.reason}") from exc

        candidates = data.get("candidates") or []
        parts = (((candidates[0] if candidates else {}).get("content") or {}).get("parts") or [])
        text = "\n".join(part.get("text", "") for part in parts).strip()
        if not text:
            raise AiProviderError("Gemini returned an empty response. Try Mock mode or retry later.")
        return text
