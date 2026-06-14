from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class ProductRead(BaseModel):
    id: uuid.UUID
    title: str
    sku: str
    description: str
    price: Decimal
    image_url: str
    category: str
    status: str
    weight_grams: Optional[float]
    material: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductListItem(BaseModel):
    id: uuid.UUID
    title: str
    sku: str
    price: Decimal
    image_url: str
    category: str
    status: str

    model_config = {"from_attributes": True}
