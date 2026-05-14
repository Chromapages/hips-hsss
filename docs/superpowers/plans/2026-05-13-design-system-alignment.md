# Design System Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all design system inconsistencies across the H.I.P.S. codebase — unify token sources, fix Tailwind configuration, align component styles, and update all pages to use consistent design tokens.

**Architecture:** Single-source-of-truth token system via `packages/ui/src/tokens/colors.css`, consumed by both CSS variables and Tailwind config. All pages use standard Tailwind utilities (brand/*, semantic/*, neutral/*) instead of arbitrary CSS variables or hardcoded color names. Session pages adopt brand dark tokens instead of slate/* raw values.

**Tech Stack:** Tailwind CSS 3.4, Next.js App Router, `@hips/ui` component library, CSS custom properties.

---

## File Map

### Files to CREATE
- `docs/superpowers/plans/YYYY-MM-DD-design-system-alignment.md` (this plan)

### Files to MODIFY (Tier 1 — Foundation)
- `apps/web/tailwind.config.ts` — Add neutral colors, fix semantic-crisis, add animate-slide-in, complete Apple mapping
- `apps/web/src/app/globals.css` — Remove duplicate token definitions, import only from @hips/ui
- `packages/ui/src/tokens/colors.css` — Ensure all tokens (brand, semantic, session, neutral, apple) are defined here

### Files to MODIFY (Tier 2 — Components)
- `packages/ui/src/components/index.tsx` — Fix Button radius inconsistency, add missing semantic colors

### Files to MODIFY (Tier 3 — Pages)
- `apps/web/src/app/(public)/page.tsx` — Migrate from `--apple-*` CSS vars to Tailwind tokens
- `apps/web/src/app/(app)/dashboard/page.tsx` — Add Metadata export
- `apps/web/src/app/(app)/dashboard/sessions/page.tsx` — Use EmptyState, SkeletonTableRow
- `apps/web/src/app/(app)/dashboard/packages/page.tsx` — Use EmptyState, SkeletonTableRow
- `apps/web/src/app/(app)/dashboard/downloads/page.tsx` — Use EmptyState, SkeletonTableRow
- `apps/web/src/app/(public)/services/page.tsx` — Standardize Card API usage
- `apps/web/src/app/(public)/organizations/page.tsx` — Standardize Card API usage
- `apps/web/src/app/(public)/donate/page.tsx` — Standardize Card API usage
- `apps/web/src/app/(admin)/bookings/page.tsx` — Remove unnecessary role="table", standardize Card usage
- `apps/web/src/app/(admin)/scholarships/page.tsx` — Standardize Card API usage
- `apps/web/src/app/(admin)/safety/page.tsx` — Remove unnecessary role="table"
- `apps/web/src/app/(admin)/facilitators/page.tsx` — Remove unnecessary role="table"
- `apps/web/src/app/(admin)/revenue/page.tsx` — Standardize Card API usage
- `apps/web/src/app/(admin)/dashboard/organizations/page.tsx` — Remove unnecessary role="table"
- `apps/web/src/app/(session)/session/[id]/page.tsx` — Replace bg-slate-* with brand dark tokens
- `apps/web/src/app/(session)/lobby/[groupId]/page.tsx` — Replace bg-slate-* with brand dark tokens

### Files to MODIFY (Tier 4 — Shared Components)
- `apps/web/src/components/navbar.tsx` — Audit for token consistency
- `apps/web/src/components/auth/sign-in-form.tsx` — Audit for token consistency
- `apps/web/src/components/auth/sign-up-form.tsx` — Audit for token consistency
- `apps/web/src/components/toast-provider.tsx` — Ensure Toast uses animate-slide-in
- `apps/web/src/components/session/AvatarSelector.tsx` — Move hardcoded AVATAR_COLORS to design tokens

---

## Task 1: Fix Tailwind Configuration

**Files:**
- Modify: `apps/web/tailwind.config.ts`

- [ ] **Step 1: Read current tailwind.config.ts**

Read `apps/web/tailwind.config.ts` in full.

- [ ] **Step 2: Add neutral color group to theme.extend.colors**

Add a `neutral` color group that maps to the neutral CSS variables defined in `:root`:

```ts
neutral: {
  50:  '#fafafa',
  100: '#f5f5f5',
  200: '#e5e7eb',   // --color-border
  300: '#d1d5db',
  400: '#9ca3af',   // --color-text-muted
  500: '#6b7280',   // --color-text-secondary
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',   // --color-text-primary
  950: '#030712',
},
```

- [ ] **Step 3: Fix semantic-crisis color**

Change `semantic.crisis: "var(--color-crisis)"` in the Tailwind colors section. Currently `color-crisis` IS in the CSS variables (defined as `#7F1D1D`), so `semantic.crisis` should reference `var(--color-crisis)`. Verify it does; if not, add it.

- [ ] **Step 4: Add animate-slide-in keyframes and animation**

Add to `theme.extend`:

```ts
keyframes: {
  'slide-in': {
    '0%': { transform: 'translateX(100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
},
animation: {
  'slide-in': 'slide-in 0.3s ease-out',
},
```

- [ ] **Step 5: Complete Apple color group mapping**

Ensure all Apple CSS variables from `globals.css` are mapped in the `apple` color group. Currently missing: `--apple-divider-soft`, `--apple-hairline`, `--apple-surface-pearl`, `--apple-surface-tile-3`, `--apple-on-primary`, `--apple-on-dark`. Add any missing mappings that reference existing CSS variables.

- [ ] **Step 6: Save and verify**

Run `pnpm typecheck` to verify no type errors.

---

## Task 2: Unify Design Tokens

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `packages/ui/src/tokens/colors.css`

- [ ] **Step 1: Read both token files**

Read `packages/ui/src/tokens/colors.css` and `apps/web/src/app/globals.css` in full.

- [ ] **Step 2: Identify all unique tokens in both files**

Compare the two files token-by-token. The goal is to ensure `colors.css` is the canonical source and `globals.css` only imports it.

- [ ] **Step 3: Update colors.css to be the single source of truth**

Ensure `colors.css` contains ALL tokens (brand, semantic, neutral, session, apple) with their full definitions. It should be a standalone CSS file with `:root` block containing every token.

- [ ] **Step 4: Rewrite globals.css to only import colors.css**

`globals.css` should:
1. `@import` the `@hips/ui` token file
2. Keep the `@tailwind base/components/utilities` directives
3. Keep any non-token CSS (custom properties, resets, etc.)
4. Remove any duplicate `:root` token definitions that also exist in colors.css

```css
/* Import H.I.P.S. tokens — single source of truth */
@import "../../../../packages/ui/src/tokens/colors.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/* H.I.P.S. additional globals — only non-token overrides here */
```

- [ ] **Step 5: Verify the import path is correct**

The import path `../../../../packages/ui/src/tokens/colors.css` from `apps/web/src/app/globals.css` resolves to `packages/ui/src/tokens/colors.css`. Verify this file exists at that path.

---

## Task 3: Fix Button Component Inconsistencies

**Files:**
- Modify: `packages/ui/src/components/index.tsx:18-59`

- [ ] **Step 1: Read the Button component**

Read the Button component in `packages/ui/src/components/index.tsx`.

- [ ] **Step 2: Fix destructive and crisis variants to use rounded-full**

Currently `destructive` uses `rounded-lg` and `crisis` uses `rounded-lg`. Change both to `rounded-full` to match `primary`, `secondary`, and `ghost`:

```ts
const variants = {
  primary: 'rounded-full bg-brand-primary text-white hover:bg-brand-primary/90',
  secondary: 'rounded-full border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10',
  ghost: 'rounded-full text-brand-primary hover:bg-brand-primary/5',
  destructive: 'rounded-full bg-semantic-error text-white hover:bg-semantic-error/90',
  crisis: 'rounded-full bg-semantic-crisis text-white ring-2 ring-semantic-crisis/50',
}
```

- [ ] **Step 3: Verify semantic-crisis is in Tailwind config**

In `apps/web/tailwind.config.ts`, ensure `semantic` includes `crisis: "var(--color-crisis)"`. If it's missing, add it.

- [ ] **Step 4: Verify no other Button inconsistencies remain**

Check that `focus:ring-brand-primary/30` uses a color that exists in Tailwind (it does — brand-primary). Check hover/focus states are consistent across all variants.

---

## Task 4: Home Page Token Migration

**Files:**
- Modify: `apps/web/src/app/(public)/page.tsx`

- [ ] **Step 1: Read current home page**

Read `apps/web/src/app/(public)/page.tsx` in full.

- [ ] **Step 2: Map `--apple-*` CSS vars to Tailwind equivalents**

| CSS Variable | Tailwind Equivalent |
|---|---|
| `var(--apple-canvas-parchment)` | `bg-[#f5f5f7]` or add to Tailwind as `apple-parchment` |
| `var(--apple-canvas)` | `bg-white` |
| `var(--apple-ink)` | `text-neutral-900` |
| `var(--apple-body-muted)` | `text-neutral-400` |
| `var(--apple-ink-muted-48)` | `text-neutral-500` |
| `var(--apple-primary)` | `text-brand-primary` / `bg-brand-primary` |
| `var(--apple-primary-on-dark)` | `text-[#2997ff]` (light-on-dark accent — add to Tailwind) |
| `var(--apple-surface-tile-1)` | `bg-neutral-900` (dark tile) |
| `var(--apple-surface-black)` | `bg-black` |
| `var(--apple-hairline)` | `border-neutral-200` |
| `var(--apple-body-on-dark)` | `text-white` |

- [ ] **Step 3: Add missing Apple tokens to Tailwind config if needed**

If `apple-primary-on-dark` (#2997ff) is not in Tailwind, add it to the `apple` color group in `tailwind.config.ts`:
```ts
'primary-on-dark': '#2997ff',
```

- [ ] **Step 4: Replace inline Apple CSS variables with Tailwind classes**

Replace all occurrences of `style={{ backgroundColor: 'var(--apple-...)' }}` and `style={{ color: 'var(--apple-...)' }}` with Tailwind utility classes. For example:
- `style={{ backgroundColor: 'var(--apple-canvas-parchment)' }}` → `className="bg-[#f5f5f7]"` (or use a custom token)
- `style={{ color: 'var(--apple-ink)' }}` → `className="text-neutral-900"`

For the dark tiles (sections 2 and 4), use `bg-neutral-900` and `bg-black` respectively.

- [ ] **Step 5: Replace hardcoded pixel font sizes with Tailwind**

Replace inline `text-[56px]`, `text-[40px]`, etc. with Tailwind classes like `text-5xl` (32px), `text-4xl` (24px), `text-2xl` (16px). Map:
- 56px → `text-5xl` (32px... no wait - 56px is ~3.5rem, use arbitrary value `text-[56px]` or add to Tailwind)
Actually, use arbitrary Tailwind values like `text-[56px]` for non-standard sizes, or map to existing Tailwind text sizes. The Apple scale (56px, 40px, 34px, 28px, 21px) can be used as arbitrary values `text-[56px]`, `text-[40px]`, etc. since they're not standard Tailwind sizes.

- [ ] **Step 6: Save and verify page renders correctly**

---

## Task 5: Standardize (app) Dashboard Pages

**Files:**
- Modify: `apps/web/src/app/(app)/dashboard/page.tsx`
- Modify: `apps/web/src/app/(app)/dashboard/sessions/page.tsx`
- Modify: `apps/web/src/app/(app)/dashboard/packages/page.tsx`
- Modify: `apps/web/src/app/(app)/dashboard/downloads/page.tsx`

- [ ] **Step 1: Add Metadata export to dashboard/page.tsx**

Read `apps/web/src/app/(app)/dashboard/page.tsx`. Add a `Metadata` export:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}
```

- [ ] **Step 2: Replace local SkeletonLoader with @hips/ui components in dashboard/page.tsx**

Replace the local `SkeletonLoader` with `SkeletonText` and `SkeletonTableRow` from `@hips/ui`. Import them:

```tsx
import { SkeletonText, SkeletonTableRow } from '@hips/ui'
```

- [ ] **Step 3: Import EmptyState in dashboard/sessions/page.tsx**

Read `apps/web/src/app/(app)/dashboard/sessions/page.tsx`. Add:

```tsx
import { EmptyState } from '@hips/ui'
```

Replace inline empty state JSX with the `EmptyState` component where applicable.

- [ ] **Step 4: Import EmptyState in dashboard/packages/page.tsx**

Read `apps/web/src/app/(app)/dashboard/packages/page.tsx`. Add `EmptyState` import and replace inline empty state.

- [ ] **Step 5: Import EmptyState in dashboard/downloads/page.tsx**

Read `apps/web/src/app/(app)/dashboard/downloads/page.tsx`. Add `EmptyState` import and replace inline empty state.

- [ ] **Step 6: Add SkeletonTableRow to pages with tables**

For `dashboard/sessions/page.tsx`, `dashboard/packages/page.tsx`, and `dashboard/downloads/page.tsx` — if they render table-like loading states, replace inline skeleton rows with `SkeletonTableRow`.

---

## Task 6: Update (public) Info Pages

**Files:**
- Modify: `apps/web/src/app/(public)/services/page.tsx`
- Modify: `apps/web/src/app/(public)/organizations/page.tsx`
- Modify: `apps/web/src/app/(public)/donate/page.tsx`

- [ ] **Step 1: Standardize Card API usage in services/page.tsx**

Read `apps/web/src/app/(public)/services/page.tsx`. Standardize on compound child API (`Card.Content`, `CardHeader`, `CardTitle`) throughout. Replace any direct `<Card><CardContent>` patterns with `<Card><Card.Content>`.

Import pattern:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@hips/ui'
```

- [ ] **Step 2: Standardize Card API usage in organizations/page.tsx**

Read `apps/web/src/app/(public)/organizations/page.tsx`. Apply same standardization as step 1.

- [ ] **Step 3: Standardize Card API usage in donate/page.tsx**

Read `apps/web/src/app/(public)/donate/page.tsx`. Apply same standardization as step 1.

---

## Task 7: Update (admin) Pages

**Files:**
- Modify: `apps/web/src/app/(admin)/bookings/page.tsx`
- Modify: `apps/web/src/app/(admin)/scholarships/page.tsx`
- Modify: `apps/web/src/app/(admin)/safety/page.tsx`
- Modify: `apps/web/src/app/(admin)/facilitators/page.tsx`
- Modify: `apps/web/src/app/(admin)/revenue/page.tsx`
- Modify: `apps/web/src/app/(admin)/dashboard/organizations/page.tsx`

- [ ] **Step 1: Remove unnecessary role="table" from admin pages**

Read each admin page. Semantic `<table>` elements have an implicit ARIA role of "table" — the explicit `role="table"` is redundant. Remove `role="table"` from all `<table>` elements across these files.

- [ ] **Step 2: Standardize Card API in admin pages**

Apply same Card API standardization (compound child pattern) across all admin pages that use Card.

- [ ] **Step 3: Verify semantic color usage**

Confirm all admin pages use `text-semantic-success`, `text-semantic-warning`, `text-semantic-error` (not hardcoded hex values) for status indicators.

---

## Task 8: Update (session) Pages

**Files:**
- Modify: `apps/web/src/app/(session)/session/[id]/page.tsx`
- Modify: `apps/web/src/app/(session)/lobby/[groupId]/page.tsx`

- [ ] **Step 1: Replace bg-slate-* with brand dark tokens**

Read both session pages. Replace hardcoded `bg-slate-*`, `text-slate-*` values with brand dark tokens:
- `bg-slate-900` → `bg-[#0D1B2A]` (use `--session-bg` CSS variable or `bg-brand-deep`)
- `bg-slate-800` → `bg-brand-deep/80` or similar
- `text-slate-300` → `text-neutral-300`
- `text-slate-400` → `text-neutral-400`
- `text-slate-500` → `text-neutral-500`

Create a CSS variable mapping note: the session layer has `--session-bg: #0D1B2A` defined in `globals.css`. Use `bg-[var(--session-bg)]` for the session background.

- [ ] **Step 2: Use brand tokens for avatar ring color**

Replace any hardcoded ring colors with `ring-[var(--session-avatar-ring)]` or `ring-brand-accent`.

- [ ] **Step 3: Save and verify dark theme consistency**

---

## Task 9: Update Shared Components

**Files:**
- Modify: `apps/web/src/components/navbar.tsx`
- Modify: `apps/web/src/components/auth/sign-in-form.tsx`
- Modify: `apps/web/src/components/auth/sign-up-form.tsx`
- Modify: `apps/web/src/components/toast-provider.tsx`
- Modify: `apps/web/src/components/session/AvatarSelector.tsx`

- [ ] **Step 1: Audit navbar.tsx for token consistency**

Read `apps/web/src/components/navbar.tsx`. Verify all colors use design tokens (brand-*, neutral-*, semantic-*). Check for any hardcoded hex values that should use tokens.

- [ ] **Step 2: Audit sign-in-form.tsx**

Read `apps/web/src/components/auth/sign-in-form.tsx`. Verify error states use `bg-semantic-error/10`, `text-semantic-error`, `border-semantic-error/20` consistently. Ensure no hardcoded red/green values.

- [ ] **Step 3: Audit sign-up-form.tsx**

Read `apps/web/src/components/auth/sign-up-form.tsx`. Same audit as step 2.

- [ ] **Step 4: Verify toast-provider uses animate-slide-in**

Read `apps/web/src/components/toast-provider.tsx`. Confirm the Toast component renders with `animate-slide-in` class. If animate-slide-in is used but not defined, flag it for Task 1 resolution.

- [ ] **Step 5: Move AVATAR_COLORS to design tokens**

Read `apps/web/src/components/session/AvatarSelector.tsx`. The `AVATAR_COLORS` array is hardcoded. Move these to a shared location — either in `packages/ui/src/tokens/colors.css` as a CSS variable array, or export it from `packages/ui/src/utils.ts` so both `AvatarSelector.tsx` and `VirtualOffice.tsx` can import from the same source.

---

## Task 10: Final Audit

**Files:**
- Read: All modified files from Tasks 1-9

- [ ] **Step 1: Run typecheck and lint**

```bash
pnpm typecheck
pnpm lint
```

Fix any errors before proceeding.

- [ ] **Step 2: Verify Tailwind compilation**

Run a build to ensure no Tailwind class resolution errors:
```bash
pnpm --filter @hips/web build 2>&1 | head -50
```

- [ ] **Step 3: Check for remaining hardcoded colors**

Grep the codebase for hardcoded hex colors that shouldn't be there:
```bash
grep -r "#[0-9A-Fa-f]\{6\}" apps/web/src --include="*.tsx" | grep -v "session" | grep -v "avatar"
```

Review matches — any hardcoded colors in UI components should use design tokens.

- [ ] **Step 4: Verify animate-slide-in works**

Check that Toast notifications animate in correctly — the `animate-slide-in` class should be defined in Tailwind config (Task 1, Step 4).

- [ ] **Step 5: Verify all pages render without CSS variable fallback warnings**

Run the dev server and check browser console for any CSS variable "undefined" warnings:
```bash
pnpm --filter @hips/web dev &
sleep 10
echo "Check browser console for CSS variable warnings"
```

---

## Commit Strategy

After each task (1-10), commit with a descriptive message:

```
git add [modified files]
git commit -m "fix(ui): [task description]"
```

Final commit after Task 10:
```
git add -A
git commit -m "fix(ui): complete design system alignment — unified tokens, fixed Tailwind, aligned all pages"
```

---

## Dependencies

- Task 1 (Tailwind config) must complete before Tasks 4, 5, 6, 7, 8 (all page updates)
- Task 2 (token unification) should complete alongside or after Task 1
- Task 3 (Button component) can run in parallel with Tasks 1 and 2
- Tasks 5-9 (page updates) can run in parallel once Tasks 1-3 are done
- Task 10 (final audit) must be last