# Avatar Feature Audit — Structured Gap List

**Date:** 2026-06-17
**Scope:** Procedural avatar system in /Users/mimac/WORK/ChromaWork/hips-hsss
**Method:** 3 parallel subagent audits (functionality, UI/UX, security/performance/a11y) against a shared feature inventory
**Source findings:** 24 functionality + 31 UI/UX + 32 security/perf/a11y = 87 raw findings, consolidated below to 45 unique issues after de-duplication

> **Note on scope:** The audit prompt asked for an upload/crop avatar creator. That feature does **not** exist in this codebase — avatars are entirely procedural (Three.js / R3F generated 3D meshes + initials fallbacks). No file upload, no Firebase Storage path for avatars, no `avatarUrl` field in Prisma. The audit was adapted to the actual procedural system and the same three lenses (functionality, UI/UX, security/perf/a11y) were applied.

---

## Summary

| Severity | Count | Examples |
|---|---|---|
| **CRITICAL** | 5 | LiveKit metadata privilege escalation, style off-by-one, color picker not honored, palette/gesture naming collisions, dead Phase 5 system |
| **MAJOR** | 18 | Dead UI (Shuffle, AvatarSelectorModal), context-loss recovery broken, hardcoded fake testimonials, missing localStorage hydration, no focus trap, no useReducedMotion in VirtualOffice, post-processing on by default |
| **MINOR** | 22 | Polish, focus rings, hover states, aria-live, loading skeletons, console cleanups |

### Cross-cutting themes
1. **Two parallel avatar systems** — Phase 5 (`/app/components/avatar/`) is dead code never imported by live-session components. The live system is VirtualOfficeAvatar. Both share palette and gesture names but assign different values. Pick one and delete the other. (CRITICAL)
2. **The user's color picker never reaches the renderer** — AvatarSelectorModal writes a raw hex to `sessionStorage["hips-avatar-color"]`; nothing reads it. The renderer trusts the server-derived `avatar.palette`. (CRITICAL)
3. **The "shuffle avatar" button is purely cosmetic** — it updates a local `avatarSeed` for the lobby initials preview, but does not re-issue the LiveKit token, so the actual session avatar is unchanged. Misleading UX. (MAJOR)
4. **Host avatar settings are localStorage-only** — the setup page text says "settings apply to all sessions" but the implementation is per-device. Multi-device hosts lose all settings. (MAJOR)
5. **Hardcoded fake testimonials** in TrustStrip (`AJ, KL, MR, SP, TC` + a "Marcus T." quote) presented as real social proof with no placeholder indicator. (MAJOR)

---

## CRITICAL

### CRIT-1 — Privilege escalation risk via LiveKit participant metadata
- **File:** `apps/web/src/components/session/AvatarCanvas.tsx:176-195`
- **Category:** Security
- **Issue:** AvatarCanvas reads `role` (FACILITATOR / ADMIN / SUPER_ADMIN) from `participant.metadata` (a writable LiveKit room attribute) and uses it to render the host "crown" badge. The code comment says "Commerce DB is authoritative" but the comment is the only safeguard. Any future code that uses `isHost` for an authorization decision would inherit a client-trust assumption.
- **Evidence:** AvatarCanvas.tsx:181 `const role = JSON.parse(participant.metadata ?? "{}").role as ...`. Currently used only for the badge; no authz decision today.
- **Fix:** Add a lint rule / code comment forbidding `isHost` in any authz path. Pass role as a server-issued flag in the token response instead of reading LiveKit metadata. Add a server-side role check before any future privilege-gated action.

### CRIT-2 — Style off-by-one: makeAvatar returns 1–12, renderer keys 0–11
- **Files:**
  - `apps/web/src/app/api/livekit/token/route.ts:23` (`style: (first % 12) + 1`)
  - `services/session/src/livekit-token-service.ts:33`
  - `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:12, 28-41, 87`
  - `apps/web/src/components/session/AvatarCanvas.tsx:192`
- **Category:** Functional
- **Issue:** makeAvatar emits `style` in the range 1–12, but `avatarStyles` is a 0–11 indexed table and the lookup is `avatarStyles[(styleIndex % 12)]`. Every local participant gets a +1 style — they are never assigned style 0 (round), and style 12 wraps to 0 only by accident. Off-by-one has been present from inception but is masked by the similarity of the 12 silhouettes.
- **Fix:** Standardize on 0–11 in both token issuers and the type: `style: first % 12`. Update `AvatarProfile.style` to `0 | 1 | ... | 11`. Add a unit test asserting `style ∈ [0, 11]`.

### CRIT-3 — AvatarSelectorModal color is silently ignored by the live renderer
- **Files:**
  - `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:5, 74`
  - `apps/web/src/components/session/SessionRoom.tsx:776`
  - `apps/web/src/components/session/AvatarCanvas.tsx:170-172`
- **Category:** Functional / UI/UX
- **Issue:** The pre-join modal presents 6 colors, stores the selected hex to `sessionStorage["hips-avatar-color"]`, and tells the user their color is locked. But `SessionRoom` passes the server-derived `avatar` (palette name) into `AvatarCanvas`, which maps it via `VirtualOfficeAvatar.paletteColors`. The sessionStorage value is read by nothing. The user's choice has zero effect on what other participants see.
- **Fix:** Either (a) read `sessionStorage["hips-avatar-color"]` in `SessionRoom`, decode it to a palette id, and override `avatar.palette` for the local participant only; or (b) rename the modal to "Lobby handle color" and make the UX honest about it being lobby-only; or (c) delete the modal.

### CRIT-4 — Palette name "forest" collides between systems with different hex values
- **Files:**
  - `apps/web/src/app/components/avatar/AvatarPalettes.ts:15-40` (Phase 5, dead code)
  - `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:44-48` (production)
  - `apps/web/src/app/api/livekit/token/route.ts:11`
  - `packages/types/src/session.ts` (`AvatarPalette = "coastal" | "sunrise" | "forest"`)
