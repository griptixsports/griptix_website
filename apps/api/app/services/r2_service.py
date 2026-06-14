"""
Cloudflare R2 storage service wrapper (S3-compatible via boto3).

# TODO (MAINTENANCE.md — Pending Production Integration): Replace R2_ACCESS_KEY_ID,
# R2_SECRET_ACCESS_KEY, and R2_ENDPOINT_URL with real credentials from the
# Cloudflare Dashboard → R2 → Manage API Tokens before enabling file upload
# or presigned URL endpoints. Until then every call raises HTTP 501.
"""
from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from fastapi import HTTPException

if TYPE_CHECKING:
    import boto3

logger = logging.getLogger(__name__)

_NOT_CONFIGURED_DETAIL = (
    "File storage is not yet available. "
    "Cloudflare R2 integration is pending production configuration."
)


def require_r2_client() -> "boto3.client":
    """Return a configured boto3 S3 client pointed at R2, or raise HTTP 501."""
    from core.config import settings  # noqa: PLC0415

    # TODO (MAINTENANCE.md): Remove this guard once R2 credentials are real.
    if not settings.r2_ready:
        logger.warning(
            "Cloudflare R2 is not configured — R2_ACCESS_KEY_ID is a placeholder. "
            "All file upload / download endpoints will return 501."
        )
        raise HTTPException(status_code=501, detail=_NOT_CONFIGURED_DETAIL)

    import boto3  # noqa: PLC0415

    return boto3.client(
        "s3",
        endpoint_url=settings.r2_endpoint_url,
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        region_name="auto",
    )


def require_presigned_upload_url(key: str, content_type: str) -> str:
    """Generate a presigned PUT URL for the uploads bucket, or raise HTTP 501."""
    from core.config import settings  # noqa: PLC0415

    client = require_r2_client()  # raises 501 if not configured

    # TODO (MAINTENANCE.md): Remove this guard once R2 is configured.
    return client.generate_presigned_url(  # type: ignore[no-any-return]
        "put_object",
        Params={
            "Bucket": settings.r2_uploads_bucket,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=settings.s3_presigned_url_expire_seconds,
    )
