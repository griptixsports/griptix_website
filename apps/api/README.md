# @griptix/api

This is the FastAPI backend service for the Griptix platform.

## Features
- **SQLModel / Alembic**: PostgreSQL schemas for users, products, orders, profiles, and audit logs.
- **Authentication**: JWT validation, HTTP-only cookie refresh, and Admin TOTP 2FA.
- **Order State Machine**: Strict status transitions with audit log recording and WebSocket events.
- **Integration services**: Stripe/Razorpay webhook verification, Brevo mail/SMS wrappers.
- **LangGraph Agents**: AI Sizing Validation Agent (checks hand scans) and Jina AI/HF search embeddings.

## Stack
- Python 3.12+
- FastAPI
- SQLModel / SQLAlchemy
- Alembic
- LangGraph
- Pytest (coverage target >= 70%)
- Ruff & Mypy