- **Category:** Functional / consistency
- **Issue:** Phase 5 palettes are named `midnight / forest / sunset`; production palettes are `coastal / sunrise / forest`. The shared name `forest` maps to `#14532D/#166534/#22C55E` in Phase 5 but `#10b981` in VirtualOffice. If anyone wires the Phase 5 components to read from the token (or copies the constant tables around), the avatar will silently render a completely different color for the same name. The live runtime path is consistent today only because VirtualOffice owns the rendering.
- **Fix:** Delete `/apps/web/src/app/components/avatar/` in full (see MAJ-9 — it is dead code). If a Phase 5 system is later required, rename its palette ids to `coastal / sunrise / forest` and align hex values to VirtualOffice as the single source of truth.

### CRIT-5 — Gesture name mismatch between systems
- **Files:**
  - `apps/web/src/app/components/avatar/GesturePresets.ts:18-74` (Phase 5, dead code: `idle / listening / speaking / thinking / agreeing`)
  - `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:14, 50-56` (production: `idle / nodding / raised-hand / thinking / applause`)
  - `packages/types/src/session.ts:8-13` (`AvatarGesture = idle | nodding | raised-hand | thinking | applause`)
- **Category:** Functional / consistency
- **Issue:** Two gesture vocabularies in the codebase. If a Phase 5 consumer ever receives a token-derived gesture, the lookup at `Avatar.tsx:73` (`GESTURE_PRESETS.find(g => g.id === gesture)`) returns undefined for `nodding`, `raised-hand`, `applause` and silently falls back to the hard-coded `idle` object. Latent bug — the Phase 5 system is currently dead, so no live code is affected.
- **Fix:** Delete Phase 5 system entirely. If preserved for documentation, mark `GesturePresets.ts` as `DEPRECATED` and add a header comment pointing to VirtualOfficeAvatar.

---

## MAJOR

### MAJ-1 — Dead `gesture` prop in token; "nodding" / "thinking" / "applause" branches unreachable
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:25`, `apps/web/src/components/session/SessionRoom.tsx:294`, `apps/web/src/components/session/AvatarCanvas.tsx:193`, `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:127-156`
- **Issue:** Token always emits `gesture: "idle"`. SessionRoom hard-codes `gesture: "idle"`. AvatarCanvas hard-codes non-local participants to `"idle"`. The gesture animation branches for nodding, thinking, applause are never reached. The "raised-hand" feature is implemented via a separate `raisedHand` Set driven by the LiveKit data channel (SessionRoom.tsx:510-516), not the gesture field.
- **Fix:** Either add LiveKit data-channel controls in VoiceControlsBar to set per-participant gestures (applause on request, thinking on long hold, nodding on facilitator prompt), or remove the unreachable gesture branches and the gesture prop entirely.

### MAJ-2 — Avatar derivation differs between route.ts and livekit-token-service.ts
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:18-28, 193`, `services/session/src/livekit-token-service.ts:28-38, 53`
- **Issue:** The route handler derives `anonymousIdentity` from HMAC-SHA256(uid) — deterministic, so the same user always gets the same avatar. The session service uses `randomUUID()` — non-deterministic, so the same user gets a different avatar on every re-issue. If the service is ever called for a reconnect, the participant's avatar changes mid-session, which other participants will see.
- **Fix:** In `livekit-token-service.ts:53`, replace `randomUUID()` with the same HMAC derivation: `createHmac('sha256', apiSecret).update(sessionId + ':' + userId).digest('hex')`. Add a regression test asserting same input → same avatar.

### MAJ-3 — "Shuffle avatar" button is purely cosmetic
- **Files:** `apps/web/src/components/session-ui/DirectJoinLobby.tsx:60-72`, `apps/web/src/app/join/[sessionId]/DirectJoinClient.tsx:167-169`
- **Issue:** Shuffle calls `setAvatarSeed(crypto.randomUUID())` — it updates only the local initials preview (`avatarSeed.slice(0, 2).toUpperCase()`), not the LiveKit token. The user perceives that they changed their session avatar, but the actual avatar inside the session is locked to the original `anonymousIdentity` from the first token fetch.
- **Fix:** Either re-fetch `/api/livekit/token` in `handleAvatarRefresh` and update `tokenCache / avatarSeed / anonymousIdentity` (consider rate-limit impact, MAJ-4), or relabel the button as "Randomise handle initials" with a tooltip explaining it is preview-only.

