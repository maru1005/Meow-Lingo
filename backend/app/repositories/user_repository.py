from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models import User


def get_by_firebase_uid(db: Session, get_by_firebase_uid: str) -> User | None:
    """
    firebase_uid を使ってユーザーを取得する。

    - 見つからない場合は None を返す
    """
    return(
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
        .first()
    )

def create_user(
    db: Section,
    firebase_uid: str,
    email: str | None = None,
) -> User:
    """
    新しいユーザーを作成する。

    - firebase_uid は必須
    - email は表示用（存在すれば保存）
    """
     user = User(
        firebase_uid=firebase_uid,
        email=email,
    ) 

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        # 同時作成などで UNIQUE 制約に引っかかった場合
        db.rollback()
        return get_by_firebase_uid(db, firebase_uid)

    db.refresh(user)
    return user


def get_or_create_by_firebase_uid(
    db: Session,
    firebase_uid: str,
    email: str | None = None,
) -> User:
    """
    firebase_uid を基準にユーザーを取得し、
    存在しなければ新規作成する。

    🔥 ユーザー管理の唯一の入口
    """
    user = get_by_firebase_uid(db, firebase_uid)

    if user:
        return user

    return create_user(
        db=db,
        firebase_uid=firebase_uid,
        email=email,
    )