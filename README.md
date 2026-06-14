# Griptix Website — Olympic-Grade Custom Sporting Grips

This is the flagship digital storefront and engineering dashboard for **Griptix** — designers and manufacturers of Olympic-grade anatomical grips for competitive sport shooting firearms (pistols and rifles).

## 🚀 Monetization & Decoupling Strategy

To prevent AI agents or external models from scraping full product logic and leaving, we operate on a decoupled architecture.
- **Source Code**: Contains the standard web, API, component, types, and infrastructure code (inside `/apps`, `/packages`, `/infra`).
- **Agent Framework (`.agent/`)**: Encapsulates the core business and process intelligence—divided into Orchestrator instructions, stage-by-stage Skills, execution Workflows, persistent Memory models, and strict Evaluator sheets.

In production environments, the `.agent/` control plane acts as a proprietary, subscription-gated product. An Orchestrator service downloads and verifies these directories before execution.

---

## 🛠️ The Tech Stack (Free-Tier Migrated)

To support immediate deployment and zero cloud spend during developer validation and early launch, we have migrated from AWS-centric dependencies to a perpetual free-tier baseline:

| Component | Standard / Paid | Free Tier Replacement |
| --- | --- | --- |
| **Frontend Hosting** | Vercel Pro | **Vercel Hobby** |
| **Backend Hosting** | AWS ECS Fargate | **Render** (free tier, via `render.yaml`) |
| **Database** | AWS RDS PostgreSQL | **Neon Serverless PostgreSQL** (with `pgvector`) |
| **Object Storage** | AWS S3 | **Cloudflare R2** (Zero egress fees, S3-Compatible API) |
| **CDN** | AWS CloudFront | **Cloudflare CDN** |
| **Container Registry** | AWS ECR | **GitHub Container Registry** (`ghcr.io`) |
| **Secrets Manager** | AWS Secrets Manager | **Doppler** (Developer Plan) |
| **Redis Cache** | AWS ElastiCache | **Upstash Redis** (Serverless) |
| **Logging / Metrics** | AWS CloudWatch | **Better Stack / Logtail** |
| **DNS / SSL** | AWS ACM / Route 53 | **Cloudflare Free DNS & SSL** |
| **Transactional Email**| SendGrid | **Brevo (Sendinblue)** (300 free emails/day) |
| **SMS Notifications** | Twilio | **Brevo SMS** (Pay-per-use, deferred to Cycle 2) |
| **LLM Reasoning** | Grok by xAI | **Groq Cloud API** (`llama-3.3-70b-versatile`) |
| **Embeddings** | Jina AI | **Hugging Face Inference API** (`BAAI/bge-small-en-v1.5`) |
| **AI Observability** | Opik | **Langfuse Cloud** (Free Hobby Tier) |
| **Heatmaps** | Hotjar | **Microsoft Clarity** (Permanently Free) |

---

## 📁 Repository Directory Structure

```
griptix-monorepo/
├── apps/
│   ├── web/                    # Next.js 14 + TS frontend
│   └── api/                    # FastAPI + Python 3.12 backend
├── packages/
│   ├── ui/                     # Design tokens & stateless component library
│   └── types/                  # Shared TypeScript/Pydantic schemas
├── infra/                      # Render configuration & Cloudflare CLI script runbooks
├── docs/
│   └── adr/                    # Architecture Decision Records
│
└── .agent/                     # Gated AI agent control center
    ├── orchestrator/           # Orchestrator agent rules and state locks
    ├── skills/                 # Stage-by-stage build plan instructions (Stages 1–7)
    ├── workflows/              # Structured workflow diagrams and steps
    ├── memory/                 # Branding, decisions, architecture, product, and user schemas
    ├── evaluations/            # Verification rules (security, performance, code quality)
    └── state/                  # Current project execution status
```

---

## ⚙️ Running Locally

1. **Prerequisites**: Ensure you have `node`, `pnpm`, and `python` installed.
2. **Environment**: Copy `env.example` to `.env` and configure your API tokens.
3. **Launch dev environment**:
   ```bash
   pnpm install
   docker compose up
   ```
   This spins up Next.js on `localhost:3000`, FastAPI on `localhost:8000`, local Postgres on `5432`, and Redis on `6379`.
