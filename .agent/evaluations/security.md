# EVALUATION: Security & Penetration Compliance

This evaluator details the requirements to certify that the repository satisfies strict web application security protocols.

---

## 🛡️ Criteria Checklist

### 1. BOLA / IDOR Verification
- [ ] Routes carrying path parameters (e.g. `/api/v1/orders/{id}`) must assert that the user ID extracted from JWT claims matches the target object's owner. If mismatched, return `HTTP 403 Forbidden`.
- [ ] Admin roles must bypass BOLA assertions to manage order verifications.

### 2. Malicious File Upload Audits
- [ ] Sizing wizard file upload endpoints must perform byte-level checks or verify content-type MIME headers.
- [ ] Uploaded assets must be rejected if they contain executable scripts (`.sh`, `.php`, `.py`, `.exe`). Allow only image extensions (`.jpg`, `.jpeg`, `.png`, `.pdf`).

### 3. HSTS & SSL
- [ ] HTTPS must be enforced on all routes.
- [ ] The HSTS header must be present on all response objects:
  `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### 4. CSP & XSS Sanitization
- [ ] Content-Security-Policy (CSP) headers must restrict script evaluations to safe sources, and block inline scripts.
- [ ] User input parameters (e.g. name, text inputs) must be sanitized to eliminate raw HTML/script tags before writing to databases.

### 5. Secrets Exposure
- [ ] No actual API tokens, database passwords, or signing keys may appear anywhere in Git histories. Run `git grep` checkouts to ensure no secrets remain.
- [ ] Secrets must load as environment variables, injected at runtime via Doppler or platform environment keys.

### 6. Dependency Scanning
- [ ] Running `npm audit` on JS dependencies must return **zero** packages with high or critical severity alerts.
- [ ] Running `pip-audit` on python dependencies must return **zero** vulnerability alerts.
