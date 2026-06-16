# Admin Dashboard Persona, Security, and Operations Audit

Date: 2026-06-15

Scope: read-only audit of the current dirty worktree covering admin personas,
dashboard pages, admin API routes, role enforcement, privileged operations, data
integrity, audit logging, and operational safety.

Overall verdict: **FAIL**

The dashboard has a nominal `ADMIN` gate, but it is not production-safe. Any
authenticated user can currently promote themselves to `ADMIN`; several core admin
queues are nonfunctional; safety operations cannot authenticate to the safety
service; and privileged actions lack least-privilege roles, confirmation, MFA,
idempotency, and immutable audit coverage.

## Orchestrator Inventory

### Implemented admin personas

| Persona | Effective scope | Implementation status |
|---|---|---|
| Web `ADMIN` | Full access to every web admin page and API | Implemented as one undifferentiated role |
| Development mock admin | Full web admin access using known development credentials | Implemented; dangerous if mock mode is exposed |
| Safety-service `ADMIN` | Intended escalation queue access | Latent: controller/module is not registered |
| Safety-service `SUPER_ADMIN` | Same escalation access as safety `ADMIN` | Latent and not meaningfully distinct |

### Non-admin personas at the boundary

`PARTICIPANT` and `FACILITATOR` are denied by the normal admin page/API guards.
However, that boundary is defeated by the client-writable role escalation described
in Critical Finding 1.

### Requested personas not implemented

There is no read-only admin/auditor, support agent, billing admin, content moderator,
user administrator, operational administrator, or distinct web super-admin. There
are no seeded production admin accounts. The only discovered seeded-like admin is
the development mock `admin@hips.org` / `password`.

### Admin surfaces

| Surface | Purpose | Current verdict |
|---|---|---|
| `/admin` | Control-plane metrics and recent safety alerts | Fail: inaccurate/synthetic metrics and hidden fetch errors |
| `/admin/users` | List users and change roles | Fail: unsafe role management, no pagination/details/filters |
| `/admin/safety` | Safety alert queue | Fail: service authentication broken; Review button is inert |
| `/admin/scholarships` | Scholarship decisions | Fail: UI/API response mismatch and incompatible application data source |
| `/admin/errors` | Error log viewer | Partial pass: useful viewer, but limited and exposes sensitive diagnostics |
| `/admin/inquiries` | Inquiry status management | Fail: UI/API response mismatch; omitted from sidebar |
| `/admin/bookings` | Booking management | Fail: static empty state; omitted from sidebar |

Evidence: `apps/web/src/components/app-sidebar.tsx:70-77`,
`apps/web/src/app/(admin)/admin/bookings/page.tsx:3`.

### Admin API inventory

| API | Methods | Implemented permission |
|---|---|---|
| `/api/admin/stats` | GET | `ADMIN` |
| `/api/admin/users` | GET, POST | `ADMIN` |
| `/api/admin/inquiries` | GET | `ADMIN` |
| `/api/admin/inquiries/[id]` | PATCH | `ADMIN` |
| `/api/admin/scholarships` | GET | `ADMIN` |
| `/api/admin/scholarships/[id]` | PATCH | `ADMIN` |
| `/api/admin/safety-alerts` | GET | `ADMIN` |
| `/api/admin/safety-alerts/[id]/escalate` | GET, POST | `ADMIN` |
| `/api/admin/crisis-access` | POST | `ADMIN` |
| `/api/admin/error-logs` | GET | `ADMIN` |

No admin APIs were found for user deletion, suspension, bans, bulk operations,
subscription management, billing overrides, impersonation, system configuration,
feature flags, maintenance mode, exports, or audit-log search.

## Role-Permission Matrix

Because only one web admin role exists, all implemented admin actions are assigned to
that role. `MISSING ENFORCEMENT` means the action exists but lacks an important
server-side authorization or safety boundary.

