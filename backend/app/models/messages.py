from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    # conversations.id への FK
    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # 発言内容
    content = Column(Text, nullable=False)

    # ユーザー発言かAI発言か（将来拡張用）
    role = Column(String(20), nullable=False)  # "user" / "assistant"

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # リレーション
    conversation = relationship(
        "Conversation",
        back_populates="messages",
    )
