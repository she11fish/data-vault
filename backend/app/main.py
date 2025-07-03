from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.api.auth as auth_api
from app.db.database import engine, Base
import app.api.data as data_api
import json
from app.config import ALLOWED_ORIGINS

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Data Vault API",
    description="API for converting images and text to documents using OCR",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router=auth_api.router,
)
app.include_router(
    router=data_api.router,
)

@app.get("/")
def read_root():
    return {"message": "Welcome!"}
