# EVALUATION: Code Quality & Testing Coverage

This evaluator details the requirements to certify that the Griptix codebase matches our strict code formatting, typing, and testing targets.

---

## 🧹 Criteria Checklist

### 1. Strict Typing (TypeScript & Python)
- [ ] Next.js React codebase and packages/ui must compile via `tsc --noEmit` with **zero** type errors.
- [ ] FastAPI backend must pass strict-mode Mypy check:
  `mypy apps/api --strict`
  (Must include `disallow_untyped_defs = true` and return zero type warnings).

### 2. Linting & Formatting Standards
- [ ] Root Ruff checks must return zero errors:
  `ruff check apps/api`
  (Rulesets E, F, I, N, B must be strictly satisfied).
- [ ] ESLint rules on Next.js/React must pass with zero issues:
  `pnpm run lint`

### 3. Automated Test Coverage
- [ ] Frontend unit tests (Jest) must achieve a minimum of **70% coverage**.
- [ ] Backend routing, services, and models tests (Pytest) must achieve a minimum of **70% coverage**.
- [ ] Unit tests must mock external calls (e.g. Stripe PaymentIntent creations, Brevo email dispatches, Groq completions) to ensure stable run executions.

### 4. Git Workspaces & Clean Commits
- [ ] Pre-commit hook checks running Ruff, Mypy, and ESLint must execute before commits are approved.
- [ ] Build outputs, node modules, venvs, and cache folders must not be checked into Git histories (verified via `.gitignore`).