### MAJ-4 — Rate limit (20 req/min) vs mount + join double-fetch
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:99-110`, `apps/web/src/app/join/[sessionId]/DirectJoinClient.tsx:60-105`
- **Issue:** The token endpoint is limited to 20 req/IP/60s. DirectJoinClient fetches once on mount and again inside `handleJoin` on cache miss. A user reloading a few times, or a future Shuffle implementation (MAJ-3), can burn through the budget and hit 429 with an opaque error message.
- **Fix:** Add a friendlier 429 UI ("You've joined several sessions — wait 30s and try again"). Optionally raise the limit to 30/min to absorb the double-request and a reconnect.

### MAJ-5 — WebGL context restore is broken; user stuck in audio-only mode
- **Files:** `apps/web/src/components/session/AvatarCanvas.tsx:52-82, 117, 123`
- **Issue:** `WebGLContextHandler` sets `contextLost = true` on `webglcontextlost`, gating `AvatarCanvas` to render `AudioOnlyFallback`. On `webglcontextrestored`, the handler does nothing. Because `contextLost` React state stays `true`, the fallback remains mounted for the rest of the session. The user must refresh to recover.
- **Fix:** In `handleContextRestored`, call `setContextLost(false)`. Also bump a `key` prop on the Canvas on restore to force a clean R3F remount.

### MAJ-6 — Phase 5 `Avatar.tsx` (lazy-loaded) has no error boundary
- **Files:** `apps/web/src/app/components/avatar/Avatar.tsx:29, 114-134`
- **Issue:** `React.lazy` rejections during render propagate to the nearest error boundary, not Suspense. There is no ErrorBoundary wrapping the Suspense. A chunk-load failure (CDN error, 404) crashes the host page. Latent because Phase 5 is unreferenced, but if any future code uses it, this is a crash bug.
- **Fix:** Wrap the Suspense in an ErrorBoundary that renders a static initials fallback. Apply the same pattern to live-session `AvatarCanvas`.

### MAJ-7 — Host avatar setup is localStorage-only; settings lost across devices
- **Files:** `apps/web/src/app/host/avatar-setup/page.tsx:252-265, 287`, `apps/web/src/app/host/practice/page.tsx:17-27`
- **Issue:** The setup page writes to `localStorage["hips-host-avatar"]` and the page text says "Your avatar and voice settings apply to all sessions" — implying cross-device sync. There is no Prisma model, no API endpoint, no backend persistence. A host who switches devices, browsers, or incognito windows loses all of: color, voice preset, semitone shift, reverb level.
- **Fix:** Either (a) add a `HostPreference` Prisma model + POST/PUT/GET endpoints the setup page writes to, falling back to localStorage on error; or (b) rewrite the line 287 copy to "settings apply to all sessions on this device."

### MAJ-8 — Host avatar color doesn't reach the live session
- **Files:** `apps/web/src/app/host/avatar-setup/page.tsx:40-48, 252-261`, `apps/web/src/components/host/AvatarPreviewCanvas.tsx:51`
- **Issue:** The host's chosen color is stored as a free-form hex in localStorage. `AvatarPreviewCanvas` reads it and renders it locally. But `SessionRoom` and the rest of the live-session pipeline read the server-derived `avatar` — the host's localStorage value is never consulted. The color picker is "dead UI" for the live session.
- **Fix:** In `SessionRoom`, read `localStorage["hips-host-avatar"]` and, for the host's local participant, override the color (only when the role is FACILITATOR / ADMIN). Document the precedence: server-derived is the default, host localStorage overrides the local participant's appearance.

### MAJ-9 — Phase 5 avatar system is fully dead code
- **Files:** `/Users/mimac/WORK/ChromaWork/hips-hsss/apps/web/src/app/components/avatar/` (Avatar.tsx, AvatarCanvas.tsx, AvatarStyles.ts, AvatarPalettes.ts, GesturePresets.ts, index.ts)
- **Issue:** `grep -rn "from.*components/avatar"` across the entire codebase returns only self-references inside the folder. No live code consumes any export from this directory. The barrel `index.ts` exports `AVATAR_PALETTES, GESTURE_PRESETS, AVATAR_COMBINATIONS, Avatar, AvatarRing, AvatarConfig, DEFAULT_AVATAR_CONFIG` and they are all unused. Avatar.tsx:80-83 also has a `Math.random()` call inside a `useMemo` whose dependency array doesn't include the random component, so the memoized value changes on every render.
- **Fix:** Delete the entire `/apps/web/src/app/components/avatar/` directory. Resolves CRIT-4, CRIT-5, and MAJ-9 simultaneously.

### MAJ-10 — No focus trap in AvatarSelectorModal
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:17-46, 52-82`
- **Issue:** Initial focus is set on the first color button (line 18-22), but Tab/Shift+Tab are not intercepted. Focus can move outside the dialog to the underlying page. WCAG 2.4.3 + WAI-ARIA Authoring Practices 1.2 for dialogs require focus containment. Sibling content is not marked `aria-hidden` while the modal is open, and the trigger element does not regain focus on close.
- **Fix:** Implement focus containment (e.g. `focus-trap-react` or manual Tab/Shift+Tab wrap), inert siblings via portal + `aria-hidden`, save/restore `document.activeElement` on open/close. Use the click event (not mousedown) for the backdrop close so it fires after button activation.

### MAJ-11 — DirectJoinLobby shows "?? " before load and opaque 2-char initials after
- **Files:** `apps/web/src/components/session-ui/DirectJoinLobby.tsx:60-62`, `apps/web/src/app/join/[sessionId]/DirectJoinClient.tsx:36, 90-94, 167-169`
- **Issue:** When `avatarSeed` is empty, the avatar tile shows the literal string "??". Once loaded, the user sees e.g. "7F" — two chars of an HMAC-SHA256 hash, which looks like a bug. `handleAvatarRefresh` sets `crypto.randomUUID()`, also non-readable.
- **Fix:** Show an animated `animate-pulse` skeleton while loading. When loaded, surface the full handle in an `aria-label` / tooltip, or generate a deterministic friendly nickname (e.g. "Brave Otter").

### MAJ-12 — Two diverged WebGL fallback components
- **Files:** `apps/web/src/components/session-ui/WebGLFallback.tsx:8-35`, `apps/web/src/components/session/AvatarCanvas.tsx:18-35`
- **Issue:** `WebGLFallback` (session-ui) has the "Audio Active" badge + amber hand-raising reassurance. `AudioOnlyFallback` (in AvatarCanvas) lacks both. Users who lose WebGL mid-session get a different message than users who never had it. Icons also differ (Monitor vs Volume2).
- **Fix:** Delete `AudioOnlyFallback` in AvatarCanvas.tsx and import the session-ui WebGLFallback everywhere. Or merge the two UIs.

### MAJ-13 — WebGL fallback has no actionable next steps
- **File:** `apps/web/src/components/session-ui/WebGLFallback.tsx:8-35`
- **Issue:** The fallback says "Your browser does not support WebGL" but offers no CTA, no help link, no list of fixes. Compare with SessionRoom.tsx:561 which shows a "Try Chrome or Edge for full support" toast — the pattern exists but is not surfaced here.
- **Fix:** Add a "What to try" list: enable hardware acceleration, update Chrome/Edge, ask IT to allow WebGL on corporate devices. Link to a help article.

### MAJ-14 — TrustStrip presents hardcoded fake testimonials as real social proof
- **File:** `apps/web/src/components/polish/TrustStrip.tsx:8-15, 219-230`
- **Issue:** Five hardcoded avatar initials (AJ, KL, MR, SP, TC) with hand-picked background colors, plus a "Marcus T." (MT) testimonial quote. The structure (overlapping circles + named testimonial) is the canonical social-proof pattern and is presented in production with no placeholder indicator. No code comment marks these as placeholders.
- **Fix:** Either (a) replace with clearly stylized anonymous silhouette icons and use "Anonymous participants" copy; (b) mark the section as "Sample testimonial" and add a TODO; or (c) move real testimonials into a CMS-backed content collection.

