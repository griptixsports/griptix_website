# Griptix — Maintenance & Pending Production Integrations

This file tracks external services that are **temporarily bypassed** during the
initial Render deployment. Each service uses a placeholder credential (`CHANGE_ME`)
and has a corresponding fail-safe in the codebase that prevents a 500 error if
the service is accidentally called before it is configured.

---

## Pending Production Integration

### 1. Stripe (Payment Processing)
| Field | Value |
|---|---|
| Status | **Placeholder** — `STRIPE_SECRET_KEY=sk_test_CHANGE_ME` |
| Fail-safe | All checkout / webhook endpoints return **HTTP 501 Not Implemented** |
| Service file | `apps/api/app/services/stripe_service.py` |
| Env vars needed | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Where to get them | [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys |
| Render env var | Set in Render Dashboard → `griptix-api` → Environment |
| Integration checklist | [ ] Set live keys in Render env<br>[ ] Configure webhook endpoint in Stripe dashboard (`/api/v1/payments/stripe/webhook`)<br>[ ] Remove `require_stripe()` fail-safe guard once verified |

---

### 2. Cloudflare R2 (File Storage)
| Field | Value |
|---|---|
| Status | **Placeholder** — `R2_ACCESS_KEY_ID=CHANGE_ME` |
| Fail-safe | All file upload / presigned URL endpoints return **HTTP 501 Not Implemented** |
| Service file | `apps/api/app/services/r2_service.py` |
| Env vars needed | `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` |
| Where to get them | [Cloudflare Dashboard](https://dash.cloudflare.com) → R2 → Manage R2 API Tokens |
| Render env var | Set in Render Dashboard → `griptix-api` → Environment |
| Integration checklist | [ ] Create R2 API token with read/write on `griptix-uploads` + `griptix-media`<br>[ ] Set env vars in Render<br>[ ] Create both buckets if not done<br>[ ] Bind `media.griptix.in` custom domain to `griptix-media` bucket |

---

### 3. Sentry (Error Tracking)
| Field | Value |
|---|---|
| Status | **Placeholder** — `SENTRY_DSN_BACKEND=https://CHANGE_ME@o0.ingest.sentry.io/CHANGE_ME` |
| Fail-safe | `init_sentry()` silently skips initialization; errors appear in console only |
| Service file | `apps/api/app/services/sentry_service.py` |
| Env vars needed | `SENTRY_DSN_BACKEND` |
| Where to get them | [Sentry Dashboard](https://sentry.io) → Project → Settings → Client Keys (DSN) |
| Render env var | Set in Render Dashboard → `griptix-api` → Environment |
| Integration checklist | [ ] Create Sentry project `griptix-api`<br>[ ] Copy DSN to Render env<br>[ ] Set `SENTRY_ENVIRONMENT=production` in Render<br>[ ] Verify errors appear in Sentry after first deploy |

---

### 4. Logtail / Better Stack (Structured Logging)
| Field | Value |
|---|---|
| Status | **Placeholder** — `LOGTAIL_SOURCE_TOKEN=CHANGE_ME` |
| Fail-safe | `get_logger()` falls back to Python's standard console logger; no log data is lost |
| Service file | `apps/api/app/services/logtail_service.py` |
| Env vars needed | `LOGTAIL_SOURCE_TOKEN` |
| Where to get them | [Better Stack](https://betterstack.com) → Logs → Sources → your source token |
| Render env var | Set in Render Dashboard → `griptix-api` → Environment |
| Integration checklist | [ ] Create a Better Stack source named `griptix-api`<br>[ ] Copy source token to Render env<br>[ ] Verify log ingestion after first deploy |

---

## How the Fail-Safes Work

- **`_is_placeholder(value)`** in `core/config.py` detects any value containing `"CHANGE_ME"`.
- `Settings` exposes `.stripe_ready`, `.r2_ready`, `.sentry_ready`, `.logtail_ready` boolean properties.
- Each service wrapper calls these properties before touching the real client. If `False`, Stripe and R2 raise `HTTP 501`; Sentry and Logtail log a console warning and continue.
- The `/readiness` endpoint (`GET /readiness`) reports live configuration status for all four services.

## Removing a Fail-Safe

Once a service is fully configured:
1. Set the real env var in Render Dashboard.
2. Verify the `/readiness` endpoint shows `"ready"` for that service.
3. Remove the `# TODO (MAINTENANCE.md)` guard comment from the service file.
4. Remove or update the corresponding section in this file.
