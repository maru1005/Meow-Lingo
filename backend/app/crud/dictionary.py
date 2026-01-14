# backend/app/crud/dictionary.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.dictionary_cache import DictionaryCache

def get_cache(db: Session, word: str, language: str) -> DictionaryCache | None:
    """単語と言語でキャッシュを検索ニャ"""
    return db.query(DictionaryCache).filter(
        DictionaryCache.word == word,
        DictionaryCache.language == language,
    ).first()

def create_cache(db: Session, word: str, language: str, response: dict) -> DictionaryCache:
    """新しい辞書キャッシュを作成ニャ"""
    cache = DictionaryCache(
        word=word,
        language=language,
        response=response,
    )
    db.add(cache)
    try:
        db.commit()
        db.refresh(cache)
    except IntegrityError:
        db.rollback()
        return get_cache(db, word, language)
    return cache

def get_or_create_cache(db: Session, word: str, language: str, response: dict | None = None) -> DictionaryCache | None:
    """あれば取得、なければ作成の便利関数ニャ"""
    cache = get_cache(db, word, language)
    if cache or response is None:
        return cache
    return create_cache(db, word, language, response)