### MAJ-15 — No hydration of host avatar from localStorage on the setup page
- **Files:** `apps/web/src/app/host/avatar-setup/page.tsx:82`, `apps/web/src/app/host/dashboard/page.tsx:99-110`
- **Issue:** The setup page initializes `selectedPreset` to `AVATAR_PRESETS[0]` (Indigo) without checking localStorage. A host who revisits the page sees a fresh Indigo selection with no indication they had previously saved a different color. Practice page reads localStorage correctly; setup page does not.
- **Fix:** Add a `useEffect` on mount that reads `hips-host-avatar` and hydrates `selectedPreset / selectedVoice / customSemitones / reverbLevel`. On the dashboard, add a "Your avatar: [color] [label]" status row.

### MAJ-16 — HMAC-derived initials in DirectJoinLobby leak a stable fingerprint
- **Files:** `apps/web/src/components/session-ui/DirectJoinLobby.tsx:60-61`, `apps/web/src/app/api/livekit/token/route.ts:193`
- **Issue:** DirectJoinLobby displays the first 2 hex characters of `anonymousIdentity` (HMAC-SHA256 of uid+sessionRef) as the user's initials. The HMAC is deterministic per user, so the same user gets the same 2-char initials on every visit, enabling cross-session correlation. The Shuffle button does not help — it changes only local state.
- **Fix:** Generate a session-only handle from `crypto.getRandomValues` stored in component state, or hash the identity client-side and bucket to a stable 2-letter nickname. Do not display any portion of `anonymousIdentity`.

### MAJ-17 — Palette/gesture whitelist missing on the client (DoS via bad token)
- **Files:** `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:44-48, 158-166`, `apps/web/src/components/session/AvatarCanvas.tsx:171`
- **Issue:** `paletteColors[avatar.palette]` returns `undefined` for any unknown palette; that `undefined` is passed to `new Color(undefined)` at VirtualOfficeAvatar.tsx:159, which throws. A compromised or maliciously-issued token can DoS the client by sending `palette: "evil"`. Same risk for gesture name (VirtualOfficeAvatar.tsx:127-156).
- **Fix:** Validate `palette` and `gesture` against the enum at the token boundary and in the renderer, normalizing invalid values to a safe default (`coastal` / `idle`). Apply the same check to `avatar.style` (must be an integer in [0, 11]).

### MAJ-18 — Animations do not pause when document.hidden
- **Files:** `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:93-156`, `apps/web/src/components/session/AvatarCanvas.tsx`
- **Issue:** `useFrame` runs every frame for every avatar with no `document.hidden` check and no frustum culling. Backgrounded tabs and off-screen avatars continue to consume full GPU. For 12 participants this is 720 Hz of Three.js updates.
- **Fix:** Add `if (document.hidden) return` at the top of `useFrame`. Use R3F `frustumCulled` (default) + `Detailed` distances for LOD. For 12+ participants, consider a single `InstancedMesh`.

### MAJ-19 — Post-processing (Bloom + Vignette) is always on
- **File:** `apps/web/src/components/session/AvatarCanvas.tsx:199-207`
- **Issue:** `GuardedEffectComposer` with Bloom and Vignette runs unconditionally. On low-end devices or with 10+ participants, fps drops below 30. No device-tier detection, no toggle.
- **Fix:** Detect device tier via `navigator.hardwareConcurrency` and WebGL renderer string; disable post-processing for low-tier devices or when `participants.length` exceeds a threshold.

### MAJ-20 — useReducedMotion not honored in VirtualOfficeAvatar
- **File:** `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:93-156`
- **Issue:** `AbstractAvatar` uses `useReducedMotion`. `VirtualOfficeAvatar` (the version in active sessions) does not. A vestibular-sensitive user still sees bob, speaking, and gesture animations.
- **Fix:** Import and use `useReducedMotion` in VirtualOfficeAvatar, mirroring `AbstractAvatar.tsx:31, 44-52`.

### MAJ-21 — Accessibility gaps in Phase 5 Avatar and AvatarPreviewCanvas
- **Files:** `apps/web/src/app/components/avatar/Avatar.tsx:91-136`, `apps/web/src/components/host/AvatarPreviewCanvas.tsx:28-60`
- **Issue:** Phase 5 Avatar wrapper has no `role`, no `aria-label`, no `aria-hidden`. Screen readers do not announce it. AvatarPreviewCanvas has `aria-label="3D avatar preview"` but the Canvas element itself lacks `role="img"`, so the label is the only accessible signal. Both should describe the avatar (style + palette + gesture).
- **Fix:** Add `role="img"` and a descriptive `aria-label` (e.g. "Avatar preview, emerald palette, slim silhouette"). For decorative avatars, set `aria-hidden="true"`. On the host setup page, pass the current preset down so the label is dynamic.

### MAJ-22 — AvatarSelectorModal accessibility issues (a11y)
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:52-82`
- **Issue:** Multiple a11y defects beyond the focus trap (MAJ-10): color-button `aria-label` reads the raw hex ("#10B981" → "hash one zero nine B nine eight one"), `aria-pressed` not toggled on selection, no `aria-live` announcement that "Lock avatar" succeeded, click-outside uses `mousedown` which fires before button click.
- **Fix:** Add a friendly name array (Emerald, Gold, Indigo, Amber, Crimson, Cyan) and use that in `aria-label`. Add `aria-pressed` correctly. Add `aria-live="polite"` announcement of save. Use the `click` event with target-equality check for the backdrop.

### MAJ-23 — Accessibility gaps in DirectJoinLobby, TrustStrip, and WebGL fallback
- **Files:** `apps/web/src/components/session-ui/DirectJoinLobby.tsx:58-92`, `apps/web/src/components/polish/TrustStrip.tsx:155-166, 222-226`, `apps/web/src/components/session-ui/WebGLFallback.tsx:8-35`
- **Issue:** DirectJoinLobby initials div has no `role="img"` or `aria-label`; the Shuffle button has no keyboard alternative. TrustStrip initials are `aria-hidden="true"` with no adjacent text labelling them, so the social-proof effect is lost for AT users. WebGL fallback has no `role="status"` or `aria-live="polite"`; users landing on it may not realize they are seeing a degraded view. No opt-in for vestibular-sensitive users to force the audio-avatar path.
- **Fix:** Add `role="img"` + `aria-label="Avatar for [name]"` to initials. Wrap initials and shuffle in a labeled group. Add a "Sample participants" `aria-label` to the TrustStrip avatar flex container. Add `role="status"` + `aria-live="polite"` to the WebGL fallback wrapper. Add a user setting that forces the audio-avatar path for vestibular-sensitive users.

### MAJ-24 — Lock button has no aria-live announcement of save success
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:71-80`
- **Issue:** After `sessionStorage.setItem` and `setOpen(false)`, the modal disappears silently. Screen-reader users may not realize the action succeeded.
- **Fix:** Add `aria-live="polite"` to the button or render a status message that reads "Avatar color saved."

