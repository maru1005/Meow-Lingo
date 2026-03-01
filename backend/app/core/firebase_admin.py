# backend/app/core/firebase_admin.py
import firebase_admin
from firebase_admin import credentials
from app.core.config import settings
import logging
import os

logger = logging.getLogger(__name__)

if not firebase_admin._apps:
    cred_path = settings.FIREBASE_SERVICE_ACCOUNT_PATH

    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        logger.info("✅ Firebase initialized successfully")
    elif settings.ENV == "production":
        # 本番でCredentialがない場合は起動を止める（認証なしで動くのを防ぐ）
        raise RuntimeError(
            f"Firebase credentials not found at '{cred_path}'. "
            "Set FIREBASE_SERVICE_ACCOUNT_PATH or mount the credentials file."
        )
    else:
        # 開発環境のみ: 警告を出して続行（認証エンドポイントは動かないが起動はできる）
        logger.warning(
            f"⚠️ Firebase credentials not found at '{cred_path}'. "
            "Auth endpoints will not work. Set ENV=production to make this a fatal error."
        )