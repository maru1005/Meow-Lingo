# backend/app/schemas/user.py
from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    firebase_uid: str
    email: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }