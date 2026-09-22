from pathlib import Path

from fastapi import FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine
from app.routers import analytics, auth, chatbot, customers, notifications, recommendations, reports, sales, sentiment, support


def create_app() -> FastAPI:
    settings.FILE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    app = FastAPI(
        title="AI Business Copilot",
        version="1.0.0",
        docs_url=f"{settings.API_PREFIX}/docs",
        redoc_url=f"{settings.API_PREFIX}/redoc",
        openapi_url=f"{settings.API_PREFIX}/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.mount(
        "/uploads",
        StaticFiles(directory=str(settings.FILE_UPLOAD_DIR)),
        name="uploads",
    )

    app.include_router(auth, prefix=settings.API_PREFIX)
    app.include_router(analytics, prefix=settings.API_PREFIX)
    app.include_router(customers, prefix=settings.API_PREFIX)
    app.include_router(sales, prefix=settings.API_PREFIX)
    app.include_router(support, prefix=settings.API_PREFIX)
    app.include_router(chatbot, prefix=settings.API_PREFIX)
    app.include_router(sentiment, prefix=settings.API_PREFIX)
    app.include_router(recommendations, prefix=settings.API_PREFIX)
    app.include_router(reports, prefix=settings.API_PREFIX)
    app.include_router(notifications, prefix=settings.API_PREFIX)

    @app.get("/")
    def home() -> dict[str, str]:
        return {"message": "AI Business Copilot Backend Running"}

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "Healthy"}

    return app


app = create_app()


@app.on_event("startup")
def startup_event() -> None:
    settings.FILE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:  # pragma: no cover - defensive startup handling
        logging.warning("Database unavailable at startup, continuing without DB: %s", exc)

