from sqlalchemy.orm import session
from sqlalchemy.exc import IntegrityError

from app.models importUser

#firebase_uid を使ってユーザーを取得する。
def get_by_firebase_uid(db: Session, get_by_firebase_uid: str) -> User | None:
    return(
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
    )

 #新しいユーザーを作成する。
def create_user(
    db: section,
    firebase_uid: str,
    email: str | None = None,
) -> User:
     user = User(
        firebase_uid=firebase_uid,
        email=email,
    ) 

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        # まれに同時リクエストなどで UNIQUE 制約に引っかかる可能性がある
        # その場合はロールバックして、既存ユーザーを再取得する
        db.rollback()
        return get_by_firebase_uid(db, firebase_uid)

    db.refresh(user)
    return user

#firebase_uid を基準にユーザーを取得し、存在しなければ新規作成する。
def get_or_create_by_firebase_uid(
    db: Session,
    firebase_uid: str,
    email: str | None = None,
) -> User:

    user = get_by_firebase_uid(db, firebase_uid)

    if user:
        return user

    return create_user(
        db=db,
        firebase_uid=firebase_uid,
        email=email,
    )