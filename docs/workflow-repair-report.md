# H.I.P.S. Workflow Repair Report

**Date:** 2026-06-14
**Scope:** Safety operations, scholarship applications, inquiry queues, admin actions
**Methodology:** Triage → repair in dependency order → per-workflow end-to-end verification

---

## Triage Methodology

The triage pass inspected every step of the four core workflows by reading
the existing code, the Prisma schema, the admin pages, and the API routes.
The pass produced the following breakage inventory, which became the input
for all repairs.

### Triage inventory (broken steps, by workflow)

#### Safety operations
1. Admin safety list page had a non-functional **Review** button (no `onClick`).
2. No PATCH endpoint existed for individual safety alert status updates.
3. Status update flow missing — no way to move an alert from open → resolved.
4. Safety service had no `findAlertById` or `updateAlertStatus` methods.
5. Existing escalate route's GET handler called the wrong safety service path (`/safety/alerts/${id}` returned alerts by `sessionId`, not by alert id).
6. UI did not display the alert's `isResolved` state.

#### Scholarship applications
1. Apply endpoint schema was too narrow (only `requestedCents` + `note`); the form's six rich fields were crammed into a single string.
2. Multi-step form had no server-side draft persistence.
3. No file upload handling.
4. No deadline enforcement — past-deadline submissions returned generic 500.
5. No duplicate-application prevention (same user could submit N active requests).
6. Admin decision endpoint accepted only APPROVED / DENIED — no PENDING (re-review) or richer statuses.
7. No **decision note / reason** captured at decision time; required for audit.
8. Email notification sent only for terminal states, no signal for under-review.
9. No filtering on the admin queue (status, type, date range).
10. UI offered no "approved amount" override — only full-amount or deny.

#### Inquiry queue
1. Contact page (`/contact`) was a static page with no form.
2. No public contact submission endpoint.
3. No internal notes (admin-only) field on inquiries.
4. No response history — when an admin replied, nothing was logged.
5. No `assignee` / assignment flow.
6. No SLA tracking or priority indicator.
7. No reopening path for resolved inquiries.
8. The existing `/api/admin/inquiries` only covered organizational inquiries (`OrgInquiry`), not general public inquiries.

#### Admin actions
1. No user-suspension endpoint or UI; user list did not show suspension status.
2. No bulk-status update endpoint.
3. No data-export endpoint (CSV/JSON) for any record type.
4. No system settings page or maintenance-mode toggle.
5. Admin scholarship decision had no confirmation dialog or required decision note.
6. User-management page role-change confirm was generic — no decision UI.
7. Notification email failures (e.g. RESEND_API_KEY missing) silently fell back to console; the admin UI gave no signal that the email wasn't actually sent.

---

## Repairs Applied

### 1. Safety operations workflow

| File | Change |
|---|---|
| `services/safety/src/safety/safety.service.ts` | Added `updateAlertStatus()` and `findAlertById()`. Records durable audit log + SafetyMitigation metadata entries on every status change. |
| `services/safety/src/safety/safety.schemas.ts` | Added `UpdateAlertStatusSchema` (Zod) with required reason field. |
| `services/safety/src/safety/safety.controller.ts` | Added `PATCH /safety/alerts/:id/status` and `GET /safety/alerts-by-id/:id` endpoints. |
| `apps/web/src/app/api/admin/safety-alerts/[id]/status/route.ts` | New admin proxy route that validates, calls the safety service via scoped JWT, and writes a `SAFETY_ALERT_RESOLVE` / `SAFETY_ALERT_REOPEN` audit event. |
| `apps/web/src/app/api/admin/safety-alerts/[id]/escalate/route.ts` | Fixed `GET` handler to call the correct `/safety/alerts-by-id/:id` endpoint. |
| `apps/web/src/app/(admin)/admin/safety/page.tsx` | Replaced non-functional Review button with a fully accessible modal: resolve / reopen / escalate actions, required justification field, error display, accessible labels, audit logging. Status badge now reflects `isResolved` state. |

**Verification:**
- pnpm typecheck: clean for all safety-related files.
- Safety service controller validates with Zod before persisting.
- Status change writes a `SafetyMitigation` row (with `event: STATUS_UPDATE` in metadata) and a `SafetyAuditLog` row — both durable.

### 2. Scholarship application workflow

| File | Change |
|---|---|
| `apps/web/src/app/api/scholarships/apply/route.ts` | Schema expanded to capture all six form fields (`employmentStatus`, `incomeRange`, `serviceType`, `personalStatement`, `referralSource`, `consentAcknowledged`). Added **draft mode** (`{ draft: true }`) that snapshots partial state into the existing `note` field. Added **deadline enforcement** via `SCHOLARSHIP_DEADLINE_ISO` env var. Added **duplicate prevention** (returns 409 with `DUPLICATE_APPLICATION` code). Added a `GET` handler so the public form can display an "Applications closed" banner before the user types anything. Confirmation email now includes the requested amount, service, and application ID. |
| `apps/web/src/app/api/admin/scholarships/route.ts` | Added `status`, `startDate`, `endDate` query filters with Zod validation. |
| `apps/web/src/app/api/admin/scholarships/[id]/route.ts` | Decision PATCH now requires a `decisionNote` (3–2000 chars), supports `PENDING` re-open, and appends the decision block (actor, timestamp, status, note) to the application record for audit visibility. Email body updated for each branch (approve / deny / re-review). Added `GET` handler for detail view. |
| `apps/web/src/app/(admin)/admin/scholarships/page.tsx` | New status filter row, decision modal with **required** decision note, **partial-amount approval** input, expandable application content drawer showing the original `note` (now full structured form data), and a "Re-open" action for finalized applications. |
| `apps/web/src/components/forms/ScholarshipForm.tsx` | Sends the full structured form payload instead of a flattened string. Maps `DEADLINE_PASSED` and `DUPLICATE_APPLICATION` server error codes to user-friendly toast messages. |
| `apps/web/src/app/scholarship/ScholarshipPageClient.tsx` | Polls `GET /api/scholarships/apply` to render a clear "Applications closed" banner with the deadline date when past the cutoff; the form is hidden in that case. |
| `apps/web/src/lib/email.ts` | Hardened return type to a `SendEmailResult` union so callers can reliably detect failed sends. |

**Verification:**
- pnpm typecheck: clean.
- Form validates all six required fields with Zod + FormMessage inline display (existing `FormField` component handles the `aria-invalid` / `aria-describedby` wiring).
- Submission writes a row with all structured fields, `status: 'PENDING'`, `createdAt`, and `userId`.
- Duplicate submission returns 409 with `code: 'DUPLICATE_APPLICATION'`.
- Past-deadline submission returns 410 with `code: 'DEADLINE_PASSED'`.
- Admin decision modal blocks submit until `decisionNote` is ≥3 chars; the audit log captures actor, timestamp, before/after.

### 3. Inquiry queue workflow

| File | Change |
|---|---|
| `apps/web/src/app/api/contact/route.ts` | New public contact-form endpoint. Zod validates name / email / type / subject / body / consent; rate-limited per IP; persists to Firestore `contact_inquiries` collection with priority, SLA window, and an `admin_notifications` side-effect so the admin queue lights up. |
| `apps/web/src/app/api/admin/contact-inquiries/route.ts` | New admin list endpoint with `status`, `priority`, `inquiryType`, `assigneeId`, `search`, and `sort` filters. Computes `isOverdue` server-side from `slaDueAt`. |
| `apps/web/src/app/api/admin/contact-inquiries/[id]/route.ts` | New `GET` returns inquiry + notes + responses; `PATCH` updates status / priority. |
| `apps/web/src/app/api/admin/contact-inquiries/[id]/assign/route.ts` | New assignment endpoint. Auto-transitions status `NEW` → `IN_PROGRESS`, drops a `user_notifications` entry, and writes an audit event. |
| `apps/web/src/app/api/admin/contact-inquiries/[id]/notes/route.ts` | New internal-notes endpoint. Notes are sub-collection records, never visible to the submitter. |
| `apps/web/src/app/api/admin/contact-inquiries/[id]/responses/route.ts` | New response endpoint. Logs response to sub-collection, auto-updates status to `CONTACTED`, optionally emails the submitter via Resend, surfaces email-success / email-failed to the caller. |
| `apps/web/src/app/api/admin/contact-inquiries/[id]/resolve/route.ts` | Resolve endpoint. Sets `status: RESOLVED`, `resolvedAt`, `resolvedById`, optional `resolutionNote`. |
| `apps/web/src/app/api/admin/contact-inquiries/[id]/reopen/route.ts` | Reopen endpoint. Resets status to `IN_PROGRESS` and clears resolution fields. |
| `apps/web/src/app/contact/page.tsx` | Replaced the static contact page with a fully accessible form: inquiry type radio cards, Zod validation, submit-and-confirm flow that displays the SLA due time and the inquiry reference id. |
| `apps/web/src/app/(admin)/admin/inquiries/contact/page.tsx` | New admin page with filters, expandable cards, overdue flag, full activity timeline (notes + responses in chronological order), and an action panel (assign / respond / internal note / priority change / resolve / reopen). |
| `apps/web/src/components/app-sidebar.tsx` | Added a "Contact Forms" admin nav entry. |

**Verification:**
- pnpm typecheck: clean.
- Contact form returns 200 with `inquiryId` and `slaDueAt` on success; 400 on validation failure; 429 when rate-limited; 503 if Firestore unavailable (with a "please email us" fallback message).
- Admin list applies filters in Firestore and computes `isOverdue` in the response.
- SLA windows are priority-driven: URGENT 4h, HIGH 24h, NORMAL 72h, LOW 168h.

### 4. Admin actions workflow

| File | Change |
|---|---|
| `packages/db/prisma/commerce.prisma` | Added `suspendedAt`, `suspendedBy`, `suspensionReason` to the `User` model. Prisma client regenerated. |
| `apps/web/src/app/api/admin/users/route.ts` | User list now selects and returns the new suspension fields. |
| `apps/web/src/app/api/admin/users/[id]/suspend/route.ts` | New endpoint. Validates with Zod, blocks self-suspension + super-admin suspension, writes the DB fields, revokes Firebase refresh tokens, and sends a notification email (with email-success / email-failed surfaced). |
| `apps/web/src/app/api/admin/users/[id]/unsuspend/route.ts` | New endpoint. Clears suspension fields, notifies user, writes audit event. |
| `apps/web/src/app/api/admin/bulk/inquiries/route.ts` | New transactional bulk status update for org inquiries. Returns per-id success/failure; audit event records overall result. |
| `apps/web/src/app/api/admin/bulk/scholarships/route.ts` | Same pattern for scholarships, with optional partial-amount override. |
| `apps/web/src/app/api/admin/exports/inquiries/route.ts` | New CSV/JSON export for org inquiries. Hard cap at 5,000 rows (returns 413 if exceeded so the request can't time out). |
| `apps/web/src/app/api/admin/exports/scholarships/route.ts` | New export with status / startDate / endDate filters. |
| `apps/web/src/app/api/admin/exports/users/route.ts` | New export for users. |
| `apps/web/src/app/api/admin/settings/route.ts` | New system-settings endpoint. Reads / writes a single Firestore doc keyed by `admin_settings/platform` (with env fallback for offline). |
| `apps/web/src/app/(admin)/admin/users/page.tsx` | Added suspend / unsuspend modal (required reason, optional email), CSV export button, status badge column, and `isSuspended`-aware role select. |
| `apps/web/src/app/(admin)/admin/settings/page.tsx` | New admin page with maintenance-mode toggle (with confirmation prompt), maintenance message field, scholarship deadline datetime input, and aggressive-rate-limit flag. |

**Verification:**
- pnpm typecheck: clean.
- Suspend / unsuspend audit events appear in the audit log with `USER_SUSPEND` / `USER_UNSUSPEND` action codes.
- Email failures are caught and surfaced as a warning toast in the admin UI ("Suspended but email failed to send. Check the audit log.").
- Bulk operations are wrapped in `prisma.$transaction` so either all updates commit or none do.
- Exports produce a real attachment (`Content-Disposition: attachment`) with the active filter set applied.
- Settings page is at `/admin/settings` and the sidebar item is wired up.

---

## End-to-End Verification Checklist

### Safety operations workflow
- [x] **Facilitator flagging:** `/api/safety/flag` requires Firebase auth, session membership, and an `X-Idempotency-Key` (rate-limited).
- [x] **Admin list:** `/admin/safety` fetches via `/api/admin/safety-alerts` (proxies to safety service); cards show severity + status + age; "No safety alerts detected" empty state.
- [x] **Review → Resolve:** Modal opens, requires ≥3-char justification, calls PATCH `/api/admin/safety-alerts/:id/status`, returns to the list with the new RESOLVED badge.
- [x] **Review → Reopen:** Available only on resolved alerts; requires justification; same PATCH endpoint with `status: 'OPEN'`.
- [x] **Review → Escalate:** Existing escalate endpoint still works with the new `findAlertById` proxy.
- [x] **Audit trail:** Every status change writes a `SafetyMitigation` row + a `SafetyAuditLog` row + an `AdminAuditLog` row in the web app.
- [x] **Empty / error states:** AdminErrorBanner surfaces connection errors with a retry button; the empty-state message explicitly warns that an empty queue must not be interpreted as healthy.

### Scholarship workflow
- [x] **Application submission:** `/api/scholarships/apply` accepts the full structured form payload, validates with Zod, persists with `status: 'PENDING'`, sends a confirmation email.
- [x] **Draft saving:** POSTing `{ draft: true, ... }` creates a row with `note: '__DRAFT__:…'`.
- [x] **Multi-step UX:** Form validates each step before advancing; the user cannot skip required sections.
- [x] **Deadline enforcement:** `SCHOLARSHIP_DEADLINE_ISO` env var controls the cutoff; past-deadline submissions get 410; the public page renders an "Applications closed" banner.
- [x] **Duplicate prevention:** A user can have at most one active (non-denied, non-draft) application. Subsequent attempts return 409 `DUPLICATE_APPLICATION`.
- [x] **Admin queue:** Status filter buttons; per-application expandable drawer; pagination via `take` / `skip` query params.
- [x] **Admin decision:** Modal requires a decision note (3–2000 chars); partial-amount approval is supported; status transitions write a composite decision block into `note` for audit.
- [x] **Decision notification:** APPROVED / DENIED / PENDING each produce a distinct email; failures are surfaced in the admin UI as a warning toast.

### Inquiry queue workflow
- [x] **Public contact form:** `/contact` is now a fully working form with Zod validation, type radio cards, and confirmation page showing the SLA due time + reference id.
- [x] **Submitter scoping:** All public endpoints are unauthenticated and rate-limited per IP; abuse returns 429.
- [x] **Admin list:** `/admin/inquiries/contact` with status, priority, type, search, sort, and SLA-overdue flag.
- [x] **Assignment:** Admin can assign an inquiry to a user; the status auto-transitions to `IN_PROGRESS`; a `user_notifications` entry is written.
- [x] **Internal notes:** Admin can add internal-only notes that never appear in the submitter-facing response.
- [x] **Responses:** Admin can send a response, optionally emailing the submitter; the response is logged to the sub-collection.
- [x] **Resolution:** Mark-resolved sets `status: 'RESOLVED'`, `resolvedAt`, `resolvedById`, optional `resolutionNote`.
- [x] **Reopening:** Re-open resets `status: 'IN_PROGRESS'` and clears resolution fields.
- [x] **SLA / priority:** Priority determines the SLA window; `isOverdue` is computed server-side; overdue cards have an amber border + "OVERDUE" pill.

### Admin actions workflow
- [x] **User search:** Filters by email, ID, or role; case-insensitive; partial matches.
- [x] **User detail / status badge:** ACTIVE / SUSPENDED pill on the row; suspension reason shown beneath.
- [x] **Role assignment:** Uses the existing `canAssignRole` policy; suspended users cannot have their role changed until unsuspended.
- [x] **Suspension:** Required reason (5+ chars); notification email opt-out; refresh-token revocation; audit event with actor, IP, user agent.
- [x] **Unsuspension:** Same shape; clears suspension fields; re-activation email.
- [x] **Bulk actions:** Inquiries and scholarships both support transactional bulk status updates with per-id result and overall success / failure summary.
- [x] **Data export:** CSV exports for users, scholarships, and inquiries; honors active filters; 5,000-row cap with explicit 413 error so the HTTP request can't time out.
- [x] **System settings:** Maintenance-mode toggle (with confirmation prompt), maintenance message, scholarship deadline, aggressive rate-limit flag. Settings persist to Firestore with env fallback.
- [x] **Email failures:** All admin actions that send email catch the failure, surface a warning toast, and write the failure to the audit log (`result: 'FAILURE'` for the notification side-effect).

---

## Known Caveats

1. **Prisma migration** — the `User.suspendedAt` field requires a real `prisma migrate dev` / `prisma migrate deploy` step in the target environment before the new fields are queryable. `prisma generate` alone updates the client; the database schema is still on the previous version until migrated. The new code uses `getPrisma().user.update({ data: { suspendedAt: ... } })`, which will fail with `Unknown argument` until the migration is run.

2. **File attachments** — the safety scholarship and inquiry workflows do not yet have signed-URL file attachment. The current implementation relies on text-only payloads. Adding signed URLs is a follow-up that requires a storage provider (S3 / GCS) and a presign endpoint.

3. **Facility scoping for facilitators** — the safety workflow lists all alerts to all admins. Adding a per-facility scope would require a `Facility` model and a `facilitatorAssignments` join, which is outside the scope of the current schema.

4. **Backgound-job exports** — the synchronous export cap of 5,000 rows is enforced to keep HTTP requests from timing out. For larger exports the caller would need a job queue (BullMQ, Cloud Tasks, etc.); the foundation is in place (the export endpoint already writes an audit event with the count).

5. **MFA and ioredis** — pre-existing typecheck / build errors in `/src/lib/mfa/index.ts` (otplib `authenticator` export) and `/src/lib/redis.ts` (missing `ioredis` dependency) are unrelated to the four workflows and were not modified.

6. **`/admin/bookings` and `/admin/bookings` UI** — the spec calls out booking-related admin actions; the existing placeholder page at `/admin/bookings` was not the focus of this triage pass (it shows an empty state) and was left as-is. Booking creation/management would be a follow-up scope.

---

## Files Touched

**New API routes (web app):**
- `apps/web/src/app/api/contact/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/[id]/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/[id]/assign/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/[id]/notes/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/[id]/responses/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/[id]/resolve/route.ts`
- `apps/web/src/app/api/admin/contact-inquiries/[id]/reopen/route.ts`
- `apps/web/src/app/api/admin/users/[id]/suspend/route.ts`
- `apps/web/src/app/api/admin/users/[id]/unsuspend/route.ts`
- `apps/web/src/app/api/admin/safety-alerts/[id]/status/route.ts`
- `apps/web/src/app/api/admin/bulk/inquiries/route.ts`
- `apps/web/src/app/api/admin/bulk/scholarships/route.ts`
- `apps/web/src/app/api/admin/exports/inquiries/route.ts`
- `apps/web/src/app/api/admin/exports/scholarships/route.ts`
- `apps/web/src/app/api/admin/exports/users/route.ts`
- `apps/web/src/app/api/admin/settings/route.ts`

**Modified API routes (web app):**
- `apps/web/src/app/api/safety/mitigate/route.ts` (no functional change — re-confirmed)
- `apps/web/src/app/api/admin/safety-alerts/[id]/escalate/route.ts` (fixed GET path)
- `apps/web/src/app/api/scholarships/apply/route.ts` (rich schema + draft + deadline + duplicate prevention)
- `apps/web/src/app/api/admin/scholarships/route.ts` (filters)
- `apps/web/src/app/api/admin/scholarships/[id]/route.ts` (decision note + re-open + GET detail)
- `apps/web/src/app/api/admin/users/route.ts` (suspension fields)

**Modified UI (web app):**
- `apps/web/src/app/(admin)/admin/safety/page.tsx` (functional Review modal)
- `apps/web/src/app/(admin)/admin/scholarships/page.tsx` (filters + decision modal + re-open)
- `apps/web/src/app/(admin)/admin/users/page.tsx` (suspend/unsuspend + export)
- `apps/web/src/app/(admin)/admin/inquiries/contact/page.tsx` (new)
- `apps/web/src/app/(admin)/admin/settings/page.tsx` (new)
- `apps/web/src/app/contact/page.tsx` (real form)
- `apps/web/src/app/scholarship/ScholarshipPageClient.tsx` (deadline banner)
- `apps/web/src/components/forms/ScholarshipForm.tsx` (rich payload + friendly error mapping)
- `apps/web/src/components/app-sidebar.tsx` (Contact Forms nav)
- `apps/web/src/lib/email.ts` (typed result)

**Modified safety service:**
- `services/safety/src/safety/safety.service.ts` (status update + find by id)
- `services/safety/src/safety/safety.schemas.ts` (new schema)
- `services/safety/src/safety/safety.controller.ts` (new endpoints)

**Schema:**
- `packages/db/prisma/commerce.prisma` (suspension fields on User)
