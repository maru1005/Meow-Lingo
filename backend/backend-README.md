# API設計

# 英語学習サポートAI API仕様書（Firebaseログイン対応）

## 概要

本APIは、Firebase Authentication を用いたログイン機能を備えた

英語学習サポートAIのバックエンドAPIである。

- 認証方式：Firebase Authentication（ID Token）
- 認可方式：Bearer Token
- データ形式：JSON
- ベースURL：`/api`

---

## 認証仕様（最重要）

### 認証方式

- フロントエンドで Firebase ログインを実施
- Firebase ID Token を取得
- APIリクエスト時に `Authorization` ヘッダーへ付与

```
Authorization: Bearer <Firebase ID Token>

```

---

### ユーザー管理方針

- APIに「ユーザー登録API」は存在しない
- 初回アクセス時に **Firebase UID を元に自動でユーザーを作成**
- Firebase が **認証の正**、DBは **補助情報**

---

## API一覧

| メソッド | エンドポイント | 認証 | 概要 |
| --- | --- | --- | --- |
| POST | `/api/chat` | 要 | 質問を送信し、AIの回答を取得 |
| POST | `/api/chat/reset` | 要 | 会話リセット |
| GET | `/api/chat/conversations` | 要 | 会話履歴取得 |
| GET | `/api/auth/me` | 要 | ログインユーザー情報取得 |
| GET | `/api/health` | 不要 | ヘルスチェック |

---

## 1. ログインユーザー確認

### GET `/api/auth/me`

ログイン状態の確認および、ユーザー情報の取得を行う。

---

### Request Header

```
Authorization: Bearer <Firebase ID Token>

```

---

### Response Body

```json
{
"firebase_uid":"firebase-uid-string",
"email":"user@example.com",
"created_at":"2025-12-22T10:00:00Z"
}

```

---

### 処理概要

1. Firebase ID Token を検証
2. Firebase UID を取得
3. ユーザーが存在しない場合は DB に作成
4. ユーザー情報を返却

---

## 2. チャット送信（メインAPI）

### POST `/api/chat`

---

### Request Header

```
Authorization: Bearer <Firebase ID Token>

```

---

### Request Body

```json
{
"message":"What does 'get along with' mean?"
}

```

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| message | string | ✓ | ユーザーの質問 |

---

### Response Body

```json
{
"reply":"It means to have a good relationship with someone.",
"conversation_id":"uuid-string"
}

```

---

### 処理概要

1. Firebase認証（共通処理）
2. ログインユーザー取得
3. 現在の会話を取得（なければ作成）
4. ユーザー発言を保存
5. RAG（辞書API）参照
6. OpenAI API 呼び出し
7. AI回答を保存
8. 応答返却

---

## 3. 会話リセット

### POST `/api/chat/reset`

---

### Request Header

```
Authorization: Bearer <Firebase ID Token>

```

---

### Request Body

```json
{}

```

※ Bodyなしでも可

---

### Response Body

```json
{
"conversation_id":"uuid-string"
}

```

---

### 処理概要

1. 新しい Conversation を作成
2. 新しい会話IDを返却

※ 過去の会話は削除されない

---

## 4. 会話履歴取得

### GET `/api/conversations`

---

### Request Header

```
Authorization: Bearer <Firebase ID Token>

```

---

### Response Body

```json
{
  "conversations":[
   {
     "conversation_id":"uuid-string",
     "created_at":"2025-12-22T09:00:00Z",
     "messages":[
      {
        "role":"user",
        "content":"What is run?"
      },
      {
        "role":"assistant",
        "content":"Run means to move fast on foot."
      }
    ]
  }
]
}

```

---

### 処理概要

- ログインユーザーに紐づく会話のみを返却
- 作成日時の降順で返す

---

## 5. ヘルスチェック

### GET `/api/health`

---

### Response Body

```json
{
"status":"ok"
}

```

---

## ステータスコード

| ステータス | 説明 |
| --- | --- |
| 200 | 正常 |
| 401 | 未認証 / トークン不正 |
| 403 | 権限不足 |
| 400 | リクエスト不正 |
| 500 | サーバーエラー |

---

## セキュリティ方針

- Firebase ID Token は必ず API 側で検証
- フロントから `user_id` を送信させない
- 会話・履歴は **必ずログインユーザー単位で制御**

