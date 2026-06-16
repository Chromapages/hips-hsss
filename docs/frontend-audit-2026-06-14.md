# Frontend Audit — H.I.P.S. Foundation Web

**Date:** 2026-06-14
**Scope:** `apps/web/src` — Next.js 15.2.4 / React 18.3.1 monorepo web app
**Method:** Multi-agent parallel audit — 1 discovery agent + 5 dimension analysts (component architecture, design system, type safety, Next.js patterns, perf/a11y/quality) + in-script synthesis
**Audited by:** `frontend-audit-five-dimensions` workflow (transcript: `/private/tmp/claude-501/.../tasks/wpiuuzzu9.output`)

---

## Overall health: **F (0/100)** — 63 unique findings

| Severity | Count | Description |
|---|---|---|
| **P0** Critical | **4** | Block, ship-block, or security gate failures |
| **P1** High | **24** | Significant correctness, performance, or DX issues |
| **P2** Medium | **29** | Quality, consistency, and a11y issues |
| **P3** Low | **6** | Cosmetic / minor |

**By cross-cutting category:** Performance 3 · Accessibility 3 · Code-quality 56 · Security 1.

The strong foundation (strict TS, shadcn primitives, SWR, RHF+Zod, dual-theme tokens) is undermined by 4 critical issues, systemic `'use client'` over-application, dual middleware/proxy ambiguity, and a long tail of design-token and accessibility drift. The codebase shows what happens when a feature is built faster than the design system can absorb it.

---

## Executive summary

The H.I.P.S. web app is a 53-page Next.js 15.2.4 monorepo with sensible defaults in many areas (loading.tsx on most long routes, dynamic() for 3D/Stripe/SessionRoom, next/image with priority/quality, ErrorBoundary on session page). But it carries sharp edges:

- **Critical security/correctness:** host access code in client bundle, untyped Firestore reads in 10 API routes, four-way middleware/proxy ambiguity, LiveKit token in URL.
- **Bundle/perf:** SessionRoom (LiveKit + R3F + voice-mask) is statically imported, defeating the lazy split on `test-session`; 3D `useFrame` loops run per-vertex JS at 60fps with no reduced-motion guard; Stripe SDK in initial checkout bundle.
- **Design system:** 51 ad-hoc `tracking-[0.Xem]` values where 5 tokens would do; 92 arbitrary `min-h-[...]` values; 17 shadcn primitives but no shared hero/CTA component; theme tokens exist but ~30% of call-sites bypass them.
- **A11y:** No skip-to-main link (recently removed); form errors not linked via `aria-describedby` on long intake/booking forms; 3 different focus-ring mechanisms.
- **Type safety:** Strict tsconfig is real (29 `: any` is small for ~37K LOC) but Firestore + WebSocket payloads are unvalidated; middleware JWT decode is the auth gatekeeper but is excluded from `tsc`; 4 `eslint-disable react-hooks/exhaustive-deps` mask potential stale closures.
- **Server/client boundaries:** Home page is a 555-line client component for one `useState`; 5 layouts stamped `'use client'` solely to host AuthGuard; dashboard does client-side SWR fetching of data the server could resolve.

The top three priority items are: **(1) Delete 3 of 4 middleware/proxy files**; **(2) Move host access code to a server route**; **(3) Add Zod schemas to 10 Firestore API reads**.

---

## Discovery snapshot

| Metric | Value |
|---|---|
| Total `.tsx` files | 251 |
| Total `.ts` files | 128 |
| Approx LOC | ~36,762 |
| Page routes (`page.tsx`) | 53 |
| API routes (`route.ts`) | 49 |
| Middleware files | 1 active + 1 `.bak` + 2 `proxy.ts` |
| Client components (`'use client'`) | 138 (across 146 occurrences) |
| `useState` calls | 258 |
| `useEffect` calls | 137 |
| `useMemo` calls | 39 |
| `useCallback` calls | 87 |
| Explicit `: any` | 29 |
| `@ts-ignore` / `@ts-expect-error` | **0** |
| `console.*` calls | 92 (37 in API routes) |

**Stack:** Next.js 15.2.4 · React 18.3.1 · TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) · Tailwind v4 (via `@tailwindcss/postcss`) · shadcn-style Radix UI primitives · SWR 2.4.1 · react-hook-form 7.77 + zod 4.4 · Firebase Auth + Firestore · Stripe (server + `@stripe/stripe-js` + `@stripe/react-stripe-js`) · LiveKit · Resend · Prisma (shared workspace package) · dual-theme via `[data-theme]` + 3-state toggle.

**Component dirs:** `components/{ui,polish,theme,dashboard,sidebar,forms,session,session-ui,booking,host,checkout,auth,admin,testimonials,avatar,app-sidebar,sidebar}` + 17 shadcn primitives in `components/ui/`.

---

## P0 — Critical (4 findings)

### `arch-05` — Four-way middleware/proxy ambiguity  ·  S effort  ·  high impact

**Files:** `apps/web/src/middleware.ts`, `apps/web/src/middleware.ts.bak`, `apps/web/src/proxy.ts`, `apps/web/proxy.ts`

Four files share the same responsibility. Next.js only recognizes one middleware file at a time. Having four candidates invites the build to silently pick the wrong one (or both, causing duplicate edge work). `middleware.ts.bak` is dead weight in the source tree.

**Fix:** Pick a single filename (Next.js convention is `middleware.ts`) and delete the other three. Delete `.bak` files from git history.

```bash
rm apps/web/src/middleware.ts.bak
rm apps/web/src/proxy.ts
rm apps/web/proxy.ts
# keep apps/web/src/middleware.ts
```

---

### `QUAL-1` — Hardcoded host access code fallback ships in client bundle  ·  S effort  ·  high impact

**File:** `apps/web/src/app/(auth)/login/page.tsx:17`

```ts
const HOST_ACCESS_CODE = process.env.NEXT_PUBLIC_HOST_ACCESS_CODE ?? "HIPS-HOST-2025";
```

The `NEXT_PUBLIC_` prefix means the value is inlined into the client bundle. The fallback `"HIPS-HOST-2025"` is shipped to every browser when env is not set, and even the env value is exposed to the client. Anyone reading the JS bundle bypasses the access gate.

**Fix:** Move the access-code comparison to a server route (e.g. `POST /api/auth/host-challenge`) that validates the supplied code against a server-only secret (no `NEXT_PUBLIC_`). Drop the static fallback. If the env var is missing in production, the server should refuse to start (boot-time validation).

---

### `TS-03` — Untyped `firestore .data()!` reads in API routes (10 sites)  ·  M effort  ·  high impact

**Files:** `apps/web/src/app/api/{safety/flag,safety/ingest,services/[slug],session,session/[id],sessions/reconnect,livekit/token,cron/session-expire}/route.ts`

`sessionDoc.data()!` at `safety/flag:27`, `safety/ingest:20`, `services/[slug]:39`, `session-expire:39`. `doc.data() as Phase5Session` at `session/route:66,239`, `session/[id]:66`, `livekit/token:54,161`. `doc.data() as ReconnectRecord` at `sessions/reconnect:50`. None of these are Zod-parsed.

Server code trusts Firestore document shape. With `noUncheckedIndexedAccess` and the absence of a runtime check, any schema drift silently produces `undefined` in the response and `!` lies about presence. The existing `Phase5Session` type alias is only a structural hint, not a guarantee.

**Fix:** Add a `Phase5SessionSchema = z.object({...})` next to the type in `packages/db` (or a colocated `src/lib/schemas/session.ts`) and call `.safeParse(doc.data())` on every Firestore read in API routes. Return 404/422 on parse failure. Replace `!` and `as` with the parsed result.

