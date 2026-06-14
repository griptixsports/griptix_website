from __future__ import annotations

from typing import Optional

from sqlmodel import Field

from app.models.base import TimestampedBase


class User(TimestampedBase, table=True):
    __tablename__ = "users"

    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str = Field(default="")
    phone: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    role: str = Field(default="customer")  # customer | admin
    google_id: Optional[str] = Field(default=None, index=True)
