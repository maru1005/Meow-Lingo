# backend/app/schemas/user.py
from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    firebase_uid: str
    email: str
    created_at: datetime
