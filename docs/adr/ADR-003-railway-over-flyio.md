# Architecture Decision Record (ADR) 003: Render as Backend Host (replacing Railway)

## Status
**Superseded** — 2026-06-16
(Originally accepted 2026-06-13 with Railway as primary; updated to Render)

## Context

The initial free-tier stack specified **Railway** as the backend container host after deprioritizing Fly.io (see original ADR reasoning below). Railway was later replaced by **Render** as the primary host for the following reasons:

1. **Credit exhaustion risk**: Railway's free $5/month credit is consumed by always-on services; Render's free tier is genuinely free (with trade-offs).
2. **`render.yaml` IaC**: Render supports a declarative `render.yaml` at the repo root, enabling version-controlled service configuration — Railway has no equivalent file-based config.
3. **GitHub Actions integration**: Render's deploy API (`POST /v1/services/{id}/deploys`) integrates cleanly with the existing GitHub Actions workflow using `RENDER_TOKEN`.
4. **Simpler credential model**: Render uses a single API token + service ID, matching the secrets already configured in the GitHub repository.

## Decision

Use **Render** as the primary backend hosting platform for the FastAPI container.

### Comparison

| Factor | Render | Railway | Fly.io |
|---|---|---|---|
| Free tier | Free (15-min sleep) | $5/month credit | Shared VMs (limited) |
| GitHub integration | Native + `render.yaml` | Native, no IaC file | Requires `flyctl` CLI |
| Docker support | Full Dockerfile | Full Dockerfile | Full Dockerfile |
| Custom domains | Free | Free | Free |
| IaC config | `render.yaml` ✅ | ❌ | `fly.toml` ✅ |
| Deploy API | REST API ✅ | REST API ✅ | CLI only |
| Cold boot | 15-min sleep on free | No cold boot (paid) | No cold boot |
| Region | Oregon (us-west) | ap-south | Configurable |

## Consequences

1. `render.yaml` at repo root defines the `griptix-api` web service with Docker build config.
2. `.env` Section 5 uses `RENDER_SERVICE_ID`, `RENDER_API_KEY`, and `RENDER_REGION`.
3. `infra/README.md` documents Render as primary with step-by-step setup.
4. `.github/workflows/deploy-api.yml` triggers a Render redeploy via `POST /v1/services/{id}/deploys`.
5. GitHub secrets required: `RENDER_TOKEN`, `RENDER_SERVICE_ID`.
6. **No code changes** to the FastAPI app — the `Dockerfile` and `uvicorn` startup are platform-agnostic.

## Migration Path

If Render's free tier becomes insufficient:
- **Option A**: Upgrade to Render Starter ($7/month) — no sleep, persistent connections.
- **Option B**: Railway Pro ($20/month) — no cold boot, more memory.
- **Option C**: AWS ECS Fargate — once revenue justifies managed infrastructure costs.
