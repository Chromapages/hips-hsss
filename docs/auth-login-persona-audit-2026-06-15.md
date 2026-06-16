# Login Flow Persona Audit

Date: 2026-06-15

Scope: read-only audit of web login, signup, password reset, authentication state,
page/API routing, role enforcement, session integrity, and persona-specific UX.

Overall verdict: **FAIL**

## Persona Inventory

### Implemented web personas

| Persona | Authentication | Effective role | Expected destination | Actual destination/verdict |
|---|---|---|---|---|
| Unauthenticated visitor | None | None | Public pages or login continuation | Partial pass: protected pages redirect to `/login?from=...`, but client guards and some flows lose continuation |
| New registered user | Email/password signup | `PARTICIPANT` | `/dashboard` | Partial pass: sync failures are ignored; Partner/Org selection is misleading |
| Existing participant | Email/password login | `PARTICIPANT` | `/dashboard` or validated requested route | Partial pass: basic routing works; redirect and protected-write journeys fail |
| Facilitator/host | Email/password login | `FACILITATOR` | Host/facilitator destination | Fail: destinations differ by entry point and role claim is later demoted |
| Admin | Email/password login | `ADMIN` | `/admin` | Fail: general login goes to `/dashboard`; real host login goes to `/host/dashboard`; role claim is later demoted |
| Firebase-disabled account | Failed Firebase login | None | Clear disabled-account support state | Partial pass: fresh login is blocked; cached sessions remain usable until token expiry |
| Development mock client/host/admin | Hard-coded development credentials | Mock role | Persona destination | Fail: client, middleware, and APIs disagree about when mock tokens are valid |

### Latent or non-routable types

- `LEADER` and `ORGBUYER` exist in shared/commerce role models but have no web
  guards or destinations.
- Safety-service `SUPER_ADMIN` is a separate service-token persona, not a web
  login persona.
- Commerce `User.deletedAt` exists, but authentication and routing do not enforce it.

### Requested personas/features not implemented

OAuth-only users, Google sign-in, magic links, invitations, team owner/member,
onboarding completion, free/pro tiers, expired subscriptions, 2FA, and app-level
suspended/banned accounts are not implemented. Email/password signup/login and
Firebase password-reset email are the only active user auth methods.

## Persona Journey Map

### Unauthenticated visitor: PARTIAL PASS

Happy path: protected page -> middleware -> `/login?from=<pathname>` -> email/password
login -> requested route.

Failures:

- Middleware preserves only the pathname, dropping the original query string.
- Client `AuthGuard` redirects to plain `/login`, losing the destination.
- `/join` says no account is required, but direct join requires a Firebase token and
  its sign-in link loses continuation.
- User-controlled `from` is navigated without validation.

Evidence: `apps/web/src/middleware.ts:217-237`,
`apps/web/src/components/auth/AuthGuard.tsx:16-34`,
`apps/web/src/app/(auth)/login/page.tsx:45-93`.

### New participant: PARTIAL PASS

Happy path: `/signup` -> Firebase account -> `/api/auth/sync` -> `/dashboard`.

Failures:

- Signup offers `ORGBUYER`, but sync always assigns `PARTICIPANT`.
- Signup ignores a failed sync response and still reports success by navigating.
- Signup exposes raw SDK errors and its error is not an alert.

Evidence: `apps/web/src/app/(auth)/signup/page.tsx:23-56`,
`apps/web/src/app/api/auth/sync/route.ts:102-113`.

### Existing participant: PARTIAL PASS

Happy path: `/login` -> Firebase login -> `/dashboard`; manual admin/facilitator/host
navigation returns the participant to `/dashboard`.

Failures:

- Protected state-changing requests are rejected by the broken CSRF design.
- Direct-join and query-string continuation are lost.
- There is no pro-only route/upgrade experience because subscription tiers do not exist.

### Facilitator/host: FAIL

Happy path: host access-code UX gate -> `/login/host` -> claim check ->
`/host/dashboard`.

Failures:

- General login sends facilitators to `/dashboard`.
- `/api/auth/sync` later replaces the facilitator claim with `PARTICIPANT`.
- Host/facilitator protected writes fail CSRF.
- Mock/default data can silently replace errors or empty states.

### Admin: FAIL

Happy path: a valid admin token can manually access `/admin`.

Failures:

- General login sends admins to `/dashboard`.
- Real host login sends admins to `/host/dashboard`; development admin login sends them
  to `/admin`.
- `/api/auth/sync` later replaces the admin claim with `PARTICIPANT`.
- Role promotion requests fail CSRF, and different admin APIs trust different role stores.

### Firebase-disabled account: PARTIAL PASS

Fresh login attempts are rejected with a user-facing message. However, most middleware
and API verification checks signature/expiry without revocation, so a disabled or
demoted user can retain access with a cached token until expiry.

### Development mock personas: FAIL

The login UI accepts mocks whenever `NODE_ENV=development`; middleware requires
`DEV_MOCK_TOKENS_ENABLED=true`; some handlers use still different rules. Mock journeys
therefore fail unpredictably and middleware can accept mock admin tokens if the flag is
accidentally enabled outside development.

## Security Findings

### CRITICAL

