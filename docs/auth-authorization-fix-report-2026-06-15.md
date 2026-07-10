# Authentication and Authorization Fix Report

Date: 2026-06-15

## Authoritative Role Source

`Commerce.User.role`, looked up by verified Firebase UID on every privileged
request, is the sole user-role authority.

Canonical flow:

1. Verify the Firebase ID token with revocation checking.
2. Extract the Firebase UID.
3. Fetch the non-deleted Commerce user by `firebaseUid`.
4. Enforce the Commerce role with `requireRole()`.

## Role Source Inventory

| Previous location | Previous behavior | Current disposition |
|---|---|---|
| Firebase custom `role` claim | Granted web/session-service permissions | Ignored for authorization and removed during auth sync |
| Firestore `users.role` | Granted admin/facilitator access and powered role changes | No longer read or written for authorization; privileged Firestore claim rules removed |
| Middleware JWT `role` claim | Redirected and blocked routes | Middleware now validates identity only |
| AuthProvider token claim | Hydrated client role | Role now hydrates from `/api/auth/sync` Commerce response |
| LiveKit metadata role | Derived from token claim | Derived server-side from Commerce and used only for rendering |
| Browser storage/query role flags | Could influence host UI | Role-like sessionStorage and `?role=host` usage removed |
| Session-service token role claim | Granted facilitator/admin endpoints | Replaced with Commerce lookup via `COMMERCE_DATABASE_URL` |
| Safety admin service-token role | Authorizes service-to-service escalation calls | Retained as a separate non-user service credential boundary |

No user role is stored in localStorage or sessionStorage. The only request-body
role value accepted is the locked role-assignment endpoint, validated by a strict
enum and server-side assignment policy.

## Vulnerabilities Closed

- Self-promotion through Firestore role writes and custom-claim synchronization.
- Role destruction during repeated login/OAuth-style sync.
- Admin/facilitator authorization from stale or client-influenced token claims.
- Admin-to-admin modification and admin promotion by ordinary admins.
- Self-role modification for every privileged role.
- Assignment of `SUPER_ADMIN` through any API.
- Delayed role enforcement after changes; roles are read per request and refresh
  tokens are revoked after successful changes.
- Participant access to facilitator session creation and lifecycle transitions.
- Long-lived silently refreshed admin authorization; privileged requests require
  authentication within the last four hours.
- Missing audit durability for successful role changes; a failed audit write
  causes the role update to roll back.

## Permission Policy

- `PARTICIPANT`: participant routes only.
- `FACILITATOR`: facilitator/host routes and assigned-session operations; no admin,
  billing, system configuration, or role assignment access.
- `ADMIN`: admin and facilitator operations; may assign `PARTICIPANT` or
  `FACILITATOR` to non-admin users; cannot modify admins or assign `ADMIN`.
- `SUPER_ADMIN`: all admin/facilitator operations and may assign `ADMIN`; cannot
  assign `SUPER_ADMIN`, modify another super-admin, or modify their own role.

## Key Files Changed

- `apps/web/src/lib/request-auth.ts`: canonical identity validation and Commerce role lookup.
- `apps/web/src/lib/permissions.ts`: centralized permission and role-assignment policy.
- `apps/web/src/lib/roles.ts`: canonical roles including `SUPER_ADMIN`.
- `apps/web/src/app/api/auth/sync/route.ts`: role-preserving Commerce user sync.
- `apps/web/src/app/api/admin/users/route.ts`: locked role assignment, revocation, rollback, and auditing.
- `apps/web/src/lib/admin-audit.ts`: durable role-change audit result reporting.
- `apps/web/firestore.rules`: removed claim-based privileged access.
- `apps/web/src/middleware.ts` and `apps/web/src/proxy.ts`: identity-only edge checks.
- `apps/web/src/components/auth/AuthProvider.tsx`: server-hydrated UI role cache.
- `apps/web/src/hooks/useRole.ts`: UI-only canonical role hook.
- `apps/web/src/app/api/facilitator/**`, `apps/web/src/app/api/host/**`,
  `apps/web/src/app/api/session/**`: database-backed role enforcement.
