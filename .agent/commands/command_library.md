# Griptix Agent Command Library

This document defines all agentic slash-commands that can be invoked by an operator or AI orchestrator to trigger structured, scoped agent workflows.

---

## How Commands Work

Each command maps to:
1. A **Skill** file loaded from `.agent/skills/`
2. A **Workflow** executed from `.agent/workflows/`
3. **Memory** hydrated from `.agent/memory/`
4. An **Evaluation** gate from `.agent/evaluations/`

The result is a controlled, auditable agent execution — not freeform improvisation.

---

## 📋 Command Reference

### `/build [stage]`
**Purpose**: Execute the build for a specific stage or cycle.

| Usage | Effect |
|---|---|
| `/build stage1` | Scaffold monorepo, Docker Compose, and CI/CD pipelines. |
| `/build stage2` | Generate design tokens and build the UI component library. |
| `/build stage3` | Create database models, Alembic migrations, auth endpoints, and FastAPI routes. |
| `/build stage4` | Compile the public storefront pages and the 5-step Sizing Wizard. |
| `/build stage5` | Wire Stripe/Razorpay payment flows and state machine notifications. |
| `/build stage6` | Build customer dashboards, the partner portal, and Admin panel. |
| `/build stage7` | Run hardening, SEO schemas, analytics, QA, and go-live verification. |

---

### `/audit [target]`
**Purpose**: Run security or quality evaluations against the codebase.

| Usage | Effect |
|---|---|
| `/audit security` | Execute BOLA/IDOR, MIME upload, SQL injection, and XSS tests. |
| `/audit architecture` | Verify directory structure, stack compliance, and database index coverage. |
| `/audit performance` | Run Lighthouse benchmarks, API latency checks, and bundle analysis. |
| `/audit code_quality` | Run `ruff`, `mypy`, `eslint`, `tsc`, Pytest, and Jest coverage reports. |
| `/audit readiness` | Trigger the production Go-Live readiness checklist. |

---

### `/deploy [target]`
**Purpose**: Deploy applications to their respective hosting platforms.

| Usage | Effect |
|---|---|
| `/deploy preview` | Trigger a Vercel Hobby preview deployment from the current branch. |
| `/deploy staging` | Deploy the FastAPI container to Railway staging service and Vercel staging URL. |
| `/deploy production` | Execute full production release: run migrations, container push, DNS validation. |

---

### `/release [version]`
**Purpose**: Tag and document a release milestone.

| Usage | Effect |
|---|---|
| `/release cycle0` | Mark Cycle 0 foundations complete, update `project_state.json`. |
| `/release cycle1` | Mark Cycle 1 Beta Storefront complete, update `project_state.json`. |
| `/release cycle2` | Mark Cycle 2 Production Launch complete, update `project_state.json`. |
| `/release cycle3` | Mark Cycle 3 Scale & B2B complete, update `project_state.json`. |

---

### `/fix [issue]`
**Purpose**: Trigger targeted remediation for known errors or lint failures.

| Usage | Effect |
|---|---|
| `/fix lint` | Auto-run Ruff and ESLint fixers on all modified files. |
| `/fix types` | Surface and resolve Mypy and TypeScript type errors. |
| `/fix tests` | Re-run all failing Pytest and Jest tests with verbose output. |

---

### `/document [target]`
**Purpose**: Generate structured documentation for code artifacts.

| Usage | Effect |
|---|---|
| `/document api` | Auto-generate OpenAPI docs from FastAPI spec and export to `packages/types/`. |
| `/document ui` | Build and deploy the Storybook static documentation site. |
| `/document adr [title]` | Scaffold a new Architecture Decision Record in `docs/adr/` with next sequence number. |