| Action | Web `ADMIN` | Read-only/auditor | Support | Billing admin | Moderator | Web super-admin |
|---|---|---|---|---|---|---|
| View dashboard metrics | ALLOWED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| View all user documents | ALLOWED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Promote user to `ADMIN` | MISSING ENFORCEMENT | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Demote self/another admin | MISSING ENFORCEMENT | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Change inquiry status | ALLOWED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Approve/deny scholarship | MISSING ENFORCEMENT | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| View error logs/stacks | ALLOWED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| View/escalate safety alerts | ALLOWED BUT BROKEN | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Request crisis PII access | MISSING ENFORCEMENT AND BROKEN | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Delete/suspend/ban users | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Billing/subscription override | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| System configuration | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |
| View immutable admin audit log | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT IMPLEMENTED |

## Critical Findings

### 1. Any authenticated user can self-promote to `ADMIN`

**Attack vector:** Firestore rules allow a user to write their entire own user
document, including `role`. `/api/auth/sync` then trusts that Firestore role and
copies it into authoritative Firebase custom claims.

**Impact:** A participant or facilitator can set `role: ADMIN`, call auth sync,
refresh their token, and gain every admin page and API permission.

**Evidence:** `apps/web/firestore.rules:19-23`,
`apps/web/src/app/api/auth/sync/route.ts:102-114`, `apps/web/firebase.json:2`.

**Required remediation:** Prohibit all client writes to role and privileged fields.
Allowlist user-editable profile fields. Store role authority in a server-only data
source, and never copy a client-writable value into custom claims.

### 2. Scholarship submission and administration use incompatible contracts and data stores

**Impact:** Valid scholarship submissions cannot reliably enter the queue that
admins review. The public form sends employment/income/service fields without an
authorization token; the apply API requires a bearer token and
`{ requestedCents, note }`. Applications are written to Firestore while the admin
queue reads and updates Commerce Prisma.

**Evidence:** `apps/web/src/components/forms/ScholarshipForm.tsx:73`,
`apps/web/src/app/api/scholarships/apply/route.ts:6-51`,
`apps/web/src/app/api/admin/scholarships/route.ts:33`.

**Required remediation:** Define one authenticated submission contract and one
authoritative scholarship store. Add an end-to-end test from submission through
admin decision and user notification.

### 3. Inquiry and scholarship admin queues always render empty

Both APIs return `{ data, total, take, skip }`, but both pages require the top-level
response to be an array and replace any object response with `[]`.

**Evidence:** `apps/web/src/app/(admin)/admin/inquiries/page.tsx:20-24`,
`apps/web/src/app/api/admin/inquiries/route.ts:40`,
`apps/web/src/app/(admin)/admin/scholarships/page.tsx:21-25`,
`apps/web/src/app/api/admin/scholarships/route.ts:49`.

**Required remediation:** Use a shared typed paginated response contract and render
`response.data`; add route-to-page contract tests.

### 4. Admin safety and crisis operations are broken

Web safety routes send raw `SESSION_SERVICE_SECRET`, while the safety service now
requires a signed JWT using `SAFETY_SERVICE_SECRET` with issuer `hips-web`, audience
`hips-safety`, `token_use=service`, and `scope=safety:report`. The crisis proxy calls
`/safety/crisis-access`, but no matching route exists. The richer escalation
controller is not registered by the safety module and its `ADMIN`/`SUPER_ADMIN`
roles grant identical access.

**Impact:** Alert listing, escalation, and crisis access fail; admins may see a
misleading empty/healthy state instead of an operational failure.

**Evidence:** `apps/web/src/app/api/admin/safety-alerts/route.ts:5-8`,
`apps/web/src/app/api/admin/safety-alerts/[id]/escalate/route.ts:12-15`,
`apps/web/src/app/api/admin/crisis-access/route.ts:72`,
`services/safety/src/safety/service-auth.guard.ts:28-35`,
`services/safety/src/safety/safety.controller.ts:39`,
`services/safety/src/safety/safety.module.ts:9`.

