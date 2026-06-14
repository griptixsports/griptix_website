# EVALUATION: Production Readiness & Go-Live Gate

This evaluator is the final gate before DNS cutover. Every item must be marked complete before the platform can go live.

---

## 🚀 Go-Live Criteria Checklist

### 1. Content & Copy
- [ ] All product descriptions, technical specs, and ISSF compliance documentation finalized and loaded into the production database.
- [ ] All downloadable sizing grid PDFs (1:1 scale) are uploaded to Cloudflare R2 and publicly accessible.
- [ ] All product photography (min. 3 per product) loaded in high-resolution to the media bucket.
- [ ] Privacy Policy and Terms of Service are legally reviewed and compliant with the 2026 DPDP Act.
- [ ] Contact Us page routes to an active monitored inbox.

### 2. Authentication & Access Control
- [ ] Admin TOTP 2FA is operational and required on every session entry to `/admin`.
- [ ] Athlete and Partner roles are correctly blocked from `/admin` (returns 403).
- [ ] Guest checkout completes without requiring account creation.

### 3. Payment & Orders
- [ ] A real Stripe test card (`4242 4242 4242 4242`) completes checkout end-to-end, order appears in admin panel, and confirmation email arrives.
- [ ] A Razorpay test UPI payment completes end-to-end.
- [ ] Stripe and Razorpay webhook signatures are validated; forged signatures return HTTP 400.
- [ ] Manufacturing state machine blocks invalid transitions (e.g., `pending -> shipped` returns HTTP 400).

### 4. Notifications
- [ ] Order confirmation email arrives within 2 minutes of payment confirmation.
- [ ] Shipped email includes a clickable tracking link.
- [ ] SMS or feature flag `FEATURE_SMS_ENABLED` is correctly configured.

### 5. SEO & Tracking
- [ ] `sitemap.xml` accessible at `griptix.in/sitemap.xml` and submitted to Google Search Console.
- [ ] `robots.txt` disallows `/admin`, `/account`, and `/api`.
- [ ] GA4 Purchase event fires on confirmation page (verified via GA4 Realtime DebugView).
- [ ] Meta Pixel Purchase event fires on confirmation page.
- [ ] All analytics scripts are blocked until cookie consent is granted.

### 6. Infrastructure
- [ ] Neon database snapshot (pg_dump) taken and stored in Cloudflare R2 before DNS cutover.
- [ ] `railway run --service api -- alembic upgrade head` dry-run shows zero unexpected changes.
- [ ] Alembic `upgrade head` runs cleanly on the production database.
- [ ] Sentry production project is actively receiving error events.
- [ ] Langfuse cloud traces appear for test LangGraph agent calls.
- [ ] HSTS header is enforced on both `griptix.in` and `api.griptix.in`.

### 7. Physical Device QA Sign-Off
- [ ] Full checkout tested on **iPhone (iOS Safari)** with Apple Pay.
- [ ] Full checkout tested on **Samsung Galaxy Android (Chrome)** with Google Pay.
- [ ] Admin panel verified functional on **iPad Pro** (tablet layout).
- [ ] Site fully usable on a 375px mobile viewport without horizontal scroll.

### 8. Human Sign-Off
- [ ] Product Lead has reviewed and approved all public-facing copy.
- [ ] Technical Lead has signed the go-live confirmation document.
