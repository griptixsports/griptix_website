# Architecture Decision Record (ADR) 003: Railway as Backend Host (replacing Fly.io)

## Status
**Accepted** — 2026-06-13

## Context

During systemization, the initial free-tier stack specified **Fly.io** as the backend container host to replace AWS ECS Fargate. After review, Fly.io was deprioritized for the following reasons:

1. **CLI-dependent deployment**: Fly.io requires `flyctl` installation and manual `fly launch` initialization — adding friction for agent-driven CI/CD pipelines.
2. **Region billing complexity**: Fly.io's Mumbai (`bom`) region is not on the permanent free tier; it requires at least 1 always-running VM at $1.94/month.
3. **Cold boot behaviour**: Shared VMs on Fly.io can cold-boot up to 30 seconds on the smallest tier, equivalent to Render's limitation but with added complexity.
4. **Developer UX**: Railway's dashboard is significantly more intuitive for onboarding contributors and managing services per-environment.

## Decision

Use **Railway** as the primary backend hosting platform for the FastAPI container.

### Why Railway

| Factor | Railway | Fly.io | Render |
|---|---|---|---|
| Free tier | $5/month credit (no card required initially) | Shared VMs are technically free but limited | Free tier with 15-min sleep |
| GitHub integration | Native — deploys on push, zero config | Requires `flyctl` CLI setup | Native — deploys on push |
| Docker support | Full Dockerfile support | Full Dockerfile support | Full Dockerfile support |
| Custom domains | Free | Free | Free |
| Persistent regions | ap-south (Singapore/Mumbai proximity) | Mumbai (`bom`) available | Singapore (`sg`) available |
| CLI optional | ✅ Optional (`@railway/cli`) | ❌ Required | ✅ Optional |
| Cold boot | No cold boot on active services | No cold boot | 15-min sleep on free tier |

### Render as Fallback

**Render** is the documented fallback — appropriate for:
- **Staging environments** (acceptable 30s cold boot latency)
- **Overflow** when Railway credit is exhausted
- **Mirror deployments** for QA testing

## Consequences

1. `env.example` Section 5 uses `RAILWAY_SERVICE_NAME`, `RAILWAY_ENVIRONMENT`, and `RAILWAY_REGION` instead of `FLY_APP_NAME` and `FLY_REGION`.
2. The `infra/` directory contains Railway setup runbook instead of `fly.toml`.
3. The `.agent/memory/decisions.json` DEC-004 is updated to reflect Railway as primary.
4. The CI/CD pipeline (`.github/workflows/deploy-api.yml`) will use the Railway CLI or Railway GitHub integration (no deploy token needed if using native GitHub app).
5. **No code changes** are required to the FastAPI app itself — the `Dockerfile` and `uvicorn` startup command work identically across Railway, Render, and Fly.io.

## Migration Path

If Railway's free credit becomes insufficient at scale (Cycle 3+), the migration path is:
- **Option A**: Upgrade to Railway Pro ($20/month) — recommended for production workloads exceeding 8 GB memory/month.
- **Option B**: Migrate to Render Starter ($7/month) — no sleep, more predictable pricing.
- **Option C**: Migrate to AWS ECS Fargate once business revenue justifies it (original stack from the Engineering Build Plan).
