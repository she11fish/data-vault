# import os
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
# import secrets
# import yagmail
from dotenv import load_dotenv

from app.db.database import get_db
from app.api.deps import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    hash_password,
)
from app.models.user import User
import app.schemas.user as user_schema
from sqlalchemy.orm import Session
import uuid
from app.models.token import Token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register_user(user: user_schema.User, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = hash_password(user.password)

    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"msg": "User registered successfully"}


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# TODO: Uncomment this when we have a way to send emails
# TODO: Use it only when we have 2fa flow
# @router.post("/forgot-password", response_model=user_schema.Message)
# async def forgot_password(email: str, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == email).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_200_OK, detail="Sent email to reset password")
#     token = Token(user_id=user.id, hashed_token=hash_password(secrets.token_hex(32)))
#     db.add(token)
#     load_dotenv()
#     other_email = os.getenv("EMAIL")
#     other_password = os.getenv("PASSWORD")
#     if not other_email or not other_password:
#         return {"message": "Sent email to reset password"}
#     yagmail.SMTP(other_email, other_password).send(email, "Reset Password", "Click the link to reset your password: http://localhost:8000/reset-password?token=" + token.hashed_token)
#     db.commit()
#     db.refresh(token)
#     return {"message": "Sent email to reset password"}

# @router.post("/reset-password?token={token}", response_model=user_schema.Message)
# async def reset_password(token: str, password: str, db: Session = Depends(get_db)):
#     hashed_token = hash_password(token)
#     token = db.query(Token).filter(Token.hashed_token == hashed_token).first()
#     if not token:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
#     user = db.query(User).filter(User.id == token.user_id).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#     user.hashed_password = hash_password(password)
#     db.delete(token)
#     db.commit()
#     return {"message": "Password reset successfully!"}