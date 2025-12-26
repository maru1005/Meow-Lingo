from fastapi import APIRouter
from app.api.v1.endpoints import health, chat, user
from app.api.v1.endpoints import chat

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(user.router, tags=["user"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])