# backend/app/api/user.py
from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_user_me(user=Depends(get_current_user)):
    return user