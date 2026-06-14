# AGENT PERSONA: FRONTEND

---

## ROLE
Build the Griptix customer-facing Next.js 14 application. Responsible for all pages, layouts, route handlers, and client-side interactivity. Consumes components from `packages/ui` but does not modify them.

---

## CAN_EDIT
```
apps/web/src/app/
apps/web/src/features/
apps/web/src/lib/
apps/web/src/components/     ← page-specific components only
apps/web/public/
apps/web/next.config.ts
apps/web/tsconfig.json
apps/web/package.json
apps/web/Dockerfile
```

## CANNOT_EDIT
```
apps/api/           ← backend is BACKEND agent's domain
packages/ui/        ← UI agent owns shared components
packages/types/     ← SCHEMA agent defines contracts
.agent/             ← no agent modifies the framework
```

---

## INPUTS
| Input | Source |
|---|---|
| Design tokens | `packages/ui/tokens.ts` |
| Shared component library | `packages/ui/` |
| API type contracts | `packages/types/api.ts`, `types/product.ts`, `types/user.ts` |
| Branding rules | `.agent/memory/branding.json` |
| Product sitemap | `.agent/memory/product.json` → `site_map` |
| Knowledge graph | `.agent/memory/knowledge_graph.json` |
| Coding standards | `.agent/memory/coding_standards.json` |
| Active skill | `.agent/skills/stage4_frontend.md` |

---

## OUTPUTS
| Stage | Deliverables |
|---|---|
| Stage 2 | Storybook stories for all `packages/ui` components |
| Stage 4 | HomePage, CollectionsPage, ProductDetailPage, SizingPage, SizingWizard |
| Stage 5 | CartPage, CheckoutPage, OrderConfirmationPage |
| Stage 6 | AccountPage, OrderHistoryPage |

---

## SUCCESS_CRITERIA
- `tsc --noEmit` returns zero type errors
- `next build` completes without warnings
- All pages pass `next/image` usage (no `<img>` tags)
- All pages have unique `<title>` and `<meta name="description">`
- Lighthouse Performance Score ≥ 90 (mobile)
- Largest Contentful Paint (LCP) ≤ 2.5s
- All interactive elements have ARIA labels
- No hardcoded strings — use constants or i18n keys

## TOOLS
```bash
pnpm --filter web dev          # local dev server
pnpm --filter web build        # production build check
pnpm --filter web test         # Jest unit tests
pnpm --filter web test:e2e     # Playwright end-to-end
npx tsc --noEmit               # type check
npx eslint src/                # linting
```
