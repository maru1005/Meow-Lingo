# backend/app/crud/chat.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
import uuid
from app.models.conversations import Conversation
from app.models.messages import Message

# --- 会話操作 (Conversation) ---

def create_conversation(db: Session, user_id: int, mode: str = "study") -> Conversation:
    conv = Conversation(user_id=user_id, mode=mode)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

def get_conversation(db: Session, conversation_uuid: str, user_id: int) -> Conversation | None:
    return db.query(Conversation).filter(
        and_(Conversation.conversation_uuid == conversation_uuid, Conversation.user_id == user_id)
    ).first()

def list_conversations(db: Session, user_id: int) -> list[Conversation]:
    return db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.updated_at.desc()).all()

def delete_conversation(db: Session, conversation_uuid: str, user_id: int) -> bool:
    conv = get_conversation(db, conversation_uuid, user_id)
    if not conv: return False
    db.delete(conv)
    db.commit()
    return True

# --- メッセージ操作 (Message) ---

def create_message(db: Session, conversation_id: int, content: str, role: str) -> Message:
    msg = Message(conversation_id=conversation_id, content=content, role=role)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg