# H.I.P.S. Platform — Crisis Protocol: Reviewer Assignment
**Document Type:** Binding Operational Decision Record
**Decision Date:** April 23, 2026
**Status:** RECOMMENDED — awaiting Program Lead confirmation (6 fields below)
**Authority:** Program Lead
**Companion doc:** docs/no-clinicians-commitment.md

---

## Commitment Statement

The H.I.P.S. crisis protocol requires a designated human to initiate Identity
Vault access during a live session crisis event. That human must:

- Hold the FACILITATOR or ADMIN role on the platform
- Be reachable within **15 minutes** during all scheduled session hours
- Be trained on the crisis referral protocol (documented in ops runbook)
- Understand that every vault access they initiate is permanently logged
  in an immutable `VaultAccessLog` entry with their identity and justification

This document names those individuals and commits them to that responsibility.

---

## Designated Reviewers

### Primary Reviewer
| Field | Value |
|---|---|
| **Name** | ___________________________ |
| **Role on platform** | FACILITATOR |
| **Availability** | Mon–Sat, 8am–9pm *(timezone: see below)* |
| **SMS alert phone** | ___________________________ *(E.164 format, e.g. +12135550100)* |

### Backup Reviewer
*(Required — primary may be unavailable)*

| Field | Value |
|---|---|
| **Name** | ___________________________ |
| **Role on platform** | ADMIN |
| **Availability** | Mon–Sat, 8am–9pm *(same covered window)* |
| **SMS alert phone** | ___________________________ *(E.164 format)* |

---

## Operational Parameters

| Parameter | Value |
|---|---|
| **Escalation SLA** | 15 minutes from flag to human review |
| **Alert channel** | SMS (primary) + SMS (backup) + Slack `#crisis-alerts` — all three fire simultaneously |
| **Session hours timezone** | ___________________________ *(e.g. America/Los_Angeles)* |
| **Slack webhook URL** | ___________________________ *(internal #crisis-alerts channel)* |
| **Auto-promote after SLA breach** | Yes — escalation promotes to all ADMIN users if unreviewed after 15 min |

---

## What Reviewers Are Authorized to Do

When a crisis is flagged, the reviewer initiates `POST /safety/v1/crisis/:sessionId`.
This action:

1. Retrieves **three fields only** from the Identity Vault (minimum necessary):
   - `emergencyContact` — to notify a contact if participant consents
   - `region` + `country` — to surface the correct local emergency services number
2. Logs the access permanently to `VaultAccessLog` (immutable — cannot be deleted)
3. Displays 988 + Crisis Text Line + local emergency services to the participant
4. Marks the escalation `CRISIS_ACTIVE` in the safety queue

**Reviewers cannot:** access `realName`, `email`, `ipAddress`, or any other vault field.
**Reviewers cannot:** dismiss a `CRISIS_ACTIVE` escalation without logging a resolution note.

---

## Out-of-Hours Protocol

Sessions are only bookable during the covered window (Mon–Sat 8am–9pm).
The booking system enforces this — no session can be scheduled outside it.

In the event a crisis flag fires outside covered hours (edge case only):
1. System immediately displays 988 + Crisis Text Line + local emergency resources to participant
2. Session is NOT terminated — participant retains connection
3. SMS + Slack alerts fire to both reviewers regardless of hour
4. No vault access occurs automatically
5. Escalation is flagged `PENDING_REVIEW` and reviewed at next staff availability
6. Incident is documented in the safety log with timestamp of flag and first response

---

## Environment Variables (set in production before Sprint 7 go-live)

```env
CRISIS_ESCALATION_SLA_MINUTES=15
CRISIS_SMS_PRIMARY=             # Primary reviewer phone (E.164)
CRISIS_SMS_BACKUP=              # Backup reviewer phone (E.164)
CRISIS_SLACK_WEBHOOK_URL=       # Internal #crisis-alerts Slack webhook
SESSION_HOURS_START=08:00
SESSION_HOURS_END=21:00
SESSION_HOURS_TIMEZONE=         # e.g. America/Los_Angeles
```

These values are set via AWS Secrets Manager in production.
They are never committed to version control.

---

## Changing Reviewers

If a reviewer leaves or changes role:

1. Update this document with new name + contact
2. Update `CRISIS_SMS_PRIMARY` or `CRISIS_SMS_BACKUP` in AWS Secrets Manager
3. Notify the Safety Engine team to verify alert delivery before next session day
4. New reviewer must complete crisis protocol training before being activated

---

## Sign-off

> **Program Lead:** ___________________________  **Date:** ___________
>
> *By signing, I confirm that the named individuals have been informed of their
> responsibility, have completed crisis protocol training, and are available
> during the session hours listed above.*
>
> **Founder (witness):** ___________________________  **Date:** ___________
