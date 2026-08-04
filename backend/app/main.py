from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base
from app.core.database import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Business Copilot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():

    return {
        "message": "AI Business Copilot Backend Running"
    }


@app.get("/health")
def health():

    return {
        "status": "Healthy"
    }