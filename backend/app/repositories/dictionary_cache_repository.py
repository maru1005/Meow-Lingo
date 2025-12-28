from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.models import DictionaryCache


def get_cache(
    db: Session,
    word:str,
    language:str,
) -> DictionaryCache | None:
    """
    辞書キャッシュを取得する。

    - word + language の組み合わせで検索
    - 見つからなければ None
    """
    return (
        db.query(DictionaryCache)
        .filter(
            DictionaryCache.word == word,
            DictionaryCache.language == language,
        )
        .first()
    )


def create_cache(
    db: Session,
    word: str,
    language: str,
    response: str,
) -> DictionaryCache:
   """
    辞書キャッシュを新規作成する。

    - response は JSON を文字列化したもの
    """
    cache = DictionaryCache(
        word=word,
        language=language,
        response=response,
    )

    db.add(cache)

    try:
        db.commit()
    except IntegrityError:
        # 同時アクセス等で UNIQUE 制約に引っかかった場合
        db.rollback()
        return get_cache(db, word, language)

    db.refresh(cache)
    return cache


def get_or_create_cache(
    db: Session,
    word: str,
    language: str,
    response: str | None = None,
) -> DictionaryCache | None:
    """
    辞書キャッシュを取得し、
    存在しなければ作成する。

    注意：
    - response が None の場合は「取得のみ」
    """
    cache = get_cache(db, word, language)

    if cache:
        return cache

    if response is None:
        return None
    
    return create_cache(
        db=db,
        word=word,
        language=language,
        response=response,
    )

