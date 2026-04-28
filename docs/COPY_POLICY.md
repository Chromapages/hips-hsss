# H.I.P.S. Copy Policy

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Copy Policy & Content Standards
**Version:** 1.0
**Status:** Canonical — all content, email, UI copy, and AI output must conform
**Date:** April 23, 2026
**Authority:** Founder (locked) + Legal Reviewer (required before first public launch)
**Companion files:** `packages/types/src/copy-policy.ts` · `no-clinicians-commitment.md` · `DESIGN_SYSTEM.md`

---

## Table of Contents

1. [Why This Document Exists](#1-why-this-document-exists)
2. [Binding Commitment](#2-binding-commitment)
3. [Approved & Banned Terms](#3-approved--banned-terms)
4. [Required Disclaimers](#4-required-disclaimers)
5. [Crisis Resources Copy](#5-crisis-resources-copy)
6. [Tone Guide](#6-tone-guide)
7. [Service Description Standards](#7-service-description-standards)
8. [Email Copy Standards](#8-email-copy-standards)
9. [Admin & Internal Copy](#9-admin--internal-copy)
10. [AI Output Rules](#10-ai-output-rules)
11. [Copy Review Process](#11-copy-review-process)
12. [CI Enforcement](#12-ci-enforcement)

---

## 1. Why This Document Exists

H.I.P.S. is a 501(c)(3) nonprofit providing **peer support, coaching, and care navigation** — not licensed mental health treatment. This distinction is both a legal boundary and an ethical one.

Using clinical language (e.g., "therapy," "counseling," "treatment") on the platform:
- Creates **false impressions** about the nature of services offered
- Exposes the foundation to **professional liability** and regulatory action
- Violates the **No Clinicians Commitment** (binding founder decision, April 23, 2026)
- Undermines participant trust by promising something the platform cannot deliver

This document defines every copy standard that protects the foundation, its participants, and its facilitators. It is not a style preference — it is a **compliance requirement**.

---

## 2. Binding Commitment

> The H.I.P.S. platform provides **peer support, coaching, and care navigation services only**.
> All copy on all surfaces — including UI, email, marketing, AI output, and facilitator-facing tools — must reflect this commitment accurately and without exception.
>
> **Authority:** Founder
> **Locked through:** v1, v2, v3
> **Change requires:** Founder + Legal Reviewer sign-off + full copy audit

If you are writing, reviewing, or generating any content for this platform and are unsure whether a phrase complies, **stop and consult this document or the Legal Reviewer before publishing.**

---

## 3. Approved & Banned Terms

### Master Term Reference

| ✅ Approved Term | ❌ Banned Term | Notes |
|---|---|---|
| Peer Support | Therapy | Never use — implies licensed clinical delivery |
| Care Navigation | Counseling | Banned unless referring to a licensed credential (which H.I.P.S. does not employ) |
| Coaching | Treatment | Never use for any service description |
| Leadership Wellness | Mental health treatment | Banned across all surfaces |
| Restoration Services | Clinical services | Banned |
| Support Sessions | Clinical intervention | Banned |
| Care Access | Diagnosis | Never use — implies clinical assessment |
| Emotional Support | Mental health care | Banned unless in a crisis resource referral context |
| Facilitator | Therapist | Never use to describe H.I.P.S. staff |
| Facilitator | Counselor | Banned unless facilitator holds a license AND H.I.P.S. legally employs them in that capacity (not permitted in v1–v3) |
| Peer Support Leader | Clinician | Banned |
| Restoration Coaching | Psychological services | Banned |
| Group Cohort | Group therapy | Banned |
| Leadership Track | Mental health program | Banned |
| Care Navigation Session | Intake assessment | Banned — implies clinical intake |
| Personal Restoration | Trauma treatment | Banned |
| Safe Space | Therapeutic environment | Avoid — implies clinical setting |

### Contextual Rules

**"Mental health" usage:**
- ✅ Allowed: "Mental health is important." (general public health statement)
- ✅ Allowed: "If you need mental health treatment, please contact a licensed provider."
- ❌ Banned: "Our mental health services..." — implies H.I.P.S. provides clinical care

**"Healing" usage:**
- ✅ Allowed: "The restoration journey..." or "Finding restoration..."
- ⚠️ Use cautiously: "healing" in isolation may imply clinical process — prefer "restoration" or "renewal"

**"Safe" usage:**
- ✅ Allowed: "A confidential, anonymous space"
- ⚠️ Avoid: "a safe space for healing" — clinical connotation
- ❌ Banned: "a therapeutic safe space"

**Facilitator introductions:**
- ✅ "Meet your Peer Support Facilitator"
- ✅ "Your facilitator is a trained peer support leader"
- ❌ "Meet your therapist" / "Your counselor" / "Your clinician"
- ❌ Any introduction that implies a license or credential the facilitator does not hold

---

## 4. Required Disclaimers

### Standard Service Disclaimer

**Must appear on:** every service page, service detail page, checkout page, and any email that describes a service.

**Exact text — do not paraphrase:**

> *"H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed mental health treatment, medical care, or crisis intervention. If you are in crisis, please contact the 988 Suicide & Crisis Lifeline or your local emergency services."*

**Implementation:** This text is exported as `REQUIRED_DISCLAIMER` from `packages/types/src/copy-policy.ts`. Always import and render the constant — never retype it.

```ts
import { REQUIRED_DISCLAIMER } from '@hips/types/copy-policy';
```

### Donation Receipt Disclaimer

**Must appear on:** every donation receipt email and receipt page.

**Exact text:**

> *"[Org Name] is a 501(c)(3) nonprofit organization. EIN: [EIN]. Your contribution of $[amount] on [date] is tax-deductible to the extent permitted by law. No goods or services were provided in exchange for this donation."*

### Scholarship Disclaimer

**Must appear on:** scholarship application page and approval email.

**Exact text:**

> *"Scholarship and sliding-scale pricing is available to ensure access for all. Scholarship recipients receive the same service experience as all other participants."*

### Digital Product Disclaimer

**Must appear on:** all digital product pages and download confirmation emails.

**Exact text:**

> *"This resource is for educational and personal development purposes only. It is not a substitute for licensed mental health treatment or professional advice."*

### Session Recording Consent

**Must appear as:** explicit opt-in checkbox before any session with recording enabled. Pre-checked is not permitted.

**Exact text:**

> *"I consent to this session being recorded for quality review purposes. I understand I may withdraw consent at any time before the session ends by clicking 'End Recording'."*

---

## 5. Crisis Resources Copy

These strings are exported as `CRISIS_RESOURCES` from `packages/types/src/copy-policy.ts`. They must be rendered verbatim — no paraphrasing, no condensing.

### Primary Resources (always shown)

```
988 Suicide & Crisis Lifeline
Call or text: 988
Available 24/7
```

```
Crisis Text Line
Text HOME to 741741
Available 24/7
```

### Crisis Overlay Heading (exact)

> **"You're not alone. Help is available right now."**

### Crisis Overlay Body (exact)

> *"If you're in crisis, please reach out to a crisis line. Your facilitator has been notified and will follow up."*

### Out-of-Hours Crisis Message (exact)

> *"Our team has been alerted. In the meantime, please contact a crisis line — help is available right now."*

### Rules for Crisis Copy

- Never minimize: do not use "if you're having a hard time" in place of direct crisis language when a crisis flag has been triggered
- Never automated: no AI generates crisis response language — all crisis copy is defined in this document and rendered verbatim
- Local resources: surfaced via `region` + `country` from the Identity Vault during crisis protocol — format follows the same display template as primary resources above
- 988 and Crisis Text Line links must always be `<a href="tel:988">` and `<a href="sms:741741">` — never plain text only

---

## 6. Tone Guide

### Brand Voice

H.I.P.S. speaks with authority, warmth, and directness. Not clinical. Not corporate. Not overly casual. Think: a trusted mentor who has been through hard things and knows how to hold space — without pretending to have all the answers.

| Tone Quality | What It Means | Example |
|---|---|---|
| **Warm** | Human, not institutional | "We're glad you're here." not "Thank you for your registration." |
| **Direct** | Clear, no hedging | "Book a session" not "Explore your options for potentially scheduling a session" |
| **Grounded** | Calm, not urgent | "Ready when you are." not "Don't miss out!" |
| **Honest** | No overclaiming | "Peer support and coaching" not "Transform your life" |
| **Inclusive** | Universal access language | "For everyone who needs it." not "For high-achievers" |

### Tone Don'ts

- No urgency language: "Act now," "Limited spots," "Don't wait" — creates anxiety
- No toxic positivity: "Everything will be fine!" — dismisses real pain
- No clinical language (see Section 3)
- No jargon: "DBT-informed," "trauma-responsive," "somatic" — implies clinical framing
- No spirituality-first language on secular surfaces (the platform serves people of all and no faiths)
- No authority overclaiming: never imply facilitators have clinical authority they do not hold

### Sentence & Paragraph Standards

- Sentences: max 25 words for body copy
- Paragraphs: max 4 sentences
- Reading level target: Grade 8 (Flesch-Kincaid) — accessible to all participants
- Active voice preferred: "Book a session" not "A session can be booked"
- Oxford comma: required
- Em dash: preferred over parentheses for interruptions

---

## 7. Service Description Standards

### Service Name Formatting

| Service | Correct Name | Incorrect Variants |
|---|---|---|
| Individual sessions | "Care Access Session" or "Support Session" | "Therapy session," "Counseling session" |
| Group sessions | "Group Support Cohort" or "Group Cohort" | "Group therapy," "Group counseling" |
| Coaching | "Leadership Restoration Coaching" or "Coaching Session" | "Therapy," "Mental health coaching" (avoid) |
| Org services | "Workshop," "Training," "Retreat" | "Clinical training," "Therapeutic workshop" |
| Resources | "Workbook," "Course," "Leadership Toolkit" | "Therapy workbook," "Clinical guide" |

### Service Page Copy Template

Every service page must follow this structure:

1. **Service name** (approved term only)
2. **One-sentence description** — what it is, not what it fixes
3. **What's included** — bullet list, factual, no outcomes claimed
4. **Who it's for** — inclusive language; no clinical criteria
5. **Pricing** — transparent, scholarship CTA if applicable
6. **Required disclaimer** (see Section 4)
7. **Sponsor CTA** ("Help sponsor someone else's session")

### Outcomes Language

**Never claim outcomes.** H.I.P.S. does not promise healing, recovery, or transformation.

| ✅ Acceptable | ❌ Not Acceptable |
|---|---|
| "A space to be heard" | "Heal from trauma" |
| "Support for leaders navigating burnout" | "Cure burnout" |
| "Confidential peer conversations" | "Resolve your mental health challenges" |
| "Tools for personal restoration" | "Guaranteed results" |
| "Guided by a trained peer support facilitator" | "Led by a licensed therapist" |

---

## 8. Email Copy Standards

### Global Email Rules

- Every email that describes a service must include the `REQUIRED_DISCLAIMER` (Section 4)
- Subject lines: max 50 characters; no ALL CAPS; no urgency language
- Preheader text: required on all emails; max 100 characters
- Unsubscribe link: required on all marketing emails (not transactional)
- Sender name: "H.I.P.S. Foundation" — never a personal name (protects staff privacy)

### Email Templates

#### Booking Confirmation

- **Subject:** "Your session is confirmed — [Date] at [Time]"
- **Key elements:** service name (approved term), date, time, session join instructions, disclaimer, 988 resource line
- **Tone:** warm, brief, practical

#### Scholarship Approval

- **Subject:** "Your scholarship application has been approved"
- **Key elements:** approved amount, discount code, expiry date, booking instructions
- **Tone:** encouraging, not pitying — "We're glad to make this accessible." not "We know this is hard for you."
- **Must NOT include:** any language implying the participant is receiving charity or reduced service

#### Scholarship Denial

- **Subject:** "Your H.I.P.S. scholarship application"
- **Key elements:** clear denial, next available sliding-scale tier offered, reapplication process
- **Tone:** warm, non-dismissive — "We weren't able to approve this application. Here's what's available."
- **Must NOT include:** reason for denial, income-related language, judgment

#### Donation Receipt

- **Subject:** "Thank you — your donation receipt from H.I.P.S. Foundation"
- **Key elements:** amount, date, EIN, tax-deductible statement, "no goods or services" statement (see Section 4)
- **Tone:** grateful, brief, factual

#### Package Expiry Warning

- **Subject:** "Your session package expires in [X] days"
- **Key elements:** sessions remaining, expiry date, booking CTA
- **Tone:** gentle reminder, not alarmist — no "ACT NOW"

#### Session Reminder (24-hour)

- **Subject:** "Your session is tomorrow — [Time]"
- **Key elements:** session details, join instructions, "Need to reschedule?" link, 988 resource line (always)
- **Tone:** calm, prepared

#### Follow-Up Survey (48-hour post-session)

- **Subject:** "How was your session?"
- **Key elements:** brief feedback form link, "no obligation to respond," 988 resource line
- **Tone:** low-pressure — "When you're ready, we'd love your feedback."

#### Crisis Alert (internal — admin/facilitator only)

- **Subject:** "⚠️ Crisis flag — Session [ID] requires review"
- **Audience:** FACILITATOR / ADMIN only — never sent to participants
- **Key elements:** session ID (anonymous), timestamp, escalation queue link, SLA reminder

---

## 9. Admin & Internal Copy

Internal-facing surfaces (admin panel, facilitator tools, safety queue) have their own copy standards.

### Admin Panel Labels

| Context | Correct Label | Incorrect |
|---|---|---|
| Vault access log | "Identity Vault Access Log" | "Patient records" / "Client files" |
| Safety queue | "Safety Escalation Queue" | "Incident queue" / "Complaint queue" |
| Crisis event | "Crisis Flag" | "Psychiatric event" / "Mental health incident" |
| Session record | "Session Record" | "Clinical note" / "Therapy record" |
| Facilitator | "Facilitator" | "Clinician" / "Provider" / "Therapist" |
| Participant | "Participant" | "Patient" / "Client" (avoid — clinical) |

### Internal Emails / Alerts

- Internal alerts use plain, operational language — no warmth tone required
- Crisis alerts must be unambiguous: "This requires human review within 15 minutes."
- Never use participant's real identity in any alert subject or body — session ID (anonymous) only

---

## 10. AI Output Rules

AI services (Phase 2) generate post-session content. All AI output must be reviewed by a facilitator before delivery to participants. No AI output ships without human review.

### What AI Output May Contain

- Summary of session themes (from facilitator notes — not raw audio)
- Suggested reflection questions
- Homework prompts related to themes discussed
- Encouragement to continue engagement

### What AI Output Must Never Contain

| Banned AI Output | Why |
|---|---|
| Diagnostic language ("signs of depression," "anxiety indicators") | Implies clinical assessment |
| Treatment recommendations ("you should see a therapist") | Overclaims platform capability AND misdirects participants |
| Spiritual authority statements ("God has a plan for you") | Platform is faith-inclusive, not faith-directive |
| Predictions about outcomes ("you will feel better if...") | Overclaims; creates false expectations |
| References to specific session content involving other participants | Privacy violation in group sessions |
| Any statement that could constitute clinical advice | Legal liability |
| Real names or identifying details | PII violation |

### AI Output Review Checklist (Facilitator)

Before approving AI-generated content for delivery:

- [ ] No banned terms from Section 3
- [ ] No diagnostic or clinical language
- [ ] No spiritual authority statements
- [ ] No outcome predictions
- [ ] No identifying information
- [ ] Required disclaimer present if content describes services
- [ ] Tone matches brand voice (Section 6)

---

## 11. Copy Review Process

### Before Any New Content Ships

1. Author writes copy using this document as reference
2. Run `pnpm check:copy` — CI banned-term scanner (see Section 12)
3. Peer review by one other team member
4. For any service page, email template, or AI output template: Legal Reviewer sign-off required before first public launch
5. For crisis copy changes: Founder sign-off required

### Trigger for Full Copy Audit

A full copy audit of all surfaces is required when:
- A new service is added to the catalog
- A new email template is introduced
- The AI services (Phase 2) go live
- Any regulatory guidance changes relevant to peer support / coaching services
- Legal Reviewer flags a concern

### Roles

| Role | Responsibility |
|---|---|
| **Any contributor** | Run `pnpm check:copy` before PR; fix violations before merge |
| **Tech Lead** | Enforce CI gate; approve updates to `copy-policy.ts` |
| **Program Lead** | Approve changes to service descriptions and facilitator copy |
| **Legal Reviewer** | Sign off on all service pages before first public launch; advise on edge cases |
| **Founder** | Final authority on the No Clinicians Commitment and crisis copy |

---

## 12. CI Enforcement

The copy policy is enforced automatically in CI via `check-copy.ts` and `data-separation-2.yml` (copy policy job).

### What the Scanner Checks

- All `.tsx`, `.ts` (non-test), `.html`, `.mjml`, and `.md` files in:
  - `apps/web/app/`
  - `apps/web/components/`
  - `apps/web/emails/`
  - `packages/db/prisma/seed.ts`
- Scans for all banned terms in `BANNED_TERMS` export from `copy-policy.ts`
- Reports: file path, line number, banned term, surrounding context, approved alternative
- **Exits with code 1 on any violation** — PR cannot merge until resolved

### Running Locally

```bash
pnpm check:copy
```

Expected output (clean):
```
✅ Copy policy check passed — no banned terms found.
```

Expected output (violation):
```
🚨 COPY POLICY VIOLATIONS FOUND
H.I.P.S. prohibits the following terms in user-facing copy.
────────────────────────────────────────────────────────────────────────────────
FILE  apps/web/app/services/page.tsx:42:18
BANNED  therapy
CONTEXT  "Book a therapy session with one of our..."
USE INSTEAD  "peer support session" — See copy-policy.ts for approved alternatives
```

### Updating the Scanner

To add a new banned term:

1. Add to `BANNED_TERMS` array in `packages/types/src/copy-policy.ts`
2. Add the approved alternative to `APPROVED_ALTERNATIVES` map
3. PR requires: Tech Lead review + Program Lead review
4. Never remove a banned term without Legal Reviewer approval

### Excluded Files

The scanner excludes:
- `copy-policy.ts` itself
- `check-copy.ts` (the scanner)
- `*.test.*` and `*.spec.*` files
- `node_modules/`, `.next/`, `dist/`, `coverage/`

---

*Document maintained by: Tech Lead + Program Lead + Legal Reviewer*
*Review cycle: Before every public launch; on any service catalog change; on any AI feature launch*
*Change process: PR to `docs/COPY_POLICY.md` · requires Tech Lead + Program Lead + Legal Reviewer*
*Companion code: `packages/types/src/copy-policy.ts` must stay in sync with Section 3 of this document*
