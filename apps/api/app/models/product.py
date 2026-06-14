from __future__ import annotations

from decimal import Decimal
from typing import Optional

from sqlmodel import Field

from app.models.base import TimestampedBase


class Product(TimestampedBase, table=True):
    __tablename__ = "products"

    title: str = Field(index=True)
    sku: str = Field(unique=True, index=True)
    description: str = Field(default="")
    price: Decimal = Field(decimal_places=2, max_digits=10)
    image_url: str = Field(default="")
    category: str = Field(index=True)  # "Pistol" | "Rifle"
    # "available" | "discontinued" | "pre_order"
    status: str = Field(default="available", index=True)
    weight_grams: Optional[float] = Field(default=None)
    material: Optional[str] = Field(default=None)
