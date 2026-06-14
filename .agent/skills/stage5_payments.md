# SKILL: Stage 5 — Checkout, Payments, Order Management & Notifications

## MISSION
Build the secure payment checkout funnel, verify webhook signatures, implement the backend manufacturing state machine, and wire transactional Brevo email/SMS/WhatsApp notifications.

## INPUTS
- Stripe and Razorpay test mode credentials.
- Brevo transactional template definitions.
- Webhook signature keys.

## ALLOWED PATHS
- `/apps/web/`
- `/apps/api/`

## FORBIDDEN PATHS
- `/packages/ui/`

## EXECUTION SEQUENCE
1. **Cart & Pre-Checkout Review**: Compile `/checkout/cart` reviewing custom options, subtotal, shipping weight, and taxes. Limit custom configurations to a quantity of 1.
2. **Checkout Pages**: Route `/checkout` with Contact/Shipping, Sizing validation (blocks checkout if sizing data is missing), and Payment.
3. **Stripe & Razorpay gateways**:
   - *Stripe (International)*: Frontend Card rendering via Stripe Elements. Backend `POST /payments/stripe/create-intent`. Webhook handler `POST /webhooks/stripe` validating headers with `stripe.webhook.construct_event`.
   - *Razorpay (Domestic)*: Frontend Modal initialization. Backend `POST /payments/razorpay/create-order` and verification `POST /payments/razorpay/verify` validating HMAC-SHA256 signature.
   - *Webhooks*: Webhooks must return HTTP 200 immediately, processing state changes (transitioning order status to `paid`) asynchronously via `BackgroundTask`.
4. **Order Confirmation Page**: Route `/checkout/confirmation/{order_id}` displaying a status stepper (Order Received).
5. **Manufacturing Pipeline State Machine**: Enforce strict status lifecycle (`pending -> paid -> sizing_verified -> in_production -> qc_passed -> shipped -> delivered`). State transitions must log in `audit_logs` and broadcast changes over WebSockets.
6. **Notifications**:
   - *Brevo Email*: Branded HTML templates for `ORDER_CONFIRMATION` (triggered on `paid`), `SIZING_VERIFIED`, and `SHIPPED` (includes tracking links).
   - *Brevo SMS/WhatsApp*: SMS templates for `qc_passed` and `shipped` notifications.
7. **Shipping Estimates**: Implement `POST /shipping/estimate` returning domestic/international zone flat-rates.

## SUCCESS CRITERIA (EVALUATION GATES)
- Stripe Elements card submits, completes payment, and transitions order status to `paid`.
- Webhooks reject payloads with invalid signatures (return HTTP 400).
- State machine blocks skipping stages (e.g. `paid -> shipped` returns HTTP 400).
- Notifications send asynchronously without blocking status state updates.
- Pytest coverage on payment and state services meets >= 70%.
