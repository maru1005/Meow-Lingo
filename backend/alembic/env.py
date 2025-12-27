from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool

# alembic.ini の設定を読み込む
config = context.config

# ログ設定
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ================================
# ここが重要ポイント
# ================================

# FastAPI 側と同じ Base / engine を使う
from app.core.database import Base, engine

# ★ models を必ず import（しないと検出されない）
from app.models import users
from app.models import conversations
from app.models import messages
from app.models import dictionary_cache

# Alembic に metadata を渡す
target_metadata = Base.metadata


def run_migrations_offline():
    """オフラインモード（今回は使わないが定義は必要）"""
    url = engine.url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # 型変更検知
        )

        with context.begin_transaction():
            context.run_migrations()


# 実行モード分岐
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
