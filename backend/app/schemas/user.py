from fastapi import HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator
import re


class User(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Password must be at least 8 characters long', )
        if not re.search(r'[A-Z]', v):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Password must contain at least one special character')
        return v

    class Config:
        orm_mode = True


class UserOut(BaseModel):
    email: EmailStr
    hashed_password: str

    class Config:
        orm_mode = True


class Message(BaseModel):
    message: str