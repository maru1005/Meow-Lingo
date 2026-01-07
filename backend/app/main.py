from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#  Firebase Admin SDK 初期化（起動時に1回だけ実行される）
from app.core import firebase_admin

from app.api.v1.api import api_router
from app.core.database import engine, Base
from app.models import users, conversations, messages, dictionary_cache 

app = FastAPI(title="English Learning AI API")

# DBスキーマは Alembic で管理するため、
# 起動時に Base.metadata.create_all() は行わない
@app.on_event("startup")
def startup_event():
    pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix="/api/v1")