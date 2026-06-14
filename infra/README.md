# Griptix Infrastructure (Free-Tier Stack)

This directory outlines the setup, deployment, and configuration scripts for the Griptix cloud components.

---

## Services Setup

### 1. Backend (Render — Primary)

Render deploys automatically from GitHub on every push to `main`. Configuration is driven by `render.yaml` at the repo root.

**One-time setup steps:**
1. Go to [render.com](https://render.com) → **New → Web Service → Connect GitHub repo**.
2. Select the `griptix_website` repository.
3. Render will detect `render.yaml` automatically — confirm service name is `griptix-api`.
4. Set **Dockerfile Path** to `./apps/api/Dockerfile` and **Docker Context** to `./apps/api`.
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Under **Settings → Custom Domain**, add `api.griptix.in`.
7. Copy the **Service ID** (format: `srv-xxxxxxxx`) — add it as a GitHub Actions secret named `RENDER_SERVICE_ID`.
8. Generate a **Render API key** in Render Dashboard → Account → API Keys — add it as `RENDER_API_KEY`.

**Environment variables** (set in Render → Environment):
```
DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
JWT_SECRET=your-secret
ENVIRONMENT=production
ALLOWED_ORIGINS=https://griptix.in,https://www.griptix.in
```
All other variables are declared in `render.yaml` — set the `sync: false` ones in the Render dashboard.

> ⚠️ **Note**: Render's free tier spins down after 15 minutes of inactivity (cold boot ~30s). Upgrade to a paid plan for production uptime, or use a cron ping to keep it warm.

---

### 2. CI/CD Deploy Workflow

`.github/workflows/deploy-api.yml` triggers a Render deploy via Render API on every push to `main` that touches `apps/api/**` or `render.yaml`.

**GitHub Actions secrets required:**
| Secret | Where to get it |
|---|---|
| `RENDER_SERVICE_ID` | Render Dashboard → Service → Settings → Service ID |
| `RENDER_API_KEY` | Render Dashboard → Account → API Keys |

---

### 3. Database (Neon Serverless PostgreSQL)
1. Sign up on [neon.tech](https://neon.tech) and create a project named `griptix`.
2. Under **Branches**, use the default `main` branch for production.
3. Create a `preview` branch for PR-based migrations.
4. Enable `pgvector` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
5. Copy the connection string and add to Render environment variables.

---

### 4. File Storage (Cloudflare R2)
1. In Cloudflare, navigate to **R2 Object Storage**.
2. Create two buckets:
   - `griptix-uploads` — private (no public access)
   - `griptix-media` — bound to custom domain `media.griptix.in`
3. Generate **S3 API credentials** under **Manage R2 API tokens**.
4. Add `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` to Render environment variables.

---

### 5. DNS and SSL (Cloudflare)
1. Point `griptix.in` nameservers to Cloudflare.
2. Create DNS records:
   - `griptix.in` → Vercel (CNAME, proxied)
   - `api.griptix.in` → Render custom domain hostname (CNAME, proxied)
   - `media.griptix.in` → Cloudflare R2 bucket public URL (CNAME, proxied)
3. Under **SSL/TLS**, enable **Universal SSL** and configure **HSTS**:
   - `max-age=31536000; includeSubDomains; preload`

---

## CI/CD Pipeline Overview

| Trigger | Action |
|---|---|
| PR opened → any branch | GitHub Actions: lint, type-check, pytest, jest |
| PR merged → `main` | Vercel auto-deploys frontend preview |
| Push to `main` (touches `apps/api/**`) | GitHub Actions triggers Render redeploy via API |
| Tag `v*` | GitHub Actions: build GHCR image + Render deploy + Vercel production |
