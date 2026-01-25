# 🐱 Meow Lingo - AI英語学習パートナー

Meow Lingo は、OpenAI API と Firebase を活用した **インタラクティブな AI 英語学習アプリケーション**です。猫のキャラクター「Meow」とフリートーク、単語学習、文法特訓、実力試しなどの複数の学習モードで楽しく英語を学べます。

## ✨ 主な機能

### 📚 4つの学習モード

- **Free** - 自由会話でネイティブのような表現を学習
- **Vocabulary** - 単語の意味や使い方を学習
- **Grammar** - 文法パターンと実践例を習得
- **Test** - 学習成果を実力テストで確認

### 🔐 ユーザー認証

- Firebase Authentication による安全なログイン
- ユーザーごとに学習履歴を保存

### 💾 会話履歴管理

- すべての会話をデータベースに保存
- 過去の会話を履歴から参照可能
- 会話単位でタイトルを自動生成

### 📖 辞書 RAG 機能

- ユーザーの質問からキーワードを自動抽出
- 外部辞書 API から定義を取得
- AIの応答に辞書情報を統合

### 🚀 パフォーマンス最適化

- プロンプトのメモリキャッシング
- API クライアントのシングルトン化
- 最小限のビルドサイズ（.dockerignore 設定）

---

## 🚀 クイックスタート

### 前提条件

- **Docker & Docker Compose** - コンテナ化されたアプリケーション
- **OpenAI API Key** - ChatGPT API アクセス
- **Firebase Project** - 認証と設定

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

#### 3️⃣ Docker コンテナの起動

```bash
docker compose up -d --build
```

#### 4️⃣ アプリケーションにアクセス

- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:8000/api
- **API ドキュメント**: http://localhost:8000/docs

---

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                     Meow Lingo                               │
├──────────────────────┬──────────────────────────────────────┤
│   Frontend (Next.js)  │        Backend (FastAPI)             │
├──────────────────────┼──────────────────────────────────────┤
│  • React 18.3.1      │  • Python 3.11                       │
│  • Next.js 16.1.1    │  • FastAPI                           │
│  • Tailwind CSS      │  • SQLAlchemy ORM                    │
│  • Zustand           │  • Alembic (DB Migration)           │
│  • Firebase Auth     │  • OpenAI GPT-4o-mini               │
└──────────────────────┴──────────────────────────────────────┘
           │                          │
           ▼                          ▼
    ┌────────────────────────────────────────┐
    │   Shared Infrastructure                 │
    ├────────────────────────────────────────┤
    │  • PostgreSQL 15 (Database)            │
    │  • Docker Compose (Orchestration)      │
    │  • Firebase (Authentication & Config)  │
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

### Frontend

| 技術             | 用途                 |
| ---------------- | -------------------- |
| **Next.js 16**   | React フレームワーク |
| **React 18.3**   | UI ライブラリ        |
| **TypeScript**   | 型安全性             |
| **Tailwind CSS** | スタイリング         |
| **Zustand**      | 状態管理             |
| **Firebase SDK** | 認証・設定           |

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
│   │   └── tests/               # ユニットテスト
│   ├── alembic/                 # DB マイグレーション
│   ├── scripts/prestart.sh      # 起動スクリプト
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js ページ
│   │   ├── components/          # React コンポーネント
│   │   ├── lib/                 # ユーティリティ
│   │   ├── store/               # 状態管理
│   │   └── types/               # 型定義
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # コンテナ構成
├── .env                         # 環境変数
└── README.md                    # このファイル
```

---

## 📋 API エンドポイント

### 認証

```
GET  /api/auth/me              # 現在のユーザー情報取得
```

### チャット

```
POST   /api/chat               # メッセージ送信
GET    /api/chat/conversations # 会話一覧取得
GET    /api/chat/conversations/:id  # 会話詳細取得
DELETE /api/chat/conversations/:id  # 会話削除
```

### ユーザー

```
GET    /api/users/me           # ユーザー情報取得
```

### ヘルスチェック

```
GET    /api/health             # ヘルスチェック
```

詳細は [Swagger UI](http://localhost:8000/docs) を参照。

---

## 🔐 認証フロー

```
1. ユーザーが Firebase でログイン
   ↓
2. Firebase ID Token 取得
   ↓
3. フロントエンドが Authorization ヘッダーに ID Token を含める
   ↓
4. バックエンドが ID Token を検証
   ↓
5. firebase_uid から user 取得 or 作成
   ↓
6. API レスポンス
```

### 新規登録フロー

ホームページから新規登録へアクセス可能：

```
1. ホームページ（未ログイン状態）を表示
   ↓
2. 「新規登録はこちら」リンククリック → /signup ページへ
   ↓
3. ユーザーが以下を入力
   - メールアドレス（@ を含む有効なメール）
   - パスワード（6文字以上）
   - パスワード確認（一致する必要がある）
   ↓
4. リアルタイムバリデーション
   - メール形式チェック
   - パスワード長チェック
   - パスワード一致確認
   ↓
5. 「登録する」ボタンクリック
   ↓
6. Firebase で createUserWithEmailAndPassword 実行
   ↓
7. 成功時：
   - /selection ページへリダイレクト
   - バックエンドが firebase_uid から user を自動作成
   ↓
8. エラー時：
   - Firebase のエラーコードを日本語で表示
   - ユーザーが修正可能
```

**対応するエラーメッセージ：**

- `email-already-in-use`: 既に登録されているメールアドレス
- `weak-password`: パスワードが弱い（6文字以上推奨）
- `invalid-email`: 有効なメールアドレスではない
- `operation-not-allowed`: この操作は許可されていない

---

## 🔐 認証後の履歴表示

ログイン状態でのみ会話履歴が Sidebar に表示されます：

```
ログイン済み状態：
  ✓ HISTORY セクションに会話一覧を表示
  ✓ 過去の会話をクリックで復元
  ✓ 削除ボタンで会話を削除

未ログイン状態：
  → 「ログインして履歴を表示」メッセージを表示
```

---

## 🚀 開発ガイド

### バックエンド開発（ホストで）

```bash
# 1. 仮想環境作成
cd backend
python3 -m venv venv
source venv/bin/activate

# 2. 依存パッケージインストール
pip install -r requirements.txt

# 3. サーバー起動
uvicorn app.main:app --reload

# 4. テスト実行
pytest
```

### フロントエンド開発（ホストで）

```bash
# 1. 依存パッケージインストール
cd frontend
npm install

# 2. 開発サーバー起動
npm run dev

# 3. ESLint チェック
npm run lint
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
  user_id INTEGER REFERENCES users(id),
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
  conversation_id INTEGER REFERENCES conversations(id),
  role VARCHAR (user | assistant),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🐛 トラブルシューティング

### コンテナが起動しない

```bash
# Docker クリーンアップ
docker system prune -a --volumes

# 再ビルド
docker compose down -v
docker compose up -d --build
```

### DB マイグレーション失敗

```bash
# マイグレーション履歴確認
docker compose exec backend alembic current
docker compose exec backend alembic history
```

---

## 📈 パフォーマンス最適化

### ✅ 実装済み

- **プロンプトキャッシング** - ファイルI/O → メモリアクセス
- **API クライアント シングルトン化** - 不要な再生成を排除
- **最小ビルドサイズ** - `.dockerignore` で13GB 削減

---

## 📝 ライセンス

MIT License

---

## 🐱 プロジェクト名の由来

**Meow** は英語学習パートナーの猫のキャラクター。ユーザーとの会話を通じて、楽しく自然な英語習得をサポートします。
