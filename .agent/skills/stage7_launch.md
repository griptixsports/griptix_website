# SKILL: Stage 7 — Hardening, SEO, Analytics, QA & Production Launch

## MISSION
Execute production audits: optimize performance, deploy JSON-LD SEO schemas, configure cookies and GDPR requirements, execute penetration tests (BOLA, XSS, upload security), run load profiles, and verify DNS configurations.

## INPUTS
- Final copy, legal policies, and PDF documents.
- Analytics property tokens (GA4, Meta, LinkedIn, Clarity).
- Sentry & Langfuse production DSN keys.
- Domain access parameters.

## ALLOWED PATHS
- `/apps/`
- `/packages/`
- `/infra/`

## FORBIDDEN PATHS
None (This stage is an integration and auditing pass).

## EXECUTION SEQUENCE
1. **SEO Finalization**: Embed JSON-LD schemas: Organization (homepage), Product (PDP), FAQPage (Size Guide / homepage accordion). Configure auto-generating `sitemap.xml` and `robots.txt` disallowing `/admin`, `/account`, and `/api`.
2. **Analytics & GDPR**: Instrument Google Analytics 4 (purchase/cart events), Meta Pixel, LinkedIn Insight Tag, and Microsoft Clarity (with biometric data masking). Set up cookie consent banners preventing scripts from loading before agreement.
3. **Performance Hardening**:
   - *Frontend*: WebP/AVIF images, video deferred loading, JS bundle analysis.
   - *Backend*: Redis query cache (TTL 60s) for catalog routes. Rate limiting on auth endpoints. Database query index analysis.
4. **Security Audit**:
   - BOLA verification (Athlete A cannot access Athlete B's data).
   - MIME validation (FileUploadZone rejects non-image executables).
   - SQL Injection and XSS checks.
   - Run dependency audits: `npm audit` and `pip-audit`.
   - Configure CSP and HSTS headers.
   - Verify S3/R2 block public access and RDS VPC insulation.
5. **Cross-Device QA**: Test on physical iOS and Android viewports.
6. **Lighthouse Audits**: Benchmarks across homepage, collections, PDP, size-guide, and checkout.
7. **Load Tests**: Simulate 500 concurrent browsing users (p95 API latency < 500ms) and 50 checkouts.
8. **DNS Cutover**: Take database snapshots, run migrations, and deploy containers.

## SUCCESS CRITERIA (EVALUATION GATES)
- Rich Results validator passes all schemas without warnings.
- GA4 purchase event fires with transaction value.
- Lighthouse scores meet: Performance 90+, Accessibility 95+, Best Practices 100, SEO 100.
- BOLA test returns HTTP 403.
- `npm audit` and `pip-audit` return zero critical/high alerts.
- Live checkout completes successfully on production DNS.
