# backend/app/core/middleware.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class MiddlewareConfig:
    """ミドルウェア設定の一元管理"""
    
    @staticmethod
    def setup_cors(app: FastAPI) -> None:
        """CORS設定"""
        logger.info("🔧 Setting up CORS middleware...")
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
            allow_methods=settings.CORS_ALLOW_METHODS,
            allow_headers=settings.CORS_ALLOW_HEADERS,
        )
        logger.info(f"✅ CORS allowed origins: {settings.CORS_ORIGINS}")

    @staticmethod
    def setup_all(app: FastAPI) -> None:
        """全ミドルウェアのセットアップ"""
        logger.info("🚀 Initializing all middlewares...")
        MiddlewareConfig.setup_cors(app)
        logger.info("✅ All middlewares initialized")
