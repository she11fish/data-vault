import os
from dotenv import load_dotenv

# Load environment variables from .env file once
load_dotenv()

# Helper to fetch required env vars

def _get_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise ValueError(f"{name} is not set properly")
    return value

# Required settings
SECRET_KEY = _get_env("SECRET_KEY")
ALGORITHM = _get_env("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = _get_env("ACCESS_TOKEN_EXPIRE_MINUTES")
if not ACCESS_TOKEN_EXPIRE_MINUTES.isdigit():
    raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be an integer")
ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES)

DATABASE_URL = _get_env("DATABASE_URL")

ALLOWED_ORIGINS = _get_env("ALLOWED_ORIGINS").split(",") 