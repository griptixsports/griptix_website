from __future__ import annotations

import enum
import uuid
from decimal import Decimal
from typing import Optional

from sqlmodel import Field

from app.models.base import TimestampedBase


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    in_production = "in_production"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"


class Order(TimestampedBase, table=True):
    __tablename__ = "orders"

    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    status: OrderStatus = Field(default=OrderStatus.pending, index=True)
    total_amount: Decimal = Field(decimal_places=2, max_digits=10)
    currency: str = Field(default="USD")
    stripe_payment_intent_id: Optional[str] = Field(default=None, index=True)
    razorpay_order_id: Optional[str] = Field(default=None, index=True)
    shipping_address: str = Field(default="{}")  # JSON
    notes: str = Field(default="")


class OrderItem(TimestampedBase, table=True):
    __tablename__ = "order_items"

    order_id: uuid.UUID = Field(foreign_key="orders.id", index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id")
    quantity: int = Field(default=1, ge=1)
    unit_price: Decimal = Field(decimal_places=2, max_digits=10)
    customizations: str = Field(default="{}")  # JSON: color, material, engraving