```ts
const raw = doc.data();
const parsed = Phase5SessionSchema.safeParse(raw);
if (!parsed.success) return NextResponse.json({error:'invalid_session'}, {status:404});
return NextResponse.json(parsed.data);
```

---

### `N3` — Duplicate middleware files (middleware.ts + src/proxy.ts + .bak)  ·  S effort  ·  medium impact

**Files:** `apps/web/src/middleware.ts`, `apps/web/src/proxy.ts`, `apps/web/src/middleware.ts.bak`

`src/middleware.ts` is the active file. `src/proxy.ts` and `apps/web/proxy.ts` reference a different implementation. `middleware.ts.bak` is a stale backup. Two files named `proxy.ts` use the export name `proxy` (Next 16 convention) but Next 15.2 only recognises `middleware`. The stale `.bak` is checked into source control, increasing bundle noise and confusing reviewers.

**Fix:** Delete `src/proxy.ts` and the `.bak` file; keep `src/middleware.ts` as the single source of truth. If pre-empting Next 16's rename, add a code comment but don't duplicate.

---

## P1 — High (24 findings)

### Component architecture

#### `arch-01` — `SessionRoom.tsx` is a 772-line god component mixing 7+ concerns  ·  L effort  ·  high impact

**File:** `apps/web/src/components/session/SessionRoom.tsx`

11 `useEffect`s, 5 `useState`s, 8 `useCallback`s. It mixes: token fetching, mobile detection, media permission checks, reconnection wiring, microphone publication lifecycle, voice-mask processor lifecycle, hand-raise data-channel protocol, crisis/kick state machines, safety monitoring, facilitator notes, raised-hand queue, and full-screen rendering. The `setInterval` timer at line 447-452 is never cleared against the latest `sessionSeconds` closure; the cleanup at 407-413 calls `room.disconnect()` inside a `useEffect` that depends on `room`, which leaks if `room` reference changes.

**Fix:** Split into `useSessionToken(sessionId)`, `useMediaPermission()`, `useLiveKitConnection()`, `useMicrophonePublication()`, `useHandRaiseDataChannel()`, `useSessionTimer()`. Then `SessionContent` becomes a thin composer. Replace prop-callback state setters with a single reducer.

```ts
export function useMicrophonePublication(localParticipant: LocalParticipant | null) {
  const [track, setTrack] = useState<LocalAudioTrack | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const { activePreset, semitones } = useVoiceEffects('subtle', 4);

  const start = useCallback(async () => { /* ... */ }, [localParticipant, activePreset, semitones]);
  const toggle = useCallback(async () => { /* ... */ }, [track, enabled, busy, start]);
  const stop = useCallback(async () => { /* ... */ }, [track, localParticipant]);

  return { track, enabled, busy, start, toggle, stop };
}
```

---

#### `arch-02` — Home page (554 lines) duplicates hero CTA, 4 accordions, and 4 mockup panels inline  ·  M effort  ·  high impact

**File:** `apps/web/src/app/page.tsx`

Lines 305-465: four near-identical accordion items copy-pasted 40 lines each, differing only in id, label, body copy, and href. Lines 469-545: four mockup Image blocks for `activeIndex` 0..3 differ only in src, alt, and copy. Two CTA button rows (lines 56-69 and 189-205) are byte-for-byte identical except for href and copy. The single `useState(0)` forces the entire 555-line page to be a client component, blocking RSC streaming.

**Fix:** Extract `<FeatureAccordion items={FEATURES} activeIndex={activeIndex} onChange={setActiveIndex} />` and `<FeatureMockupPanel items={FEATURES} activeIndex={activeIndex} />`. Define `FEATURES` as a `const` array. Move the static hero/CTA to a server component and only ship the tabs as a small client island.

```ts
const FEATURES = [
  { id: 0, icon: Lock,   title: 'Identity Vault', body: '...', href: '/features#identity-vault', image: '...', palette: 'primary' },
  // ...
] as const;
```

---

#### `arch-03` — Two parallel avatar component systems  ·  M effort  ·  high impact

**Files:** `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx`, `apps/web/src/app/components/avatar/{index,Avatar,AvatarCanvas,AvatarStyles,AvatarPalettes}.ts`

`src/components/session-ui/avatars/VirtualOfficeAvatar.tsx` (250 lines) and `src/app/components/avatar/` (5 files) are two separate trees. Two sources of truth for avatar palettes, styles, and gestures. The `AvatarProfile` type from `@hips/types` is the contract, but the static `AVATAR_STYLES` list and the `avatarStyles` const in `session-ui/avatars` can drift. There is no path to import a single avatar configuration used by both the live room and the host's avatar-setup page.

**Fix:** Pick one tree as canonical. Move `AVATAR_STYLES`, `AVATAR_PALETTES`, `GESTURE_PRESETS` into a shared `packages/avatars/`, and import from both. Delete `src/app/components/avatar/`. Keep `AvatarCanvas.tsx` in `session/` since it is tightly coupled to three.js.

---

#### `arch-04` — `AvailabilityCalendar` duplicated across `host/` and `booking/` with no shared base  ·  S effort  ·  high impact

**Files:** `apps/web/src/components/host/AvailabilityCalendar.tsx`, `apps/web/src/components/booking/AvailabilityCalendar.tsx`

`host/AvailabilityCalendar.tsx` (173 lines) renders a 7-day × 3-slot toggle grid that POSTs to `/api/host/availability`. `booking/AvailabilityCalendar.tsx` (80+ lines) renders a 30-day date picker with `onSelect` callback. Both share the component name and the `AvailabilityGrid` shape but the visual + interactive surface is different.

**Fix:** Rename to `HostAvailabilitySlots` (host/) and `BookingDatePicker` (booking/). Hoist the `WeekDays`/`SlotsType` types into a shared `@/lib/availability.ts` module.

```ts
// lib/availability.ts
export type WeekDay = 'monday' | ... | 'sunday';
export type Slot = 'morning' | 'afternoon' | 'evening';
export type WeeklyAvailability = Record<WeekDay, Slot[]>;
```

---

#### `arch-06` — Barrel files in `app/components/` break App Router colocation and code-splitting  ·  S effort  ·  medium impact

**Files:** `apps/web/src/app/components/session/index.ts`, `apps/web/src/app/components/avatar/index.ts`, `apps/web/src/components/session-ui/index.ts`

`app/components/session/index.ts` and `app/components/avatar/index.ts` live inside the App Router tree, which Next.js does not treat as routable, but they re-export from across the codebase. `app/components/avatar/index.ts` re-exports 6 modules and a derived 36-element array. Consumers in `app/` pages import from these barrels and pull the entire avatar tree into the route bundle.

**Fix:** Remove the `app/components/{session,avatar}/` barrels entirely. Move the avatar pieces to a feature folder under `components/avatar/`. Keep the `session-ui/index.ts` barrel only if all named exports are actually used together.

```ts
// Before: import { AvatarCanvas } from '@/app/components/avatar'
// After:  import AvatarCanvas from '@/components/session/AvatarCanvas'
```

---

### Design system

#### `DS-01` — Invalid utility class names (Tailwind v4 silent miss)  ·  S effort  ·  high impact

**Files:** `(auth)/signup/page.tsx:200`, `booking/BookingSummaryBar.tsx:92`, `checkout/CheckoutShell.tsx:102`, `checkout/CheckoutForm.tsx:77`, `demo/DemoSessionClient.tsx:342`, `checkout/page.tsx`, `SessionExperience.tsx`, `booking/TimeSlotGrid.tsx`

