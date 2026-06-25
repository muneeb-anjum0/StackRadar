from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "StackRadar API"
    database_url: str = "postgresql+psycopg2://stackradar:stackradar@localhost:5432/stackradar"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    ai_provider: str = "mock"
    openrouter_api_key: str = ""
    openrouter_model: str = "openrouter/auto"
    openrouter_site_url: str = "http://localhost:5173"
    openrouter_app_name: str = "StackRadar"
    ai_report_cache_hours: int = 24
    ai_openrouter_cooldown_seconds: int = 20

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
