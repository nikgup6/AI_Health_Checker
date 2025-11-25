# app/core/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_URL: str = os.getenv(
        "DB_URL",
        "postgresql://ai_health_db_zuw2_user:aD2TEwCndmyrrVhqHWCok8AKd1VMhizf@dpg-d4inpqqdbo4c73bt4lj0-a.oregon-postgres.render.com/ai_health_db_zuw2"
    )
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_JUDGE_MODEL: str = os.getenv("GEMINI_JUDGE_MODEL", "gemini-2.0-flash")
    LATENCY_MAX_MS: int = int(os.getenv("LATENCY_MAX_MS", "3000"))

    def validate(self):
        if not self.DB_URL:
            raise ValueError("DB_URL is not set")
        if not self.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set")

settings = Settings()
settings.validate()