`from-#173B57` is missing the required `[...]` for arbitrary values — Tailwind v4 silently drops it, so the gradient is transparent. `bg-Gold-500`, `bg-Gold-500/10`, `bg-Gold-600/5` (8+ sites) reference a non-existent `Gold-*` palette; the only gold token is `--color-gold` / `--color-accent` (`#C59A35`).

**Fix:** Replace every `from-#173B57` with `from-[#173B57]` (or, better, `from-primary`) and every `bg-Gold-*` / `to-Gold-*` with `bg-accent/10`, `to-accent`, etc. Add a CI grep step that fails the build on `#[0-9A-Fa-f]{3,8}` and `-[A-Z][a-z]+-[0-9]+` outside the token file. Add Gold aliases to `globals.css` `@theme` block if a warm-500/600 step is required.

---

#### `DS-02` — Invalid token names: `text-text-muted0`, `bg-destructive0`, `bg-bg-subtle` typos will not resolve  ·  S effort  ·  high impact

**Files:** `not-found.tsx`, `host/appointments/page.tsx`, `host/dashboard/page.tsx`, `lobby/not-found.tsx`, `checkout/page.tsx`, `checkout/[sessionId]/page.tsx`, `checkout/donate/DonateCheckoutClient.tsx`, `checkout/error.tsx`, `crisis/page.tsx`, `demo-room/DemoRoomClient.tsx`, `(auth)/signup/page.tsx` (11 files, 14+ occurrences)

These tokens do not exist in `tailwind.config.ts` nor in the `@theme` block of `globals.css`. Tailwind v4 silently drops them, so the affected labels render with no color.

**Fix:** Run a project-wide sed: `text-text-muted0` → `text-text-muted` and `bg-destructive0/5` → `bg-destructive/5` (or `bg-destructive/10`). Add an ESLint rule (`no-unknown-tailwind-class` via `tailwindcss-classnames`) to fail lint on any class not generated by the configured safelist.

---

#### `DS-03` — Hard-coded hex/rgba in demo + avatar surfaces bypass the dual-theme system entirely  ·  M effort  ·  high impact

**Files:** `demo/live/page.tsx:29,282,298,683`, `demo-room/DemoRoomClient.tsx:799`, `host/avatar-setup/page.tsx`, `app/components/avatar/AvatarPalettes.ts`, `app/components/avatar/Avatar.tsx:156`, `CrisisEscalation.tsx`, `SessionExperience.tsx`, `demo/VaultDemo.tsx`, `session-ui/VoiceControlsBar.tsx`

`bg-[#030712]` in demo/live/page.tsx, `bg-[#C59A35]` where the same brand gold is also `--color-gold`; literal `rgba(99,102,241,0.15)` indigo glows in 5 not-found pages; `zinc-950`, `text-white/90`, `bg-amber-500/10` — all raw Tailwind palette colors that exist outside the theme. Dark-mode toggle has no effect on demo/avatar surfaces, and the brand gold is duplicated.

**Fix:** For demo pages: swap `bg-[#030712]` for a `--color-bg-inverse` token. For brand-gold CTAs, use `bg-accent` / `hover:bg-accent-dark`. For glow halos, add a `--shadow-glow-accent: 0 0 30px color-mix(in oklch, var(--color-primary) 15%, transparent)` token. Avatar palettes should read from CSS variables so dark mode can re-tint.

---

### Type safety

#### `TS-01` — Explicit `any` and `as any` casts (29 occurrences)  ·  S effort  ·  medium impact

**Files:** `lib/redis.ts:10,47`, `lib/admin-audit.ts:11-12`, `lib/prisma.ts:31`, `app/api/admin/users/route.ts:90,112`, `app/api/admin/stats/route.ts:33`, `components/auth/AuthProvider.tsx:53`, `hooks/session/useRaisedHands.ts:50`, `middleware.ts:226`

`lib/redis.ts` returns `any` so callers get zero protection. `admin-audit.ts` lets arbitrary JSON shape flow into a Prisma JSON column. The Prisma proxy casts swallow real type errors.

**Fix:** Replace with concrete types: `import type { Redis as RedisType } from 'ioredis'`; `getRedis(): RedisType | null`; `AdminAuditEvent` `before/after: Prisma.InputJsonValue | undefined`; AuthProvider token should be typed via `firebase/auth`'s `User`; middleware `role: 'PARTICIPANT' | 'FACILITATOR' | 'ADMIN'` const union.

```ts
// lib/redis.ts
import type { Redis as RedisType } from 'ioredis';
let client: RedisType | null = null;
export function getRedis(): RedisType | null { return client; }
```

---

#### `TS-02` — `as unknown as X` double-casts at LiveKit boundary (8 sites)  ·  S effort  ·  medium impact

**Files:** `demo-room/DemoRoomClient.tsx:249,309`, `SessionRoom.tsx:535,596`, `useVoiceConnection.ts:135`, `app/components/avatar/Avatar.tsx:66,74`

LiveKit `publishTrack` expects `LocalTrack` (super of `MediaStreamTrack`); the cast crosses unrelated types. `Avatar.tsx:66,74` uses `?? {} as unknown as X` to silence the fact that a lookup returned undefined — masking a real bug.

**Fix:** For LiveKit: branch on the actual `LocalTrack` shape and use a type guard. For `Avatar.tsx`: throw or return a typed `null` rather than a fabricated object.

```ts
// SessionRoom.tsx
if (track instanceof LocalAudioTrack) {
  await localParticipant.publishTrack(track, { dtx: true });
}
```

---

#### `TS-04` — Client `.json()` calls without Zod parse (~20 sites)  ·  M effort  ·  high impact

**Files:** `dashboard/page.tsx:96 (good)`, `host/appointments:106`, `host/dashboard:115`, `facilitator:40,55,89`, `facilitator/assignments:20`, `checkout:38`, `demo-room:720`, `admin/users/page.tsx`. Also `JSON.parse(...) as Partial<X>` in `SessionRoom.tsx:64`, `DemoRoomClient.tsx:55`, `useVoiceConnection.ts:27`, `useRaisedHands.ts:16`, `SafetyMonitor.tsx:34`, `AvatarCanvas.tsx:180`.

`const data = await res.json()` with no schema lets `data.something` compile even if the API returns `{error: '...'}`, then crash at runtime. WebSocket payloads are blindly cast to `Partial<X>`, so a missing field becomes `undefined.field`.

**Fix:** Mirror server Zod schemas on the client (`DashboardDataSchema` already exists — export it). For WebSocket data, use a `z.discriminatedUnion('type', [...])` and `safeParse` in the message handler.

```ts
const json = await res.json();
const parsed = DashboardDataSchema.safeParse(json);
if (!parsed.success) throw new Error('Invalid response');
return parsed.data;
```

---

#### `TS-08` — Middleware JWT decode without Zod / `jsonwebtoken` typing  ·  M effort  ·  high impact

**Files:** `middleware.ts:144,170,155-170,226`, `lib/auth-edge.ts:41`

Inline objects typed as `{ sub: string; role?: string }`; manual `JSON.parse(atob(encodedHeader))` for JWK rotation; `payload.role as any`. The edge middleware is the auth gatekeeper for every protected route, yet the JWT payload is typed as a loose inline structural type. A real header-alg-confusion attack vector is partially mitigated only by manual `atob` parsing.

**Fix:** Use `jose` (Edge-compatible) with `jwtVerify(token, JWKS, {algorithms:['RS256'], audience, issuer})` and a Zod schema for the payload. Drop the manual `atob` JSON.parse.

