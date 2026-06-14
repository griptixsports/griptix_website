# SKILL: Stage 6 — Dashboards, Admin Panel & B2B Partner Portal

## MISSION
Build the authenticated dashboards for athletes and institutional partners, and construct the admin console featuring the Kanban Order Verification board.

## INPUTS
- RBAC middleware models (Athlete, Partner, Admin roles).
- WebSocket order status endpoints.
- S3 asset download/thumbnail helper schemas.

## ALLOWED PATHS
- `/apps/web/`
- `/apps/api/`

## FORBIDDEN PATHS
- `/packages/`

## EXECUTION SEQUENCE
1. **Customer Dashboard**: Route `/account/dashboard`. Require authentication. Render order history table, order detail modal (stepper connected to WebSockets for live status changes), anatomical profiles panel (saves dimensions and scan links), account settings, and quick reorder button.
2. **B2B Partner Portal**: Route `/account/partner`. Restricted to partners. Render academy profiles, bulk order lists (details team configuration), discount progress card, and custom quote request form.
3. **Admin Panel**: Route `/admin`. Restrict to admin. Lock behind TOTP 2FA.
   - *Order Verification Board*: Kanban board grouping by status. Card views reveal hand-scan thumbnails, details, and buttons for verification transitions ("Verify Sizing", "Pass QC", "Mark Shipped").
   - *Inventory Manager*: Table of products with inline editing for pricing, stock, and is_active flag. Multi-step "Add Product" flow uploading images to R2.
   - *Audit Log Viewer*: Paginated read-only table logs.
   - *Analytics Overview*: Basic summary cards (revenue, order counts, average cycle times).
4. **Auth flows & Landing Page**: Create public `/partner-program` landing page capturing academy details and forwarding applications.

## SUCCESS CRITERIA (EVALUATION GATES)
- Non-authenticated requests to `/account/*` and `/admin` redirect to `/login`.
- Non-admin roles receive HTTP 403 on `/admin` actions.
- WebSocket-connected dashboard updates stepper status live on admin transitions.
- "Mark Shipped" requires a tracking number and carrier name.
- Partner discount mappings return the correct percentages in pricing calculations.
- Audit Log table is read-only and lacks edit/delete actions.
