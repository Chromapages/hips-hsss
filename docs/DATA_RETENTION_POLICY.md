# H.I.P.S. Data Retention Policy

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Data Retention Policy
**Version:** 1.0
**Status:** Canonical — all data lifecycle decisions must conform to this document
**Date:** April 24, 2026
**Authority:** Tech Lead + Legal Reviewer (sign-off required before first public launch)
**Depends on:** `HIPS_Ultimate_Architecture_v2.md` · `SECURITY_POLICY.md` · `DEPLOY_RUNBOOK.md`

---

## Table of Contents

1. [Purpose & Legal Basis](#1-purpose--legal-basis)
2. [Master Retention Schedule](#2-master-retention-schedule)
3. [Identity Vault Data](#3-identity-vault-data)
4. [Session Data](#4-session-data)
5. [Commerce Data](#5-commerce-data)
6. [Object Storage](#6-object-storage)
7. [Logs & Audit Trails](#7-logs--audit-trails)
8. [Third-Party Processors](#8-third-party-processors)
9. [Automated Deletion Jobs](#9-automated-deletion-jobs)
10. [Legal Hold Process](#10-legal-hold-process)
11. [Participant Right to Deletion](#11-participant-right-to-deletion)
12. [Annual Review Checklist](#12-annual-review-checklist)

---

## 1. Purpose & Legal Basis

### Why This Document Exists

H.I.P.S. is built on the promise of hard anonymity. That promise is not just ethical — it is structural. Retaining data longer than necessary increases the risk that a participant's identity could be linked to their session history, their crisis event, or their mental health journey. This document defines the maximum retention period for every category of data the platform collects, and mandates automated deletion where technically feasible.

Data minimization is a first-class design principle on this platform. If data is not needed for a defined operational purpose, it is not retained.

### Legal Basis for Data Collection

H.I.P.S. collects and processes personal data under the following bases:

| Data Category | Legal Basis |
|---|---|
| Commerce account data (name, email) | Contractual necessity — required to deliver booked services and issue receipts |
| Identity Vault data (emergency contact, region) | Explicit consent — participant completes disclosure form before vault data is stored |
| Session records (anonymous) | Legitimate interest — service quality, safety, operational continuity |
| Donation records | Legal obligation — IRS 501(c)(3) receipt and record-keeping requirements |
| IP address | Legitimate interest — safety compliance and legal jurisdiction (minimum necessary) |
| Device fingerprint | Legitimate interest — fraud prevention (lightweight; not used for tracking) |

### Scope

This policy covers all data collected, processed, or stored by the H.I.P.S. platform across all three data stores (Identity Vault, Session DB, Commerce DB), object storage (Supabase), logs (CloudTrail, CloudWatch), and third-party processors (Firebase, Stripe, Resend, Supabase, LiveKit).

---

## 2. Master Retention Schedule

This is the single authoritative reference for all data retention decisions. Every data point the platform collects is listed here.

| Data Point | Stored In | Retention Period | Deletion Method | Notes |
|---|---|---|---|---|
| Real name | Identity Vault DB (encrypted) | Duration of account + 3 years | Vault API deletion job | Immutable records — new record created on amendment |
| Email address | Identity Vault DB (encrypted) | Duration of account + 3 years | Vault API deletion job | Commerce account email retained separately per commerce rules |
| Emergency contact | Identity Vault DB (encrypted) | Duration of account + 3 years | Vault API deletion job | Only accessible via crisis protocol |
| Region / State / Country | Identity Vault DB (encrypted) | Duration of account + 3 years | Vault API deletion job | Required for crisis resource routing |
| Gender (locked) | Identity Vault DB (encrypted) | Duration of account + 3 years | Vault API deletion job | Locked post-verification |
| Disclosure / consent record | Identity Vault DB | Permanent | Never deleted | Legal record of consent — required for defensibility |
| IP address | Identity Vault DB (encrypted) | **30 days** | Automated TTL job (daily) | Hard cap — env var `IP_RETENTION_DAYS=30` |
| Device fingerprint | Identity Vault DB (encrypted) | **90 days** | Automated TTL job (daily) | Lightweight; env var `DEVICE_FINGERPRINT_RETENTION_DAYS=90` |
| VaultAccessLog entry | Identity Vault DB | Permanent | Never deleted | Immutable audit trail — insert-only |
| Commerce user account | Commerce DB | Duration of account + 3 years | Soft delete (`deleted_at`) then hard delete after 3 years | |
| Session booking record | Commerce DB | 7 years | Soft delete after 2 years; hard delete after 7 | Financial record — IRS requirement for 501(c)(3) |
| Package purchase record | Commerce DB | 7 years | Same as session booking | |
| Scholarship record | Commerce DB | 7 years | Same as session booking | Scholarship fund is tracked as ledger |
| Donation record | Commerce DB | **Permanent** | Never deleted | IRS 501(c)(3) legal requirement |
| Org inquiry record | Commerce DB | 7 years from close | Soft delete after 2 years; hard delete after 7 | |
| Stripe payment reference | Commerce DB | 7 years | Retained per IRS rules | Stripe ID only — no card data stored |
| Session record (anonymous) | Session DB | 2 years | Automated deletion job | `anonSessionToken` only — no identity link |
| Session notes (facilitator) | Session DB | 2 years | Automated deletion job | Tied to anonymous session record |
| Session AI summary reference | Session DB / Object Storage | 2 years | Deletion job + Supabase object deletion | If opted in; object deleted from Supabase |
| Group session record | Session DB | 2 years | Automated deletion job | No participant PII |
| AuditEvent (session) | Session DB | **5 years** | Automated deletion job | Extended retention for safety/legal defensibility |
| Voice recording (consented) | Supabase Object Storage | **90 days** from session end | Automated Supabase deletion job | Only if consent explicitly given; encrypted at rest |
| Voice buffers (live, no consent) | LiveKit in-memory only | **Session end** | Automatic on teardown | Never written to disk or object storage |
| Digital product files | Supabase Object Storage | Indefinite (org-managed) | Manual deletion by Tech Lead | Product files; not participant data |
| Signed URLs | Application layer | **24 hours** | URL expiry (Supabase TTL) | Non-renewable without re-auth |
| Stripe webhook log | Commerce DB | **90 days** | Automated deletion job | Minimum per Stripe recommendations |
| CloudTrail logs | AWS S3 (CloudTrail bucket) | **7 years** | S3 lifecycle rule | KMS Decrypt events included |
| CloudWatch logs | AWS CloudWatch | **90 days** | CloudWatch log group retention setting | Application logs; no PII in logs |
| GuardDuty findings | AWS Security Hub | **1 year** | AWS managed retention | |
| Resend email delivery logs | Resend (third-party) | Per Resend policy (30 days) | Resend managed | No email body content retained |
| Firebase auth logs | Firebase (third-party) | Per Firebase policy | Firebase managed | No session content |

---

## 3. Identity Vault Data

The Identity Vault is the most sensitive data store on the platform. All retention rules here are minimum-necessary and strictly enforced.

### Immutable Records

`IdentityRecord` rows are **immutable by design**. When a participant updates their vault information, a new record is created — the old record is not modified. This design means:
- No `updated_at` column exists
- No `deleted_at` column exists
- There is no `UPDATE` or `DELETE` permission granted to any application DB role
- Amendments are tracked by record sequence, not by overwriting

This immutability is intentional: it creates a clean audit trail of consent and disclosure that cannot be retroactively altered.

### Disclosure / Consent Record

The `disclosureAccepted` boolean and `disclosureDate` timestamp are **permanently retained**. They are the legal record that a participant gave informed consent before their data was stored. Deleting this record would undermine the platform's legal defensibility.

### IP Address Retention

- **Maximum retention:** 30 days
- **Stored in:** Identity Vault DB only — never in Session DB or Commerce DB
- **Deletion:** Automated daily TTL job running in the Vault service
- **Rationale:** IP address is collected for safety compliance and legal jurisdiction only. It has no operational value after 30 days. Retaining it longer creates unnecessary re-identification risk.
- **Environment variable:** `IP_RETENTION_DAYS=30` — configurable but must not be increased without Legal Reviewer approval

### Device Fingerprint Retention

- **Maximum retention:** 90 days
- **Stored in:** Identity Vault DB only
- **Deletion:** Automated daily TTL job
- **Rationale:** Lightweight fingerprint used for fraud prevention during account creation. No operational value after 90 days.
- **Environment variable:** `DEVICE_FINGERPRINT_RETENTION_DAYS=90`

### Account Closure

When a participant requests account deletion:
1. Commerce account is soft-deleted immediately (`deleted_at` timestamp set)
2. Identity Vault record is flagged for deletion
3. Vault data is hard-deleted 30 days after request (provides recovery window)
4. Exception: `disclosureAccepted` record and `VaultAccessLog` entries are permanently retained
5. Exception: Financial records (sessions paid for) are retained per the 7-year IRS rule
6. Participant receives confirmation email within 48 hours of request

### VaultAccessLog

The `VaultAccessLog` is permanently retained and can never be deleted or modified by any application role. It is the audit trail that proves every identity vault access was human-initiated, justified, and logged. Deleting it would destroy the foundation's legal protection in any investigation.

---

## 4. Session Data

Session data is anonymous by design — no session record contains a real name, email, or Firebase user ID. Retention is governed by operational need, not by identity protection (since no identity is present).

### Session Records

| Record Type | Retention | Rationale |
|---|---|---|
| `SessionRecord` | 2 years | Operational analytics, facilitator performance review |
| `SessionRecord.notes` | 2 years | Facilitator notes — tied to anonymous session record |
| `GroupSessionRecord` | 2 years | Group session analytics |
| `AuditEvent` | 5 years | Safety and legal defensibility — escalation history |

### Session Token

Anonymous session tokens are **never written to any database**. They exist in-memory in the NestJS session service only, for the duration of the session. They are destroyed on session teardown. The `sessionTokenRef` in the commerce `Session` table is a hashed reference only — it cannot be reversed to recover the original token or link to an identity.

### Voice Buffers (No Consent)

If a participant has not given recording consent:
- Voice data is processed in-memory by LiveKit only
- No audio is written to disk or object storage at any point
- On session teardown, all voice buffers are destroyed automatically
- There is no recovery mechanism — this is intentional

### Voice Recordings (Consent Given)

If a participant explicitly opts in to recording:
- Recording is stored encrypted in Supabase Object Storage
- **Maximum retention: 90 days from session end**
- Automated deletion job removes the object at day 90
- The `summaryRef` in `SessionRecord` is nulled out after object deletion
- Facilitator is notified 7 days before deletion (to complete any summary work)

### Session Notes Deletion

Session notes are part of the `SessionRecord` and are deleted on the same schedule (2 years). Notes must never contain participant real names, contact information, or any data that would link the anonymous session to a real identity. This is enforced by facilitator training and periodically audited by the Program Lead.

---

## 5. Commerce Data

Commerce data is governed primarily by IRS 501(c)(3) record-keeping requirements and general financial compliance. These retention periods are longer than other data categories for legal reasons.

### IRS Record-Keeping Requirement

501(c)(3) organizations are required to retain financial records for a minimum of **7 years** from the date of the transaction. This applies to:
- Session booking records (revenue)
- Package purchase records (revenue)
- Scholarship records (expense/subsidy tracking)
- Donation records (see below)
- Org workshop/retreat records (revenue)

### Donation Records

Donation records are **permanently retained**. They are the legal basis for the IRS-compliant charitable contribution receipts issued to donors. Deleting them would create a gap in the foundation's financial records that could jeopardize its 501(c)(3) status.

### Soft Delete vs. Hard Delete

All user-facing commerce records use soft delete (`deleted_at` timestamp) to enable recovery within the soft-delete window. Hard deletion follows after the retention period:

| Record | Soft Delete After | Hard Delete After |
|---|---|---|
| User account | On deletion request | 3 years after soft delete |
| Session booking | 2 years post-session | 7 years from booking date |
| Package | 2 years post-expiry | 7 years from purchase date |
| Scholarship | 2 years post-close | 7 years from application date |
| Org inquiry | 2 years post-close | 7 years from creation date |

### Stripe Data

H.I.P.S. stores only the Stripe `PaymentIntent` ID and `Customer` ID in the Commerce DB — no card numbers, no CVVs, no full payment method details. Stripe retains payment data per its own data retention policy (which participants can review at `stripe.com/privacy`). The Stripe `PaymentIntent` ID is retained by H.I.P.S. for 7 years to support financial record-keeping.

---

## 6. Object Storage

All files served to participants are stored in Supabase Object Storage with server-side encryption at rest.

### Signed URL Policy

- Signed URLs expire after **24 hours** by default (env var: `SIGNED_URL_EXPIRY_SECONDS=86400`)
- Expiry is enforced by Supabase — the URL becomes invalid after the TTL
- Re-authentication is required to generate a new URL for subsequent downloads
- Signed URLs are never stored in the database — they are generated on demand

### Digital Product Files

- Workbooks, courses, toolkits, and membership resources are organization-managed assets
- They are not participant personal data — they are product files
- Retained indefinitely until manually deleted by the Tech Lead or Program Lead
- Deletion of a digital product file is a product decision, not a retention decision

### Voice Recordings

See Section 4 — 90-day maximum retention, automated deletion.

### AI Summary Files (Phase 2)

- AI-generated session summaries are stored in Supabase Object Storage, referenced by `summaryRef` in `SessionRecord`
- Retention: **same as SessionRecord — 2 years from session end**
- Object is deleted from Supabase when the `SessionRecord` is deleted
- Deletion is confirmed by verifying the `summaryRef` key no longer resolves in Supabase

---

## 7. Logs & Audit Trails

### CloudTrail

- **Retention:** 7 years
- **Stored in:** S3 bucket (`hips-cloudtrail-logs`) with versioning enabled
- **Scope:** All AWS API calls across all regions — includes KMS Decrypt events, IAM activity, ECS task events
- **S3 lifecycle rule:** Transition to Glacier after 1 year; hard expiry at 7 years
- **Deletion protection:** S3 Object Lock enabled — logs cannot be deleted before the 7-year expiry

### CloudWatch Application Logs

- **Retention:** 90 days
- **Set via:** CloudWatch log group retention setting — `RetentionInDays: 90`
- **Scope:** Application logs from all NestJS services and Next.js API routes
- **Rule:** No PII, no secrets, no raw request bodies in any log line — enforced by code review checklist

### GuardDuty & Security Hub Findings

- **Retention:** 1 year in AWS Security Hub
- All `HIGH` and `CRITICAL` findings are exported to the security review record before expiry
- Findings are reviewed weekly as part of the security review cadence

### VaultAccessLog

- **Retention:** Permanent
- **Deletion:** Never — insert-only table, no `DELETE` permission granted
- See Section 3 for full specification

### AuditEvent (Session DB)

- **Retention:** 5 years
- **Deletion:** Automated job; deletes rows where `createdAt < NOW() - INTERVAL '5 years'`
- The 5-year retention is longer than session record retention (2 years) because escalation events may be referenced in legal proceedings

### Stripe Webhook Log

- **Retention:** 90 days
- **Deletion:** Automated job in Commerce DB
- Stripe retains its own copy of webhook delivery history

---

## 8. Third-Party Processors

H.I.P.S. shares participant data with the following third-party processors. Each processor's data retention practices are their own — this section documents what data each processor receives and our obligations regarding it.

| Processor | Data Received | Their Retention | Our Obligation |
|---|---|---|---|
| **Firebase** | Email, name (for account creation), role | Per Firebase Privacy Policy | Delete Firebase user on account deletion request (via Firebase API) |
| **Stripe** | Email, payment method (tokenized), billing info | Per Stripe Privacy Policy (typically 7 years for financial records) | Store only Stripe IDs on our side — no card data |
| **Resend** | Email address, email content | Delivery logs: 30 days; content: not retained after send | Use transactional emails only; no marketing without consent |
| **Supabase** | Encrypted files (digital products, voice recordings) | Per Supabase Privacy Policy | Delete objects per our retention schedule; Supabase is a processor, not a controller |
| **LiveKit** (self-hosted) | Voice streams (in-memory during session) | Session duration only — self-hosted = we control retention | Confirm no logging config that persists audio beyond session; audit before launch |
| **AWS** | Infrastructure data, logs, encrypted vault DB | Per AWS HIPAA BAA | HIPAA BAA signed and active; CloudTrail retained 7 years |

### Third-Party Processor Data Deletion Obligations

When a participant requests deletion:
1. Delete Firebase user account via Firebase Management API
2. Request Stripe customer deletion via Stripe API (or document retention basis if financial records law applies)
3. Supabase objects are deleted per our automated jobs — no separate action required
4. Resend: no stored participant data beyond delivery logs (auto-expire 30 days)
5. Document all third-party deletion actions in the participant's deletion record

---

## 9. Automated Deletion Jobs

These jobs run inside the Vault NestJS service (for vault data) and a scheduled task in the Commerce/Session services. All jobs are logged to `AuditEvent` with `eventType: AUTO_DELETION_JOB`.

### Job 1 — IP Address Expiry (Daily)

```
Service:    Vault NestJS service
Schedule:   Daily at 02:00 UTC (cron: 0 2 * * *)
Action:     DELETE FROM IdentityRecord WHERE ipAddress IS NOT NULL
            AND createdAt < NOW() - INTERVAL '30 days'
            (nulls out ipAddress field only — does not delete the record)
Log:        AuditEvent { eventType: 'IP_EXPIRY_JOB', count: N }
Alert:      If job fails 2 consecutive days → PagerDuty P2
```

### Job 2 — Device Fingerprint Expiry (Daily)

```
Service:    Vault NestJS service
Schedule:   Daily at 02:15 UTC (cron: 15 2 * * *)
Action:     Nulls out deviceFingerprint field for records older than 90 days
Log:        AuditEvent { eventType: 'FINGERPRINT_EXPIRY_JOB', count: N }
Alert:      If job fails 2 consecutive days → PagerDuty P2
```

### Job 3 — Voice Recording Deletion (Daily)

```
Service:    Session NestJS service
Schedule:   Daily at 03:00 UTC (cron: 0 3 * * *)
Action:     Query SessionRecord WHERE summaryRef IS NOT NULL
            AND endedAt < NOW() - INTERVAL '90 days'
            Delete Supabase object at summaryRef key
            Null out summaryRef in SessionRecord
Log:        AuditEvent { eventType: 'VOICE_RECORDING_DELETION_JOB', count: N }
Alert:      If job fails 2 consecutive days → PagerDuty P2
```

### Job 4 — Session Record Deletion (Monthly)

```
Service:    Session NestJS service
Schedule:   First day of month at 04:00 UTC (cron: 0 4 1 * *)
Action:     DELETE FROM SessionRecord WHERE createdAt < NOW() - INTERVAL '2 years'
            Cascades to associated notes and group records
Log:        AuditEvent { eventType: 'SESSION_RECORD_DELETION_JOB', count: N }
Alert:      If job fails → PagerDuty P2; manual review required
```

### Job 5 — Stripe Webhook Log Cleanup (Monthly)

```
Service:    Commerce Next.js (API route / cron)
Schedule:   First day of month at 04:30 UTC
Action:     DELETE FROM StripeWebhookLog WHERE createdAt < NOW() - INTERVAL '90 days'
Log:        Application log only
```

### Job 6 — Commerce Hard Delete (Annual)

```
Service:    Commerce Next.js (admin-triggered, not automated)
Schedule:   Annual — Tech Lead manually triggers after legal review
Action:     Hard deletes soft-deleted records beyond their retention period
            (User: 3 years post soft-delete; Session/Package/Scholarship: 7 years from creation)
Requires:   Tech Lead + Legal Reviewer sign-off before each run
Log:        AuditEvent { eventType: 'ANNUAL_HARD_DELETE_JOB', operator: FirebaseId, count: N }
```

### Monitoring Deletion Jobs

Every deletion job:
- Logs start time, end time, record count to `AuditEvent`
- Verifies record count is within expected range (alert if 0 when records expected, or if count is abnormally high)
- Is reviewed monthly as part of the scheduled maintenance check (see `DEPLOY_RUNBOOK.md` Section 13)

---

## 10. Legal Hold Process

A legal hold pauses automated deletion for specific records when litigation, regulatory inquiry, or crisis investigation requires data preservation. Legal holds take precedence over all automated deletion schedules.

### When a Legal Hold Is Required

- Platform receives a subpoena, court order, or law enforcement request
- Founder or Legal Reviewer determines litigation is reasonably anticipated
- A P0 security incident requires preservation of logs and records for investigation

### Legal Hold Procedure

1. **Legal Reviewer or Founder** declares a legal hold in writing (email to `security@hips.foundation` and Tech Lead)
2. **Tech Lead** disables the automated deletion jobs for affected data categories within 4 hours
3. **Tech Lead** documents: which data categories are held, start date, legal basis, and responsible party
4. **All affected jobs** are flagged in the cron config with a `LEGAL_HOLD: true` environment variable — jobs check this flag before executing deletion
5. Legal hold record is stored in a secure, off-platform document (not in the platform DB)

### Scope Minimization

Legal holds must be as narrow as possible. The hold must specify:
- Which records are held (by session ID, date range, or record type)
- Which data stores are affected (vault, session, commerce)
- Which deletion jobs are paused

A broad hold on all data is not acceptable unless required by court order.

### Legal Hold Release

1. Legal Reviewer confirms hold can be released in writing
2. Tech Lead re-enables affected deletion jobs
3. Jobs run on their next scheduled cycle and process any records that accumulated during the hold
4. Legal hold record is updated with release date

### Identity Vault Legal Hold Note

The `VaultAccessLog` and `disclosureAccepted` records are permanently retained regardless of any legal hold — they are never subject to automated deletion. A legal hold on vault data refers to the `IdentityRecord` itself (real name, emergency contact, etc.).

---

## 11. Participant Right to Deletion

Participants may request deletion of their data at any time. This section defines what can be deleted, what cannot, and the process for handling requests.

### What Can Be Deleted

| Data | Deletable? | Timeline |
|---|---|---|
| Commerce account (name, email in Firebase) | ✅ Yes | Immediately (soft-delete); hard delete after 30 days |
| Identity Vault record (real name, emergency contact, etc.) | ✅ Yes | Flagged immediately; hard delete after 30 days |
| IP address | ✅ Yes | Deleted on next daily job run (max 24 hours) |
| Device fingerprint | ✅ Yes | Deleted on next daily job run (max 24 hours) |
| Session notes (anonymous) | ✅ Yes | Deleted on next monthly job; or immediately on request |
| Voice recording (if exists) | ✅ Yes | Immediately on request |

### What Cannot Be Deleted

| Data | Reason |
|---|---|
| `disclosureAccepted` + `disclosureDate` | Legal record of consent — required for platform legal defensibility |
| `VaultAccessLog` entries | Immutable audit trail — permanent by design |
| `AuditEvent` records | Safety and legal record — retained 5 years |
| Donation records | IRS 501(c)(3) permanent record-keeping requirement |
| Financial transaction records (session bookings paid) | IRS 7-year record-keeping requirement |
| CloudTrail logs | AWS HIPAA BAA compliance requirement |

### Deletion Request Process

1. Participant submits deletion request via account dashboard or email to `privacy@hips.foundation`
2. **Identity verification:** participant must be authenticated (Firebase session) or verify via emailed confirmation link
3. Tech Lead or Admin reviews request within **48 hours**
4. Soft-delete and vault flag applied within 48 hours of verification
5. Participant receives confirmation email with list of what was deleted and what is retained (with legal basis)
6. Hard delete completes within 30 days
7. Deletion record logged to `AuditEvent` with `eventType: PARTICIPANT_DELETION_REQUEST`

### Cannot Delete During Active Crisis

If a participant has an active `CRISIS_ACTIVE` or `PENDING_REVIEW` status, data deletion is paused until the crisis is resolved. This is a safety requirement — emergency contact information must be available for the duration of an active crisis event. Participant is notified of the hold with crisis resolution process explained.

---

## 12. Annual Review Checklist

Run once per year (suggested: first week of January) by the Tech Lead and Infrastructure Lead. Document results in a dated review record.

### Deletion Job Verification

- [ ] Review `AuditEvent` logs for all 6 deletion jobs — confirm all ran on schedule for the past 12 months
- [ ] Spot-check: query `IdentityRecord` for any `ipAddress` values older than 30 days — expected: 0 rows
- [ ] Spot-check: query `IdentityRecord` for any `deviceFingerprint` values older than 90 days — expected: 0 rows
- [ ] Spot-check: query `SessionRecord` for any records older than 2 years — expected: 0 rows
- [ ] Spot-check: query `VaultAccessLog` for `INSERT` and `UPDATE`/`DELETE` permissions — expected: 0 rows with UPDATE/DELETE
- [ ] Confirm voice recording objects in Supabase — no objects older than 90 days from their session end date
- [ ] Confirm `StripeWebhookLog` — no rows older than 90 days

### Third-Party Processor Review

- [ ] Review Firebase data retention settings — confirm alignment with this policy
- [ ] Review Stripe data retention — confirm no card data stored on H.I.P.S. side
- [ ] Review Resend delivery log retention — confirm 30-day auto-expiry active
- [ ] Review LiveKit configuration — confirm no audio persistence setting is enabled
- [ ] Review Supabase storage — confirm no unexpected objects exist

### Legal & Compliance Review

- [ ] Legal Reviewer confirms retention periods remain appropriate given current regulatory landscape
- [ ] Confirm AWS HIPAA BAA is still active and up to date
- [ ] Review any participant deletion requests from the past year — confirm all were processed correctly
- [ ] Review any legal holds from the past year — confirm all were properly documented and released
- [ ] Confirm IRS 7-year record-keeping compliance — no financial records deleted prematurely

### Documentation Update

- [ ] Update this document if any retention periods have changed
- [ ] Update `SECURITY_POLICY.md` if any encryption or access changes affect retention
- [ ] PR to `docs/DATA_RETENTION_POLICY.md` with review date and any changes
- [ ] Notify Founder and Legal Reviewer of any material changes to retention periods

---

*Document maintained by: Tech Lead + Legal Reviewer*
*Review cycle: Annual; after any regulatory change; after any P0 incident involving participant data*
*Change process: PR to `docs/DATA_RETENTION_POLICY.md` · requires Tech Lead + Legal Reviewer sign-off*
*Legal Reviewer sign-off required before first public launch*
*Companion documents: `SECURITY_POLICY.md` · `DEPLOY_RUNBOOK.md` · `HIPS_PRD_v1.md` (Section 7)*
