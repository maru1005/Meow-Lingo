# backend/app/core/config.py
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # アプリ設定
    PROJECT_NAME: str = "Meow Lingo API"
    
    # データベース設定
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/english_ai")
    DB_ECHO: bool = os.getenv("DB_ECHO", "true").lower() == "true"
    
    # Firebase設定
    FIREBASE_SERVICE_ACCOUNT_PATH: str = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")

    class Config:
        env_file = ".env"

settings = Settings()