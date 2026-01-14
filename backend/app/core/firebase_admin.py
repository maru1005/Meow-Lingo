# backend/app/core/firebase_admin.py
import firebase_admin
from firebase_admin import credentials
from app.core.config import settings
import os

if not firebase_admin._apps:
    # パスが存在するかチェックしてから初期化する（エラー防止）
    if os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
    else:
        # ローカル開発でファイルがないときのための警告（止まらないようにするニャ）
        print(f"⚠️ Warning: Firebase credentials not found at {settings.FIREBASE_SERVICE_ACCOUNT_PATH}")