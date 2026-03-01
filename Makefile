# ===================================================
# Meow Lingo - Makefile
# ===================================================

# --- 本番（開発）環境 ---

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

# --- DB マイグレーション ---

migrate:
	docker compose exec backend alembic upgrade head

migrate-down:
	docker compose exec backend alembic downgrade -1

# --- テスト ---

test:
	docker compose -f docker-compose.test.yml run --rm backend-test pytest -q

test-v:
	docker compose -f docker-compose.test.yml run --rm backend-test pytest -v

test-k:
	docker compose -f docker-compose.test.yml run --rm backend-test pytest -v -k "$(k)"

# --- クリーンアップ ---

clean:
	docker compose down -v
	docker compose -f docker-compose.test.yml down -v

.PHONY: up down restart logs logs-backend logs-frontend migrate migrate-down test test-v test-k clean