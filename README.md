# English Learning AI
英語学習をサポートするAIアプリケーション。

## 開発環境のセットアップ

プロジェクトをローカル環境で立ち上げるための手順を説明します。

### 前提条件

* **Docker** および **Docker Compose** がインストールされていること

### 1. リポジトリのクローンと移動

```bash
git clone https://github.com/ms-engineer-bc25-09/section8-team-C.git
cd section8-team-C

```

*(※元の指示では `cd english-learning-ai` となっていましたが、リポジトリ名に合わせて修正しています)*

### 2. 環境変数の設定

設定ファイルをコピーし、必要な情報を追記します。

```bash
cp .env.example .env

```

`.env` ファイルを開き、以下の項目を設定してください。
※ `sk-xxxxxxxx` はダミーです。各自で取得した OpenAI API Key を設定してください。

```env
OPENAI_API_KEY=sk-xxxxxxxx

```

### 3. アプリケーションの起動

Dockerコンテナをビルドし、起動します。

```bash
docker-compose up

```
