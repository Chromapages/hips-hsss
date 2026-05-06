# H.I.P.S. Design System

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Design System Reference
**Version:** 1.0
**Status:** Canonical — all UI work must conform to this document
**Date:** April 23, 2026
**Depends on:** `HIPS_PRD_v1.md` · `HIPS_Ultimate_Architecture_v2.md`

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Library](#5-component-library)
6. [UI States](#6-ui-states)
7. [Avatar & Virtual Office](#7-avatar--virtual-office)
8. [Session Layer UI](#8-session-layer-ui)
9. [Crisis Overlay](#9-crisis-overlay)
10. [Iconography](#10-iconography)
11. [Motion & Animation](#11-motion--animation)
12. [Accessibility](#12-accessibility)
13. [Dark Mode](#13-dark-mode)
14. [Implementation Rules](#14-implementation-rules)

---

## 1. Design Principles

These principles govern every UI decision. They are downstream of the platform's core architectural principles and must never be violated for aesthetics alone.

1. **Safety through calm** — the platform serves people in distress. No aggressive CTAs, no dark patterns, no urgency-inducing copy. Every surface should feel stable and unhurried.
2. **Anonymity is visible** — anonymity is the product's core promise. The UI must make the anonymous layer *feel* anonymous: no real names displayed in sessions, avatar-first identity, session token displayed as a friendly handle only.
3. **Clarity over cleverness** — plain language, generous whitespace, no jargon. A first-time user in crisis should understand every screen without reading a guide.
4. **Trust through consistency** — colors, type, spacing, and component shapes must be identical across public marketing, commerce flows, and session UI. Visual inconsistency signals untrustworthiness.
5. **Accessibility is non-negotiable** — WCAG AA is the floor, not a stretch goal. Every design decision must pass contrast, keyboard, and screen-reader requirements before shipping.
6. **Scholarship users see no difference** — no visual distinction between scholarship and paid sessions. No badges, banners, or copy that signals reduced-access status.

---

## 2. Color Tokens

All colors are defined as CSS custom properties in `packages/ui/src/tokens/colors.css` and as a Tailwind config extension in `tailwind.config.ts`. **No hardcoded hex values anywhere in component code.**

### Brand Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-primary` | `#2D5A8E` | Primary CTA buttons, active nav links, focus rings |
| `--color-brand-secondary` | `#4A8FA8` | Secondary buttons, hover states, accents |
| `--color-brand-accent` | `#7BC4C4` | Highlights, badges, progress indicators |
| `--color-brand-warm` | `#E8D5B7` | Background warmth, card fills on public pages |
| `--color-brand-deep` | `#1A3A5C` | Dark headings, footer background, deep trust tone |

### Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-neutral-50` | `#F9FAFB` | Page backgrounds |
| `--color-neutral-100` | `#F3F4F6` | Card backgrounds, table row alternates |
| `--color-neutral-200` | `#E5E7EB` | Borders, dividers, input strokes |
| `--color-neutral-400` | `#9CA3AF` | Placeholder text, disabled labels |
| `--color-neutral-600` | `#4B5563` | Body text secondary |
| `--color-neutral-900` | `#111827` | Primary body text, headings |

### Semantic Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#059669` | Booking confirmed, payment success, session complete |
| `--color-warning` | `#D97706` | Scholarship cap alert, package expiry warning |
| `--color-error` | `#DC2626` | Form errors, failed payments, connection drops |
| `--color-crisis` | `#7F1D1D` | Crisis overlay background only — never used decoratively |
| `--color-info` | `#2563EB` | Informational banners, tooltips |

### Session Layer Palette (Three.js / Virtual Office)

The session layer uses a separate set of tokens applied via Three.js material configs and CSS vars scoped to `[data-layer="session"]`.

| Token | Value | Usage |
|---|---|---|
| `--session-bg` | `#0D1B2A` | Virtual office background / sky |
| `--session-floor` | `#1E2D3D` | Floor plane material |
| `--session-wall` | `#243447` | Wall planes |
| `--session-ambient` | `#4A7FA5` | Ambient light color |
| `--session-avatar-ring` | `#7BC4C4` | Active-speaker ring around avatar |
| `--session-muted-overlay` | `rgba(0,0,0,0.45)` | Avatar muted overlay tint |
| `--session-controls-bg` | `rgba(13,27,42,0.85)` | Voice controls bar backdrop |

### Tailwind Config Extension

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          accent:    'var(--color-brand-accent)',
          warm:      'var(--color-brand-warm)',
          deep:      'var(--color-brand-deep)',
        },
        semantic: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error:   'var(--color-error)',
          crisis:  'var(--color-crisis)',
          info:    'var(--color-info)',
        },
      },
    },
  },
}
```

---

## 3. Typography

Font stack defined in `packages/ui/src/tokens/typography.css`. All values use `rem` units; base is `16px`.

### Font Families

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `'Inter', system-ui, sans-serif` | All UI text |
| `--font-mono` | `'JetBrains Mono', monospace` | Code, session token handles, technical labels |

> **Why Inter:** Highly legible at small sizes, accessible stroke widths, excellent multilingual support for future i18n.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-xs` | `0.75rem / 12px` | `1rem` | 400 | Captions, legal micro-copy |
| `--text-sm` | `0.875rem / 14px` | `1.25rem` | 400 | Helper text, table cells |
| `--text-base` | `1rem / 16px` | `1.5rem` | 400 | Body copy, form labels |
| `--text-lg` | `1.125rem / 18px` | `1.75rem` | 500 | Card titles, section leads |
| `--text-xl` | `1.25rem / 20px` | `1.75rem` | 600 | Page sub-headings |
| `--text-2xl` | `1.5rem / 24px` | `2rem` | 700 | Section headings |
| `--text-3xl` | `1.875rem / 30px` | `2.25rem` | 700 | Page headings |
| `--text-4xl` | `2.25rem / 36px` | `2.5rem` | 800 | Hero headlines |

### Rules

- Maximum line length: `65ch` on body text
- Heading hierarchy must be semantic — never skip levels (e.g., h1 → h3)
- Disclaimer text (`--text-sm`) must never be rendered below `--color-neutral-400` on white — fails contrast
- Session layer uses `--font-mono` for anonymous handle display only

---

## 4. Spacing & Layout

Spacing uses an 8pt grid. All spacing tokens are multiples of `4px`.

### Spacing Scale

| Token | Value | Tailwind Class |
|---|---|---|
| `--space-1` | `4px` | `p-1`, `m-1` |
| `--space-2` | `8px` | `p-2`, `m-2` |
| `--space-3` | `12px` | `p-3`, `m-3` |
| `--space-4` | `16px` | `p-4`, `m-4` |
| `--space-6` | `24px` | `p-6`, `m-6` |
| `--space-8` | `32px` | `p-8`, `m-8` |
| `--space-12` | `48px` | `p-12`, `m-12` |
| `--space-16` | `64px` | `p-16`, `m-16` |

### Layout Grid

- **Max content width:** `1280px` (`max-w-screen-xl`)
- **Page gutter (mobile):** `16px`
- **Page gutter (tablet):** `32px`
- **Page gutter (desktop):** `64px`
- **Column grid:** 12-column, `24px` gap

### Breakpoints

| Name | Min Width | Usage |
|---|---|---|
| `sm` | `640px` | Mobile landscape |
| `md` | `768px` | Tablet |
| `lg` | `1024px` | Laptop (session minimum) |
| `xl` | `1280px` | Desktop |

> **Session UI note:** Session pages (`/session/[id]`, `/lobby/[groupId]`) render correctly only at `lg` (1024px) and above. Below this width, the mobile block page is shown instead.

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` | Badges, tags, table cells |
| `--radius-md` | `8px` | Inputs, buttons, cards |
| `--radius-lg` | `12px` | Modal dialogs, panels |
| `--radius-xl` | `16px` | Feature cards, hero sections |
| `--radius-full` | `9999px` | Avatars, pill badges |

---

## 5. Component Library

All components live in `packages/ui/src/components/`. Each component is a Server Component by default; opt into Client Component only when interactivity requires it. Every component **must** implement all five UI states (see Section 6).

### Button

| Variant | Use Case | Colors |
|---|---|---|
| `primary` | Main CTA — Book, Checkout, Submit | `brand-primary` bg, white text |
| `secondary` | Secondary action — Cancel, Back | `brand-secondary` outline, no fill |
| `ghost` | Tertiary / inline — Edit, View | Transparent, `brand-primary` text |
| `destructive` | Irreversible action — Cancel subscription | `semantic-error` bg, white text |
| `crisis` | Crisis protocol trigger only | `color-crisis` bg, white text, `ring-2` |

**Rules:**
- Minimum size: `44px` height, `44px` width (WCAG touch target)
- `disabled` state: `opacity-50`, `cursor-not-allowed`, no pointer events
- Loading state: spinner icon replaces label; button remains same width
- Never use `destructive` variant for non-destructive actions
- `crisis` variant is only ever rendered by the `<CrisisEscalation>` component

### Input / Textarea

- Default border: `--color-neutral-200`
- Focus border: `--color-brand-primary`, `ring-2 ring-brand-primary/30`
- Error border: `--color-error`, error message below in `--text-sm --color-error`
- Label always above input — never placeholder-as-label
- Required fields: asterisk `*` in `--color-error` after label text

### Card

- Background: `--color-neutral-100`
- Border: `1px solid --color-neutral-200`
- Padding: `--space-6`
- Border radius: `--radius-lg`
- Shadow: `shadow-sm` (Tailwind)
- Hover (interactive cards only): `shadow-md`, `border-brand-secondary`

### Badge

| Variant | Color | Use |
|---|---|---|
| `default` | neutral-200 bg | General labels |
| `success` | success/10 bg, success text | Confirmed, Complete |
| `warning` | warning/10 bg, warning text | Expiring, Pending |
| `error` | error/10 bg, error text | Failed, Cancelled |
| `info` | info/10 bg, info text | Informational |

**Rule:** Never use a badge to indicate scholarship status publicly — no "Scholarship" badge on session cards visible to facilitators or other participants.

### Modal / Dialog

- Backdrop: `rgba(0,0,0,0.5)`, `backdrop-blur-sm`
- Focus trap: required — keyboard focus must stay inside modal while open
- Close on backdrop click: **disabled** for confirmation modals; enabled for info modals
- Always includes a visible close button (`aria-label="Close"`)
- `Escape` key closes info modals; requires explicit confirm/cancel for destructive modals

### Toast Notifications

- Position: top-right, `z-50`
- Duration: 4 seconds (success/info); persistent until dismissed (error)
- Types: `success` | `error` | `warning` | `info`
- Must use `role="alert"` and `aria-live="assertive"` for errors; `aria-live="polite"` for others

### Form (React Hook Form + Zod)

- All forms use `React Hook Form` + `Zod` schema validation
- Errors render inline below each field, not in a top-level error box
- Submit button disables on submission; re-enables on error
- No form submits without disclaimer acknowledgement checkbox where required

### Availability Calendar

- Client Component
- Shows a month view with available slots highlighted in `brand-accent`
- Past dates: `neutral-200`, non-clickable
- Selected slot: `brand-primary` bg, white text
- Fully keyboard navigable (arrow keys for date navigation, Enter to select)

### Skeleton Loaders

- Shape must match the component being loaded (not generic bars)
- Animation: `animate-pulse` with `neutral-200` fill
- Never show skeletons for < 200ms (prevents flash)

---

## 6. UI States

**Every interactive component ships with all five states. No exceptions.**

| State | Visual Treatment | Copy Pattern |
|---|---|---|
| **Loading** | Skeleton matching component shape; `animate-pulse` | No text — skeleton only |
| **Empty** | Icon (48px, `neutral-400`) + heading + body + primary action CTA | "No [things] yet. [Action CTA]." |
| **Error** | `semantic-error` banner or inline error; retry button | "Something went wrong. [Retry]" — never expose raw errors or stack traces |
| **Success** | `semantic-success` confirmation + next step | "Done! [What happens next]." |
| **Disabled** | `opacity-50`, `cursor-not-allowed`, tooltip explaining why | N/A — disabled state speaks for itself |

### Empty State Copy Patterns

| Context | Heading | Body | CTA |
|---|---|---|---|
| No bookings | "No sessions yet" | "Book your first session to get started." | "Browse Services" |
| No packages | "No active packages" | "Purchase a package for discounted sessions." | "View Packages" |
| No downloads | "No downloads yet" | "Your purchased resources will appear here." | "Visit Resources" |
| Empty scholarship queue | "All caught up" | "No pending scholarship applications." | — |
| Empty safety queue | "Queue is clear" | "No active escalations." | — |

---

## 7. Avatar & Virtual Office

The avatar and virtual office are core to the platform's anonymity promise. Design rules here are security requirements, not just aesthetics.

### Avatar System

**Avatar selection:**
- 12 base avatar styles (diverse representations; no photorealistic human faces)
- Each avatar: a stylized abstract form with color customization (3 palette options per style)
- Avatar parameters **lock** on session start — no changes permitted mid-session
- Avatar selection is stored in session token only; never persisted to identity

**Avatar display rules:**
- Never display a real name under an avatar — anonymous handle only (e.g., `Participant #7`)
- Facilitator avatar is visually distinct (border ring `--session-avatar-ring`) but not labeled "Facilitator" by name
- Muted participants: `--session-muted-overlay` tint applied to avatar; mute icon shown
- Active speaker: pulsing ring animation (CSS, not Three.js animation — performance)

**Three.js avatar implementation:**
- Avatar mesh: `~2,000 polys` max per avatar (performance on mid-range laptops)
- Gesture presets: 5 states — `idle`, `nodding`, `raised-hand`, `thinking`, `applause`
- Gesture triggers: participant-initiated only via gesture button in voice controls bar
- No inverse kinematics, no lip-sync, no real-time facial tracking — ever

### Virtual Office Room

**Room design:**
- Warm, neutral interior — wood tones, soft lighting, bookshelves (non-distracting)
- No windows (no outdoor environment — avoids geographic inference)
- Seating capacity rendered: 1:1 and group sessions have different room layouts
- Camera angle: fixed, isometric-style, slight top-down — no first-person perspective

**Three.js scene rules:**
- Target: 60fps on a 2020 mid-range laptop (MacBook Air M1 baseline)
- Max draw calls: 50 per frame
- Shadow maps: disabled on lower-performance devices (detected via `navigator.hardwareConcurrency < 4`)
- Assets loaded via `React.lazy` + `Suspense`; skeleton shown during load
- Room assets: stored in Supabase, loaded once and cached in `sessionStorage`

**Fallback:**
- If WebGL is unavailable: static illustration of the room + audio-only label
- If Three.js fails to init: graceful degradation to plain audio with avatar icon grid

---

## 8. Session Layer UI

Session UI lives at `/session/[id]` and `/lobby/[groupId]`. It is only accessible via a valid anonymous session token and is only rendered on `lg` breakpoint and above.

### Layout

```
┌─────────────────────────────────────────────────┐
│  Session Header (anonymous handle + timer)      │
├──────────────────────────┬──────────────────────┤
│                          │                      │
│   Virtual Office         │  Facilitator Notes   │
│   (Three.js/WebGL)       │  Panel (read-only    │
│                          │  participant view)   │
│                          │                      │
├──────────────────────────┴──────────────────────┤
│  Voice Controls Bar (fixed bottom)              │
│  [Mute] [Gesture ▾] [Report 🚩] [End Session]  │
└─────────────────────────────────────────────────┘
```

### Voice Controls Bar

- Fixed to bottom of session viewport
- Background: `--session-controls-bg` (semi-transparent dark)
- Buttons: minimum `44px` × `44px`
- **Mute/Unmute:** toggles; active state = filled microphone icon + `brand-accent` ring
- **Gesture:** dropdown of 5 gesture presets
- **Report 🚩:** opens a lightweight confirmation — "Flag this session for review?" Yes / Cancel — triggers `POST /session/v1/:id/flag`
- **End Session:** requires confirmation modal — "Are you sure you want to end this session?" — destructive button variant

### Session Header

- Left: anonymous handle (monospace font, `--font-mono`)
- Center: session duration timer (counts up from 00:00)
- Right: connection quality indicator (3 bars, colored green/yellow/red)
- No branding logo in session header — keeps the space focused

### Group Lobby

- Anonymous participant list: handles only, no avatars until session starts
- "Waiting for moderator to start" state with pulsing indicator
- Moderator sees a "Start Session" primary button
- Participant count shown: "3 of 6 participants joined"

---

## 9. Crisis Overlay

The crisis overlay is a full-screen interrupt component rendered by `<CrisisEscalation>`. It overrides all other UI. It is a **safety-critical** component and has strict implementation rules.

### Visual Spec

- **Background:** `--color-crisis` (`#7F1D1D`) — dark red, never used anywhere else on the platform
- **Text:** white, `--text-xl` minimum for all resource information
- **Layout:** centered, single-column, max-width `640px`

### Required Elements (in order)

1. **Heading:** "You're not alone. Help is available right now."
2. **Primary resource block:**
   - 988 Suicide & Crisis Lifeline — "Call or text **988**"
   - Crisis Text Line — "Text HOME to **741741**"
3. **Local resource block** (populated from `region` + `country` via crisis protocol)
4. **"Stay in session" button** — keeps session alive; dismisses overlay temporarily
5. **"End session safely" button** — ends session; maintains resource display

### Accessibility Requirements (non-negotiable)

- `role="alertdialog"` on the overlay container
- `aria-labelledby` pointing to the heading
- `aria-describedby` pointing to the resource list
- **Focus trap:** keyboard focus must not leave the overlay
- **Focus on open:** first focusable element is the heading or first resource link
- `Escape` key: does NOT close the overlay — crisis state must be explicitly resolved
- All phone numbers and text numbers are `<a href="tel:988">` and `<a href="sms:741741">` links for mobile (even though sessions are desktop-only, the resource may be shared)
- Screen reader must announce: "Crisis resources. Help is available." on mount

---

## 10. Iconography

- Icon library: **Lucide React** (`lucide-react`) — consistent stroke weight, MIT license
- Size system: `16px` (inline), `20px` (button icon), `24px` (standalone), `48px` (empty states)
- Stroke width: `1.5` default; `2` for emphasis
- Color: inherits from text color via `currentColor` — never hardcoded
- Icons used decoratively must have `aria-hidden="true"`
- Icons with meaning must have `aria-label` or adjacent visible label

### Reserved Icons

| Icon | Lucide Name | Usage |
|---|---|---|
| 🚩 Flag | `Flag` | Report / safety flag — session only |
| 🔒 Vault | `Lock` | Identity vault references in admin |
| 📅 Calendar | `Calendar` | Booking / scheduling |
| 💳 Payment | `CreditCard` | Checkout / billing |
| 🎓 Scholarship | `GraduationCap` | Scholarship flows |
| ⚠️ Warning | `AlertTriangle` | Warnings, SLA alerts |
| 🆘 Crisis | `AlertOctagon` | Crisis escalation queue (admin only) |
| 🎙 Microphone | `Mic` / `MicOff` | Voice mute toggle |

---

## 11. Motion & Animation

The platform serves people in distress. Motion must be purposeful and calming — never distracting or flashy.

### Rules

- All animations use `prefers-reduced-motion` media query — disable or reduce if set
- Duration scale: `150ms` (micro), `250ms` (standard), `400ms` (emphasis)
- Easing: `ease-out` for entrances; `ease-in` for exits; `ease-in-out` for loops
- No parallax, no scroll-triggered animations, no auto-playing video backgrounds
- Skeleton pulse: `2s` cycle, `ease-in-out` — the only looping animation on non-session surfaces

### Permitted Animations

| Component | Animation | Duration |
|---|---|---|
| Modal open | `opacity 0→1` + `translateY 8px→0` | `250ms ease-out` |
| Toast enter | `translateX 100%→0` | `250ms ease-out` |
| Button hover | `background-color transition` | `150ms ease-out` |
| Avatar speaker ring | `scale pulse 1→1.05→1` | `800ms ease-in-out, infinite` |
| Skeleton | `opacity 0.5→1→0.5` | `2s ease-in-out, infinite` |
| Crisis overlay open | `opacity 0→1` | `400ms ease-out` — deliberate, not jarring |

---

## 12. Accessibility

WCAG AA is the minimum. All components are tested with axe-core (automated) and manual keyboard + screen reader testing before shipping.

### Color Contrast

| Pairing | Ratio | Pass? |
|---|---|---|
| `neutral-900` on `neutral-50` | 16.9:1 | ✅ AAA |
| `brand-primary` on white | 5.1:1 | ✅ AA |
| `neutral-600` on white | 7.2:1 | ✅ AAA |
| `neutral-400` on white | 3.0:1 | ⚠️ AA Large only — never use for body text |
| white on `color-crisis` | 8.4:1 | ✅ AAA |
| `brand-accent` on `session-bg` | 5.7:1 | ✅ AA |

### Keyboard Navigation

- All interactive elements reachable via `Tab`
- Focus ring: `ring-2 ring-brand-primary ring-offset-2` — always visible
- Skip-to-content link: present on every page, visible on focus
- Modals and overlays: focus trap active while open
- Custom components (avatar selector, calendar): full arrow-key navigation

### Screen Reader Requirements

- All images: `alt` text required; decorative images: `alt=""`
- Form inputs: always associated with `<label>` via `htmlFor` / `id`
- Live regions: `aria-live="polite"` for status updates; `aria-live="assertive"` for errors
- Session controls bar: each button has descriptive `aria-label`
- Crisis overlay: `role="alertdialog"` with focus management (see Section 9)

### Focus Management

- On modal open: focus moves to first focusable element
- On modal close: focus returns to triggering element
- On page navigation: focus moves to `<h1>` of new page
- On error: focus moves to first error message

---

## 13. Dark Mode

**Dark mode stance for v1:** Not implemented. The platform ships in light mode only.

**Rationale:** The session virtual office already uses a dark environment (`--session-bg`). Implementing a full dark mode system across all surfaces in v1 would add significant scope without a validated user need. The session layer dark palette is isolated via `[data-layer="session"]` data attribute.

**v2 plan:** Dark mode tokens added to `colors.css` as a second CSS custom property block under `@media (prefers-color-scheme: dark)`. The token names remain identical — only the values change. No component code changes required.

```css
/* Planned v2 dark mode structure */
@media (prefers-color-scheme: dark) {
  :root {
    --color-neutral-50:  #111827;
    --color-neutral-100: #1F2937;
    /* ... all tokens redefined ... */
  }
}
```

---

## 14. Implementation Rules

These rules are enforced at code review. PRs that violate them must be corrected before merge.

**Token rules:**
- No hardcoded hex, rgb, or hsl values in any component file
- No hardcoded px values for spacing — use spacing tokens or Tailwind classes
- No inline `style={{ color: '...' }}` — use Tailwind classes only

**Component rules:**
- Every new component must include a `ComponentName.stories.tsx` Storybook story with all five UI states demonstrated
- Server Components by default; `'use client'` only when browser APIs or interactivity require it
- No `any` type in component props — all props typed with TypeScript interfaces
- No hardcoded UI copy strings in component files — use constants from `packages/types/src/copy-policy.ts`

**Session layer rules:**
- Session layer components must be wrapped in `[data-layer="session"]` for CSS scoping
- No commerce Prisma client imported in session components
- Three.js scene initialization must be wrapped in `try/catch` with graceful fallback

**Testing requirements before merge:**
- axe-core automated scan passes (zero violations)
- All five UI states rendered and visually verified
- Keyboard navigation manually tested
- Crisis overlay: focus trap manually verified

---

*Document maintained by: Tech Lead + Design Lead*
*Review cycle: Before every phase milestone; on any token or component addition*
*Change process: PR to `docs/DESIGN_SYSTEM.md` · requires Tech Lead + Design Lead review*
