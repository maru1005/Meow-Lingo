# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 環境変数から DB URL を取得
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/english_ai")

# エンジン作成
engine = create_engine(DATABASE_URL, echo=True)  # echo=True は SQL ログ確認用

# セッション作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルのベースクラス
Base = declarative_base()

# DBセッションの依存関係注入用
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()