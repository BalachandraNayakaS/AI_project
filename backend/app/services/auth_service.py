from datetime import timedelta
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.crud.user import create_user, get_user_by_email, get_user_by_username
from app.schemas.schemas import UserCreate


def register_user(db: Session, user_in: UserCreate):
    existing_by_email = get_user_by_email(db, user_in.email)
    if existing_by_email:
        raise ValueError("A user with this email already exists")

    existing_by_username = get_user_by_username(db, user_in.username)
    if existing_by_username:
        raise ValueError("A user with this username already exists")

    password_hash = hash_password(user_in.password)
    user = create_user(
        db=db,
        username=user_in.username,
        email=user_in.email,
        password_hash=password_hash,
        company=user_in.company,
        role=user_in.role,
    )
    return user


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def create_tokens_for_user(user_id: int) -> dict[str, str]:
    access_token = create_access_token(subject=str(user_id), expires_delta=timedelta(minutes=30))
    refresh_token = create_refresh_token(subject=str(user_id), expires_delta=timedelta(minutes=1440))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
