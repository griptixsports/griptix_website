from __future__ import annotations

import uuid
from typing import Optional

from sqlmodel import Field

from app.models.base import TimestampedBase


class AnatomicalProfile(TimestampedBase, table=True):
    """Custom hand measurement profile used to size grips for each shooter."""

    __tablename__ = "anatomical_profiles"

    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)
    hand_length_mm: Optional[float] = Field(default=None)
    hand_width_mm: Optional[float] = Field(default=None)
    grip_circumference_mm: Optional[float] = Field(default=None)
    dominant_hand: str = Field(default="right")  # left | right
    sport_discipline: str = Field(default="")  # e.g. "10m Air Pistol", "25m Rapid Fire"
    finger_reach_mm: Optional[float] = Field(default=None)
    notes: str = Field(default="")
    verified_by_coach: bool = Field(default=False)
