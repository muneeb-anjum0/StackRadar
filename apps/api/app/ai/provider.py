from __future__ import annotations

from abc import ABC, abstractmethod


class AiProviderError(RuntimeError):
    pass


class BaseAiProvider(ABC):
    name: str
    model: str | None

    @abstractmethod
    def generate(self, report_type: str, prompt: str, context: dict, token_budget: int) -> str:
        raise NotImplementedError
