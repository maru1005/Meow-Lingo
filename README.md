# 🐱 Meow Lingo - AI英語学習パートナー

Meow Lingo は、OpenAI API と Firebase を活用した **インタラクティブな AI 英語学習アプリケーション**です。猫のキャラクター「Meow」とフリートーク、単語学習、文法特訓、実力試しなどの複数の学習モードで楽しく英語を学べます。

## ✨ 主な機能

### 📚 4つの学習モード

- **Free Talk** - 自由会話でネイティブのような表現を学習
- **Vocabulary** - 単語の意味や使い方を学習
- **Grammar** - 文法パターンと実践例を習得
- **Test** - 学習成果を実力テストで確認

### 🔐 ユーザー認証

- Firebase Authentication による安全なログイン
- ユーザーごとに学習履歴を保存

### 💾 会話履歴管理

- すべての会話をデータベースに保存
- 過去の会話を履歴から参照・復元可能
- 会話単位でタイトルを自動生成（バックグラウンド処理）

### 📖 辞書 RAG 機能

- ユーザーの質問からキーワードを自動抽出
- 外部辞書 API から定義を取得
- AI の応答に辞書情報を統合してより正確な回答を生成

### 🚀 パフォーマンス・安定性

- OpenAI API のタイムアウト・自動リトライ（429/5xx）
- 会話履歴の上限管理によるトークンコスト制御
- API クライアントのシングルトン化
- フロントエンドの通信タイムアウト（AbortController）

---

## 🚀 クイックスタート

### 前提条件

- **Docker & Docker Compose**
- **OpenAI API Key**
- **Firebase Project**

### インストール手順

#### 1️⃣ リポジトリのクローン

```bash
git clone https://github.com/yourusername/meow-lingo.git
cd meow-lingo
```

#### 2️⃣ 環境変数の設定

`.env` ファイルを作成:

```bash
# Project
PROJECT_NAME=meow-lingo
ENV=development

# Backend
BACKEND_PORT=8000
DATABASE_URL=postgresql://postgres:postgres@db:5432/english_ai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini          # モデルを変更したい場合はここを変更
OPENAI_TIMEOUT_SECONDS=30
OPENAI_MAX_RETRIES=2

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json

# Database
POSTGRES_DB=english_ai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
```

#### 3️⃣ 起動

```bash
make up
```

#### 4️⃣ アプリケーションにアクセス

- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:8000/api
- **API ドキュメント**: http://localhost:8000/docs

---

## 🛠️ Makeコマンド一覧

```bash
# 開発環境
make up             # コンテナ起動
make down           # コンテナ停止
make restart        # コンテナ再起動
make logs           # 全ログを表示
make logs-backend   # バックエンドのログのみ
make logs-frontend  # フロントエンドのログのみ

# DBマイグレーション
make migrate        # マイグレーション実行
make migrate-down   # 1つ前に戻す

# テスト
make test           # テスト実行
make test-v         # 詳細表示
make test-k k=chat  # 特定テストのみ（例: "chat" を含むテスト）

# クリーンアップ
make clean          # コンテナ・ボリュームを全削除
```

---

## 🧪 テスト

テスト専用の Docker 環境（独立した PostgreSQL）を使用するため、本番データに影響しません。

```bash
make test
```

```
15 passed in 2.26s
```

### テスト構成

```
app/tests/
├── conftest.py               # フィクスチャ（認証モック・テストDB）
├── api/
│   ├── test_auth.py          # 認証エンドポイント
│   ├── test_chat.py          # チャットエンドポイント
│   ├── test_conversations.py # 会話履歴エンドポイント
│   ├── test_health.py        # ヘルスチェック
│   └── test_user.py          # ユーザーエンドポイント
└── services/
    └── test_chat_service.py  # ChatService ユニットテスト
```

---

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                     Meow Lingo                               │
├──────────────────────┬──────────────────────────────────────┤
│   Frontend (Next.js)  │        Backend (FastAPI)             │
├──────────────────────┼──────────────────────────────────────┤
│  • React 18          │  • Python 3.11                       │
│  • Next.js 16        │  • FastAPI                           │
│  • Tailwind CSS      │  • SQLAlchemy ORM                    │
│  • Zustand           │  • Alembic (DB Migration)            │
│  • Firebase Auth     │  • OpenAI GPT-4o-mini                │
└──────────────────────┴──────────────────────────────────────┘
           │                          │
           ▼                          ▼
    ┌────────────────────────────────────────┐
    │   Shared Infrastructure                 │
    ├────────────────────────────────────────┤
    │  • PostgreSQL 15 (Database)            │
    │  • Docker Compose (Orchestration)      │
    │  • Firebase (Authentication)           │
    │  • OpenAI API (LLM Service)            │
    └────────────────────────────────────────┘
