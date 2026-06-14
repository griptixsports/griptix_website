from __future__ import annotations

import uuid
from typing import Optional

from sqlmodel import Field

from app.models.base import TimestampedBase


class AuditLog(TimestampedBase, table=True):
    __tablename__ = "audit_logs"

    user_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="users.id", index=True
    )
    action: str = Field(index=True)  # "order.created" | "user.login" | "product.viewed"
    resource_type: str = Field(index=True)  # "order" | "user" | "product"
    resource_id: Optional[str] = Field(default=None)
    ip_address: Optional[str] = Field(default=None)
    user_agent: Optional[str] = Field(default=None)
    extra: str = Field(default="{}")  # JSON for additional context