**Required remediation:** Generate a fresh signed service JWT for each proxy call,
register and test the intended safety admin module/routes, define the crisis-access
contract, and add web-to-safety contract tests.

## High Findings

### 5. Role management is unrestricted, non-transactional, and inconsistent

Any admin can promote another user to `ADMIN`, modify another admin, demote
themselves, or remove the last admin without confirmation, reauthentication, 2FA,
reason, or audit event. The route updates Firebase claims before Firestore without a
transaction or rollback, and does not revoke existing tokens. Other admin APIs
authorize against Commerce Prisma, creating role-authority drift.

**Evidence:** `apps/web/src/app/api/admin/users/route.ts:73-86`,
`apps/web/src/app/(admin)/admin/users/page.tsx:124-133`.

**Required remediation:** Split role-management permission from operational admin;
forbid self-role changes and last-admin demotion; require second-admin approval and
step-up authentication for promotion; use one authoritative role workflow with
rollback/outbox behavior; revoke target-user tokens after demotion.

### 6. No admin MFA, step-up authentication, or short privileged session

Admins use ordinary email/password login. No sensitive action checks recent
`auth_time`. The session endpoint stores a raw Firebase ID token in an HttpOnly
cookie with a seven-day `Max-Age`, while the client can silently refresh tokens.

**Impact:** A stolen password or token grants long-lived access to all admin powers.

**Evidence:** `apps/web/src/app/(auth)/login/page.tsx:109`,
`apps/web/src/app/api/auth/session/route.ts:19-25`.

**Required remediation:** Require MFA for admins, enforce a maximum privileged
session of eight hours or less with no silent admin refresh, and require
authentication within five minutes for role changes, escalation, crisis PII access,
and other high-impact actions.

### 7. Privileged actions lack immutable audit coverage

Role changes, inquiry changes, scholarship decisions, admin reads, error-log reads,
and failed privileged attempts are not written to an immutable admin audit log.
Crisis access does not forward the initiating admin identity. The safety audit model
is not database-enforced append-only and lacks complete actor/before/after/IP data.

**Required remediation:** Generate server-side append-only events containing event
ID, request/correlation ID, actor ID and role, action, target, before/after values,
justification, result, timestamp, IP, and user agent. Write mutation and audit event
atomically where possible. Provide a searchable read-only audit viewer.

### 8. Sensitive mutations lack confirmation and idempotency

Role changes and scholarship decisions execute immediately. Scholarship status is
committed before synchronous email; email failure returns `500`, encouraging a retry
after the decision already succeeded. Safety escalation and crisis access have no
idempotency key.

**Evidence:** `apps/web/src/app/api/admin/scholarships/[id]/route.ts:45-71`,
`apps/web/src/app/(admin)/admin/scholarships/page.tsx:102`,
`apps/web/src/app/api/admin/safety-alerts/[id]/escalate/route.ts:72`.

**Required remediation:** Require confirmation and justification; use idempotency
keys backed by unique constraints; enforce valid state transitions; move
notifications and large operations to durable background jobs.

### 9. Admin analytics are fabricated or incorrect

- The growth chart adds deterministic mock sessions to real counts.
- “Active Sessions / Live Now” counts `SCHEDULED` sessions.
- Revenue sums package `amount`, but Stripe package records do not write `amount`.
- The safety dashboard reads an unused Firestore collection instead of the safety DB.
- “Nodes Online” is static copy.

**Evidence:** `apps/web/src/app/api/admin/stats/route.ts:42-92`,
`apps/web/src/app/api/stripe/webhook/route.ts:70-79`,
`apps/web/src/app/(admin)/admin/page.tsx:52`.

**Required remediation:** Define each KPI and authoritative source, remove synthetic
production data, calculate metrics from complete records, expose freshness, and add
data-reconciliation tests.

### 10. Admin failures render as believable empty or healthy states

Admin pages generally ignore `useFetchWithTimeout.error`. API failures therefore
appear as zero metrics, empty queues, or “All systems functioning normally.”