```ts
const { payload } = await jwtVerify<AuthClaims>(token, JWKS, {algorithms:['RS256']});
if (!ROLES.includes(payload.role)) return redirectTo('/login');
```

---

### Next.js App Router

#### `N1` — Entire home page is a client component for a single `useState` tab  ·  M effort  ·  high impact

**File:** `apps/web/src/app/page.tsx:1,11`

`'use client'` + `const [activeIndex, setActiveIndex] = useState(0)` — the entire 555-line homepage is a client component to manage one tab index. Hero, How It Works, Features, and partner strip are 100% static content.

**Fix:** Extract a small `<FeatureTabs items={...} />` client component holding only the `activeIndex` state. Keep `page.tsx` as a server component. Reduces initial JS by ~95% for that page.

---

#### `N2` — Layouts marked `'use client'` just to host AuthGuard  ·  S effort  ·  high impact

**Files:** `dashboard/layout.tsx`, `(admin)/layout.tsx`, `facilitator/layout.tsx`, `checkout/layout.tsx`, `session/layout.tsx`

All five layouts start with `'use client'` and render `<AuthGuard><DashboardShell>{children}</DashboardShell></AuthGuard>`. Defeats Next.js nested layout benefits; the actual page can never be a server component (its layout is client).

**Fix:** Drop the `'use client'` wrapper in each layout, or convert `AuthGuard` into a server component that reads a cookie/Firebase ID token via `cookies()`/`headers()` and redirects. If client interactivity is unavoidable, at minimum keep the layout server-side and pass a Server Component child into a small `<ClientShell>` wrapper.

---

#### `N5` — Server-only `prisma`/`firebase-admin` imported in client-touched paths via shared lib  ·  M effort  ·  high impact

**Files:** `lib/firebase-admin.ts`, `lib/prisma.ts`, `lib/auth-utils.ts`

`firebase-admin.ts` initializes `firebase-admin` on import; `prisma.ts` instantiates `PrismaClient` globally. Both lack an `import 'server-only'` guard. Accidental import from a `'use client'` file would compile but throw at runtime; a clear sentinel would surface the bug at build time.

**Fix:** Add `import 'server-only';` as the first line of both files. Install `server-only` if not present.

---

#### `N6` — Dashboard page does client-side SWR fetching of server-resolvable data  ·  M effort  ·  high impact

**Files:** `app/dashboard/page.tsx`, `app/api/dashboard/route.ts`

`dashboard/page.tsx` L1 `'use client'` + L3 `dynamic='force-dynamic'`, then a 60-line `useSWRData` fetcher that hits `/api/dashboard` from the browser. The underlying `/api/dashboard` already calls Firestore with the caller's Firebase ID token.

Round-trips from browser → Next API → Firestore when a server component could read Firestore directly via `firebase-admin` (server side). Also loses Next.js streaming and partial pre-render benefits.

**Fix:** Make `dashboard/page.tsx` an async server component that calls a server-only data layer. Reserve `useSWRData` for live polls on a small sub-tree (e.g. feedback prompt).

---

#### `N7` — Public API route `/api/services` has no auth and is missing route segment config  ·  S effort  ·  medium impact

**Files:** `app/api/services/route.ts:4-27`, `app/api/session/[id]/flag/route.ts:45-129`

`/api/services` GET returns all active services with no auth. `/api/session/[id]/flag` POST accepts arbitrary anonymous tokens and stores reports; no auth, no rate limiting. Both lack `export const dynamic = 'force-dynamic'`.

**Fix:** Add `export const dynamic = 'force-dynamic';` to both. For `/api/services`, document why no auth is required or add an internal token check. For `/api/session/[id]/flag`, add at minimum a rate limit + Zod validation + a session membership check (already present in `/api/safety/flag` — reuse the same pattern).

---

#### `N11` — Session token leaked via URL on `/session/[id]?token=` path  ·  S effort  ·  high impact

**Files:** `app/session/[id]/page.tsx:1`, `app/session/[id]/SessionRoomClient.tsx:13`

`page.tsx` L1 `'use client'` uses `useParams<{id}>` instead of receiving `params` prop. `SessionRoomClient.tsx` reads `?token=` from URL search params and passes it as LiveKit token. The `/api/safety/flag` route validates session membership, but no server-side check protects `/session/[id]` from token-in-URL replay.

LiveKit tokens placed in URL are recorded in browser history, the `Referer` header, server access logs, and any analytics tooling. **Security finding — cross-category: security.**

**Fix:** Drop the URL-token fallback. Make `/session/[id]/page.tsx` an async server component that takes `params` as a `Promise` (Next 15 idiom) and passes only the sessionId to a client `SessionRoomClient` that always fetches a fresh token from `/api/sessions/token` using the caller's Firebase ID token.

---

### Performance & a11y

#### `PERF-1` — `SessionRoom` (LiveKit + R3F + voice-mask) statically imported into the session route  ·  M effort  ·  high impact

**Files:** `app/session/[id]/page.tsx:5`, `app/session/[id]/SessionRoomClient.tsx:5`, `components/session/SessionRoom.tsx`

Static imports of `LiveKitRoom`, `useDataChannel`, `livekit-client`, `voice-mask-processor`, `AvatarCanvas` (R3F), `SafetyMonitor`, `CrisisEscalation`, `SessionHeader`, `VoiceControlsBar`, `WebGLFallback`, `MobileBlockPage`, `MediaToolbar`, `useMediaDevices`, `useVoiceEffects`. `test-session/page.tsx:5` correctly uses `dynamic(..., { ssr: false })` — but the real `/session/[id]` does not.

**Fix:** Switch the `SessionRoom` imports in `/session/[id]/page.tsx` and `SessionRoomClient.tsx` to `dynamic(() => import('@/components/session/SessionRoom'), { ssr: false, loading: ... })`.

---

#### `PERF-2` — 3D scene files use unbounded `useFrame` loops with per-vertex JS work, no reduced-motion guard  ·  M effort  ·  high impact

**Files:** `components/session/SanctuaryParticles.tsx:32-49`, `AbstractAvatar.tsx:36-52`, `SanctuaryScene.tsx`

300 particles + N avatars multiplied by 60fps = ~18k JS vertex mutations/sec, blocking the main thread next to audio rendering, creating a battery-drain and reduced-motion a11y issue. None of the three files reference `prefers-reduced-motion`.

**Fix:** Add a single `useReducedMotion` (already in the codebase via `useCountUp`) check at the top of each component and skip the `useFrame` registration (or return early) when reduced motion is preferred. Consider replacing the JS particle update with a vertex shader.

---

#### `A11Y-1` — React-hook-form inputs across intake/contact/scholarship/booking never link `aria-invalid`/`aria-describedby`  ·  M effort  ·  high impact

**Files:** `forms/OrganizationIntakeForm.tsx:142-168`, `forms/ScholarshipForm.tsx:153-189`, `booking/TimeSlotGrid.tsx`, `app/contact/page.tsx`

`<Input {...register("orgName")} />` with a sibling `<p>{errors.orgName.message}</p>` but no `aria-invalid` and no `aria-describedby`. The auth flow forms (`auth/login/page.tsx:179-180`, `signup/page.tsx:116-117`, `forgot-password`) do set these — the pattern is established but absent in long forms. **A11y finding.**

**Fix:** Centralize a `FormField` wrapper component (RHF `useFormContext` + shadcn-style Field/FieldError pair) that wires `aria-invalid` and `aria-describedby` automatically. Add `role=alert` to the error `<p>` or wrap error list in `aria-live=polite`.