---

## MINOR

### MIN-1 — Dead `locked: true` flag in AvatarProfile
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:26`, `services/session/src/livekit-token-service.ts:36`, `apps/web/src/app/join/[sessionId]/DirectJoinClient.tsx:19`, `apps/web/src/components/session/SessionRoom.tsx:294`
- **Issue:** No rendering code reads `avatar.locked`. It is declared in `DirectJoinClient` and `SessionRoom` types but never checked. The "lock" is implicit (avatar derived from anonymousIdentity, not user-editable mid-session).
- **Fix:** Remove the field from `AvatarProfile` in `packages/types/src/session.ts`, or actually gate a UI (e.g. block an "Edit avatar" button) on `if (!avatar.locked)`.

### MIN-2 — `makeAvatar` duplication between route.ts and service.ts
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:18-28`, `services/session/src/livekit-token-service.ts:28-38`
- **Issue:** Two near-identical implementations. `route.ts:19-20` uses `seed.charCodeAt(0) || 1` to guard against 0; the service does not. A future fix in one file (e.g. changing 12 → 24) will silently desync them.
- **Fix:** Extract `makeAvatar` into `@hips/types` or a shared `@hips/avatar-derivation` package. Add a unit test asserting same seed → same avatar in both.

### MIN-3 — `avatar.style` enum is `number`, not a strict 0-11 literal
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:23`, `packages/types/src/session.ts`
- **Issue:** `AvatarProfile.style` is typed `number` with no range constraint. No Zod schema at the token boundary.
- **Fix:** Tighten the type to `0 | 1 | ... | 11` and validate at the API boundary with Zod.

### MIN-4 — Phase 5 Avatar cleanup leaves PointLight / AmbientLight in the disposed scene
- **File:** `apps/web/src/app/components/avatar/AvatarCanvas.tsx:107-113, 149-157`
- **Issue:** `rimLight` and `ambient` are not individually disposed or removed from the scene. The scene's `dispose()` cascades to geometries/materials but not to lights. Small leak per unmount. Latent because the component is unused.
- **Fix:** Add `scene.remove(rimLight); rimLight.dispose(); scene.remove(ambient); ambient.dispose();` before `renderer.dispose()`.

### MIN-5 — `statechange` listener leak on AudioAvatar unmount
- **File:** `apps/web/src/components/demo/audio-avatar.tsx:54-62, 121-127`
- **Issue:** The `statechange` useEffect reads `audioContextRef.current` at mount and bails if null — so the listener is never registered. The interactive resume listeners (`document.addEventListener('click')`, `'keydown'`) are removed only on first interaction; if the component unmounts before any interaction, they leak for the page lifetime.
- **Fix:** Store the resume listeners in refs, add them inside `setupAudioVisualization` (after the context exists), and remove them in `cleanupAudioVisualization`. Use `{ once: true }` option.

### MIN-6 — AvatarSelectorModal pre-selection ignores stored value
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:7-13, 71-80`
- **Issue:** `useState(colors[0])` always initializes to the first color. The previously selected value from sessionStorage is not pre-highlighted. The "Lock avatar and join" button may overwrite a valid stored value with `colors[0]` if the user opens the modal (impossible per current auto-open logic) or clicks the join button without a new selection. Latent because the modal is dead UI (CRIT-3).
- **Fix:** Initialize from sessionStorage: `useState(() => sessionStorage.getItem('hips-avatar-color') ?? colors[0])`. Only meaningful if CRIT-3 is fixed; otherwise delete the component.

### MIN-7 — Two WebGL fallback texts diverged
- **File:** `apps/web/src/components/session/AvatarCanvas.tsx:18-35` (AudioOnlyFallback), `apps/web/src/components/session-ui/WebGLFallback.tsx:8-35`
- **Issue:** Already covered in MAJ-12; tracked separately as a minor if MAJ-12 is fixed by consolidation.
- **Fix:** Same as MAJ-12.

### MIN-8 — No test coverage for `makeAvatar`
- **Files:** `apps/web/src/app/api/livekit/token/route.ts:18-28`, `services/session/src/livekit-token-service.ts:28-38`
- **Issue:** No `.spec.ts` / `.test.ts` for makeAvatar. The off-by-one (CRIT-2) and the duplication (MIN-2) would both be caught by a unit test.
- **Fix:** Add a test asserting: (a) same input → same output, (b) `style ∈ [0, 11]`, (c) `palette ∈ {coastal, sunrise, forest}`. Mirror in both call sites.

### MIN-9 — Empty / null avatar config could throw on `new Color(undefined)`
- **Files:** `apps/web/src/components/session/AvatarCanvas.tsx:95-101, 170-172`, `apps/web/src/components/session/SessionRoom.tsx:294`, `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx:159`
- **Issue:** `paletteColors[avatar.palette]` returns undefined for unknown palette, then `new Color(undefined)` throws. The token path always returns a valid value, so this is theoretical. A defensive default would harden the renderer.
- **Fix:** `paletteColors[avatar.palette] ?? paletteColors.coastal`.