---

## 更新履歴

## 

| 日付 | 内容 |
| --- | --- |
| 2025-12-22 | Firebaseログイン対応版 初版 |

# DB設計

## 1. DB設計の前提方針

### 認証・ユーザー管理

- 認証は **Firebase Authentication**
- バックエンドでは Firebase ID Token を検証し、`firebase_uid` を取得
- API では `session_id` / `user_id` を **受け取らない**
- DB 内では **firebase_uid を唯一のユーザー識別子**とする

### データ永続化の方針

- 会話履歴はすべて保存（学習用途）
- 会話の「区切り」は conversation 単位で管理
- メッセージは role（user / assistant）で区別

---

## 2. エンティティ一覧

| エンティティ | 概要 |
| --- | --- |
| users | Firebaseユーザー |
| conversations | 会話のまとまり |
| messages | 会話内の発言 |
| dictionary_cache | Free Dictionary API キャッシュ（RAG） |

---

## 3. ER図（論理設計）

```
┌────────────┐
│   users    │
│────────────│
│ id (PK)    │
│ firebase_uid (UQ) │
│ email      │
│ created_at │
└─────┬──────┘
      │ 1
      │
      │ N
┌─────▼──────────┐
│ conversations  │
│────────────────│
│ id (PK)        │
│ user_id (FK)   │
│ conversation_uuid (UQ) │
│ created_at     │
│ ended_at       │
└─────┬──────────┘
      │ 1
      │
      │ N
┌─────▼──────────┐
│   messages     │
│────────────────│
│ id (PK)        │
│ conversation_id (FK) │
│ role           │
│ content        │
│ created_at     │
└────────────────┘

┌──────────────────────┐
│ dictionary_cache     │
│──────────────────────│
│ id (PK)              │
│ word (UQ)            │
│ definition           │
│ example              │
│ fetched_at           │
└──────────────────────┘

```

---

## 4. テーブル定義（物理設計）

### 4.1 users テーブル

Firebaseユーザーを管理する。

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

```

### 補足

- `firebase_uid` が **アプリ内ユーザーの主キー的存在**
- email は表示用（必須ではない）

---

### 4.2 conversations テーブル

会話セッションを管理する。

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  conversation_uuid UUID NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  ended_at TIMESTAMP
);

```

### 補足

- `/api/chat/reset` で新規作成
- `ended_at IS NULL` がアクティブ会話

---

### 4.3 messages テーブル

会話内の発言ログ。

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id),
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

```

### 補足

- role により UI / プロンプト生成を切り替える
- 時系列順は `created_at`

---

### 4.4 dictionary_cache テーブル（RAG）

Free Dictionary API の結果キャッシュ。

```sql
CREATE TABLE dictionary_cache (
  id SERIAL PRIMARY KEY,
  word VARCHAR(255) NOT NULL UNIQUE,
  definition TEXT,
  example TEXT,
  fetched_at TIMESTAMP NOT NULL DEFAULT now()
);

```

### 補足

- 同一単語への外部APIアクセス削減
- 将来ベクトル化・教材DBへ拡張可能

---

## 5. API ⇄ DB 対応関係（Firebase対応後）

| API | 内部DB処理 |
| --- | --- |
| POST /api/chat | users → conversations → messages |
| POST /api/chat/reset | conversations 新規作成 |
| GET /api/conversations | conversations + messages |
| 認証 | firebase_uid → users |

※ API では `session_id` を使わない

※ `firebase_uid` は **トークンからのみ取得**

---

## 6. データフロー（Firebase対応）

```
[ Frontend ]
   │ Firebase Login
   ▼
[ Firebase Auth ]
   │ ID Token
   ▼
[ FastAPI ]
   ├─ verify_id_token
   ├─ firebase_uid 取得
   ├─ user get_or_create
   ├─ conversation取得 or 作成
   ├─ message保存
   ├─ RAG / OpenAI
   └─ reply保存
   ▼
[ PostgreSQL ]

```

---

## 7. 将来拡張を考慮した設計ポイント

### 教材・学習分析

- messages を元に学習履歴分析可能
- user_id で集計しやすい

### ベクトルDB導入

- dictionary_cache / messages を分離しているため移行容易

### 認証変更

- Firebase → 他認証へ変更しても
    
    **users テーブルのキー差し替えのみ**