---

#### `A11Y-2` — Skip-to-main-content link removed in navbar refactor  ·  S effort  ·  high impact

**Files:** `app/layout.tsx:74-89`, `components/polish/Navbar.tsx:280-309`

Recent commit `fd8c0d9: "refactor(navbar): remove skip-to-main-content link"`. Keyboard and screen-reader users must tab through the entire sticky Navbar (logo, 5 nav links with dropdowns, theme toggle, CTA button) on every page load to reach content. This is a **WCAG 2.4.1 Bypass Blocks** failure. **A11y finding.**

**Fix:** Add a visually-hidden "Skip to main content" link as the first focusable element in `app/layout.tsx`, with `href="#main"`, and add `id="main" tabIndex={-1}` to the per-page `<main>` element.

---

### Code quality

#### `QUAL-2` — 37 `console.log` calls in API routes and demo token endpoint  ·  S effort  ·  medium impact

**Files:** `api/auth/sync/route.ts:35,42,60,83,116,129`, `api/demo/token/route.ts:37,44,48,73,87,102,136`, `proxy.ts:47`

Six `console.log`/`console.error` calls in `api/auth/sync/route.ts` printing user emails, UIDs, and request IDs. Seven in `api/demo/token/route.ts` logging room names, identities, and credential state. User PII ends up in stdout and any log aggregator; in production these calls are not structured, not sampled, and not scrubbed.

**Fix:** Replace with a thin `logger` module that respects `NODE_ENV` (silent in production for `info`, structured JSON for `error`). Never log PII — hash the UID if needed for correlation. Drop the verbose demo token logs.

---

#### `QUAL-3` — `eslint-disable react-hooks/exhaustive-deps` in 4 hot hooks, masking possible stale closures  ·  M effort  ·  medium impact

**Files:** `demo-room/DemoRoomClient.tsx:522`, `hooks/useDemoMediaDevices.ts:220`, `hooks/useFetchWithTimeout.ts:122`, `hooks/useMediaDevices.ts:130`

`}, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps` after a `useEffect` that calls `requestPermission`/`stopAudio`. The disabled lines correspond to dependencies the lint wants (e.g. `startAudioTest`) that the author considered stable or wanted to suppress — but no inline comment explains the rationale. Each disable hides a real risk: a stale closure could re-run the effect with a stale callback, leaking an audio track.

**Fix:** Wrap the unstable callbacks in `useEvent`-style refs (or `useRef` of the latest function) and remove the disables.

---

## P2 — Medium (29 findings)

### Component architecture

#### `arch-07` — Form pattern split: `ScholarshipForm` uses RHF+Zod, `OrganizationIntakeForm` and dashboard use raw `useState`  ·  M effort

`forms/ScholarshipForm.tsx` uses `useForm + zodResolver + z.object`. `OrganizationIntakeForm.tsx` (249 lines) uses a single `useState(false)` for submission state and uncontrolled form fields. Two form paradigms coexist. Pick RHF + zod as the standard. Convert `OrganizationIntakeForm` to a typed RHF form. Add a small `<FormField>` primitive.

```ts
const orgSchema = z.object({ orgName: z.string().min(2), /* ... */ });
const { register, handleSubmit, formState: { errors } } = useForm<OrgInput>({ resolver: zodResolver(orgSchema) });
```

#### `arch-08` — Boolean-sprawl in session UI props (`MediaToolbar` has 12 props, 7 are flags/handlers)  ·  S effort

`MediaToolbarProps: micEnabled, micBusy, cameraEnabled, onToggleMic, onToggleCamera, audioInputs, audioOutputs, selectedAudioInput, selectedAudioOutput, onSelectAudioInput, onSelectAudioOutput` (12). Group into a `mediaState: { mic: { enabled, busy, inputs, selectedInput }, camera: { enabled }, speaker: { outputs, selectedOutput } }` object, or extract a `useSessionMediaController(localParticipant)` hook.

#### `arch-09` — Dashboard pages and host dashboard accumulate `useState` soup  ·  M effort

`host/avatar-setup/page.tsx` has 4 audio-related states with no shared structure. Co-locate with `useReducer`, or extract a `useVoiceConfiguration()` hook. For `sessions/page.tsx`, the filter+page is one piece of UI state, not two.

```ts
type HostSetupState = { preset: AvatarPreset; voice: VoiceOption; semitones: number; reverb: 'low'|'medium'|'high' };
const [state, dispatch] = useReducer(hostSetupReducer, { preset: AVATAR_PRESETS[0], voice: VOICE_OPTIONS[0], semitones: 0, reverb: 'medium' });
```

#### `arch-10` — `AuthProvider` mixes mock-cookie dev path, timeouts, cookie sync, and real Firebase flow in one 195-line effect  ·  M effort

Lines 37-149: a single `useEffect` that (1) checks for a mock cookie in dev, (2) bails if no auth, (3) sets up a 3s hard timeout, (4) subscribes to `onAuthStateChanged`, (5) force-refreshes the token, (6) sets role, (7) syncs a cookie, (8) debounces a `/api/auth/sync` call, (9) handles errors with multiple fallback paths. Split into `useMockAuthSession()`, `useFirebaseAuthSession()`, `useAuthBootstrap()`.

#### `arch-11` — Any-typed error catches in 12+ files defeat the strict TS posture  ·  S effort

Add `lib/errors.ts` helper: `export const asError = (e: unknown): Error => e instanceof Error ? e : new Error(String(e))`. Replace all `catch (err: any)` with `catch (err: unknown)` and call `asError(err)`.

```ts
try { await fetch(url); } catch (err) {
  const message = asError(err).message;
  reportSessionError(message, 'HIGH', sessionId);
}
```

### Design system

#### `DS-04` — Radius token system is half-applied: 4 different ways to spell pill  ·  S effort

Tailwind config defines `radius.pill: 9999px`, but `rounded-pill` is used only 3 times while `rounded-[9999px]` appears 24× and `rounded-full` 248×. Pick one: migrate all `rounded-[9999px]` → `rounded-pill` and all pill-shaped `rounded-full` → `rounded-pill`, or delete `radius.pill` and standardize on `rounded-full`. Remove the duplicate `--radius-md` CSS var.

#### `DS-05` — Five identical not-found shells should be a single component or `@apply` utility  ·  S effort

`flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500 bg-surface/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl max-w-lg mx-auto shadow-2xl shadow-black/50` — copy-pasted 5×, plus a near-identical 6th in `error.tsx`. Extract a `NotFoundShell` component. Use `shadow-elevated` (already a token).

#### `DS-06` — Long, unreadable button class strings that bypass the cva Button primitive  ·  M effort

Login L249 has a 320-char class string on a submit button. `login/host/page.tsx:186` has a similar 300-char string. Extend `buttonVariants` with a new size `hero` (`h-16 rounded-2xl px-8 font-ui uppercase tracking-tighter`) and replace the three 250+ char class strings with `Button variant=default size=hero`.

#### `DS-07` — Typography drift: 51 arbitrary `tracking-[0.Xem]` values where tokens exist  ·  S effort

5 magic numbers for tracking in 11 files. Add `--tracking-tight`, `--tracking-tight-2`, `--tracking-wide`, `--tracking-wider`, `--tracking-widest`, `--tracking-display` to `@theme` in `globals.css`. Replace all `tracking-[0.22em]` with `tracking-widest`, etc.

#### `DS-09` — Dark-mode treatment inconsistent: white/alpha colors leak on light surfaces  ·  M effort

