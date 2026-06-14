# Griptix Infrastructure (Free-Tier Stack)

This directory outlines the setup, deployment, and configuration scripts for the Griptix cloud components.

---

## Services Setup

### 1. Backend (Railway — Primary)

Railway deploys automatically from GitHub on every push. No CLI install required for production.

**Setup steps:**
1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.
2. Select the `Griptix_website` repository.
3. Set the **Root Directory** to `apps/api`.
4. Railway auto-detects the `Dockerfile`. Confirm it is set as the build method.
5. Set the **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Under **Service Settings → Custom Domain**, add `api.griptix.in`.

**Environment variables** (set in Railway → Service → Variables):
```
DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
JWT_SECRET=your-secret
ENVIRONMENT=production
```

**Optional: Railway CLI for local operations**
```bash
npm install -g @railway/cli
railway login
railway status
railway logs --tail
```

---

### 2. Backend Fallback (Render)

If Railway credit is exhausted, Render acts as a documented fallback.

> ⚠️ **Note**: Render's free tier spins down services after 15 minutes of inactivity (cold boot ~30s). Use only for staging or non-production environments.

**Setup steps:**
1. Go to [render.com](https://render.com) → **New → Web Service → Connect GitHub repo**.
2. Set **Root Directory** to `apps/api`.
3. Set **Dockerfile Path** to `apps/api/Dockerfile`.
4. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Set the custom domain to `staging-api.griptix.in`.

---

### 3. Database (Neon Serverless PostgreSQL)
1. Sign up on [neon.tech](https://neon.tech) and create a project named `griptix`.
2. Under **Branches**, use the default `main` branch for production.
3. Create a `preview` branch for PR-based migrations.
4. Enable `pgvector` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
5. Copy the connection string and add to Railway/Render environment variables.

---

### 4. File Storage (Cloudflare R2)
1. In Cloudflare, navigate to **R2 Object Storage**.
2. Create two buckets:
   - `griptix-uploads` — private (no public access)
   - `griptix-media` — bound to custom domain `media.griptix.in`
3. Generate **S3 API credentials** under **Manage R2 API tokens**.
4. Add `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` to Railway variables.

---

### 5. DNS and SSL (Cloudflare)
1. Point `griptix.in` nameservers to Cloudflare.
2. Create DNS records:
   - `griptix.in` → Vercel (CNAME, proxied)
   - `api.griptix.in` → Railway custom domain hostname (CNAME, proxied)
   - `media.griptix.in` → Cloudflare R2 bucket public URL (CNAME, proxied)
3. Under **SSL/TLS**, enable **Universal SSL** and configure **HSTS**:
   - `max-age=31536000; includeSubDomains; preload`

---

## CI/CD Pipeline Overview

| Trigger | Action |
|---|---|
| PR opened → any branch | GitHub Actions: lint, type-check, pytest, jest |
| PR merged → `main` | Vercel auto-deploys frontend preview |
| Push to `main` | Railway auto-redeploys `griptix-api` service |
| Tag `v*` | GitHub Actions: build GHCR image + Railway deploy + Vercel production |
