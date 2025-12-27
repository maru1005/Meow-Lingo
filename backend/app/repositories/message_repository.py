from sqlalchemy.orm import Session

from app.models import message


def create_message(
    db: Session,
    conversation_id: int,
    content: str,
    role: str,
) -> Message:
     """
    Message を新規作成する。

    - conversation_id: 紐づく会話ID
    - content: 発言内容
    - role: "user" / "assistant"

    commit は repository 内で行う
    """
    message = Message(
        conversation_id=conversation_id,
        content=content,
        role=role,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def list_messages_by_conversation(
    dd: Session,
    conversation_id: int,
) -> list[Message]:
    """
    指定された Conversation に紐づく Message 一覧を取得する。

    - created_at 昇順（会話の流れ順）
    """
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all
    )


def delete_messages_by_conversation(
    db: Session,
    conversation_id: int
) -> int:
    """
    指定された Conversation に紐づく Message をすべて削除する。

    ⚠️ 通常は使用しない
    （Conversation 削除時は CASCADE で自動削除される）

    戻り値：
    - 削除件数
    """
    result = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .delete()
    )

    db.commit()
    return result