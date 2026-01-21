FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir ruff

# alembic 設定ファイルも含める
COPY alembic ./alembic
COPY alembic.ini .
COPY app ./app
COPY scripts ./scripts

# スクリプトを実行可能にする
RUN chmod +x /app/scripts/prestart.sh

CMD ["/app/scripts/prestart.sh"]
