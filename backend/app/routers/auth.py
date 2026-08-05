from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.schemas.schemas import Token, TokenPayload, UserCreate, UserLogin, UserRead
from app.services.auth_service import authenticate_user, create_tokens_for_user, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        user = register_user(db, user_in)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    return user


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_in.username, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return create_tokens_for_user(user.id)


@router.post("/refresh", response_model=Token)
def refresh_token(current_user=Depends(get_current_user)):
    tokens = create_tokens_for_user(current_user.id)
    return tokens


@router.get("/profile", response_model=UserRead)
def profile(current_user=Depends(get_current_user)):
    return current_user
