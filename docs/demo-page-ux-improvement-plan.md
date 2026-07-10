# `/demo` Page — UX & Accessibility Improvement Plan

**Synthesized from 3 specialist agents** (UX/Navigation, Accessibility, Visual Design)  
**Date:** June 17, 2026  
**Status:** Planned  
**Pages affected:** `/demo`, `/demo/vault-demo`, `/demo/live`, `/demo/crisis`

---

## Executive Summary

The `/demo` page currently serves as both a landing page and a navigation hub, trying to explain the H.I.P.S. privacy architecture AND guide visitors to 4 different demos simultaneously. This dual purpose creates competing visual weight, a confusing entry point, and several accessibility failures. Three specialist audits identified **15 issues** across 3 priority levels.

---

## Critical Issues Found

### 🔴 Priority 1 — Must Fix Before Ship

| # | Issue | Source | File |
|---|-------|--------|------|
| C1 | Journey stepper link touch targets are **~34px** — WCAG 2.5.5 requires **44px minimum** | Accessibility | `apps/web/src/app/demo/page.tsx` |
| C2 | `dark:bg-emerald-500/15` in `accentStyles` — **15% opacity on dark bg** is nearly invisible | Visual Design | `apps/web/src/app/demo/page.tsx:23-25` |
| C3 | VaultDemo `border-[${accent}]` template literal — Tailwind can't parse dynamic class names at build time; accent colors **never render** in production | Visual Design | `apps/web/src/components/demo/VaultDemo.tsx:76` |

### 🟡 Priority 2 — High Impact

| # | Issue | Source | File |
|---|-------|--------|------|
| H1 | **No primary CTA above the fold** — visitors land on 400+ lines of explanatory content with no clear action | UX/Nav | `apps/web/src/app/demo/page.tsx` |
| H2 | **"Try the demos" section header** is redundant with the journey stepper above it — two sections doing the same job | Visual Design | `apps/web/src/app/demo/page.tsx:223-230` |
| H3 | Demo cards **buried below explanatory content** on mobile — first-time visitors must scroll past 400+ lines before reaching navigation | UX/Nav | `apps/web/src/app/demo/page.tsx` |
| H4 | Session DB data values lack explicit `dark:text-amber-50` — may inherit wrong color in dark mode, making cards look identical | Visual Design | `apps/web/src/app/demo/page.tsx:121-130` |

### 🟠 Priority 3 — Important

| # | Issue | Source | File |
|---|-------|--------|------|
| M1 | VaultDemo phase pills use **color-only state** — fails WCAG 1.4.1 (color as sole means of conveying information) | Accessibility | `apps/web/src/components/demo/VaultDemo.tsx:32-36` |
| M2 | Demo card group has **no `aria-label`** — screen readers read cards in isolation with no group context | Accessibility | `apps/web/src/app/demo/page.tsx:232` |
| M3 | Anonymous support services card is **off-narrative** — belongs on a pricing page, not a demo hub | Visual Design | `apps/web/src/app/demo/page.tsx:162-179` |
| M4 | Board Guide + Crisis cards both use **amber accent** — visually indistinguishable at a glance | Visual Design | `apps/web/src/app/demo/page.tsx:47-63` |
| M5 | Live demo card description doesn't mention **mic requirement** — visitors click expecting a visual demo | Accessibility | `apps/web/src/app/demo/page.tsx:42` |
| M6 | Crisis "End session safely" button `bg-red-600` — contrast is **3.97:1** (fails WCAG AA 4.5:1) | Accessibility | `apps/web/src/app/demo/crisis/page.tsx` |

---

## Current Page Structure (9 Sections — Too Many)

```
LEFT COLUMN (1.05fr):
  1. Headline + intro paragraph
  2. Commerce DB vs Session DB split cards
  3. "What we never see or store" list
  4. Anonymous support services  ← OFF-NARRATIVE — remove
  5. [CTA area] — empty, no primary action

RIGHT COLUMN (0.95fr):
  6. Journey stepper (5 steps)
  7. "Try the demos" header  ← REDUNDANT with stepper above
  8. Demo cards × 4
  9. Crisis overlay trust callout
  10. Nonprofit/compliance trust signal
```

**Problems with current structure:**
- 10 visual sections competing for attention
- 4 distinct navigation elements in the right column alone
- No single primary CTA
- "The Problem" (step 1) is not a demo — misleading in a "demo journey"
- Mobile: left column stacks first — visitor reads 400+ lines before reaching demos

---

## Proposed Page Structure (5 Sections)

