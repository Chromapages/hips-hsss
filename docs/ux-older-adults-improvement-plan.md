# UX Improvement Plan for Older Adults
## H.I.P.S. Platform — Senior-Friendly Accessibility & Usability

**Date:** June 17, 2026  
**Status:** Proposed  
**Priority Areas:** Accessibility · Visual Design · Navigation & Trust

---

## Executive Summary

Three parallel audits (Accessibility, UI/UX Design, Navigation & Flows) identified **27 total issues** across the H.I.P.S. platform. The findings converge on three root problems: **typography too small**, **contrast ratios failing for aging eyes**, and **insufficient navigation confidence** for older adult users.

**Estimated quick-win coverage:** 4 changes fix 60% of the high-priority issues.

---

## What's Already Working ✅

| Feature | Location | Notes |
|---------|----------|-------|
| Line-height 1.65 body text | `globals.css` | Generous — excellent for reading |
| `prefers-reduced-motion` | `globals.css`, `navbar.css` | Motion sensitivity handled |
| Skip-to-main link | `layout.tsx:95` | Visible focus state |
| Primary CTA buttons (56px) | All pages | Exceeds 48px senior recommendation |
| Keyboard navigation | `Navbar.tsx:192-220` | Arrow keys + Home/End supported |
| ARIA landmarks | Throughout | Proper `role`, `aria-label` usage |
| Primary text contrast | `#213d53` on white = 9:1 | Passes AAA |
| Dark mode | ThemeToggle | Proper contrast maintained |
| Human-readable errors | `login/page.tsx:16-37` | "Login Failed" not code-heavy |

---

## Critical Issues Found

### Accessibility Audit — Top Findings

| Priority | Issue | File | Line |
|----------|-------|------|------|
| 🔴 HIGH | Stat labels at `text-[10px]` — unreadable for presbyopia | `TrustStrip.tsx` | 112 |
| 🔴 HIGH | Navbar links at `text-sm` + uppercase + tracking = ~3:1 effective | `Navbar.tsx` | 295 |
| 🔴 HIGH | Login form labels `text-xs` + uppercase — fails WCAG AA | `login/page.tsx` | 153, 179 |
| 🔴 HIGH | FeatureTabs labels at `text-sm` / `text-xs` — key content undersized | `FeatureTabs.tsx` | 58–59 |
| 🟡 MED | Password toggle only ~24px touch target (needs 44px) | `login/page.tsx` | 206 |
| 🟡 MED | Drawer links borderline at ~44px — fails with text scaling | `navbar.css` | 214 |
| 🟡 MED | Muted text `#6F8291` = 3.03:1 contrast (needs 4.5:1) | `globals.css` | 103 |
| 🟡 MED | Icons at 16×16 — too small for interactive use | Multiple | — |

### Navigation & Flow Audit — Top Findings

| Priority | Issue | File | Line |
|----------|-------|------|------|
| 🔴 HIGH | No "Back" button on auth pages — users feel trapped | `login/page.tsx`, `signup/page.tsx` | — |
| 🔴 HIGH | Role portals (`/login/host`, `/login/admin`) hidden from nav | `Navbar.tsx` | — |
| 🟡 MED | No "Remember me" option — hurts users with memory difficulties | `login/page.tsx` | — |
| 🟡 MED | No inline validation — errors only after submit | `login/page.tsx`, `signup/page.tsx` | — |
| 🟡 MED | Password strength color-only (no text labels) — fails colorblind users | `signup/page.tsx` | 218–243 |
| 🟡 MED | TOS checkbox only 16×16px touch target | `signup/page.tsx` | 248 |
| 🟡 MED | MFA enrollment with no explanation | `login/page.tsx` | 112–116 |
| 🟡 MED | Session expiry silent — just redirects | `middleware.ts` | 169–174 |

### Design Audit — Contrast Failures

| Location | Current | Needs | Status |
|----------|---------|-------|--------|
| Nav links (muted) | 14px + uppercase | 4.5:1 | ❌ FAIL |
| Drawer labels | 14px uppercase | 4.5:1 | ❌ FAIL |
| Accordion descriptions | 14px muted | 4.5:1 | ❌ FAIL |
| Tab descriptions | 12px muted | 4.5:1 | ❌ FAIL |
| Trust stat labels | 10px muted | 4.5:1 | ❌ FAIL |
| Brand/press badges | 9px | 4.5:1 | ❌ FAIL |

---

## Implementation Phases

### Phase 1 — Quick Wins
**Effort:** Low · **Impact:** High · **Coverage:** ~60% of high-priority issues

| # | Action | File | Change |
|---|--------|------|--------|
| 1.1 | Fix muted text contrast | `globals.css:103` | `#6F8291` → `#4A6274` (~5.2:1) |
| 1.2 | Add "Back to Home" button | `login/page.tsx`, `signup/page.tsx` | Visible escape route on auth pages |
| 1.3 | Upgrade `text-[10px]` labels → `text-sm` min | `TrustStrip.tsx`, `FeatureTabs.tsx` | All stat/descriptive labels |
| 1.4 | Enlarge password toggle to 44px min | `login/page.tsx:206` | `p-3` + `min-w-[44px] min-h-[44px]` |