### MIN-10 — `THREE` import in Avatar.tsx is unused in the wrapper
- **File:** `apps/web/src/app/components/avatar/Avatar.tsx:23`
- **Issue:** `import * as THREE from 'three'` pulls the entire Three.js library into the initial bundle of any page that imports the wrapper, even though `THREE` is only used in the lazy-loaded AvatarCanvas. Latent — wrapper is unused.
- **Fix:** Remove the import. Keep `THREE` only in AvatarCanvas.tsx.

### MIN-11 — `polyCount` documentation in AvatarStyles.ts doesn't match actual geometry
- **File:** `apps/web/src/app/components/avatar/AvatarStyles.ts:14-27`
- **Issue:** `broad` style claims 1560 polys; actual `BoxGeometry(0.7, 0.65, 0.4, 4, 4, 4)` is 192 triangles. `round` claims 892, actual SphereGeometry(0.45, 24, 18) = 864 triangles. Documentation drift.
- **Fix:** Update `polyCount` values to match actual `createAvatarGeometry` parameters, or document as design targets.

### MIN-12 — WebGL context exhaustion risk on pages with multiple R3F canvases
- **Files:** `apps/web/src/components/session/AvatarCanvas.tsx:131-208`, `apps/web/src/components/host/AvatarPreviewCanvas.tsx:28`
- **Issue:** Browsers cap simultaneous WebGL contexts at 8–16. AvatarCanvas (session) and AvatarPreviewCanvas (host setup) each create one. Navigating between them may not release contexts in time.
- **Fix:** Call `gl.getExtension('WEBGL_lose_context').loseContext()` on unmount, or share a single R3F root across surfaces.

### MIN-13 — AudioAvatar `dataArray` reallocated on every mic toggle
- **File:** `apps/web/src/components/demo/audio-avatar.tsx:154`
- **Issue:** `const dataArray = new Uint8Array(analyser.frequencyBinCount)` is allocated inside `setupAudioVisualization`. Each mic toggle allocates a new array.
- **Fix:** Hoist `dataArray` into a ref so it is reused across mount/unmount cycles.

### MIN-14 — Shuffle persistence: local state lost on reconnect
- **File:** `apps/web/src/app/join/[sessionId]/DirectJoinClient.tsx:60-105, 167-169`
- **Issue:** `handleAvatarRefresh` uses `crypto.randomUUID()` with no persistence. After a reconnect, the user gets a new random avatar. Moot if MAJ-3 is fixed (Shuffle becomes a token re-fetch); otherwise persist to `sessionStorage` keyed by `sessionId`.
- **Fix:** Persist shuffled seed to sessionStorage, or refactor per MAJ-3.

### MIN-15 — ProtocolCheckbox not memoized in DirectJoinLobby
- **File:** `apps/web/src/components/session-ui/DirectJoinLobby.tsx:158-191`
- **Issue:** The `ProtocolCheckbox` subcomponent is a plain function. On every keystroke in the display-name input the parent re-renders and recreates three checkboxes.
- **Fix:** Wrap in `React.memo`.

### MIN-16 — Suspense fallback emoji announces as emoji name to screen readers
- **File:** `apps/web/src/app/components/avatar/Avatar.tsx:115-124`
- **Issue:** Suspense fallback renders an emoji with no `aria-label`. Screen readers announce the emoji name, which is at least meaningful, but for a purely decorative loading state prefer `aria-hidden="true"` and `aria-busy="true"` on the wrapper.
- **Fix:** Add `aria-hidden="true"` to the emoji span and `aria-busy="true"` to the wrapper.

### MIN-17 — AvatarSelectorModal color-button aria-labels read raw hex
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:59-68`
- **Issue:** Screen reader announces "#hash one zero nine B nine eight one". Pattern issue (already covered in MAJ-22).
- **Fix:** Use friendly color names (Emerald, Gold, Indigo, Amber, Crimson, Cyan).

### MIN-18 — Sidebar initials: guest vs regular user have different visuals for the same component
- **File:** `apps/web/src/components/sidebar/sidebar-user-footer.tsx:49-63, 113-118, 156-162`
- **Issue:** Guest uses `bg-accent/15 border border-accent/30 text-accent`; regular user uses `bg-accent text-primary`. Subtle inconsistency. Both have no deterministic-per-user color.
- **Fix:** Decide if guest should be visually distinct (icon, "G" badge, "Guest" label) and unify if not. Consider hashing the user id to a stable palette color from the design system.

### MIN-19 — Avatar canvas loading state not announced
- **File:** `apps/web/src/app/components/avatar/Avatar.tsx:85-134`
- **Issue:** Canvas mounting takes 50–150ms. During that window the user sees the `animate-pulse` gradient (lines 102-111) or the Suspense fallback glyph (lines 114-124) with no announcement to assistive tech.
- **Fix:** Add an `aria-live="polite"` region announcing "Loading 3D avatar" while `!isLoaded`, remove on load. Add a faded-circle skeleton matching the avatar footprint.

### MIN-20 — AvatarPreviewCanvas loading: generic Loader2 instead of avatar-shaped skeleton
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:18-28, 295-307`
- **Issue:** Dynamic import + Suspense both show a `Loader2` spinner on `bg-primary`. No skeleton matching the avatar's eventual size and shape.
- **Fix:** Replace the spinner with a low-opacity rounded rectangle in the user's currently-selected color (`animate-pulse`). Optionally add "Preparing preview…" label.

### MIN-21 — Avatar setup Save button: no dirty-state indicator
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:81-89, 502-526`
- **Issue:** Save button is always enabled and always shows "Save Settings" with the same arrow icon, even when nothing has changed since the last save. A host who picks presets but never clicks Save has no warning.
- **Fix:** Add a dirty-state dot on the Save button when any setting has changed since the last save. Disable the button when no changes are pending.

### MIN-22 — Preview Voice button: redundant icon + play glyph, no mic-permission warning
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:467-481`
- **Issue:** Button has both a Mic icon and a `▶` play triangle in the label, conveying "start" in two vocabularies. Clicking requests full mic permission with no advance warning.
- **Fix:** Remove the redundant play triangle; keep the Mic icon. Add a sentence: "Clicking will request microphone access and play your masked voice through your speakers for 3 seconds — use headphones."

