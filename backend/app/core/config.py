from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str = "change-this-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440

    API_PREFIX: str = "/api"
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000

    FILE_UPLOAD_DIR: Path = Path("./app/uploads")

    LOG_LEVEL: str = "INFO"

    REDIS_URL: Optional[str] = None
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

    @property
    def is_redis_enabled(self) -> bool:
        return bool(self.REDIS_URL and self.CELERY_BROKER_URL and self.CELERY_RESULT_BACKEND)


def load_settings() -> Settings:
    base_env = Path(".env")
    example_env = Path(".env.example")

    if base_env.exists():
        return Settings()
    if example_env.exists():
        return Settings(_env_file=str(example_env))
    return Settings()


settings = load_settings()