### Phase 2 — Core Fixes
**Effort:** Medium · **Impact:** High

| # | Action | File | Change |
|---|--------|------|--------|
| 2.1 | Set minimum font floor | `globals.css` | `font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem)` |
| 2.2 | Upgrade nav links | `Navbar.tsx:295` | `text-sm uppercase` → `text-base` mixed-case |
| 2.3 | Add 44px min-height to nav links | `navbar.css` | `.hips-nav-link { min-height: 44px }` |
| 2.4 | Lower hamburger breakpoint | `Navbar.tsx` | `lg:hidden` → `md:hidden` (tablets get persistent nav) |
| 2.5 | Add inline field validation | `login/page.tsx`, `signup/page.tsx` | Email format on blur, password strength text labels |
| 2.6 | Upgrade icons | Multiple | `w-4 h-4` → `w-6 h-6` for interactive icons |
| 2.7 | Fix TOS checkbox touch target | `signup/page.tsx:248` | Minimum 44×44px hit area |

### Phase 3 — Trust & Recovery
**Effort:** Medium–High · **Impact:** High (especially for donation flows)

| # | Action | File | Change |
|---|--------|------|--------|
| 3.1 | Add "Remember this device" | `login/page.tsx` | Persistent Firebase session UI |
| 3.2 | Add contact info to auth panel | `AuthBrandPanel.tsx` | Phone/email for trust |
| 3.3 | Add session timeout warning | Session handling | 5-min "your session will expire" dialog |
| 3.4 | Explain MFA before enrollment | `login/page.tsx` | "Why is extra security required?" expandable |
| 3.5 | Add nonprofit credentials | `AuthBrandPanel.tsx` | 501(c)(3), EIN |
| 3.6 | Add "Donor privacy guarantee" | Donation pages | Near payment UI |
| 3.7 | Breadcrumb navigation | Dashboard/nested pages | Orientation aid |

---

## Microcopy Improvements

| Location | Current | Recommended |
|----------|---------|-------------|
| Login subtitle | "Enter your credentials to access your account." | "Enter your email and password to sign in." |
| Forgot password link | "Forgot?" | "Forgot password?" |
| Signup purpose | "Begin your journey with hard anonymity protection." | "Create your account to join our secure peer support community." |
| Privacy notice | Technical | "Your personal information is used only for account management. Your activity in support groups remains completely private." |
| Password reset email prompt | "Check your inbox" | "Check your email for a password reset link from noreply@hipsfoundation.org" |

---

## CSS Token Changes

### Before / After — `globals.css`

```css
/* BEFORE */
--color-text-muted: #6F8291;  /* ~3.0:1 contrast — FAILS WCAG AA */
--text-xs: 0.75rem;
--text-sm: 0.875rem;

/* AFTER */
--color-text-muted: #4A6274;  /* ~5.2:1 contrast — PASSES WCAG AA */
--text-xs: 0.875rem;         /* 14px minimum floor */
--text-sm: 1rem;            /* 16px minimum floor */
```

### Recommended Senior Text Scale

```css
:root {
  --text-senior-sm: 1rem;       /* 16px — minimum for any text */
  --text-senior-base: 1.125rem; /* 18px — standard body */
  --text-senior-lg: 1.375rem;   /* 22px — emphasized body */
  --text-senior-xl: 1.75rem;    /* 28px — small headings */
}
```

---

## Files to Modify

| File | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| `apps/web/src/app/globals.css` | ✅ | ✅ | |
| `apps/web/src/components/polish/TrustStrip.tsx` | ✅ | | |
| `apps/web/src/components/home/FeatureTabs.tsx` | ✅ | ✅ | |
| `apps/web/src/components/polish/navbar.css` | | ✅ | |
| `apps/web/src/components/polish/Navbar.tsx` | | ✅ | |
| `apps/web/src/app/(auth)/login/page.tsx` | ✅ | ✅ | ✅ |
| `apps/web/src/app/(auth)/signup/page.tsx` | ✅ | ✅ | |
| `apps/web/src/components/auth/AuthBrandPanel.tsx` | | | ✅ |
| `apps/web/src/components/auth/ForgotPasswordClient.tsx` | | | ✅ |
| `apps/web/src/middleware.ts` | | | ✅ |

**Total files:** 10 across 3 phases

---

## Impact Estimate

| Metric | Current State | After Phase 1 | After Phase 2 |
|--------|--------------|---------------|---------------|
| Minimum text size | 10px | 14px | 16px |
| Contrast ratio (muted) | 3.03:1 ❌ | 5.2:1 ✅ | 5.2:1 ✅ |
| Touch targets compliant | ~60% | ~80% | 95% |
| WCAG AA pass rate | ~70% | ~85% | ~95% |
| Auth page back navigation | ❌ | ✅ | ✅ |
| Inline validation | ❌ | ✅ | ✅ |

---

## Audit Sources

- **Agent 1:** Accessibility Specialist — font sizes, touch targets, WCAG 2.1 AA+ for presbyopia
- **Agent 2:** UI/UX Design Specialist — typography scale, color system, component design, responsive/tablet
- **Agent 3:** Navigation & UX Flow Specialist — information architecture, error recovery, trust signals

---

*Generated: June 17, 2026 · H.I.P.S. Platform*