### MIN-23 — Custom semitone slider missing live feedback
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:401-435`
- **Issue:** Sliding the value does not auto-trigger Preview Voice. Discontinuous interaction.
- **Fix:** Either add a "Re-preview" button enabled on change, or auto-preview on `pointerup` with a debounce. Make the label say "Pitch Shift (saved setting, click Preview to test)".

### MIN-24 — Reverb radio buttons: redundant uppercase
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:438-463`
- **Issue:** `className` includes `uppercase` and the text content is already lowercase ("low"/"medium"/"high"). Double-uppercase with `tracking-wider` produces very wide letter spacing.
- **Fix:** Pick one — either use title-case labels ("Low"/"Medium"/"High") OR keep lowercase content and remove the `uppercase` class.

### MIN-25 — Save button does not reset to default state
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:250-265, 502-526`
- **Issue:** Save button transitions to a green "Saved!" state but never transitions back. If the user makes no further changes, the green badge stays for the session.
- **Fix:** `setTimeout(() => setSaved(false), 4000)` after save success, with a small fade animation.

### MIN-26 — AudioAvatar hardcoded dark teal + gold, works in dark mode only
- **File:** `apps/web/src/components/demo/audio-avatar.tsx:40-42, 233-234, 308-310`
- **Issue:** Constants `darkTeal = "#0D2E2B"`, `gold = "#D4AF37"`, wrapper `backgroundColor: "#09090b"`. No theme tokens. Component is always dark.
- **Fix:** If the demo room is intentionally always dark, add a comment in the file header. Otherwise, read from CSS variables (`--avatar-body`, `--avatar-accent`). Document the decision in the design system.

### MIN-27 — AvatarSelectorModal: selected-state border is white-on-yellow
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:62-68`
- **Issue:** Selected state is communicated only via a 2px white border, which has very low contrast against bright swatches like `#FBBF24` (amber) or `#06B6D4` (cyan).
- **Fix:** Replace with a high-contrast outline: `ring-2 ring-offset-2 ring-offset-zinc-950`. The `ring-offset` creates a visible gap.

### MIN-28 — AvatarSelectorModal: Lock button `hover:bg-primary` is identical to base state
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:71-80`
- **Issue:** Class includes `hover:bg-primary` which is the same as the base `bg-primary`. Hover effect is invisible. Likely a typo. Also no `focus-visible` ring.
- **Fix:** Change to `hover:bg-primary/90`. Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`.

### MIN-29 — Save button: no aria-live announcement of success
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:502-526`
- **Issue:** Save button transitions to "Saved!" but screen readers may not announce the change (aria-label is static).
- **Fix:** Add `aria-live="polite"` region near the Save button that announces "Avatar settings saved."

### MIN-30 — AvatarSelectorModal: low-contrast selected state on bright swatches
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:62-68`
- **Issue:** Same as MIN-27.
- **Fix:** Same.

### MIN-31 — DemoRoomClient never renders the 3D avatar even on WebGL-capable browsers
- **File:** `apps/web/src/app/demo-room/DemoRoomClient.tsx:362-382`
- **Issue:** DemoRoomClient renders AudioAvatar only — no WebGL detection, no R3F canvas, no VirtualOfficeAvatar. The /demo-room page looks visually different from /session/[id] in a way that is not obvious to users.
- **Fix:** Either (a) add a file-header comment explaining the design choice (AudioAvatar preferred for demo simplicity), or (b) add the same WebGL detection + AvatarCanvas/AbstractAvatar fallback chain that SessionRoom uses.

### MIN-32 — AvatarSelectorModal: no selected-state icon (Host setup page has one)
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:62-68`
- **Issue:** Selected state communicated only by a 2px border. The host/avatar-setup page uses an inner Check icon at line 343-345 — that pattern is the codebase convention.
- **Fix:** Add a Check icon (or filled dot) inside the button when `selected === color`. Place the icon with `text-white drop-shadow` for visibility over any swatch.

### MIN-33 — AvatarSelectorModal: click-outside uses `mousedown` (fires before button click)
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:28-32`
- **Issue:** `mousedown` on the backdrop closes the modal before the inner button's `click` event fires. Could prevent button activation.
- **Fix:** Use the `click` event with target-equality check (`e.target === e.currentTarget`).

### MIN-34 — AvatarSelectorModal: mobile grid may overflow at 375px
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:57-69`
- **Issue:** `grid grid-cols-6 gap-3` inside `p-6` + `max-w-lg` is tight on a 375px viewport. 6 × 48px buttons + 5 × 12px gaps = 348px; content area is 327px. Overflows.
- **Fix:** `grid grid-cols-3 sm:grid-cols-6` so colors stack 2 rows of 3 on phones.

### MIN-35 — AvatarSelectorModal: modal body has no max-height / overflow
- **File:** `apps/web/src/components/session-ui/AvatarSelectorModal.tsx:53-54`
- **Issue:** On short viewports, the modal could push content below the fold without scroll affordance.
- **Fix:** `max-h-[90vh] overflow-y-auto` on the dialog body, or split content into a scrollable section.

### MIN-36 — DirectJoinLobby Shuffle button is 24×24px (below 44px touch target)
- **File:** `apps/web/src/components/session-ui/DirectJoinLobby.tsx:62-72`
- **Issue:** `h-6 w-6` with a 12px icon. Far below the 44px minimum touch target. Also no `focus-visible` ring.
- **Fix:** Increase to `h-9 w-9` (or wrap in a 44px transparent hit area). Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`.

### MIN-37 — Sidebar dropdown trigger duplicates the name in aria-label
- **File:** `apps/web/src/components/sidebar/sidebar-user-footer.tsx:113-118, 156-162, 209-212`
- **Issue:** The trigger button content is the user name; `aria-label` also contains the user name. Screen readers may announce both.
- **Fix:** Replace the trigger button content with an `aria-hidden` span and let `aria-label` carry the only name.