**Evidence:** `apps/web/src/hooks/useFetchWithTimeout.ts:15`,
`apps/web/src/app/(admin)/admin/page.tsx:26`,
`apps/web/src/app/(admin)/admin/errors/page.tsx:217`.

**Required remediation:** Render prominent failure states with retry controls and
last-success timestamps. Never equate failed safety/operations requests with an
empty or healthy state.

### 11. Admin APIs and responses violate least privilege

The sole `ADMIN` role can access role management, revenue, inquiry PII, logs, safety,
and crisis PII. `/api/admin/users` spreads entire Firestore documents; inquiries
return EIN and full messages; scholarship PATCH includes the complete related user;
safety APIs can expose transcript chunks; error logs expose stacks and user agents.

**Evidence:** `apps/web/src/app/api/admin/users/route.ts:29-33`,
`apps/web/src/app/api/admin/inquiries/route.ts:32`,
`apps/web/src/app/api/admin/scholarships/[id]/route.ts:51`,
`services/safety/src/safety/safety.service.ts:348`,
`apps/web/src/app/api/admin/stats/route.ts:101`.

**Required remediation:** Introduce scoped server-side permissions and explicit
response DTOs/field selections. Require separate authorization and justification
for PII, transcripts, and sensitive diagnostics.

## Medium and Low Findings

### Inconsistent handler authentication

Middleware centrally protects `/api/admin/*` and normally returns `401` for
missing/invalid sessions and `403` for authenticated non-admins. Handlers are
inconsistent: some initialize databases before auth, some return `403` for missing
credentials, and some token-verification errors can become `500`.

**Evidence:** `apps/web/src/middleware.ts:240`,
`apps/web/src/app/api/admin/stats/route.ts:7`,
`apps/web/src/app/api/admin/users/route.ts:8`,
`apps/web/src/app/api/admin/inquiries/route.ts:24`.

**Required remediation:** Make a standardized `requireAdmin(permission)` the first
handler operation and consistently distinguish `401` from `403`.

### No admin-specific abuse controls or emergency kill switch

Only a generic in-memory IP-based `100/minute` API limit was found. There is no
per-admin/per-action distributed limit, five-attempt admin-login lockout,
super-admin alert, maintenance/read-only mode, destructive-operation dry run, or
emergency disable-PII switch.

**Evidence:** `apps/web/src/middleware.ts:45-55`.

### Development mock admin can be dangerous

Known development credentials create a mock admin cookie. Middleware checks
`DEV_MOCK_TOKENS_ENABLED`, but login/provider behavior does not consistently require
the same explicit flag.

**Evidence:** `apps/web/src/app/(auth)/login/host/page.tsx:58`,
`apps/web/src/components/auth/AuthProvider.tsx:38`,
`apps/web/src/middleware.ts:133`.

**Required remediation:** Require one explicit flag everywhere, bind mock mode to
localhost, and fail startup if enabled outside local development.

### Unauthenticated error reporting can feed unsafe admin/email content

The public error-report endpoint accepts user-supplied HTML-like diagnostic values,
stack text, and user agent. Admin React rendering escapes text, but email HTML
interpolation is not safely encoded.

**Evidence:** `apps/web/src/app/api/error/report/route.ts:7-13`,
`apps/web/src/app/api/error/report/route.ts:42-95`.

## UI, Functionality, and Data Integrity Gaps

### Users

- Arbitrary unsorted first 100 users only; no pagination or infinite scroll.
- Search operates only on loaded rows and does not support name.
- No role/status/plan filters.
- No user detail view with registration date, last login, auth method, plan,
  subscription, usage, or activity.
- No bulk actions, confirmation, progress, suspension/ban, deletion, or impersonation.

### Safety and moderation

- “Review” and “View All Safety Logs” buttons have no action.
- No detail view, resolution workflow, escalation justification, or crisis-log viewer.
- No pagination/filter/resolved-state UI.
- No general content moderation queue, reporter workflow, or notifications.
- A better anonymized/paginated escalation design exists in the safety service, but
  it is not registered or connected to the web dashboard.

