# backend/app/dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from firebase_admin import auth as firebase_auth

from app.core.database import get_db
from app.repositories.user_repository import get_or_create_user


security = HTTPBearer()


def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db),
):
    """
    Firebase ID Token を検証し、User を取得（なければ作成）
    """
    try:
            # Bearer トークン取得
            token = credentials.credentials

            # Firebase で ID Token を検証
            decoded_token = firebase_auth.verify_id_token(token)

            firebase_uid: str = decoded_token["uid"]
            email: str | None = decoded_token.get("email")

    except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase ID Token",
            )

    user = get_or_create_user(
            db=db,
            firebase_uid=firebase_uid,
            email=email,
            )

    return user