231 occurrences of `bg-white/`, `text-white/`, `border-white/` (alpha white) without `dark:` variant. Define a neutral alpha family in `@theme` using `light-dark()`. The Tailwind v4 native `light-dark()` function pairs perfectly with the existing data-theme strategy.

#### `DS-10` — Focus-ring pattern is inconsistent across inputs, buttons, and links  ·  S effort

3 focus-ring styles, 3 ring colors, 2 mechanisms (outline vs ring). Standardize on `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`.

#### `DS-11` — `!important` usage concentrated in 3 files  ·  S effort

8 `!important` declarations: 1 legitimate (globals.css L301, suppress transitions on first paint), 4 sidebar width (should be inline style or component-owned), 2 legitimate navbar reduced-motion, 1 suspicious (`margin-left: 0 !important;` in `VoiceControlsBar.tsx:120`).

### Type safety

#### `TS-05` — Non-null assertions on array/lookup results (~20 sites)  ·  S effort

`AVATAR_PRESETS[0]!`, `handles[i % handles.length]!`, `dataRef.current!` chained, `focusable[0]!`, `milestones[0..2]!`, `link.children!.length`, `sessionResult!.id`, `points[points.length-1]!.x`. With `noUncheckedIndexedAccess: true`, these are exactly the callsites the strict flag was meant to catch.

```ts
// host/appointments/page.tsx
const handle = handles[i % handles.length];
const service = services[i % services.length];
if (!handle || !service) continue;
```

#### `TS-06` — Form schemas defined but not used to type `useForm`  ·  S effort

`ScholarshipForm.tsx:43` and login/signup pages define Zod schemas and pass to `zodResolver` but the inferred type and the `useForm` generic are not aligned. Use `useForm<z.infer<typeof schema>>`. Centralize in `src/lib/schemas/`.

#### `TS-07` — `catch (err: any)` / `catch (error: any)` (8 sites)  ·  S effort

`api/admin/error-logs:97`, `admin/users:112`, `livekit/webhook:60`, `error/report:102`, `signup:89`, `PackageCheckout:126`, `SessionRoom:142`, `facilitator:95`. Drop the `: any` annotation.

```ts
// utils/error.ts
export function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
```

#### `TS-11` — `useState<null>` / `Record<string, unknown>` — discriminable unions missed  ·  M effort

35 `useState<T | null>(null)` calls; `Record<string, unknown>` in `AnalyticsTracker.tsx:7`. Introduce `type AsyncState<T> = {kind:'loading'} | {kind:'error', err:Error} | {kind:'data', data:T}` in `src/lib/async-state.ts`. Replace `loading + error + data` trios.

#### `TS-12` — `tsconfig` strictness gap: `middleware.ts` excluded  ·  S effort

Root `tsconfig.json` `"exclude": [..., "apps/web/src/middleware.ts"]` — `middleware.ts` is excluded from type-checking entirely. The file enforcing auth on every protected route is not type-checked. Remove the exclusion; delete the `.bak`; optionally enable `noImplicitOverride` and `noFallthroughCasesInSwitch`.

### Next.js App Router

#### `N4` — Static marketing pages have no `generateMetadata`  ·  S effort

Only `services/[slug]/page.tsx` and `join/[sessionId]/page.tsx` define `generateMetadata`. All other 51 page.tsx files rely on the root layout's default metadata (single title "H.I.P.S. Foundation Platform"). Add a static `export const metadata: Metadata = { title, description, openGraph, ... }` block in each page module — 5-line change per file, 9 marketing pages.

#### `N8` — Layout chrome duplicated across (admin), dashboard, facilitator, host  ·  M effort

All four layouts re-import and render `<DashboardShell>`. `host/layout.tsx` independently hand-rolls a sidebar (lines 5-58) that largely mirrors the same DashboardShell chrome. Role arrays are repeated as string literals across files. Move shared sidebar chrome into a single `AppShell` component. Centralise role arrays in `lib/roles`. Consider nesting a `/(console)` route group.

#### `N9` — `loading.tsx` / `error.tsx` coverage gaps in 14 routes  ·  S effort

14 routes have a `page.tsx` but no sibling `error.tsx`. `/app/host` has no `not-found.tsx`. `(auth)` has no `not-found.tsx`. Add a single shared `<ErrorState/>` + `<LoadingSkeleton/>` pair as components and create `error.tsx` / `loading.tsx` in each missing route.

#### `N12` — `useSWRData` polling pattern duplicates server-fetch logic and skips Next 15 cache semantics  ·  M effort

Four pages (dashboard, facilitator/page, facilitator/queue/page, host/dashboard/page) re-implement the same pattern: `useEffect/setInterval` + `fetch` + manual token retrieval. Wrap all polling in a single `usePolledFetch` hook. Mark all such pages with `export const dynamic = 'force-dynamic'`.

### Performance & a11y

#### `PERF-3` — Stripe `Elements` / `loadStripe` imported statically in checkout pages  ·  S effort

`checkout/[sessionId]/page.tsx:4-5` and `DonateCheckoutClient.tsx:5-6` static-import Stripe. ~80KB gz + Elements ~50KB lands in the initial bundle for any visit to `/checkout/[sessionId]`. Move into a small `PaymentClient.tsx` wrapper, then `dynamic()` import from the page with `ssr: false`.

#### `PERF-4` — `next/image` in home hero / Navbar logo is shipped at 220x220 with no `sizes` attribute  ·  S effort

`Navbar.tsx:276-283` Image with no `sizes`, no `priority`. The 4 home-page feature images mount simultaneously (lines 489, 511, 530 do not have `priority`). Add `sizes="(max-width: 768px) 80px, 220px"` and `priority` on the Navbar logo. Render only the active tab image, or `loading="lazy"` the rest.

#### `PERF-5` — Loading skeletons missing on long admin / dashboard / sessions routes  ·  S effort

Only 8 `loading.tsx` files exist. None under `/dashboard/*`, `/host/*`, `/facilitator/*`, `/admin/*`, `/checkout/[sessionId]/*`, `/book`, `/opportunities`, `/organizations`, `/donate`, `/crisis`, `/compliance`, `/host`. Add co-located `loading.tsx` skeletons to the heavy routes (use the existing `ui/skeleton.tsx` primitive). Wrap `(admin)` and dashboard route groups with an `<ErrorBoundary>` in their `layout.tsx`.

#### `A11Y-3` — Sheet/dialog components lack focus return to trigger and rely on Radix defaults  ·  S effort

`sheet.tsx:55-74` wraps Radix Dialog primitive. `SheetTitle` and `SheetDescription` are imported and not required — sheets opened without a title render with an unlabelled dialog. Either require `SheetTitle` to be a non-empty string at the type level, or default `SheetContent` to render a hidden `<SheetTitle>` derived from a required `title` prop. Audit icon-only `SheetTrigger` usages and add `aria-labels`.

#### `A11Y-4` — Color-only success/error feedback in forms and toasts  ·  S effort

`OrganizationIntakeForm.tsx:90-95` success state uses `bg-emerald-50` + `text-emerald-600` + Check icon (color-only). `ToastProvider.tsx` maps to sonner but only the icon and color carry meaning — no `role=status`, no `aria-live` on the rendered Toaster. Add visible text labels ("Success:" / "Error:") and ensure error variants are `aria-live=assertive`.

#### `A11Y-5` — Heading hierarchy skips  ·  M effort