1. **Participant session tokens can authenticate as privileged Safety-service callers.**
   Session and service-to-service JWTs share `SESSION_SERVICE_SECRET`, while the Safety
   guard validates no issuer, audience, token type, service identity, or scope.
   Use separate keys and require scoped `iss`, `aud`, `token_use`, and service claims.
   Evidence: `apps/web/src/lib/session-auth.ts:25`,
   `services/safety/src/safety/service-auth.guard.ts:10-28`.

### HIGH

1. **All privileged web claims are silently demoted.** `/api/auth/sync` always writes
   `PARTICIPANT` to Firebase custom claims. Preserve a validated authoritative role and
   assign the default only to new users.
   Evidence: `apps/web/src/app/api/auth/sync/route.ts:102-115`.

2. **Participants can assume facilitator/session-control capabilities.** Session creation
   checks identity but not facilitator role, and participant-controlled lifecycle actions
   can end sessions. Require authoritative facilitator/admin claims for creation and
   lifecycle transitions.
   Evidence: `apps/web/src/app/api/session/route.ts:100-141`,
   `apps/web/src/app/api/session/[id]/route.ts:171-199`.

3. **Role authorities drift.** Claims, Firestore roles, Commerce roles, and `deletedAt`
   are updated/enforced inconsistently, allowing privilege persistence or unexpected
   demotion. Establish one authority, update projections transactionally, enforce
   `deletedAt: null`, and revoke refresh tokens after role/status changes.

4. **Disabled/revoked users retain access.** Middleware and most web/session checks do not
   check Firebase revocation. Use `verifyIdToken(token, true)` for sensitive operations
   and check disabled/deleted status.

5. **Package credits can be granted without matching payment value.** Fulfillment accepts
   client-controlled service/count values without binding them to verified Stripe amount
   and metadata. Fulfill only from verified, idempotent webhook data.

### MEDIUM

1. **CSRF blocks legitimate writes.** Middleware sets an `HttpOnly` `csrf-token` and then
   requires clients to echo it in `x-csrf-token`; clients cannot read it and do not send
   the header. Remove CSRF from bearer-auth APIs or implement a consistent readable
   double-submit token. Evidence: `apps/web/src/middleware.ts:197-200,249-255`.

2. **Redirect continuation is incomplete and unsafe.** Validate `from` as an internal,
   role-compatible path; preserve pathname plus query across login, signup, reset, and
   host login. Evidence: `apps/web/src/app/(auth)/login/page.tsx:45-93`.

3. **Bearer token cookie is JavaScript-readable for seven days.** Exchange Firebase ID
   tokens for short-lived server sessions in `Secure; HttpOnly; SameSite=Strict` cookies.
   Evidence: `apps/web/src/lib/auth-cookies.ts:22-26`.

4. **Rate limits are bypassable or unwired.** Web limiting trusts `x-forwarded-for`, is a
   generic 100 requests/minute rather than auth-specific per-IP/per-account limiting, and
   service throttler guards are not globally registered.

5. **Web-to-Safety auth is incompatible.** Web proxies send the raw service secret while
   Safety expects a signed JWT. Issue narrowly scoped service JWTs.

### LOW

- Host access code is public client configuration and is only a UX gate.
- Middleware mock tokens do not also require development mode.
- No evidence establishes that service secrets are at least 32 random bytes and identical
  across instances; validate this through deployment-secret policy without printing values.

## UI, Error, And Accessibility Findings

### Cross-cutting failures

- Auth forms use custom error blocks rather than the requested Shadcn Alert.
- Signup and forgot-password can expose raw Firebase SDK errors.
- Inputs lack `aria-invalid` and `aria-describedby` links to errors.
- Failed submission does not focus the error summary or invalid field.
- Login, host login, and signup have no show/hide-password control.
- Auth inputs omit useful autocomplete attributes.
- Forgot-password success does not move focus or announce the new state.
- The collapsed host gate leaves invisible controls keyboard-focusable.
- Login and host-login alerts use destructive text on the same destructive background,
  creating a source-level contrast failure.
- Auth animations lack reduced-motion handling.
- Host/admin data-fetch failures can render as believable empty/default data.

### Passes

- General login and signup render immediately.
- Native forms support Enter submission.
- Email values remain after failed authentication.
- Submit buttons show loaders and are disabled while pending.
- Login, host-login, and host-code failures use `role="alert"`.
- The host gate moves focus to its input when opened.

## Verification

Command:

`corepack pnpm exec vitest run apps/web/src/lib/firebase-auth.spec.ts services/session/src/auth/roles.guard.spec.ts services/session/src/session/session-token.controller.spec.ts`

Result: **25 passed, 4 failed**. The four web helper failures are stale assertions:
production code now correctly calls `verifyIdToken(token, true)`, while tests still expect
the one-argument call.

## Recommended Remediation Order

1. Separate participant-session and Safety service credentials/scopes.
2. Fix `/api/auth/sync` role preservation and unify the authoritative role/status model.
3. Enforce facilitator/admin claims on session creation and lifecycle actions.
4. Repair CSRF or remove it from explicit bearer-auth APIs.
5. Add revocation/disabled/deleted enforcement for sensitive requests.
6. Validate and preserve redirect destinations.
7. Replace client-readable bearer cookies with server session cookies.
8. Implement consistent auth error mapping, accessible alerts, focus management, and
   persona-specific destination/error screens.
