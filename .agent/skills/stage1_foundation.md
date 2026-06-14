# SKILL: Stage 1 — Foundation, Environment & Build Pipeline

## MISSION
Scaffold the monorepo structure, establish linting configurations, write the Docker Compose developer setup, and configure CI/CD actions for Railway/Vercel pipelines.

## INPUTS
- Target Railway service region (`ap-south`, closest to Mumbai).
- GitHub repository ownership details.
- Environment variable layouts in `env.example`.

## ALLOWED PATHS
- `/infra/`
- `docker-compose.yml`
- `package.json`
- `pnpm-workspace.yaml`
- `pyproject.toml`
- `tsconfig.json`
- `.gitignore`
- `.github/workflows/`

## FORBIDDEN PATHS
- `/apps/`
- `/packages/`

## EXECUTION SEQUENCE
1. **Scaffold Directory Structure**: Ensure apps, packages, infra, and docs/adr exist.
2. **Docker Compose**: Create `docker-compose.yml` defining `web` (Next.js), `api` (FastAPI), `db` (Postgres), and `redis` (Upstash emulator or standard).
3. **Environment Setup**: Read `env.example` and prepare local `.env` bindings.
4. **Code Quality configuration**: Ensure Ruff is configured for Python 3.12 (rules E, F, I, N, B) and Mypy in strict mode. Ensure ESLint + Prettier are configured for React.
5. **CI/CD Pipeline**: Write `.github/workflows/ci.yml` verifying linting, typing, unit testing, and triggering deployments on Vercel Hobby (frontend) and Railway (backend) via GitHub integration.

## SUCCESS CRITERIA (EVALUATION GATES)
- `docker compose up` starts all services cleanly.
- `ruff check .` and `mypy .` return zero errors.
- `eslint` and `tsc --noEmit` return zero errors.
- CI workflows parse successfully and block merges on lint/typecheck failures.
- ADR-001 (Monorepo) and ADR-002 (Free-Tier Stack) are present in `docs/adr/`.