`OrganizationIntakeForm.tsx:108` renders `<h4>` for cards inside a section that has no `h2` or `h3` above. Similar in `TestimonialCarousel`, `about/page.tsx`. WCAG 1.3.1 + axe-core flag heading-order violations. Audit each top-level page route for an `h1` and ensure the next heading is `h2`. Convert stray `<h4>` cards to `<h3>` or wrap them in a section with an `h2`.

#### `QUAL-4` — Mixed locale handling  ·  S effort

`CheckoutShell.tsx:9` hardcodes `'en-US'` in `Intl.NumberFormat`. `useCountUp.ts:25` same. `facilitator/page.tsx:203` uses `new Date(s.startsAt).toLocaleString()` (browser locale, no options) while dashboard, admin, scholarship pages use `date-fns format()`. Pick a single `src/lib/format.ts` module exporting `formatCurrency(cents)`, `formatDateTime(d)`, `formatTime(d)`.

#### `QUAL-5` — Duplicate/conflicting middleware files (middleware.ts, .bak, proxy.ts)  ·  S effort

Three parallel files: `src/middleware.ts` (canonical), `src/middleware.ts.bak` (leftover), `src/proxy.ts` (mirrors middleware logic). Decide on one mechanism and delete the others.

## P3 — Low (6 findings)

#### `DS-08` — Marketing content-width hard-coded as `max-w-[1200px]` 16 times; token `maxWidth.content` exists but is unused  ·  S effort

`tailwind.config.ts:112` declares `maxWidth.content: 1200px`, but `max-w-content` is not used anywhere. Search-replace `max-w-[1200px]` → `max-w-content` (16 sites). Verify in Tailwind v4 the config token flows into the generated utility.

#### `DS-12` — `alert.tsx` uses raw template-literal class concatenation instead of `cn()`; empty/error-state lack `className` prop  ·  S effort

14 of 17 ui primitives use `cn()`. `alert.tsx:19,33,45` uses raw template-literal class string concatenation. Convert to `cn(...${variantClasses}, className)`. Add a `className` prop to `empty-state` and `error-state`.

#### `TS-09` — Prop type duplication with `packages/types`  ·  M effort

`src/types/api.ts` defines `Service`, `AdminStats` locally; `auth-utils.ts:5-9` defines `verifyRequestAuth` return type inline `{ uid: string; role: string | null }` instead of importing `AuthUser` from `@hips/types`. Move `DashboardDataSchema`, `Service`, and other client-side mirror types into `packages/types/src` (or a new `packages/contracts/src`).

#### `TS-10` — `forwardRef` without generic polymorphism  ·  S effort

`card.tsx`, `sheet.tsx`, `dialog/alert.tsx` use `React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>`. For the 1-2 components that need polymorphism (Button, Link wrappers), introduce a generic `PolymorphicComponentProp<T, As>` helper from `src/lib/polymorphic.ts`.

#### `arch-12` — `Sidebar` primitive is 780 lines but only one consumer  ·  M effort

`components/ui/sidebar.tsx` is 780 lines, exports 14+ symbols. `components/app-sidebar.tsx` (266 lines) is the only consumer. Move `app-sidebar.tsx` and `sidebar-user-footer.tsx` into a single `components/dashboard/sidebar/` feature folder. Delete dead exports from `ui/sidebar.tsx` (e.g. `SidebarRail`, `SidebarTrigger` if unused).

#### `N10` — Duplicate `'use client'` directives in three `error.tsx` files  ·  S effort

`error.tsx:1-2` has both `'use client'` and `"use client"` — single and double quoted. Several others (lobby, dashboard, book, etc.) have the same duplication. Delete the redundant line.

---

## Top 10 prioritized actions (this week)

| # | Action | Severity | Effort | Impact | Finding |
|---|---|---|---|---|---|
| 1 | Delete 3 of 4 middleware/proxy files; keep `src/middleware.ts` | P0 | S | high | arch-05 |
| 2 | Move host access code check to a server route; drop `NEXT_PUBLIC_` | P0 | S | high | QUAL-1 |
| 3 | Add Zod schemas for Firestore reads in 10 API routes; replace `!`/`as` | P0 | M | high | TS-03 |
| 4 | Delete `src/proxy.ts` and `middleware.ts.bak`; canonicalize | P0 | S | medium | N3 |
| 5 | Rename `host/AvailabilityCalendar` vs `booking/AvailabilityCalendar`; hoist types to `lib/availability.ts` | P1 | S | high | arch-04 |
| 6 | Fix `from-#173B57` → `from-[#173B57]` and `bg-Gold-500` → `bg-accent` | P1 | S | high | DS-01 |
| 7 | Fix `text-text-muted0` / `bg-destructive0` / `bg-bg-subtle` typos | P1 | S | high | DS-02 |
| 8 | Drop `'use client'` from 5 layouts; move AuthGuard to server/middleware | P1 | S | high | N2 |
| 9 | Drop `?token=` URL fallback in `/session/[id]`; always fetch fresh token | P1 | S | high | N11 |
| 10 | Add skip-to-main-content link + `id="main"` to all `<main>` elements | P1 | S | high | A11Y-2 |

---

## Quick wins (27 findings — ≤M effort, ≥P1 impact)

The top 10 plus:

- `arch-02` — Extract `<FeatureTabs>` + `<FeatureMockupPanel>` from `app/page.tsx` (also fixes N1 client/server boundary)
- `arch-03` — Unify avatar trees
- `arch-06` — Delete `app/components/{session,avatar}/` barrels
- `DS-03` — Replace hard-coded hex/rgba in demo + avatar surfaces with tokens
- `TS-01` — Replace 29 `: any`/`as any` sites with concrete types
- `TS-02` — Fix 8 `as unknown as X` double-casts at LiveKit boundary
- `TS-04` — Add Zod parse to ~20 client `.json()` calls
- `TS-08` — Add `jose` JWT verification + Zod claims schema to middleware
- `N1` — Extract `<FeatureTabs>` from home page → server component
- `N5` — Add `import 'server-only'` to `firebase-admin.ts` / `prisma.ts`
- `N6` — Make dashboard a server component
- `N7` — Add `dynamic = 'force-dynamic'` to `/api/services` and `/api/session/[id]/flag`
- `PERF-1` — `dynamic()` import SessionRoom
- `PERF-2` — Add `useReducedMotion` guard to 3D `useFrame` loops
- `A11Y-1` — Build `FormField` wrapper to wire `aria-invalid`/`aria-describedby`
- `arch-04` — Split AvailabilityCalendar names + shared types
- `arch-05` — Delete 3 middleware files
- `arch-06` — Remove `app/components/` barrels
- `QUAL-2` — Replace 37 `console.log` with structured `logger`
- `QUAL-3` — Remove 4 `eslint-disable react-hooks/exhaustive-deps` via `useEvent` ref pattern

## Long-term investments (1 finding, L/XL effort)

- `arch-01` — Split `SessionRoom.tsx` (772 lines, 11 `useEffect`s) into `useSessionToken`, `useMediaPermission`, `useLiveKitConnection`, `useMicrophonePublication`, `useHandRaiseDataChannel`, `useSessionTimer` hooks. The single `SessionContent` composer then becomes a thin shell.

---

## Per-lens summaries

