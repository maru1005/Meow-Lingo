# backend/app/repositories/user_repository.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.users import User

def get_or_create_user(db: Session, firebase_uid: str, email: str | None = None) -> User:
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if user:
        return user

    user = User(firebase_uid=firebase_uid, email=email)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    return user