```
SECTION 1: HERO
  • Headline (reframe: "Your payment info is never in the same place as your session")
  • Primary CTA: "Start with Live Demo →" (large, centered, above fold on mobile too)

SECTION 2: PROOF
  • Commerce DB vs Session DB split cards (the strongest visual proof — keep)

SECTION 3: DEMOS  ← primary navigation, most prominent
  • 4 demo cards in recommended order: Live → Vault → Crisis → Board Guide
  • 2×2 grid on desktop, 1-column on mobile
  • Each card has: icon, badge, title, description, teaser of what you'll do, CTA
  • Live demo card: add "(requires microphone)" pre-warning
  • Board Guide: give its own gold accent (#C59A35), distinct from amber Crisis card

SECTION 4: PRIVACY GUARANTEE
  • "What we never see or store" — condensed to essentials
  • Reframe title: "Data we never collect or store" (less alarming framing)

SECTION 5: TRUST
  • 501(c)(3) nonprofit badge
  • "Privacy architecture reviewed by independent auditors"
  • Positioned as foundational, not an afterthought
```

**Remove entirely:**
- Journey stepper (replaced by demo card order as the implicit sequence)
- "Try the demos" redundant header
- Anonymous support services (off-page)

---

## Quick Wins — Implement Without Redesign

These fixes can ship immediately without restructuring the page.

### Fix 1: Stepper touch targets (WCAG 2.5.5)
```tsx
// BEFORE — line 204
className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-alt/40"

// AFTER
className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 hover:bg-surface-alt/40"
// py-2.5 = 10px × 2 = 40px + text ~14px = ~44px total ✓
```

### Fix 2: Dark mode icon backgrounds (Visual Design)
```tsx
// BEFORE — lines 23-25
emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300' },
indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-500/15',   text: 'text-indigo-700 dark:text-indigo-300'   },
amber:   { bg: 'bg-amber-100 dark:bg-amber-500/15',     text: 'text-amber-700 dark:text-amber-300'     },

// AFTER — minimum 25% opacity for visibility on dark backgrounds
emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/25', text: 'text-emerald-700 dark:text-emerald-300' },
indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-500/25',   text: 'text-indigo-700 dark:text-indigo-300'   },
amber:   { bg: 'bg-amber-100 dark:bg-amber-500/25',       text: 'text-amber-700 dark:text-amber-300'     },
```

### Fix 3: Session DB dark mode data values
```tsx
// BEFORE — line 122
<dd className="font-mono text-xs font-medium text-amber-950 dark:text-amber-50">anon_4KQ9</dd>

// AFTER — explicit dark mode text on dd elements
<dd className="font-mono text-xs font-medium text-amber-950 dark:text-amber-200">anon_4KQ9</dd>
```

### Fix 4: Demo card group aria-label
```tsx
// BEFORE — line 232
{demoCards.map((card) => (

// AFTER — wrap map in section with group label
<section aria-label="Demo options">
  {demoCards.map((card) => (
    ...
  ))}
</section>
```

### Fix 5: VaultDemo phase pill accessibility
```tsx
// BEFORE — line 32
<span className={`... ${active ? '...' : 'bg-surface text-text-muted'}`}>

// AFTER — add aria-label to convey state via text, not just color
<span
  aria-label={`Phase ${label}: ${active ? 'active' : 'inactive'}`}
  className={`...`}
>
```

### Fix 6: VaultDemo accent template literal bug
```tsx
// BEFORE — line 76 (VaultDemo.tsx DataCard)
${accent ? `border-[${accent}]/40 bg-[${accent}]/5` : '...'}

// AFTER — use inline style for dynamic border, Tailwind for static classes
style={accent ? { borderColor: `${accent}40`, backgroundColor: `${accent}0D` } : undefined}
className="rounded-xl border p-4 transition-all duration-300 border-white/10 bg-surface"
// Remove dynamic class approach entirely — use style prop
```

### Fix 7: Crisis button contrast
```tsx
// BEFORE — crisis/page.tsx
<button className="h-12 rounded-2xl bg-red-600 ...">

// AFTER — red-500 (#EF4444) achieves ~4.6:1 on white
<button type="button" className="h-12 rounded-2xl bg-red-500 ...">
```

### Fix 8: Live demo mic pre-warning (on /demo card)
```tsx
// BEFORE — line 42
description: 'Experience anonymous 3D avatars and real-time voice masking live in your browser — no download required.'

// AFTER
description: 'Experience anonymous 3D avatars and real-time voice masking in your browser. Requires microphone. No download.'
```

### Fix 9: Add skip-to-content link (all demo pages)
```tsx
// Add as first focusable element in <nav> or before <main>
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:font-bold">
  Skip to main content
</a>
```

---

## Structural Changes — Require More Work

### Change A: Primary Hero CTA
Add a large centered CTA above the fold, visible on both desktop and mobile:

```tsx
<div className="col-span-full text-center py-8">
  <a
    href="/demo/live"
    className="inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-[1.02] transition-all"
  >
    Start with the Live Demo
    <ArrowRight className="h-5 w-5" />
  </a>
  <p className="mt-3 text-sm text-text-secondary">
    No download required — voice masking and avatars run in your browser
  </p>
</div>
```

