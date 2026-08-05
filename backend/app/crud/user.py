from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import User


def get_user(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)


def get_user_by_username(db: Session, username: str) -> User | None:
    statement = select(User).where(User.username == username)
    return db.scalar(statement)


def create_user(db: Session, username: str, email: str, password_hash: str, company: str | None = None, role: str = "user") -> User:
    user = User(
        name=username,
        username=username,
        email=email,
        password_hash=password_hash,
        company=company,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    statement = select(User).offset(skip).limit(limit)
    return db.scalars(statement).all()
