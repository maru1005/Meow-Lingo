from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core import firebase_admin

from app.api.api import api_router 

from app.core.database import engine, Base
from app.models import users, conversations, messages, dictionary_cache 

app = FastAPI(title="Meow Lingo API")

@app.on_event("startup")
def startup_event():
    pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # 本番時は環境変数にする
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix="/api")