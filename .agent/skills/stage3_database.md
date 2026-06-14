# SKILL: Stage 3 — Database Schema, Auth & Core Backend API

## MISSION
Build the PostgreSQL schema, write Alembic migration revisions, configure JWT authentication, write RBAC middleware, implement core FastAPI routers (products, profiles, orders, partners), and compile OpenAPI contracts.

## INPUTS
- Target Database: Neon Serverless PostgreSQL with pgvector.
- Allowed API endpoints list and schemas.
- Doppler Secrets Token.

## ALLOWED PATHS
- `/apps/api/`
- `/packages/types/` (Only Pydantic contract generation)

## FORBIDDEN PATHS
- `/apps/web/`
- `/packages/ui/`

## EXECUTION SEQUENCE
1. **Schema Design**: Write SQLModel/SQLAlchemy models for:
   - `users`: ID (UUID), email (unique), hashed_password, role (enum), is_active, is_verified, totp_secret.
   - `anatomical_profiles`: ID, user_id (FK), hand_width_mm, hand_length_mm, hand_orientation (enum), scan_file_s3_url.
   - `products`: ID, name, slug (unique, indexed), discipline (enum), material (enum), price_inr, price_usd, stock_count, issf_compliant (bool).
   - `firearm_compatibility`: ID, product_id (FK), manufacturer, model_name, model_slug.
   - `orders`: ID, user_id (FK, nullable), status (enum: 8 statuses), total_amount_inr, total_amount_usd, payment_gateway, payment_intent_id (indexed), shipping_address, tracking_number.
   - `order_items`: ID, order_id (FK), product_id (FK), anatomical_profile_id (FK, nullable), quantity, unit_price, configuration.
   - `institutional_partners`: ID, user_id (FK), academy_name, bulk_discount_percentage, status.
   - `audit_logs`: ID, actor_user_id (FK), action, entity_type, entity_id, before_state (JSONB), after_state (JSONB).
2. **Migrations**: Generate Alembic migrations: `alembic revision --autogenerate` and run database updates.
3. **Authentication**: Set up bcrypt hashing, access JWTs (15 min), refresh JWTs in HTTP-only cookies (7 days), and Admin TOTP 2FA endpoints.
4. **RBAC**: Implement `require_role(role: Role)` FastAPI dependency checking token payloads.
5. **Endpoints**:
   - `GET /products` (paginated, filtered), `GET /products/{slug}`, `GET /products/search` (predictive Postgres `ILIKE` fallback).
   - `POST /profiles`, `GET /profiles`, `POST /profiles/{id}/upload-scan` (returns presigned Cloudflare R2 PUT URL).
   - `WS /ws/orders/{order_id}` (WebSocket channel for order updates).
6. **Agent Scaffolding**: Setup `SizingValidationAgent` class skeleton using LangGraph with Opik/Langfuse tracing variables.

## SUCCESS CRITERIA (EVALUATION GATES)
- `alembic upgrade head` and `downgrade base` run cleanly.
- Endpoint unit tests achieve >= 70% coverage.
- BOLA protection is verified (athletes cannot fetch other athletes' profiles/orders).
- Mypy in strict mode and Ruff checks pass with zero errors.