### Scholarships and inquiries

- Both list pages render empty because of response-contract mismatch.
- Neither UI exposes API pagination, search, or filters.
- Inquiry status changes do not refetch or update local state after success.
- Scholarship decisions are non-atomic and can produce confusing retries.
- Inquiry quote/payment-link generation and EIN verification are absent.

### Billing, analytics, settings, and operations

- No billing/subscription management or override workflow.
- No MRR, churn, conversion, accurate revenue breakdown, date filters, or export.
- No system settings, feature flags, rate-limit configuration, or maintenance mode.
- Admin “Settings” points to personal appearance settings.
- `/admin/bookings` is a static empty state.
- `/admin/inquiries` and `/admin/bookings` are omitted from sidebar navigation.

## Operational Safety Assessment

| Requirement | Verdict |
|---|---|
| Every admin mutation logged immutably server-side | FAIL |
| Audit log searchable in dashboard | FAIL |
| Audit log cannot be modified/deleted by super-admin | NOT DEMONSTRATED |
| Admin sessions expire within eight hours without silent refresh | FAIL |
| MFA required for admins | FAIL |
| Sensitive actions require step-up authentication | FAIL |
| Bulk destructive operations use background jobs | NOT IMPLEMENTED |
| Destructive actions are idempotent | FAIL for implemented sensitive mutations |
| Soft delete and recovery grace period | NOT IMPLEMENTED for admin operations |
| Dry-run for large-impact actions | NOT IMPLEMENTED |
| Read-only/maintenance incident mode | NOT IMPLEMENTED |

The Vault service has insert-only hardening and logs access before decrypted PII is
returned. The hardening migration/script must be verified as applied in every
environment. The safety escalation service uses transactions and audit calls in its
intended implementation, but that controller is currently unregistered.

## Passes

- Middleware and the client admin layout nominally gate admin pages to `ADMIN`.
- Middleware nominally gates all `/api/admin/*` routes.
- Most mutation payloads use server-side Zod validation.
- Per-row loading disables exist for role, inquiry, and scholarship changes.
- Error logs have severity filtering, manual refresh, keyboard-expandable details,
  and loading indicators.
- No bulk delete, hard-delete, suspension, ban, subscription override, system
  configuration, or impersonation endpoint exists to exploit today.
- Vault insert-only protection tests pass.

These passes do not offset the self-promotion vulnerability or the absence of scoped
permissions and privileged-action controls.

## Verification

Command:

```text
corepack pnpm exec vitest run \
  services/safety/src/escalation/escalation.service.spec.ts \
  services/vault/test/vault-insert-only.spec.ts \
  services/session/src/auth/roles.guard.spec.ts \
  apps/web/src/lib/firebase-auth.spec.ts
```

Result: **31 passed, 4 failed**.

- Vault insert-only: 11 passed.
- Firebase auth: 8 passed.
- Session roles guard: 9 passed.
- Safety escalation: 4 failed of 7.

Safety escalation failures include an undefined mocked `logger.warn` at
`services/safety/src/escalation/escalation.service.ts:432` and test mocks that do not
provide `$transaction`. No web admin API integration tests were found.

## Remediation Priority

1. Immediately close the Firestore/auth-sync self-promotion path and rotate/revoke
   sessions after correcting role authority.
2. Disable or visibly fail closed on broken safety/crisis operations until the
   service contract and routes are fixed.
3. Introduce scoped admin permissions, MFA, step-up auth, short admin sessions, and a
   durable audited role-change workflow.
4. Build an immutable admin audit log before enabling further privileged operations.
5. Fix scholarship/inquiry contracts and replace synthetic metrics with reconciled
   authoritative data.
6. Add confirmation, idempotency, background jobs, least-data DTOs, error states,
   admin-specific rate limits, and emergency read-only controls.
7. Add a comprehensive admin authorization/API/UI integration test suite covering
   every persona and every ALLOWED/DENIED permission boundary.