### MIN-38 — AudioAvatar mouth: closed state is an oval, not a slit
- **File:** `apps/web/src/components/demo/audio-avatar.tsx:286-294`
- **Issue:** When amplitude is 0, the mouth is `rx=6, ry=3` — a clearly visible oval. Compare with AbstractAvatar.tsx:119-132 which uses `scaleY: 0.1` (closed slit) → `1.0` (open).
- **Fix:** Change base ellipse to `rx=2, ry=0.5` and scale up with amplitude. Or use a path that morphs from a flat line to an open oval.

### MIN-39 — Keyboard-only avatar setup flow: focus ring missing on "Test Your Setup" card
- **File:** `apps/web/src/app/host/avatar-setup/page.tsx:317-499`
- **Issue:** The flow is already keyboard-friendly (each preset has `tabIndex=0`, Enter/Space handler, `role="radio"`, `aria-checked`). The "Test Your Setup" link has a focus ring but the surrounding card has none.
- **Fix:** Add a visible focus ring on the parent card of the Test Your Setup link.

### MIN-40 — Empty / null avatar config: defensive default missing
- See MIN-9. Listed separately for cross-reference.

### MIN-41 — `// todo` not present anywhere; many gaps lack follow-up tickets
- **Issue:** No TODOs in the avatar code reference the issues in this gap list. Some of the dead code (Phase 5) is the result of a phased development that was never cleaned up.
- **Fix:** Add a top-level `apps/web/docs/AVATAR_TECH_DEBT.md` tracking each of the 45 issues, linked from this audit. Use the gap list as the de-duplicated canonical version.

### MIN-42 — AudioAvatar microphone listeners leaked on unmount
- See MIN-5. Listed separately for cross-reference.

---

## Files Audited (combined)

**Phase 5 (Three.js, dead code):**
- `apps/web/src/app/components/avatar/Avatar.tsx`
- `apps/web/src/app/components/avatar/AvatarCanvas.tsx`
- `apps/web/src/app/components/avatar/AvatarStyles.ts`
- `apps/web/src/app/components/avatar/AvatarPalettes.ts`
- `apps/web/src/app/components/avatar/GesturePresets.ts`
- `apps/web/src/app/components/avatar/index.ts`

**Production avatar system (R3F):**
- `apps/web/src/components/session-ui/avatars/VirtualOfficeAvatar.tsx`
- `apps/web/src/components/session/AvatarCanvas.tsx`
- `apps/web/src/components/session/AbstractAvatar.tsx`
- `apps/web/src/components/host/AvatarPreviewCanvas.tsx`

**Audio-only / demo:**
- `apps/web/src/components/demo/audio-avatar.tsx`
- `apps/web/src/app/demo-room/DemoRoomClient.tsx`
- `apps/web/src/app/demo/live/page.tsx`

**Selector / picker:**
- `apps/web/src/components/session-ui/AvatarSelectorModal.tsx`
- `apps/web/src/components/session-ui/DirectJoinLobby.tsx`
- `apps/web/src/app/host/avatar-setup/page.tsx`
- `apps/web/src/app/host/practice/page.tsx`
- `apps/web/src/app/host/dashboard/page.tsx`
- `apps/web/src/app/join/[sessionId]/DirectJoinClient.tsx`

**WebGL fallback:**
- `apps/web/src/components/session-ui/WebGLFallback.tsx`

**Initials fallbacks:**
- `apps/web/src/components/sidebar/sidebar-user-footer.tsx`
- `apps/web/src/components/polish/TrustStrip.tsx`

**API routes:**
- `apps/web/src/app/api/livekit/token/route.ts`

**Services:**
- `services/session/src/livekit-token-service.ts`

**Types / config:**
- `packages/types/src/session.ts`
- `apps/web/src/lib/storage.ts`
- `apps/web/src/lib/voice-mask-processor.ts`
- `apps/web/src/hooks/useReducedMotion.ts`
- `apps/web/firestore.rules`
- `apps/web/next.config.ts`

**Session UI:**
- `apps/web/src/components/session/SessionRoom.tsx`
- `apps/web/src/app/dashboard/page.tsx`

---

## Recommended remediation order

1. **Sprint 0 (one day):** Fix the four CRITICAL security / functional bugs
   - CRIT-1 (LiveKit metadata trust) — add lint rule, pass role from server
   - CRIT-2 (style off-by-one) — change to 0–11, add test
   - CRIT-3 (color picker not honored) — decide: persist palette name instead of hex, or rename modal to "Lobby handle color"
   - CRIT-4 / CRIT-5 / MAJ-9 — delete `/apps/web/src/app/components/avatar/` entirely

2. **Sprint 1 (two days):** Fix MAJ bugs that block the live user experience
   - MAJ-1 (dead gesture prop) — remove or wire to data channel
   - MAJ-2 (derivation divergence) — align service.ts to HMAC
   - MAJ-3 / MAJ-4 (Shuffle cosmetic / rate limit) — re-fetch token or relabel
   - MAJ-5 (WebGL context restore) — set state on restore
   - MAJ-7 / MAJ-8 / MAJ-15 (host localStorage hydration) — single fix touches all three

3. **Sprint 2 (two days):** Fix accessibility, performance, and remaining MAJ
   - MAJ-10 / MAJ-22 (AvatarSelectorModal a11y) — focus trap, aria, friendly names
   - MAJ-17 (palette/gesture whitelist) — defensive client validation
   - MAJ-18 / MAJ-19 / MAJ-20 (useReducedMotion, doc.hidden, post-processing) — single component edit
   - MAJ-21 / MAJ-23 (Phase 5 Avatar a11y, TrustStrip a11y) — only relevant if Phase 5 is preserved; otherwise delete

4. **Sprint 3 (polish):** Address MIN items in batches. The biggest product wins are MIN-32/33/34 (AvatarSelectorModal selected-state icon, click-outside fix, responsive grid) and MIN-21 (Save button dirty state).

5. **Sprint 4 (decide on):** MAJ-14 (TrustStrip fake testimonials) is a content decision, not a code fix. Resolve with product before engineering.
