# backend/app/repositories/conversation_repository.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime

from app.models import Conversation


def get_active_conversation(
    db: Session,
    user_id: int,
) -> Conversation | None:
    """
    指定ユーザーの「現在アクティブな会話」を取得する。

    アクティブ会話の定義：
    - conversations.user_id が一致
    - ended_at が NULL（まだ終了していない）

    仕様：
    - 同時にアクティブな会話は1つだけ想定
    - 見つからなければ None を返す
    """
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


def create_conversation(
    db: Session,
    user_id: int,
) -> Conversation:
    """
    新しい会話（Conversation）を作成する。

    - conversation_uuid は自動生成（UUID）
    - created_at は DB 側で自動設定
    - ended_at は NULL（＝アクティブ）

    /api/chat/reset や
    初回チャット時に利用される
    """
    conversation = Conversation(
        user_id=user_id,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


def end_conversation(
    db: Session,
    conversation: Conversation,
) -> Conversation:
    """
    指定された会話を「終了状態」にする。

    - ended_at に現在時刻をセット
    - 会話履歴は削除しない（学習履歴として保持）

    注意：
    - この関数は「削除」ではない
    - reset 時に必ず呼ばれる想定
    """
    conversation.ended_at = datetime.utcnow()

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


def end_active_conversation(
    db: Session,
    user_id: int,
) -> Conversation | None:
    """
    指定ユーザーのアクティブ会話が存在すれば、それを終了する。

    - アクティブ会話がなければ None を返す
    - /api/chat/reset で使用される
    """
    conversation = get_active_conversation(db, user_id)

    if not conversation:
        return None

    return end_conversation(db, conversation)


def get_or_create_active_conversation(
    db: Session,
    user_id: int,
) -> Conversation:
    """
    アクティブ会話を取得し、
    存在しなければ新規作成する。

    🔥 /api/chat のメイン入口
    """
    conversation = get_active_conversation(db, user_id)

    if conversation:
        return conversation

    return create_conversation(db, user_id)


def list_user_conversations(
    db: Session,
    user_id: int,
) -> list[Conversation]:
    """
    指定ユーザーに紐づく会話一覧を取得する。

    - 作成日時の降順
    - messages は relationship により取得可能
    - API / Service 側で UUID を使って返却する
    """
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )
