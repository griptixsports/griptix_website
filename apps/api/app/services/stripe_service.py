"""
Stripe payment service wrapper.

# TODO (MAINTENANCE.md — Pending Production Integration): Replace STRIPE_SECRET_KEY
# and STRIPE_WEBHOOK_SECRET with real production keys from the Stripe Dashboard
# before enabling checkout flows. Until then every call raises HTTP 501.
"""
from __future__ import annotations

import logging

from fastapi import HTTPException

logger = logging.getLogger(__name__)

_NOT_CONFIGURED_DETAIL = (
    "Payment processing is not yet available. "
    "Stripe integration is pending production configuration."
)


def require_stripe() -> object:
    """Return a configured stripe module or raise HTTP 501."""
    from core.config import settings  # noqa: PLC0415, I001

    # TODO (MAINTENANCE.md): Remove this guard once STRIPE_SECRET_KEY is a real key.
    if not settings.stripe_ready:
        logger.warning(
            "Stripe is not configured — STRIPE_SECRET_KEY is a placeholder. "
            "All payment endpoints will return 501."
        )
        raise HTTPException(status_code=501, detail=_NOT_CONFIGURED_DETAIL)

    import stripe  # noqa: PLC0415

    stripe.api_key = settings.stripe_secret_key
    return stripe


def require_stripe_webhook_secret() -> str:
    """Return the webhook secret or raise HTTP 501."""
    from core.config import settings  # noqa: PLC0415

    # TODO (MAINTENANCE.md): Remove this guard once STRIPE_WEBHOOK_SECRET is real.
    if not settings.stripe_ready:
        logger.warning("Stripe webhook secret is a placeholder — rejecting webhook.")
        raise HTTPException(status_code=501, detail=_NOT_CONFIGURED_DETAIL)

    return settings.stripe_webhook_secret
