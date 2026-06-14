# Architecture Decision Record (ADR) 001: Monorepo Structure

## Context

Griptix consists of a Next.js 14 frontend, a FastAPI python backend, a shared design token component library, and database models. Operating these as separate repositories creates friction, version misalignment, and complex CI/CD setup.

## Decision

We will use a unified git monorepo configured with `pnpm workspaces` (for JS/TS sub-packages) and a workspace-level Python configuration.

### Folder Layout
- `/apps/web`: Next.js 14 application
- `/apps/api`: FastAPI application
- `/packages/ui`: Storybook & UI Component Library
- `/packages/types`: Shared type schemas
- `/infra`: Infrastructure as Code (OpenTofu & CLIs)
- `/docs/adr`: Architecture Decision Records

## Consequences

- **Pros**: Consolidated version control, shared type contracts, simplified atomic commits across apps and packages, centralized CI/CD pipelines.
- **Cons**: Monorepo size grows, setup complexity in CI filters, Python and Node workspace tooling are separate.
