from fastapi import FastAPI
from app.core import firebase_admin
from app.core.middleware import MiddlewareConfig
from app.core.database import engine, Base
from app.models import users, conversations, messages, dictionary_cache 
from app.api.api import api_router 
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="Meow Lingo API")

# ✅ ミドルウェア設定を一元管理
MiddlewareConfig.setup_all(app)

@app.on_event("startup")
def startup_event():
    logger.info("🚀 Application startup")

app.include_router(api_router, prefix="/api")