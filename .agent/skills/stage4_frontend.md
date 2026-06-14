# SKILL: Stage 4 — Core E-Commerce Engine (Frontend Catalog, PDP & Sizing Wizard)

## MISSION
Build the public-facing storefront pages and the multi-step Sizing Wizard utilizing components exclusively from `@griptix/ui` and types from `@griptix/types`.

## INPUTS
- Storybook component library from Stage 2.
- OpenAPI schema types for API routing.
- Product descriptions, pricing metrics, and discipline requirements.

## ALLOWED PATHS
- `/apps/web/`

## FORBIDDEN PATHS
- `/apps/api/`
- `/packages/ui/` (Read-only reference)

## EXECUTION SEQUENCE
1. **Global App Shell**: Setup Next.js custom `_app.tsx` / Layout wrapping the `ThemeProvider`, `SessionProvider` (auth), and Zustand store (for cart state). Bind `TopNav` (with debounced search), `Footer`, and `CartDrawer`.
2. **Homepage**: Compile landing page: Hero section (silent looping video, primary CTAs), Three Pillars grid, Discipline navigation grid, Testimonial carousel, and Accordion FAQs.
3. **Collection Pages**: Route `/collections` and `/collections/{discipline}`. Implement Server-Side Rendering (SSR) or Incremental Static Regeneration (ISR, `revalidate: 60`). Provide filtering (materials, orientation, price) and sorting. Bind the `ComplianceBadge`.
4. **Product Detail Page (PDP)**: Route `/products/{slug}`. SSR-rendered page with image lightbox, configuration panel (size, orientation, material, weapon compatibility), specs sheets, and JSON-LD schema metadata.
5. **Sizing Wizard**: Route `/support/size-guide`. Five-step flow (Firearm -> Orientation -> Measurements -> Outline Upload -> Review). Step 4 must call pre-signed URL endpoints and upload outline drawings directly to Cloudflare R2 via `PUT` request. Support hash-addressable URL navigation (`#step-3`).
6. **Auth Pages**: Compile `/login`, `/register`, `/forgot-password`, `/reset-password` layouts.

## SUCCESS CRITERIA (EVALUATION GATES)
- `next build` compiles successfully with zero TypeScript/ESLint errors.
- Sizing Wizard uploads JPEGs to R2 and completes Step 5 successfully.
- Image assets utilize Next.js `<Image>` component.
- Mobile viewports (375px wide) do not overflow or trigger horizontal scroll.
- Staging Lighthouse Performance score is >= 90.
