"""
Logtail / Better Stack structured logging wrapper.

# TODO (MAINTENANCE.md — Pending Production Integration): Replace LOGTAIL_SOURCE_TOKEN
# with the real token from Better Stack Dashboard → Sources before deploying to
# production. Until then all log output falls back to Python's standard console
# logger — no data is lost, just not shipped to Better Stack.
"""
from __future__ import annotations

import logging


def get_logger(name: str) -> logging.Logger:
    """
    Return a logger for *name*.

    If LOGTAIL_SOURCE_TOKEN is a real token, attach a LogtailHandler so logs
    are shipped to Better Stack. Otherwise fall back to console logging with a
    one-time warning.
    """
    from core.config import settings  # noqa: PLC0415

    log = logging.getLogger(name)

    # TODO (MAINTENANCE.md): Remove this guard once LOGTAIL_SOURCE_TOKEN is real.
    if not settings.logtail_ready:
        # Warn only once at module level to avoid log spam on every request.
        if not getattr(get_logger, "_warned", False):
            logging.getLogger(__name__).warning(
                "Logtail is not configured — LOGTAIL_SOURCE_TOKEN is a placeholder. "
                "Falling back to console logging. "
                "Logs will not be shipped to Better Stack."
            )
            get_logger._warned = True  # type: ignore[attr-defined]
        return log

    try:
        from logtail import LogtailHandler  # noqa: PLC0415

        if not any(isinstance(h, LogtailHandler) for h in log.handlers):
            log.addHandler(LogtailHandler(source_token=settings.logtail_source_token))
    except ImportError:
        logging.getLogger(__name__).warning(
            "logtail-python is not installed — falling back to console logging."
        )

    return log
