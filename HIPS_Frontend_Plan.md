# H.I.P.S. — Frontend Implementation Plan (No Backend Required)

> **Skills Applied:** `ui-ux-pro-max`, `react-ui-patterns`, `nextjs-best-practices`, `concise-planning`, `tailwind-patterns`

This plan covers all remaining frontend surfaces that can be fully built using mocked data and placeholder API shapes, unblocked from any backend work.

---

## Design System

> [!IMPORTANT]
> These design tokens must be applied consistently across every new surface built in this plan.

### Style: Dark Mode (OLED) + Glassmorphism Hybrid
The platform's identity is built on two complementary styles:
- **Dark Base:** `#000000` OLED black backgrounds, `#0A0A0A` for elevated surfaces
- **Glass Layers:** `backdrop-blur-xl`, `bg-white/5` to `bg-white/10` borders for modal cards
- **Glow Accents:** `indigo-500` and `purple-600` with `shadow-[0_0_30px_rgba(99,102,241,0.25)]`

### Color Palette
| Role | Token | Hex |
|---|---|---|
| Background | `black` | `#000000` |
| Surface | `gray-950` | `#0A0A0A` |
| Elevated | `gray-900` | `#111111` |
| Border | `white/10` | `rgba(255,255,255,0.1)` |
| Primary | `indigo-500` | `#6366F1` |
| Secondary | `purple-600` | `#9333EA` |
| Success | `emerald-500` | `#10B981` |
| Warning | `amber-400` | `#FBBF24` |
| Danger | `red-500` | `#EF4444` |
| Text Primary | `white` | `#FFFFFF` |
| Text Muted | `gray-400` | `#9CA3AF` |

