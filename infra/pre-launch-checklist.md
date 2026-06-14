# Pre-Launch Deployment Checklist

Run through this list before every production deploy.

## Render (Backend API)

- [ ] `SENTRY_DSN_BACKEND` set to real DSN (not `CHANGE_ME`)
- [ ] `LOGTAIL_SOURCE_TOKEN` set to real token
- [ ] `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` set to live keys
- [ ] `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` set
- [ ] `JWT_SECRET` generated with `openssl rand -hex 64`
- [ ] `DATABASE_URL` points to Neon production branch (with `?sslmode=require`)
- [ ] `ALLOWED_ORIGINS` includes only production domains
- [ ] `ENVIRONMENT=production`
- [ ] Alembic migrations run: `alembic upgrade head`
- [ ] `/health` and `/readiness` endpoints return `"status": "ok"` with no `placeholder` entries

## Vercel (Frontend)

- [ ] `NEXTAUTH_SECRET` generated with `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` set to `https://griptix.in`
- [ ] `NEXT_PUBLIC_API_URL` set to `https://api.griptix.in`
- [ ] `NEXT_PUBLIC_SENTRY_DSN` set to real frontend DSN
- [ ] `STRIPE_PUBLISHABLE_KEY` set to live publishable key
- [ ] `NEXT_PUBLIC_GA4_MEASUREMENT_ID` set
- [ ] Preview deployment tested at Vercel preview URL before promoting to production

## DNS / Cloudflare

- [ ] `griptix.in` → Vercel (CNAME or A record, proxied)
- [ ] `api.griptix.in` → Render hostname (CNAME, proxied)
- [ ] `media.griptix.in` → R2 public bucket (CNAME, proxied)
- [ ] HTTPS enforced on all records
- [ ] HSTS header active: `max-age=31536000; includeSubDomains; preload`

## GitHub Actions Secrets

| Secret | Required for |
|--------|--------------|
| `RENDER_SERVICE_ID` | `deploy-api.yml` |
| `RENDER_API_KEY` | `deploy-api.yml` |
| `VERCEL_TOKEN` | `deploy-web.yml` |
| `VERCEL_ORG_ID` | `deploy-web.yml` |
| `VERCEL_PROJECT_ID` | `deploy-web.yml` |