### Component architecture
> The H.I.P.S. web app shows a serious mismatch between its stated conventions (shadcn primitives, SWR, RHF+Zod, feature folders) and its actual implementation. The codebase is dominated by a small number of very large client components — `SessionRoom.tsx` (772 lines, 11 `useEffect`s, 5 `useState`s, 8 LiveKit effects, 6 `useCallback`s), the home page (554 lines, 4 inline-defined accordions + tabbed mockup gallery), and the dashboard pages — that mix data fetching, business logic, and presentation. Multiple parallel middleware/proxy files suggest ongoing migration. Two barrel files live in `app/components/{avatar,session}`, defeating Next.js App Router colocation and likely blocking route-level code splitting. Prop design is consistent (typed interface per component) but the session UI uses optional-everything callbacks that effectively make the prop list boolean-OR-null, and a duplicated `AvailabilityCalendar` exists across `host/` and `booking/`. Forms inconsistently mix RHF+Zod (`ScholarshipForm`) with raw `useState` (`OrganizationIntakeForm`).

### Design system
> Design-system audit of the H.I.P.S. Foundation Next.js 15 / Tailwind v4 web app. Token system is well-conceived (dual-theme via `[data-theme]`, CSS-variable cascade, `@theme` block, shadcn aliases), but enforcement breaks down at the call-site: invalid token names (`text-text-muted0`, `bg-destructive0`), invalid Tailwind class syntax (`from-#173B57`, `bg-Gold-500`), hard-coded hex/rgba in demo/avatar surfaces, and a token (`rounded-pill` / `rounded-[9999px]`) that is duplicated and bypassed by `rounded-full`. The 17 UI primitives and 92 arbitrary `min-h` values suggest no shared component for elevated cards, hero CTAs, or marketing layouts. The `.hips-nav` component-scoped CSS is sound, but token leakage into 5 not-found files (identical 2.5rem shell) is a clear `@apply` candidate.

### Type safety
> TypeScript type-safety audit of the Next.js web app (251 `.tsx` / 128 `.ts` files, ~36.7K LOC). Root tsconfig already enables `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`, and most schemas use Zod — so the remaining surface is small and concentrated in 3 areas: (1) `as any` / `as unknown as X` double-casts at the LiveKit/Firebase boundary, (2) untyped Firestore `.data()!` reads in API routes, and (3) unsafe `.json()` consumption in client components with no Zod parse. Counts: 29 `: any`, 8 double-casts, 10 untyped Firestore sites, ~20 unparsed `.json()`.

### Next.js App Router
> The H.I.P.S. web app demonstrates strong Next.js 15 App Router adoption in some areas (proper async params in dynamic routes, `generateMetadata` on the `services/[slug]` route, route group usage, server-side data fetching in services, good loading/error boundary coverage for primary flows) but suffers from systemic `'use client'` over-application and middleware duplication. The root layout is a server component correctly using `next/font/google`, but the home, packages, and crisis pages are marked client only to manage a single `useState` tab, dramatically inflating the initial JS bundle. Multiple layouts are stamped `'use client'` purely to host AuthGuard. There are two parallel middleware files (`middleware.ts` and `src/proxy.ts`) plus a `.bak` file checked into source. The dashboard page sets `'use client'` + `force-dynamic` but performs client-side SWR fetching of data the server could resolve. Many API route handlers are solid (Zod-validated, auth-checked), but `/api/session/[id]/flag` and `/api/services` entirely skip auth, and many lack route segment config. The most impactful fixes are: (1) split client interactivity out of the home page so it becomes a server component, (2) delete `src/proxy.ts` and `middleware.ts.bak`, (3) add auth + route segment config to `/api/services`, and (4) wrap AuthGuard in a server layout.

### Performance & accessibility
> The H.I.P.S. Foundation web app is a 53-page Next.js 15.2.4 / React 18.3.1 App Router monorepo with sensible defaults (loading.tsx on most long routes, `dynamic()` for 3D/Stripe/SessionRoom, `next/image` with priority/quality, ErrorBoundary on session page, ESLint disables with comments) but it carries a few sharp edges: a hardcoded production fallback host access code shipping to the client bundle, react-hook-form inputs that never link `aria-describedby`/`aria-invalid`, `SessionRoom` pulling the full LiveKit + R3F + voice-mask + session-UI graph eagerly via static import in `app/session/[id]/page.tsx` (defeating the lazy test-session split), 3D scenes (`SanctuaryParticles`, `AbstractAvatar`, `SanctuaryScene`) using per-frame `useFrame` loops that mutate buffer attributes without respecting `prefers-reduced-motion`, locale-pinned `'en-US'` formatters and date-fns usage mixed inconsistently, the 7 eslint-disable comments masking hook-deps warnings, and 37 `console.log` calls in API routes. The most urgent issues are the security/code-quality ones; the perf wins are concentrated in 3D and the SessionRoom import chain.

---

## Suggested execution order

1. **Day 1:** Items 1-4 (P0 fixes — security/correctness, all S effort)
2. **Day 2-3:** Items 5-10 (P1 quick wins — most are S effort)
3. **Week 1:** Round out the 27 quick wins (TS-01, TS-02, TS-04, TS-08, N1, N5, N6, N7, PERF-1, PERF-2, A11Y-1, etc.)
4. **Month 1:** Three sessions to (a) split `SessionRoom` (arch-01), (b) extract shared `FeatureTabs`/`FeatureMockupPanel` (arch-02), (c) build the design-system enforcement grep + `FormField` primitive
5. **Quarter:** Unify avatar trees (arch-03), rebuild `AppShell` route group (N8), ship a single `lib/format.ts` formatter (QUAL-4), wire the `tsconfig` strictness gap (TS-12)

---

## Cross-cutting category index

| Category | Count | Finding IDs |
|---|---|---|
| **Code quality** | 56 | arch-* (12) · DS-* (10) · TS-* (12) · N-* (10) · QUAL-* (5) · A11Y-4 · A11Y-5 · PERF-2 · PERF-5 · N9 |
| **Performance** | 3 | PERF-1, PERF-3, PERF-4 |
| **Accessibility** | 3 | A11Y-1, A11Y-2, A11Y-3 |
| **Security** | 1 | N11 (LiveKit token in URL) |

## Severity index

| Severity | Count | Finding IDs |
|---|---|---|
| **P0** | 4 | arch-05, QUAL-1, TS-03, N3 |
| **P1** | 24 | arch-01, arch-02, arch-03, arch-04, arch-06, DS-01, DS-02, DS-03, TS-01, TS-02, TS-04, TS-08, N1, N2, N5, N6, N7, N11, PERF-1, PERF-2, A11Y-1, A11Y-2, QUAL-2, QUAL-3 |
| **P2** | 29 | arch-07..11, DS-04..11 (8), TS-05..12 (7), N4, N8, N9, N12, PERF-3, PERF-4, PERF-5, A11Y-3, A11Y-4, A11Y-5, QUAL-4, QUAL-5 |
| **P3** | 6 | arch-12, DS-08, DS-12, TS-09, TS-10, N10 |

---

## What's working well (preserve)

- **Strict TS posture** — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, Zod at boundaries, RHF+Zod schemas
- **Tailwind v4 token foundation** — `[data-theme]` cascade, `--color-primary`/`--color-bg`/`--shadow-*`, shadcn-style cva Button
- **App Router adoption** — proper async `params` in dynamic routes, `generateMetadata` on `services/[slug]`, route groups, server-side data fetching in services
- **Error/loading boundary coverage** for primary flows (8 loading.tsx files; session route has ErrorBoundary)
- **Memoization habits** — 39 `useMemo`, 87 `useCallback`; lint hygiene is clean (0 `@ts-ignore`, 0 `@ts-expect-error`)

---

*Generated by the `frontend-audit-five-dimensions` workflow. Full structured output preserved at `/private/tmp/claude-501/-Users-mimac-WORK-ChromaWork-hips-hsss/40e305fd-4a1b-4da1-b3f8-dbf534e18d9a/tasks/wpiuuzzu9.output`.*