```

---

## 🔧 主要技術スタック

### Backend

| 技術               | 用途                |
| ------------------ | ------------------- |
| **FastAPI**        | Web フレームワーク  |
| **SQLAlchemy**     | ORM                 |
| **Alembic**        | DB マイグレーション |
| **Pydantic**       | データ検証          |
| **OpenAI**         | LLM API             |
| **Firebase Admin** | ユーザー認証・検証  |
| **PostgreSQL**     | データベース        |
| **pytest**         | テスト              |

### Frontend

| 技術             | 用途                 |
| ---------------- | -------------------- |
| **Next.js 16**   | React フレームワーク |
| **TypeScript**   | 型安全性             |
| **Tailwind CSS** | スタイリング         |
| **Zustand**      | 状態管理             |
| **Firebase SDK** | 認証                 |

---

## 📁 ディレクトリ構成

```
meow-lingo/
├── backend/
│   ├── app/
│   │   ├── main.py              # メインアプリケーション
│   │   ├── api/                 # API エンドポイント
│   │   ├── core/                # 設定・ミドルウェア
│   │   ├── models/              # DB モデル
│   │   ├── schemas/             # リクエスト/レスポンス
│   │   ├── crud/                # CRUD 操作
│   │   ├── services/            # ビジネスロジック
│   │   ├── dependencies/        # 依存性注入
│   │   └── tests/               # テスト
│   ├── alembic/                 # DB マイグレーション
│   ├── scripts/prestart.sh      # 起動スクリプト
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js ページ
│   │   ├── components/          # React コンポーネント
│   │   ├── lib/                 # ユーティリティ・ミドルウェア
│   │   ├── store/               # 状態管理（Zustand）
│   │   └── types/               # 型定義
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # 開発環境
├── docker-compose.test.yml      # テスト環境（独立DB）
├── Makefile                     # コマンド集
├── .env                         # 環境変数
└── README.md
```

---

## 📋 API エンドポイント

### 認証

```
GET  /api/auth/me              # 現在のユーザー情報取得
```

### チャット

```
POST   /api/chat                    # メッセージ送信
GET    /api/chat/conversations      # 会話一覧取得
GET    /api/chat/conversations/:id  # 会話詳細取得
DELETE /api/chat/conversations/:id  # 会話削除
```

### ユーザー

```
GET  /api/user/me              # ユーザー情報取得
```

### ヘルスチェック

```
GET  /api/                     # ヘルスチェック
```

詳細は [Swagger UI](http://localhost:8000/docs) を参照。

---

## 🔐 認証フロー

```
1. ユーザーが Firebase でログイン／新規登録
   ↓
2. useAuthStore 経由で Firebase ID Token を取得・ストアに保存
   ↓
3. フロントエンドが Authorization ヘッダーに ID Token を付与
   ↓
4. バックエンドが Firebase Admin SDK で ID Token を検証
   ↓
5. firebase_uid からユーザーを取得 or 自動作成
   ↓
6. API レスポンス
```

---

## 📊 DB スキーマ

### users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR UNIQUE NOT NULL,
  email VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### conversations

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  conversation_uuid UUID UNIQUE,
  title VARCHAR,
  chat_mode VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### messages

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR,   -- "user" | "assistant"
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🐛 トラブルシューティング

### コンテナが起動しない

```bash
make clean
make up
```

### DB マイグレーション失敗

```bash
# マイグレーション状態確認
docker compose exec backend alembic current
docker compose exec backend alembic history

# マイグレーション再実行
make migrate
```

### テストが通らない

```bash
# テストログを詳細表示
make test-v
```

---

## 📝 ライセンス

MIT License

---

## 🐱 プロジェクト名の由来

**Meow** は英語学習パートナーの猫のキャラクター。ユーザーとの会話を通じて、楽しく自然な英語習得をサポートします。
