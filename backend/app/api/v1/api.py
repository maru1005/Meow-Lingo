# backend/app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.endpoints import health, chat, auth, user

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(user.router, tags=["user"]) # 追加