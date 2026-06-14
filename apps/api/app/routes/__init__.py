from __future__ import annotations

from fastapi import APIRouter

# Sub-routers are registered here as each feature module is implemented.
# Pattern: from app.routes.<module> import router as <module>_router
#          api_router.include_router(
#              <module>_router, prefix="/<resource>", tags=["<tag>"]
#          )

api_router = APIRouter()
