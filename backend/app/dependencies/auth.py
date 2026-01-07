# backend/app/dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from firebase_admin import auth as firebase_auth
from firebase_admin.exceptions import FirebaseError

from app.core.database import get_db
from app.repositories.user_repository import get_or_create_user

security = HTTPBearer(auto_error=False)

def get_current_user(
        credentials: HTTPAuthorizationCredentials | None = Depends(security),
        db: Session = Depends(get_db),
):
        # トークン未指定
        if not credentials:
                raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Authorization token missing",
                )

        token = credentials.credentials

        # Firebase ID Token 検証
        try:
                decoded_token = firebase_auth.verify_id_token(token)
        except FirebaseError:
                raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid Firebase ID Token",
                        )

        firebase_uid: str = decoded_token["uid"]
        email: str | None = decoded_token.get("email")

        user = get_or_create_user(
                db=db,
                firebase_uid=firebase_uid,
                email=email,
        )

        return user
