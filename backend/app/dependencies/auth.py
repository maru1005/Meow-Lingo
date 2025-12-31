# backend/app/dependencies/auth.py
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.user_repository import get_or_create_by_firebase_uid


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Authorization ヘッダーからユーザーを特定する。
    ※ 今は Firebase 検証を省略（後で差し替え可能）
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    # 仮実装：Bearer の後ろを firebase_uid として扱う
    firebase_uid = authorization.replace("Bearer ", "")

    user = get_or_create_by_firebase_uid(
        db=db,
        firebase_uid=firebase_uid,
        email=None,
    )

    return user
