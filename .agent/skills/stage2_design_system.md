# SKILL: Stage 2 — Design System & UI Component Library

## MISSION
Create the unified Design Token framework and compile the stateless, prop-driven UI Component Library (`@griptix/ui`) documented fully inside Storybook.

## INPUTS
- Typography: Inter font-family.
- Color Tokens: Deep Black `#0A0A0A`, Charcoal `#1A1A1A`, Olympic Gold `#D4AF37`.
- Spacing Scale: Multiples of 4px.

## ALLOWED PATHS
- `/packages/ui/`

## FORBIDDEN PATHS
- `/apps/`
- `/packages/types/`
- `/infra/`

## EXECUTION SEQUENCE
1. **Design Token Creation**: Write `packages/ui/tokens.ts` exporting colors, typography, spacing, shadows (`shadow.glow` for gold glow), border-radii, and breakpoints.
2. **Global CSS**: Generate CSS variables on `:root` in `packages/ui/global.css`.
3. **Stateless Component Compilation**:
   - *Typography*: Heading, Body, Tabular-nums specs.
   - *Buttons*: Primary (Gold, glow, hover scaling), Secondary (outline), Text (sliding arrow). Covers 6 states (default, hover, focus, active, disabled, loading).
   - *Forms*: InputField (floating label, gold ring on focus), SelectDropdown, FileUploadZone (dashed boundary, progress bar), Checkbox/Radio (gold checked states).
   - *Cards*: ProductCard (image zoom, discipline badge), TestimonialCard, StepCard, StatCard.
   - *Navigation*: TopNav (transparent-to-solid on scroll, MegaMenu dropdown), MobileNav (slide-out drawer), Footer (4-column), Breadcrumbs.
   - *Overlays*: CartDrawer (slide-in from right), Modals, Lightbox, Toasts.
   - *Badges*: ComplianceBadge (ISSF gold shield), StatusBadge (manufacturing stages), MaterialBadge (walnut/carbon).
4. **Dark/Light Mode**: Write `ThemeProvider` reading system/local storage overrides, and `ThemeToggle` switch.
5. **Storybook configuration**: Document all components, variant states, and screen breakpoints.

## SUCCESS CRITERIA (EVALUATION GATES)
- `packages/ui` compiles successfully via `tsc --noEmit` and passes `eslint`.
- Storybook builds statically with zero compilation errors.
- Every component has a Storybook file covering dark/light modes.
- Zero hardcoded hex values exist outside `tokens.ts`.