### Change B: Demo Card Reorder
```tsx
// BEFORE order: Vault, Live, Crisis, Board Guide
// AFTER order: Live (most engaging), Vault, Crisis, Board Guide

const demoCards = [
  { href: '/demo/live',      label: 'Live Experience',  badge: 'Interactive', ... },  // FIRST
  { href: '/demo/vault-demo', label: 'Identity Vault',  badge: 'Encryption', ... },
  { href: '/demo/crisis',     label: 'Crisis Safety',  badge: 'Safety',      ... },
  { href: '/board-demo',      label: 'Board Guide',    badge: 'Full Tour',   ... },
];
```

### Change C: Demo Cards → 2×2 Grid
```tsx
// Desktop: 2-column grid instead of single column
<div className="grid gap-4 md:grid-cols-2">
  {demoCards.map(card => (
    <Link href={card.href} className="group rounded-2xl border ...">
      {/* larger card layout with bigger icon, more whitespace */}
    </Link>
  ))}
</div>
```

### Change D: Board Guide → Distinct Accent
```tsx
// Give Board Guide the gold (#C59A35) brand accent — distinct from amber Crisis card
const boardGuideStyle = { bg: 'bg-[#C59A35]/10', text: 'text-[#C59A35]' };
```

### Change E: Remove Off-Narrative Content
Remove the anonymous support services card (lines 162-179) — it belongs on a pricing/services page, not a demo hub.

### Change F: vault-demo Dark Mode Consistency
The `/demo/vault-demo` page renders on a light `bg-bg-subtle` background while `/demo/live` and `/demo/crisis` use `#030712` dark backgrounds. The visual transition is jarring. Add a matching dark navbar to vault-demo.

---

## Accessibility Compliance Table

| WCAG Criterion | Current Status | Required | Fix |
|---------------|--------------|---------|-----|
| 1.1.1 Non-text Content | ⚠️ Emoji icons in crisis categories lack alt text | Icon or text alt | Add `aria-hidden` or text alternatives |
| 1.3.1 Info & Relationships | ⚠️ Demo cards lack group label | `aria-label` on group | Fix 4 above |
| 1.4.1 Use of Color | ⚠️ VaultDemo phase pills | State conveyed by text | Fix 5 above |
| 1.4.3 Contrast (Normal Text) | ❌ Crisis red-600 button = 3.97:1 | Minimum 4.5:1 | Fix 7 above |
| 1.4.4 Resize Text | ⚠️ `text-xs` (12px) used for body-adjacent text | Prefer 16px for older adults | Upgrade to `text-sm` |
| 2.4.1 Bypass Blocks | ❌ No skip link on demo pages | Skip-to-main link | Fix 9 above |
| 2.5.5 Target Size | ❌ Stepper links ~34px | 44px minimum | Fix 1 above |

---

## Sub-Page Navigation Consistency

| Page | Back to /demo | Forward to next demo | Notes |
|------|--------------|---------------------|-------|
| `/demo/vault-demo` | ✅ "← Overview" | ✅ "Try the Live Demo →" | Best nav UX |
| `/demo/live` | ✅ "← Overview" | ❌ No link to crisis | Add forward link |
| `/demo/crisis` | ✅ "← Overview" | ✅ "Full Board Guide →" | No link back to live |
| `/board-demo` | Not checked | — | — |

**Key gap:** Live and crisis demos don't link to each other. A visitor exploring must return to `/demo` to navigate between them.

---

## Files Requiring Changes

| File | Quick Wins | Structural Changes |
|------|-----------|------------------|
| `apps/web/src/app/demo/page.tsx` | Fix 1, 2, 3, 4, 8, 9 | Change A, B, C, D, E |
| `apps/web/src/app/demo/vault-demo/page.tsx` | Fix 9 | Change F |
| `apps/web/src/app/demo/live/page.tsx` | Fix 9 | — |
| `apps/web/src/app/demo/crisis/page.tsx` | Fix 7, 9 | — |
| `apps/web/src/components/demo/VaultDemo.tsx` | Fix 5, 6 | — |

**Total: 9 quick win fixes, 6 structural changes across 5 files**

---

## Audit Sources

- **Agent 1 — UX/Navigation:** 8 findings — primary CTA, layout hierarchy, stepper redesign, demo order, mobile, progress tracking, sub-page navigation gaps
- **Agent 2 — Accessibility:** 8 findings — WCAG 1.1.1 through 2.5.5, phase pill state, skip links, color contrast, aria labels, mic pre-warning
- **Agent 3 — Visual Design:** 9 findings — section consolidation, accentColors dark mode, VaultDemo template literal bug, vault-demo inconsistency, crisis framing, trust signal placement, board guide accent

---

*Generated: June 17, 2026 · H.I.P.S. Platform*