- `services/session/src/auth/commerce-role.ts` and `roles.guard.ts`: session-service Commerce role lookup.
- `packages/db/prisma/commerce.prisma`: added `SUPER_ADMIN`.
- `eslint.config.mjs`: flags inline role comparisons in API routes.

## Verification Checklist

- [x] Participant cannot access admin or facilitator APIs.
- [x] Facilitator can access facilitator APIs and cannot access admin APIs.
- [x] Admin can assign facilitator and cannot assign admin/super-admin.
- [x] Admin cannot modify an admin or their own role.
- [x] Super-admin can assign admin and cannot assign super-admin or modify own role.
- [x] Existing-user login sync omits role from updates and preserves privileged roles.
- [x] Every privileged request re-reads the current Commerce role.
- [x] Successful role changes revoke refresh tokens.
- [x] Successful role changes require a persisted audit event with actor, target,
  previous role, new role, and database timestamp.
- [x] All admin APIs use the canonical database-backed admin guard.
- [x] All facilitator and host APIs use the canonical database-backed role guard.

## Deployment Requirements

Apply migration `20260615000000_add_super_admin_role`. Configure
`COMMERCE_DATABASE_URL` for the session service. Bootstrap the first super-admin
directly in the controlled Commerce database; no API can assign that role.

## Verification Results

- Focused authorization suite: **28 passed**.
- Prisma Commerce schema validation: **passed**.
- Privileged-route guard inventory: **passed**; no admin/facilitator route is missing its canonical guard.
- Legacy role-source scan: **passed**; no user authorization remains from claims,
  Firestore role queries, role browser storage, or role query parameters.
- Targeted ESLint and targeted auth-file typecheck: **passed**.
- Full web and session-service typechecks remain blocked by unrelated pre-existing
  errors outside the auth remediation scope.
- Live deployed persona/API verification was not run because this workspace does
  not provide dedicated participant, facilitator, admin, and super-admin test
  credentials. The per-role matrix is covered by policy/guard tests and static
  route-guard verification.

## Complete Remediation File Inventory

- Policy/auth core: `apps/web/src/lib/request-auth.ts`, `permissions.ts`,
  `roles.ts`, `firebase-auth.ts`, `admin-auth.ts`, `admin-audit.ts`,
  `auth-utils.ts`, `authorize.ts`, and their focused specs.
- Authentication/session UI: `apps/web/src/components/auth/AuthProvider.tsx`,
  `AuthGuard.tsx`, `apps/web/src/hooks/useRole.ts`, login pages, admin/facilitator/
  host layouts, sidebar role rendering, and host session links.
- Authentication endpoints: `apps/web/src/app/api/auth/sync/route.ts` and
  `apps/web/src/app/api/auth/session/route.ts`.
- Privileged endpoints: `apps/web/src/app/api/admin/users/route.ts`, every route
  under `api/facilitator/` and `api/host/`, `api/session/route.ts`,
  `api/session/[id]/route.ts`, `api/sessions/cancel/route.ts`, and
  `api/sessions/flag/route.ts`.
- Active-user validation adoption: dashboard, checkout, donations, packages,
  scholarships, services, safety, LiveKit, and session API routes that accept
  Firebase identities.
- Database/rules: `apps/web/firestore.rules`, `packages/db/prisma/commerce.prisma`,
  generated Commerce client files, the `20260615000000_add_super_admin_role`
  migration, `services/commerce/prisma/schema.prisma`, and shared role types.
- Session service: `services/session/src/auth/commerce-role.ts`,
  `roles.guard.ts`, `roles.guard.spec.ts`,
  `session/facilitator-flag.controller.ts`, and `session/session.guard.ts`.
- Guardrails/reporting: `eslint.config.mjs` and this report.
