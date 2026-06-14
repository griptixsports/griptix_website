# Architecture Decision Record (ADR) 002: Free-Tier Stack Migration

## Context

The initial Engineering Build Plan specified an AWS-based infrastructure (RDS, S3, CloudFront, ECR, ECS Fargate, Secrets Manager, CloudWatch, ACM, Route 53) alongside paid tiers of Vercel Pro, SendGrid, Twilio, Jina AI, xAI Grok, and Hotjar. Running this stack from Day 1 generates immediate cloud spend before validating the D2C market or sizing accuracy.

## Decision

We migrate the stack to perpetual free-tier or open-source self-hostable equivalents. The changes are drop-in replacements with no changes to core business logic.

### Mappings
1. **Frontend Hosting**: Vercel Hobby (100 GB free bandwidth).
2. **Backend Hosting**: Railway (free tier).
3. **PostgreSQL Database**: Neon Serverless Postgres (0.5 GB storage, scales to zero when idle).
4. **File Storage**: Cloudflare R2 (10 GB storage, free egress).
5. **Secrets Manager**: Doppler Developer plan (unlimited secrets).
6. **Redis Cache**: Upstash Redis (10,000 commands/day).
7. **Logging**: Better Stack Logtail (1 GB/month log ingestion).
8. **DNS & SSL**: Cloudflare Free Plan.
9. **Email**: Brevo Transactional Email (300 emails/day, 9,000/month).
10. **SMS**: Brevo SMS (credits funded on usage, or feature flagged disabled).
11. **LLM**: Groq API (`llama-3.3-70b-versatile` or vision models).
12. **Embeddings**: Hugging Face Inference API (`BAAI/bge-small-en-v1.5` 384 dimensions).
13. **AI Observability**: Langfuse Cloud (Free Hobby plan).
14. **Heatmaps**: Microsoft Clarity (permanently free).

## Consequences

- **Pros**: $0/month infrastructure cost for Cycle 0, Cycle 1, and launch. Zero code rewrites when moving to paid plans—switching only requires changing environment variable connection strings.
- **Cons**: Fly.io VM RAM is limited to 256 MB (requires tuning Gunicorn/Uvicorn processes). Neon backups are limited to 24-hour restore (requires custom pg_dump scripts stored in Cloudflare R2). Groq models lack native high-accuracy vision (image sizing scans handled via HuggingFace models or local processing).
