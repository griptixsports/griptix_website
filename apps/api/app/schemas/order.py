from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, field_validator


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = 1
    customizations: dict[str, str] = {}

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    shipping_address: dict[str, str]
    currency: str = "USD"
    notes: str = ""


class OrderItemRead(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    unit_price: Decimal
    customizations: str

    model_config = {"from_attributes": True}


class OrderRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    total_amount: Decimal
    currency: str
    shipping_address: str
    notes: str
    created_at: datetime

    model_config = {"from_attributes": True}
