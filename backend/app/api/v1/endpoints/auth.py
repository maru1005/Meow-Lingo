# backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user
from app.models import User
from app.core.logger import get_logger

router = APIRouter(prefix="/auth", tags=["auth"])
logger = get_logger(__name__)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    """
    ログイン状態の確認およびユーザー情報の取得

    - Firebase ID Token を検証
    - ユーザーがなければ作成
    - ユーザー情報を返却
    """
    uid = current_user.firebase_uid

    logger.info(
        "GET /api/auth/me called uid=%s",
        uid,
    )

    try:
        logger.debug(
            "return user info uid=%s",
            uid,
        )

        return current_user
    
    except Exception:
        logger.exception(
            "auth/me failed uid=%s",
            uid,
        )
        raise
