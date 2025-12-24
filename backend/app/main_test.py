# backend/app/main_test.py
# test用のFastAPIアプリケーションを定義し、chat.pyのエンドポイントを組み込む
from fastapi import FastAPI
from backend.app.api.v1.endpoints import chat  # あなたが作ったchat.pyを読み込む
import uvicorn

app = FastAPI()

# chat.pyで定義したルーターをアプリケーションに組み込む
app.include_router(chat.router)

@app.get("/")
def test_root():
    return {"status": "LLM Test Mode Running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)