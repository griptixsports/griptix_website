"""
Sentry error-tracking initializer.

# TODO (MAINTENANCE.md — Pending Production Integration): Replace SENTRY_DSN_BACKEND
# with the real DSN from Sentry Dashboard → Project → Client Keys before deploying
# to production. Until then Sentry is silently skipped and errors only appear in
# console logs.
"""
from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def init_sentry() -> None:
    """Initialize Sentry SDK, or log a warning and skip if DSN is a placeholder."""
    from core.config import settings  # noqa: PLC0415

    # TODO (MAINTENANCE.md): Remove this guard once SENTRY_DSN_BACKEND is a real DSN.
    if not settings.sentry_ready:
        logger.warning(
            "Sentry is not configured — SENTRY_DSN_BACKEND is a placeholder. "
            "Error tracking is disabled for this deployment."
        )
        return

    try:
        import sentry_sdk  # noqa: PLC0415, I001
        from sentry_sdk.integrations.fastapi import FastApiIntegration  # noqa: PLC0415, I001
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration  # noqa: PLC0415, I001

        sentry_sdk.init(
            dsn=settings.sentry_dsn_backend,
            traces_sample_rate=settings.sentry_traces_sample_rate,
            environment=settings.sentry_environment,
            integrations=[FastApiIntegration(), SqlalchemyIntegration()],
            send_default_pii=False,
        )
        logger.info("Sentry initialized (environment=%s)", settings.sentry_environment)
    except ImportError:
        logger.warning("sentry-sdk is not installed — error tracking is disabled.")