### Typography
**Selected Pairing: Classic Elegant** — Playfair Display (headings) + Inter (body)
- Headings anchor trust and convey premium quality
- Inter provides accessibility-first, high-readability body text
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
```

### Key Animation Rules (UX Pro Max)
- Micro-interactions: `duration-150` to `duration-300`
- Page transitions: `animate-in fade-in slide-in-from-bottom-4`
- **No continuous animations on decorative elements** (only on loaders)
- Respect `prefers-reduced-motion` on all animations

---

## Feature Bucket 1: User Dashboard

### Overview
A client-authenticated portal that gives a participant their full picture: upcoming sessions, package balance, and digital product downloads. Built as a mocked shell ready to wire up to Commerce API later.

### Wireframe
![User Dashboard Wireframe](C:\Users\ericb\.gemini\antigravity\brain\7a622894-f14a-460d-976e-884285159504\hips_dashboard_wireframe_1777245391139.png)

### Routes & Components

| Route | Type | Description |
|---|---|---|
| `/dashboard` | Server → Client shell | Overview with KPI cards and upcoming session |
| `/dashboard/sessions` | Client | Paginated session history table |
| `/dashboard/packages` | Client | Package progress bars and expiry warnings |
| `/dashboard/downloads` | Client | Digital product list with mock download CTAs |

### Component Breakdown

#### `DashboardLayout.tsx`
- **Pattern:** Persistent left sidebar + main content, mirrors `/admin/layout.tsx`
- **Nav links:** Overview, Sessions, Packages, Downloads, Settings
- **Behavior:** Sidebar collapses to icon-only on `lg` breakpoint

#### `SessionHistoryTable.tsx`
- **Pattern:** Headless paginated table via `@tanstack/react-table`
- **Columns:** Session ID (anon), Service Name, Date, Status badge, Duration
- **Status badges:** `UPCOMING` (indigo), `COMPLETED` (emerald), `CANCELLED` (gray)
- **Empty state:** Uses `EmptyState` component with `CalendarX2` icon
- **Mock data:** 10 pre-seeded rows, pagination controls working client-side

#### `PackageBalanceCard.tsx`
- **Pattern:** Card with a progress bar `<progress>` (accessible)
- **Data:** Mock `{ used: 3, total: 5, expiresAt: '2026-07-01' }`
- **Warning state:** Amber warning badge if `< 30 days` until expiry
- **Skeleton loader:** `<Skeleton>` blocks on initial mount

---

## Feature Bucket 2: Booking & Availability Calendar

### Overview
The most complex conversion surface. A two-step UI where a user selects a date then a specific time slot for their chosen service.

### Wireframe
![Booking Calendar Wireframe](C:\Users\ericb\.gemini\antigravity\brain\7a622894-f14a-460d-976e-884285159504\hips_booking_calendar_wireframe_1777245404974.png)

### Route: `/book/[serviceId]`

### Component Breakdown

#### `AvailabilityCalendar.tsx` (Client Component)
- **Library:** `react-day-picker` (already accessible, lightweight, styleable)
- **State:** Selected date in `useState`; available dates highlighted with custom `modifiers`
- **Mock data:** Weekdays available for next 30 days, weekends unavailable
- **Styling:** Override `react-day-picker` CSS vars to match OLED dark theme

#### `TimeSlotGrid.tsx` (Client Component)
- **Pattern:** A CSS grid of 30-min time blocks from 9 AM – 7 PM
- **States per slot:** `available` (clickable, indigo border), `booked` (dimmed, not clickable), `selected` (indigo fill, white text)
- **Touch target:** Each slot is `min-h-[44px]` per UX Pro Max rules
- **Loading state:** Full grid covered in `<Skeleton>` rows when date changes

#### `BookingSummaryBar.tsx`
- A sticky bottom bar that appears only once a time slot is selected
- Shows: Service name, selected date/time, price
- Button: "Continue to Checkout →"

---

## Feature Bucket 3: Checkout Shell

### Overview
The two-column checkout layout that will eventually host Stripe Elements. Fully buildable now as a static shell.

### Wireframe
![Checkout Wireframe](C:\Users\ericb\.gemini\antigravity\brain\7a622894-f14a-460d-976e-884285159504\hips_checkout_wireframe_1777245417048.png)

### Route: `/checkout`

### Component Breakdown

#### `OrderSummaryCard.tsx`
- Service name, facilitator handle (anon), date/time, base price
- **Donation Add-On Toggle:** A `Switch` (Radix UI) + `$10 / $25 / $50 / Custom` tier selector
- Logic: Shows running total that updates in real-time with React `useState`

#### `PaymentFormShell.tsx`
- A dark-styled placeholder card where Stripe Elements will mount
- Fields: Card number, MM/YY, CVC, ZIP — all visually rendered (not wired yet)
- Styled to match dark OLED theme via custom CSS variables (Stripe allows CSS theming)

#### `DisclaimerCheckbox.tsx`
- A required `<Checkbox>` (Shadcn) that must be checked to enable the "Complete Purchase" button
- Text: _"I understand that H.I.P.S. provides coaching and peer support — not clinical therapy or medical advice."_
- **Accessibility:** ARIA-required, visible focus ring, associated label

> [!CAUTION]
> The "Complete Purchase" button must remain **disabled** until the disclaimer is checked. This is a legal requirement, not just UX.

---

## Feature Bucket 4: Intake Forms

### Overview
Two complex, multi-step forms built with `react-hook-form` + `zod` for client-side validation. Backend-agnostic with optimistic `console.log` on submit.

### Wireframe
![Scholarship Form Wireframe](C:\Users\ericb\.gemini\antigravity\brain\7a622894-f14a-460d-976e-884285159504\hips_scholarship_form_wireframe_1777245440595.png)

### Route 1: `/scholarship` — Scholarship Application

#### Multi-Step Form Architecture
- **Step 1 — Eligibility:** Radio group (Current employment status), Slider (Monthly income estimate), Service type dropdown
- **Step 2 — Details:** Textarea (Personal statement, 500 char max with live counter), How did you hear about us? Select
- **Step 3 — Review:** Read-only summary of all inputs, consent checkbox, Submit button with loading state

#### Validation (Zod Schema)
```typescript
const scholarshipSchema = z.object({
  employmentStatus: z.enum(['employed', 'unemployed', 'student', 'disabled']),
  incomeRange: z.string().min(1),
  serviceType: z.string().min(1),
  personalStatement: z.string().min(50).max(500),
  referralSource: z.string().min(1),
  consentAcknowledged: z.literal(true),
})
```

### Route 2: `/organizations` — Org Intake Form

- **Fields:** Organization Name, Contact Name, EIN (formatted `XX-XXXXXXX`), Nonprofit checkbox (shows EIN field), Event type (dropdown), Headcount (number), Preferred dates (date range picker), Additional notes
- **Validation:** EIN regex validation, headcount min/max, required fields
- **Success state:** Full-page success overlay with confirmation and "What happens next" timeline

---

## Feature Bucket 5: Session Environment UI

### Overview
The interactive UI components that overlay the 3D WebRTC canvas.

### Wireframe
![Session Lobby Wireframe](C:\Users\ericb\.gemini\antigravity\brain\7a622894-f14a-460d-976e-884285159504\hips_session_lobby_wireframe_1777245429181.png)

### Components

#### `VoiceControlsBar.tsx`
- Floating bar at the bottom of the session canvas: `fixed bottom-6 left-1/2 -translate-x-1/2`
- Buttons: Mute (toggle), Settings (popover), Report (opens modal), End Session (red, confirm dialog)
- Mute state: Changes icon color + background to red; visually clear
- **Accessibility:** All buttons have `aria-label`, `tabIndex={0}`, keyboard `Enter`/`Space` activation

#### `AvatarSelectorModal.tsx`
- A pre-session modal (Radix `<Dialog>`) shown before joining the canvas
- Displays 6 color swatches; clicking selects the avatar's base hue
- "Lock Avatar & Join" button confirms and closes modal
- Avatar color stored in `sessionStorage` (not a cookie; not linked to identity)

#### `SessionLobby.tsx` (`/lobby/[groupId]`)
- Centered glassmorphism card; list of participant handles (anonymized)
- Participant handles follow pattern: `[Adjective]-[Animal]-[Number]` (e.g., `Silent-Hawk-7`)
- Countdown timer showing "Session starts in X:XX"
- Moderator sees a "Start Session" button; participants see "Waiting for facilitator..."

#### `CrisisResourceOverlay.tsx`
- A full-screen `fixed inset-0` overlay (highest z-index: `z-[9999]`)
- Focus-trapped via `@radix-ui/react-dialog`; keyboard-navigable
- Shows: 988 Suicide & Crisis Lifeline, Crisis Text Line, Local emergency number
- Cannot be accidentally dismissed; requires explicit "I'm safe, close this" button

---

## Global Polish Components

#### `ToastProvider.tsx` + `useToast.tsx`
- Library: `sonner` (lightest, most performant toast library)
- Configured once in `app/layout.tsx`; exposes `toast.success()`, `toast.error()`, `toast.warning()`
- Dark theme matching platform aesthetic

#### `app/error.tsx` (Next.js Error Boundary)
- A full-page graceful fallback that uses the `ErrorState` component
- Shows a human-friendly message; "Try again" button calls Next.js `reset()` function

#### `app/loading.tsx` (Next.js Global Loading)
- A full-page skeleton that prevents layout shift during navigation

#### `GlobalDisclaimerBanner.tsx`
- A sticky `top-16` (below the navbar) slim banner shown on all `/services/*` and `/book/*` routes
- Text: "H.I.P.S. provides coaching & peer support — not clinical therapy."
- Dismissible per session (stored in `sessionStorage`); re-shows on each new browser session

---

## Sprint Order

| Sprint | Bucket | Key Deliverables |
|---|---|---|
| **Sprint A** | Global Polish | Toast system, Error/Loading boundaries, GlobalDisclaimerBanner |
| **Sprint B** | Forms | Scholarship form (multi-step), Organization intake form |
| **Sprint C** | Dashboard | Dashboard layout, Session history table, Package balance card |
| **Sprint D** | Booking | Availability calendar, Time slot grid, Booking summary bar |
| **Sprint E** | Checkout | Order summary, Payment form shell, Disclaimer checkbox |
| **Sprint F** | Session Layer | Voice controls bar, Avatar selector modal, Session lobby, Crisis overlay |

---

## Effort Summary

| Feature | Effort | Components |
|---|---|---|
| Global Polish | **S** | 4 components |
| Scholarship Form | **M** | Multi-step form + Zod schema |
| Org Intake Form | **M** | EIN validation + date range |
| User Dashboard | **M** | Layout + 3 sub-pages |
| Booking Calendar | **L** | 2 complex Client components |
| Checkout Shell | **M** | 3 layout components |
| Session Layer | **L** | 4 interactive overlays |

**Total estimated effort: ~2–3 focused development days**

---

## Pre-Delivery Checklist (UX Pro Max)

- [ ] All clickable elements have `cursor-pointer`
- [ ] All buttons have `aria-label` or visible text
- [ ] No emojis as icons — SVG from `lucide-react` only
- [ ] Hover states transition in `150-300ms`
- [ ] Focus rings visible on all interactive elements
- [ ] Form inputs all have associated `<label>` elements
- [ ] Loading → Success → Error states implemented on all forms
- [ ] Crisis overlay is focus-trapped and screen-reader accessible
- [ ] Responsive verified at `375px`, `768px`, `1024px`, `1440px`
- [ ] `prefers-reduced-motion` disables `animate-*` classes
