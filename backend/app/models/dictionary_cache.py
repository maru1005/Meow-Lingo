from sqlalchemy import Column, Integer, String, DateTime, Text, Index
from sqlalchemy.sql import func

from app.core.database import Base


class DictionaryCache(Base):
    __tablename__ = "dictionary_cache"

    id = Column(Integer, primary_key=True, index=True)

    # 検索した単語
    word = Column(String(255), nullable=False)

    # 言語コード（例: en, ja）
    language = Column(String(10), nullable=False)

    # 辞書APIのレスポンス（JSONを文字列で保存）
    response = Column(Text, nullable=False)

    # キャッシュ作成日時
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # キャッシュ更新日時（再取得時に更新）
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # word + language の組み合わせは一意
    __table_args__ = (
        Index("ix_dictionary_cache_word_language", "word", "language", unique=True),
    )
