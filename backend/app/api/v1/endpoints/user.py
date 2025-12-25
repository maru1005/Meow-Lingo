from fastapi import APIRouter
from app.schemas.user import UserResponse

router = APIRouter(prefix="/user")

@router.get("/me", response_model=UserResponse)
def get_me():
    return UserResponse(
        id="dummy-user-id",
        email="dummy@example.com",
    )