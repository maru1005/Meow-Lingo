# backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserResponse)
def me(current_user=Depends(get_current_user)):
    """
    ログイン状態の確認およびユーザー情報の取得

    - Firebase ID Token を検証
    - ユーザーがなければ作成
    - ユーザー情報を返却
    """
    return {
        "firebase_uid": current_user.firebase_uid,
        "email": current_user.email,
        "created_at": current_user.created_at,
    }
