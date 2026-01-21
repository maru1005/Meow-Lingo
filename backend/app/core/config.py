# backend/app/core/config.py
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # アプリ設定
    PROJECT_NAME: str = "Meow Lingo API"
    ENV: str = os.getenv("ENV", "development")
    
    # データベース設定
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/english_ai")
    DB_ECHO: bool = os.getenv("DB_ECHO", "true").lower() == "true"
    
    # Firebase設定
    FIREBASE_SERVICE_ACCOUNT_PATH: str = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
    
    # CORS設定（一元管理）
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]
    
    def __init__(self, **data):
        super().__init__(**data)
        # 本番環境での設定調整
        if self.ENV == "production":
            self.CORS_ORIGINS = [os.getenv("FRONTEND_URL", "https://meow-lingo.example.com")]
            self.DB_ECHO = False

    class Config:
        env_file = ".env"

settings = Settings()