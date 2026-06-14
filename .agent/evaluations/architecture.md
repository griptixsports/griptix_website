# EVALUATION: Architecture & Design Pattern Compliance

This evaluator details the requirements to certify that the repository code matches the Griptix monorepo and database architectural standards.

---

## 📐 Criteria Checklist

### 1. Monorepo Structural Integrity
- [ ] Subprojects must be located strictly inside `/apps/` and `/packages/`. No root-level applications allowed.
- [ ] Root workspace file `pnpm-workspace.yaml` must define workspaces for `/apps/*` and `/packages/*`.
- [ ] Root `package.json` must map unified orchestration scripts (build, lint, test) to workspaces.
- [ ] Architecture Decision Records (ADRs) must be stored inside `/docs/adr/` following numeric prefix names (`ADR-001-...`).

### 2. Database Models & Schema Isolation
- [ ] Database entities must inherit from SQLModel or SQLAlchemy models and be declared inside `apps/api/models/`.
- [ ] Database revisions must be managed entirely by Alembic. Run `alembic current` to ensure the schema has no pending migration files.
- [ ] Primary keys must use Server-generated UUIDs, not application-generated values.
- [ ] All tables must feature `created_at` and `updated_at` timestamps using server-default timestamps.
- [ ] Foreign keys must be configured with explicit delete constraints (e.g. `ondelete="CASCADE"` or `SET NULL`).
- [ ] Database indexes must be explicitly added to:
  - `products.slug` (unique)
  - `products.discipline`
  - `orders.user_id`
  - `orders.payment_intent_id`

### 3. Stack Cleanliness (Free-Tier Stack Rules)
- [ ] Ensure no code references or packages import AWS-specific SDKs (e.g., AWS Secrets Manager clients, RDS drivers) inside production services.
- [ ] R2 uploads client must bind using custom `endpoint_url` pointing to `cloudflarestorage.com`.
- [ ] No hardcoded database connection strings; connection URLs must load from environments and match Neon layouts (`?sslmode=require`).
- [ ] Embeddings must compile to 384 dimensions matching Hugging Face `bge-small` configuration (Alembic products vector column size must equal 384).
- [ ] Observability tracing decorators must utilize Langfuse (`@observe()`), not Opik.
- [ ] Analytics scripts must load Microsoft Clarity, not Hotjar.
