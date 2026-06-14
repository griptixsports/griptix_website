from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import api_router
from app.services.logtail_service import get_logger
from app.services.sentry_service import init_sentry
from core.config import settings

logging.basicConfig(level=logging.INFO)
logger = get_logger(__name__)

# Initialize error tracking.
# Skipped with a warning if SENTRY_DSN_BACKEND is a placeholder — see MAINTENANCE.md.
init_sentry()

app = FastAPI(
    title="Griptix API",
    version="1.0.0",
    description="Olympic-grade custom sporting grips — backend API",
    docs_url="/docs" if settings.environment != "production" else None,
    redoc_url="/redoc" if settings.environment != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["ops"])  # type: ignore[untyped-decorator]
async def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


@app.get("/readiness", tags=["ops"])  # type: ignore[untyped-decorator]
async def readiness() -> dict[str, object]:
    """
    Reports which external services are fully configured vs. still using
    placeholder credentials. Used by ops / monitoring to track integration status.
    See MAINTENANCE.md for pending items.
    """

    def _status(ready: bool) -> str:
        return "ready" if ready else "placeholder — see MAINTENANCE.md"

    return {
        "status": "ok",
        "services": {
            "stripe": _status(settings.stripe_ready),
            "r2": _status(settings.r2_ready),
            "sentry": _status(settings.sentry_ready),
            "logtail": _status(settings.logtail_ready),
        },
    }
