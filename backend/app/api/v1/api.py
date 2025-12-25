from fastapi import APIRouter

from app.api.v1.endpoints import health, chat, user


api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(user.router, tags=["user"])