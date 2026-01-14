# backend/app/api/api.py
from fastapi import APIRouter
from . import health, chat, auth, user

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/user", tags=["user"])