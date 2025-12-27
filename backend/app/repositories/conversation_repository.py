from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime

from app.models import Conversation

##指定ユーザーの「現在アクティブな会話」を取得する。
def get_active_conversation(
    db: Session,
    user_id: int,
) -> Conversation | None:
    
    return (
        db.query(Conversation)
        .filter(
            and_(
                Conversation.user_id == user_id,
                Conversation.ended_at.is_(None),
            )
        )
        .order_by(Conversation.created_at.desc())
        .first()
    )

# 新しい会話（Conversation）を作成する。
def create_conversation(
    db: Session,
    user_id: int,
) -> Conversation:
    
    conversation = Conversation(
        user_id=user_id,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation

#指定された会話を「終了状態」にする。
def end_conversation(
    db: Session,
    conversation: Conversation,
) -> Conversation:
    conversation.ended_at = datetime.utcnow()

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation

#指定された会話を「終了状態」にする。
def end_active_conversation(
    db: Session,
    user_id: int,
) -> Conversation | None:
   
    conversation = get_active_conversation(db, user_id)

    if not conversation:
        return None

    return end_conversation(db, conversation)

#アクティブ会話を取得し、存在しなければ新規作成する。
def get_or_create_active_conversation(
    db: Session,
    user_id: int,
) -> Conversation:
    
    conversation = get_active_conversation(db, user_id)

    if conversation:
        return conversation

    return create_conversation(db, user_id)

#指定ユーザーに紐づく会話一覧を取得する。
def list_user_conversations(
    db: Session,
    user_id: int,
) -> list[Conversation]:
    
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )