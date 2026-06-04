# Fix: Org Inquiry form/API schema mismatch

## Goal
Make a successful organization inquiry submission actually persist to the database, and stop losing the rich data the form already collects (event type, headcount, dates, EIN, nonprofit flag).

## Tasks

- [ ] **Task 1: Add an `OrgInquiryEventType` enum to `packages/db/prisma/commerce.prisma`** next to the existing `InquiryStatus` enum (values: `WORKSHOP`, `RECURRING`, `CONSULTANCY`).
  → Verify: `grep -n "OrgInquiryEventType" packages/db/prisma/commerce.prisma` shows the enum definition.

- [ ] **Task 2: Extend the `OrgInquiry` model in `packages/db/prisma/commerce.prisma` with the new fields**: `isNonprofit Boolean @default(false)`, `ein String?`, `eventType OrgInquiryEventType`, `headcount Int`, `preferredStart DateTime`, `preferredEnd DateTime`. Keep `message` for the existing optional "additional requirements" text. **Drop `@@unique([email])`** (it's the wrong shape for a lead-capture table and currently causes 500s on duplicate submissions).
  → Verify: model lists all 6 new fields; no `@@unique([email])` line remains.

- [ ] **Task 3: Run the Prisma migration**: `pnpm --filter @hips/db prisma migrate dev --name extend_org_inquiry_model`. Apply the generated SQL to the dev DB.
  → Verify: `pnpm --filter @hips/db prisma migrate status` shows the new migration as applied; `pnpm --filter @hips/db prisma generate` updates the client.

- [ ] **Task 4: Update `services/commerce/src/dto/commerce.dto.ts` `createOrgInquirySchema`** to mirror the form. Required: `orgName`, `contactName`, `email`, `eventType`, `headcount`, `preferredStart`, `preferredEnd`. Optional: `isNonprofit` (default false), `ein`, `message`. Add a `superRefine` to require `ein` when `isNonprofit === true` and to require `preferredEnd >= preferredStart`. Drop the `email` uniqueness assumption (the unique constraint is being removed from the model).
  → Verify: `services/commerce` builds (`pnpm --filter @hips-commerce build` or `tsc --noEmit`); spec at `commerce.service.spec.ts:90` is updated to match.

- [ ] **Task 5: Update `apps/web/src/app/api/organizations/inquiry/route.ts`** — extend `inquirySchema` to match the new DTO (same fields, same cross-field rules). Update the `prisma.orgInquiry.create` call to pass all new fields. **Remove the silent-swallow on `P2002`** while you're there (no longer needed since the unique constraint is gone, but worth confirming the catch still maps non-P2002 errors to 500).
  → Verify: `curl -X POST localhost:3000/api/organizations/inquiry` with a valid payload returns `{ success: true, inquiryId: "..." }`.

- [ ] **Task 6: Update `apps/web/src/components/forms/OrganizationIntakeForm.tsx`** — add an `email` field with the same email format validation; add a `superRefine` mirroring the API's `isNonprofit → ein` and `preferredEnd >= preferredStart` rules. Send the body to the API with the canonical field names (`message` for the notes textarea, `isNonprofit` for the checkbox, etc.) so it matches the DTO exactly. **Drop the `contactName`-only submission path — the form is the only caller and the API now requires all the structured fields.**
  → Verify: client-side validation surfaces an error if you submit with `preferredEnd < preferredStart`; submitting a valid form shows the "Inquiry Received" success card.

- [ ] **Task 7: Update `apps/web/src/app/api/admin/inquiries/route.ts` and `[id]/route.ts`** to surface the new fields in the admin list/detail responses (Prisma will return them automatically — just confirm the response shape includes `eventType`, `headcount`, `preferredStart`, `preferredEnd`, `isNonprofit`, `ein` so the admin UI can render them).
  → Verify: an admin GET returns the new fields in the JSON; the PATCH status flow still works.

- [ ] **Task 8: End-to-end smoke test** — sign in as a participant, navigate to `/organizations`, fill the form (including a nonprofit EIN path and a date range check), submit, see the success card. Then as an admin, GET `/api/admin/inquiries` and confirm the new record has all the fields populated.
  → Verify: a row in `OrgInquiry` exists in the DB with `eventType`, `headcount`, `preferredStart`, `preferredEnd`, and the nonprofit flag set correctly.

- [ ] **Task 9 (verification gate)**: run `pnpm --filter @hips/web typecheck` and `pnpm --filter @hips-commerce test`. Both must be clean.
  → Verify: zero TS errors, all commerce service tests pass.

## Done When
- [ ] A logged-in user can submit the org inquiry form and see a `OrgInquiry` row in the database with every field populated.
- [ ] The nonprofit → EIN cross-field rule and the date-range rule both work on the client (form errors) and on the server (400).
- [ ] A duplicate-email submission no longer 500s.
- [ ] Admin can see the rich fields via the existing admin endpoints.

## Notes / Out of scope
- **Auth on the POST**: the inquiry route doesn't check the session token; it relies on the `AuthGuard` wrapper on the page. Fine for now, but if the form ever moves to a public route, add a session check or rate limit.
- **CSRF / rate limiting**: deferred. Next.js App Router same-origin fetch is the default mitigation; revisit if the surface changes.
- **`@@unique([email])` removal**: confirmed safe to drop — re-submission is a legitimate user flow, and the original constraint was causing silent 500s.
- **Should the form have a captcha?** Probably yes for a public form, but `AuthGuard` is the current mitigation.
