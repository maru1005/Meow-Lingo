# from fastapi import APIRouter
# from app.schemas.user import UserResponse

# router = APIRouter(prefix="/user")

# @router.get("/me", response_model=UserResponse)
# def get_me():
#     return UserResponse(
#         id="dummy-user-id",
#         email="dummy@example.com",
#     )

from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user # 追加

router = APIRouter(prefix="/user")

@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)): # Dependsを追加
    # current_userから全ての必須フィールドを抽出して返す
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        firebase_uid=current_user.firebase_uid,
        created_at=current_user.created_at
    )