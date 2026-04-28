# H.I.P.S. Facilitator Onboarding Guide

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Facilitator Onboarding
**Version:** 1.0
**Status:** Canonical — all facilitators must complete this guide before their first session
**Date:** April 24, 2026
**Authority:** Program Lead
**Companion Documents:** `COPY_POLICY.md` · `SECURITY_POLICY.md` · `crisis-reviewer-assignment.md` · `no-clinicians-commitment.md`

---

## Table of Contents

1. [Welcome & Role Definition](#1-welcome--role-definition)
2. [What You Can and Cannot Do](#2-what-you-can-and-cannot-do)
3. [Your Access & Permissions](#3-your-access--permissions)
4. [Setup Checklist — Before Your First Session](#4-setup-checklist--before-your-first-session)
5. [Session Workflow — Step by Step](#5-session-workflow--step-by-step)
6. [Group Cohort Workflow](#6-group-cohort-workflow)
7. [Crisis Protocol — Your Responsibilities](#7-crisis-protocol--your-responsibilities)
8. [Using Session Notes](#8-using-session-notes)
9. [AI Summary Review (Phase 2)](#9-ai-summary-review-phase-2)
10. [Facilitator No-Show & Cancellation Policy](#10-facilitator-no-show--cancellation-policy)
11. [Offboarding & Access Revocation](#11-offboarding--access-revocation)

---

## 1. Welcome & Role Definition

Welcome to the H.I.P.S. facilitator team. You are here because the foundation believes you have the lived experience, judgment, and commitment to hold space for leaders navigating hard things — without pretending to have all the answers.

### What a Facilitator Is

A H.I.P.S. facilitator is a **trained peer support leader**. You provide:
- Peer support sessions (individual and group)
- Leadership restoration coaching
- Care navigation — helping participants identify resources and next steps

You are a trusted peer, not a clinician. The platform is built on that distinction. It is not a limitation — it is the point.

### What a Facilitator Is Not

This is not a style preference. It is a binding commitment embedded in the foundation's governing documents.

- You are **not** a therapist, counselor, psychologist, or licensed clinical professional in this role
- You are **not** providing treatment, diagnosis, or clinical intervention of any kind
- You are **not** authorized to recommend specific medications, clinical programs, or diagnostic labels
- You are **not** making crisis decisions autonomously — the crisis protocol requires a logged, human-initiated action (see Section 7)

If a participant asks whether you are a therapist: *"I'm a trained peer support facilitator. I'm not a licensed clinician — I'm here to support you as a peer."*

If you are ever unsure whether an action crosses the clinical line: **stop, don't do it, and contact the Program Lead.**

### Your Role on the Platform

| Attribute | Value |
|---|---|
| Platform role | `FACILITATOR` |
| Auth layer | Clerk (commerce layer) |
| Session access | Via anonymous session token — your identity is not linked to participant identity in the session layer |
| Admin access | Limited — see Section 3 |
| Crisis protocol | You may be a designated crisis reviewer — see Section 7 |

---

## 2. What You Can and Cannot Do

### Language Boundaries

The platform has a copy policy enforced by CI and legal review. These rules apply to you as a facilitator — in your session notes, in any written communication to participants, and in any content you produce for the platform.

**Never use these terms to describe your work:**

| ❌ Banned | ✅ Use Instead |
|---|---|
| Therapy / therapist | Peer support / facilitator |
| Counseling / counselor | Coaching / peer support leader |
| Treatment | Support sessions / care navigation |
| Clinical services | Restoration services |
| Diagnosis | (Never use in any context) |
| Group therapy | Group cohort / group support cohort |
| Mental health care | Peer support and coaching |
| Intake assessment | Care access session |

For the full term reference, see `COPY_POLICY.md` Section 3.

### Session Conduct Boundaries

**You must:**
- Complete sessions during the scheduled session window (Mon–Sat, 8am–9pm in your designated timezone)
- Mark sessions complete via the admin panel after each session ends
- Write session notes that are anonymous — no real names, no contact information, no PII
- Surface crisis resources (988, local emergency services) whenever distress language arises — do not wait for a formal flag
- Follow the crisis protocol when a crisis flag is triggered (Section 7)
- Review AI-generated summaries before they are delivered to participants (Phase 2, Section 9)

**You must not:**
- Attempt to identify which participant corresponds to which anonymous session token
- Access participant identity information outside the crisis protocol
- Use your facilitator access to look up session history for any purpose other than delivering the current session
- Share session content — even anonymized — outside the platform
- Make any promise about outcomes: "You will feel better," "This will help you," etc.
- Produce or approve any AI-generated content containing diagnostic language, outcome predictions, or spiritual authority statements

---

## 3. Your Access & Permissions

### What the `FACILITATOR` Role Unlocks

Your Clerk JWT contains `role: FACILITATOR`. This role is verified against the database on every admin operation — the JWT claim alone is not sufficient for sensitive actions.

| Route / Feature | Facilitator Access | Notes |
|---|---|---|
| `/admin/bookings` | ✅ Read own assigned sessions | Cannot see other facilitators' sessions |
| Session notes (`GET /session/v1/:id/notes`) | ✅ Read and write | Own sessions only |
| `PATCH /api/v1/sessions/:id/complete` | ✅ Mark session complete | Own sessions only |
| `POST /session/v1/:id/flag` | ✅ Initiate a safety flag | Triggers Safety Engine; logged to AuditEvent |
| `POST /safety/v1/crisis/:id` | ✅ Initiate crisis protocol (if designated reviewer) | Logged to VaultAccessLog permanently — see Section 7 |
| `/admin/scholarships` | ❌ No access | Admin only |
| `/admin/revenue` | ❌ No access | Admin only |
| `/admin/organizations` | ❌ No access | Admin only |
| Identity Vault (participant real name, email) | ❌ No access | Crisis protocol surfaces `emergencyContact` + `region/country` only |
| Commerce DB (participant payment info) | ❌ No access | Stripe-managed; admin only |

### What You Never See

The platform's hard anonymity model means you will **never** see:
- A participant's real name
- A participant's email address
- Which Clerk account corresponds to which session
- A participant's payment status, scholarship status, or pricing tier
- A participant's IP address or device information

This is not an oversight — it is the design. Participant identity and session content are stored in physically separate databases with no join path. Even if you wanted to link them, the system makes it technically impossible.

### Your Dashboard

After signing in at `hips.foundation/sign-in` with your Clerk account:
- `/admin/bookings` — your upcoming and past session assignments
- Session detail page — join link, session notes, flag control, mark-complete button
- `/admin/safety` — escalation queue (if you are a designated crisis reviewer)

---

## 4. Setup Checklist — Before Your First Session

Complete every item on this checklist before you are activated for live sessions. The Program Lead will confirm your activation once all items are verified.

### Account & Access

- [ ] Receive Clerk invitation email from `H.I.P.S. Foundation` — create your account
- [ ] Confirm your role is `FACILITATOR` — sign in and verify you can access `/admin/bookings`
- [ ] Confirm you **cannot** access `/admin/scholarships` or `/admin/revenue` — if you can, notify the Tech Lead immediately
- [ ] Save the platform URL: `https://hips.foundation`
- [ ] Do not use your personal email as your facilitator login if you want an additional layer of separation — contact the Program Lead to set up a dedicated facilitator email

### Scheduling (Cal.com)

- [ ] Receive Cal.com onboarding link from the Tech Lead
- [ ] Sign in to Cal.com via Clerk OAuth (same credentials as platform login)
- [ ] Set your weekly availability — sessions are bookable Mon–Sat, 8am–9pm only
- [ ] Confirm a test booking appears in your `/admin/bookings` dashboard
- [ ] Set your buffer time (minimum 15 minutes between sessions — platform recommends 30)
- [ ] Confirm your timezone is set correctly in Cal.com — this determines when your slots appear to participants

### Technical Setup

- [ ] **Laptop required** — sessions cannot be initiated from a mobile device; verify you are on a laptop or desktop
- [ ] Test your microphone — open `hips.foundation/session/[test-session-id]` (provided by Tech Lead) and confirm your voice is transmitting
- [ ] Test your avatar — select your avatar in the virtual office; confirm it locks on session start and does not change mid-session
- [ ] Confirm your browser supports WebRTC — Chrome 120+ or Firefox 121+ recommended; Safari requires explicit permission grants
- [ ] Test the mute/unmute and end session controls — confirm keyboard navigation works (Tab + Enter)
- [ ] Confirm the crisis overlay displays correctly — the Tech Lead will walk you through a simulated crisis flag test

### Training Completion

- [ ] Read `COPY_POLICY.md` in full — sign the acknowledgement form provided by the Program Lead
- [ ] Read `no-clinicians-commitment.md` — sign the acknowledgement form
- [ ] Complete crisis protocol training with the Program Lead — you must demonstrate the crisis flag → review → resolution workflow before activation
- [ ] If you are a designated crisis reviewer: complete the `crisis-reviewer-assignment.md` sign-off with the Program Lead and Founder
- [ ] Review Section 8 of this document (Session Notes) — confirm you understand the anonymity rules

### Activation Sign-Off

The Program Lead confirms:
- [ ] All checklist items above are complete
- [ ] Facilitator has completed crisis protocol training
- [ ] Facilitator role is verified in the platform DB
- [ ] Cal.com availability is live
- [ ] First session assignment has been made in `/admin/bookings`

**Facilitator is not activated until the Program Lead explicitly confirms activation in writing.**

---

## 5. Session Workflow — Step by Step

Every individual session (1:1 Care Access Session or Coaching Session) follows this workflow. Know it before your first session.

### Before the Session

**24 hours before:**
- The system automatically sends the participant a 24-hour reminder email (you do not need to do this)
- Review your `/admin/bookings` to confirm the session is still `CONFIRMED`
- If the session is `CANCELLED` or `NO_SHOW`, the admin will notify you — do not attempt to contact the participant directly

**15 minutes before:**
- Be at your laptop, microphone tested
- Navigate to your session detail page in `/admin/bookings`
- Have 988 and your local crisis resource information available — do not rely on memory during a live session

### Starting the Session

1. Click **Join Session** on your session detail page — this navigates you to `/session/[sessionId]`
2. The system issues your anonymous session token — you appear in the virtual office as your avatar, not your real identity
3. The participant joins from their own session link (sent in their confirmation email)
4. You see: participant avatar, voice controls, session timer, flag button, notes panel
5. You do **not** see: participant real name, email, payment status, or any identity information

### During the Session

- **Voice smoothing is on by default** — this protects participant anonymity; do not ask the participant to disable it
- **Recording is off by default** — if the participant has opted in, a recording indicator will be visible; respect the consent
- **Session notes panel** is available in real time — use it; see Section 8 for rules
- **Flag button** — if you observe crisis language or distress signals, use it immediately; do not wait for the participant to tell you they are in crisis; see Section 7
- **Mute/unmute** — keyboard shortcut: `Space` bar (configurable in settings)
- **Session timer** — visible in the top right of the virtual office; sessions auto-teardown at the scheduled end time plus a 5-minute grace period

### Ending the Session

1. Click **End Session** — or the session auto-ends at the scheduled time + 5 minutes
2. The virtual office closes; you are returned to your session detail page
3. **Within 30 minutes of the session ending:**
   - Complete your session notes (Section 8)
   - Click **Mark Complete** (`PATCH /api/v1/sessions/:id/complete`)
   - If the participant did not attend: click **Mark No-Show** — admin is notified automatically; the participant's session balance is not consumed
4. The system sends the participant a follow-up survey 48 hours after the session ends — you do not send this manually

### After the Session (Phase 2 — AI Summary)

If the participant has opted into AI-generated summaries:
- A summary is generated from your session notes (not from the raw audio)
- It appears in your review queue within 2 hours of session completion
- You must review and approve it before it is delivered to the participant — see Section 9
- If you do not review within 24 hours, the summary is held (not auto-sent)

---

## 6. Group Cohort Workflow

Group cohorts (6-Week Group Cohort, 8-Week Leader Cohort, Couples/Family Group) have additional workflow requirements.

### Before the Cohort Starts

- Admin assigns you as the cohort moderator in `/admin/bookings`
- **72 hours before each session:** the system automatically sends all participants a cohort session reminder — you do not send this manually
- Review your cohort roster (participant count only — no names, no identity) in your session detail
- Confirm the group room is set up: `/lobby/[groupId]` in your admin panel

### The Group Lobby

- Participants join at `/lobby/[groupId]` — they wait in the lobby until you start the session
- You start the session via `POST /group/v1/lobby/:id/start` — the **Start Cohort** button in your admin panel triggers this
- Minimum cohort size is 4 participants — if fewer than 4 have joined at start time, wait up to 10 minutes; then contact admin to decide whether to proceed or reschedule
- Maximum cohort size is 12 participants — the system enforces this at booking; no action needed from you

### Moderator Controls

During a group session you have:
- **Voice turn-taking** — only one participant can speak at a time; you control the queue
- **Teaching mode** — mutes all participants; your voice is broadcast; participants can signal to speak
- **Individual mute** — you can mute a specific participant (use judiciously; only for safety reasons, not to silence distressing content)
- **Flag button** — same as individual sessions; flags the entire group session for Safety Engine review
- **End session** — ends the session for all participants simultaneously

### Cohort Conduct Rules

- Sessions are anonymous — no participant can see another participant's real identity
- Do not ask participants to share identifying information in the group (name, workplace, location)
- If a participant discloses crisis language in a group session, use the flag button immediately — the crisis protocol applies to group sessions exactly as it does to individual sessions
- Session notes for group sessions are aggregate — describe themes and dynamics, never attribute content to a specific participant (even anonymously)

### Refund Situations (Know These)

If H.I.P.S. cancels a cohort: full refund is issued to all participants — admin handles this, not you.
If a participant leaves after Week 1: 50% refund — admin handles this.
If a participant leaves before Week 1: full refund — admin handles this.

You are never responsible for processing refunds. If a participant raises a refund request during a session, direct them to: *"Please contact us at support@hips.foundation and we'll sort it out."*

---

## 7. Crisis Protocol — Your Responsibilities

This section applies to all facilitators. If you are a **designated crisis reviewer**, read the `crisis-reviewer-assignment.md` document in full — it contains your specific responsibilities, availability commitment, and sign-off requirement.

### The Three Tiers of Response

The Safety Engine runs in parallel to every session. It does not make decisions — you do.

**Tier 1 — Soft Alert**
- You receive a real-time flag indicator in the session UI
- No automatic action is taken
- You decide whether to acknowledge verbally and continue, or escalate

**Tier 2 — Escalation Review**
- You click the **Flag Session** button (`POST /session/v1/:id/flag`)
- The session is added to the escalation queue for post-session human review
- A soft alert notification goes to the designated crisis reviewer
- The session continues — you stay present with the participant

**Tier 3 — Crisis Protocol**
- A designated reviewer (you, if you hold that role, or the backup reviewer) initiates `POST /safety/v1/crisis/:id`
- **This action is permanent and logged.** It cannot be undone. It creates an immutable `VaultAccessLog` entry with your identity, the timestamp, and your justification.
- You must enter a justification before the action is accepted — "Participant expressed active suicidal ideation" is an example of an acceptable justification

### What Crisis Protocol Reveals

When you initiate the crisis protocol, the system surfaces **three fields only** from the Identity Vault:

| Field | Purpose |
|---|---|
| `emergencyContact` | To notify a contact if the participant consents |
| `region` | To surface the correct local emergency services number |
| `country` | To surface the correct local emergency services number |

**You cannot access, and will not see:**
- Participant real name
- Participant email address
- IP address
- Any session history
- Any other vault field

This is a hard technical constraint, not a trust decision.

### The 15-Minute SLA

From the moment a crisis flag is initiated, a designated reviewer must respond within **15 minutes**. The system:
1. Sends an SMS alert to the primary designated reviewer
2. Simultaneously sends an SMS alert to the backup reviewer
3. Simultaneously posts to the `#crisis-alerts` Slack channel
4. If unreviewed after 15 minutes: auto-promotes the alert to all `ADMIN` users

If you are a designated reviewer and you receive a crisis SMS, respond immediately. If you cannot respond (genuine emergency), confirm the backup reviewer is aware.

### What the Participant Sees

When the crisis protocol is initiated, the participant sees:

> **"You're not alone. Help is available right now."**

Followed by:
- 988 Suicide & Crisis Lifeline (call or text: 988)
- Crisis Text Line (text HOME to 741741)
- Local emergency services (based on their region)

> *"Our team has been alerted and will follow up. Help is available right now."*

The session does **not** automatically terminate. The participant remains connected. You remain present.

### Resolving a Crisis Escalation

You cannot close a `CRISIS_ACTIVE` escalation without logging a resolution note. The resolution note must include:
- What action was taken (e.g., 988 referenced, participant confirmed they are safe, emergency services contacted)
- Current status of the participant (to your knowledge at session end)
- Any follow-up required

Resolution notes are logged to the safety queue and reviewed by the Program Lead.

### Out-of-Hours Crisis

Sessions are only bookable Mon–Sat, 8am–9pm. In the rare event a crisis flag fires outside covered hours:
1. The system immediately displays crisis resources to the participant
2. The session is NOT terminated
3. SMS and Slack alerts fire to both designated reviewers regardless of the hour
4. No vault access occurs automatically
5. The escalation is flagged `PENDING_REVIEW` and reviewed at next staff availability

If you receive an out-of-hours crisis alert and you are not on call: attempt to respond anyway if you are able. If you cannot, confirm the backup reviewer is aware via SMS.

### Hard Rules (Non-Negotiable)

- **No AI makes a crisis decision.** Ever. You are the decision-maker.
- **No crisis action is undone.** Once `POST /safety/v1/crisis/:id` is called, the log entry is permanent.
- **988 must be shown at every crisis trigger.** If it is not displaying, treat this as a P1 platform bug and notify the Tech Lead immediately.
- **Never dismiss a crisis flag as a false positive without logging it.** Even if you believe the flag was triggered in error, you must log a resolution note explaining why.

---

## 8. Using Session Notes

Session notes are your primary record of what happened in a session. They are stored in the Session DB (not the Identity Vault or Commerce DB) and are tied to the anonymous session record — not to a participant's real identity.

### What to Write

Good session notes serve two purposes: they help you deliver continuity across sessions, and they are the source material for AI-generated summaries (Phase 2, if the participant opts in).

Write:
- Themes discussed (burnout, leadership transition, relationship strain, grief — at a conceptual level)
- Tone and energy of the session (participant seemed disengaged / was visibly relieved when discussing X)
- Resources referenced (e.g., "discussed work-life boundary strategies from the Leadership Toolkit")
- Any homework or reflection prompts agreed on
- Any safety flags triggered and their resolution
- Whether a follow-up topic was deferred to the next session

### What Never to Write

This is a compliance requirement enforced by the Program Lead during periodic note audits.

| ❌ Never Include | Why |
|---|---|
| Participant's real name | Links anonymous session to identity — forbidden |
| Participant's email, phone, workplace, or location | PII in an anonymous record |
| Clinical language (diagnosis, treatment, symptoms) | Copy Policy §3 — clinical framing is banned |
| Any statement that could constitute clinical advice | Legal liability |
| Identifying details of other participants (group sessions) | Privacy violation |
| Speculation about a participant's mental health diagnosis | Copy Policy §10 — AI output rules apply to notes too |
| Your personal opinions about the participant's character | Unprofessional; not what notes are for |

**The test:** If you deleted the session token from the database, could anyone reading your notes identify the participant? If yes, rewrite the note before saving.

### Note Format

There is no required template, but this structure is recommended:

```
Session themes:       [2–4 sentences]
Participant energy:   [1 sentence]
Resources discussed:  [bullet list or "none"]
Agreed next steps:    [bullet list or "none"]
Safety flags:         [none / describe if applicable]
Follow-up topics:     [none / describe if applicable]
```

Notes must be completed and saved within 30 minutes of session end. After 30 minutes, the note field is locked and requires Program Lead unlock.

---

## 9. AI Summary Review (Phase 2)

This section applies when the AI services (Phase 2) are live. AI summaries are **not active in v1**.

### How It Works

After a session ends:
1. The AI service generates a summary from your session notes — **not** from the raw audio
2. The summary appears in your review queue (linked from your `/admin/bookings` session detail)
3. You review, edit if needed, and approve — or reject
4. Only approved summaries are delivered to the participant

If you do not review within **24 hours**, the summary is held. It is never auto-sent.

### Review Checklist

Before approving any AI-generated summary:

- [ ] No banned terms from `COPY_POLICY.md` Section 3 (no "therapy," "counseling," "treatment," "diagnosis")
- [ ] No diagnostic or clinical language
- [ ] No spiritual authority statements ("God has a plan," "This is your purpose")
- [ ] No outcome predictions ("You will feel better," "This approach will resolve...")
- [ ] No identifying information (no names, no locations, no workplace references)
- [ ] Required disclaimer present if summary describes services
- [ ] Tone matches brand voice — warm, direct, grounded (see `COPY_POLICY.md` Section 6)
- [ ] Content is accurate to what actually occurred in the session

If the summary fails any item: **reject it** and flag it to the Program Lead. Do not edit it into compliance yourself unless the change is minor (a single word swap). For structural problems, rejection is the right call.

### What AI Output Must Never Contain

| Banned AI Output | Action |
|---|---|
| "Signs of depression" / "anxiety indicators" | Reject immediately — diagnostic language |
| "You should see a therapist" | Reject — misdirects and overclaims |
| "God has a plan for you" | Reject — spiritual authority |
| "You will feel better if..." | Reject — outcome prediction |
| Any reference to another group session participant | Reject — privacy violation |
| Real names or any identifying detail | Reject — PII violation |

---

## 10. Facilitator No-Show & Cancellation Policy

### If You Cannot Make a Session

**More than 24 hours in advance:**
- Notify the Program Lead by email or Slack immediately
- Do not attempt to contact the participant directly
- Admin will reassign the session or reschedule — participant is notified by email
- Session is marked `CANCELLED` in the system; participant's session balance is restored

**Less than 24 hours in advance (emergency only):**
- Notify the Program Lead by phone or SMS immediately
- Admin is notified automatically when a session reaches its scheduled start time without a facilitator joining
- Participant is notified and rescheduled at no penalty
- Session is marked `NO_SHOW` (facilitator) in the system — this is tracked

**Three facilitator no-shows in a rolling 90-day window** triggers a Program Lead review of your availability and platform access.

### If a Participant Does Not Show

- Wait 10 minutes past the scheduled session start time
- After 10 minutes with no participant: click **Mark No-Show** in your session detail
- The participant's session balance is **not consumed** — a no-show does not cost them a session
- Admin is notified automatically; the participant receives a reschedule offer
- You are available for your next session; this session counts as completed for scheduling purposes

### Cancellation vs. Reschedule

You do not manage cancellations or reschedules. All scheduling changes go through admin. If a participant raises a scheduling issue during a session: *"Reach out to us at support@hips.foundation and we'll get that sorted for you."*

---

## 11. Offboarding & Access Revocation

When your role as a facilitator ends — whether voluntarily or otherwise — the following steps are completed by the Tech Lead within 24 hours. This section is here so you understand the process, not so you execute it.

### What Happens When You Leave

1. Your Clerk account is removed from the H.I.P.S. organization — you lose all platform access
2. Your Cal.com facilitator profile is deactivated — no new bookings can be made against your availability
3. Any sessions assigned to you that have not yet occurred are reassigned by admin
4. `VAULT_API_SECRET` and `SESSION_SERVICE_SECRET` are rotated within 24 hours
5. Your access to the `#crisis-alerts` Slack channel is revoked
6. If you were a designated crisis reviewer: `crisis-reviewer-assignment.md` is updated with a replacement reviewer; `CRISIS_SMS_PRIMARY` or `CRISIS_SMS_BACKUP` is updated in AWS Secrets Manager; the Safety Engine team verifies alert delivery before the next session day

### VaultAccessLog Audit

Within 24 hours of your departure, the Tech Lead reviews the `VaultAccessLog` for any vault accesses you initiated in the last 90 days. This is a standard security review — it is not a statement about trust. All access logs are permanent and unmodifiable.

### Your Responsibilities Before Leaving

- Complete or hand off any active session assignments — notify the Program Lead of pending sessions
- Complete all outstanding session notes and AI summary reviews
- Do not retain any session content, notes, or participant-related information after your access is revoked
- If you were a designated crisis reviewer: confirm your replacement is trained before your last session day

---

*Document maintained by: Program Lead*
*Review cycle: Before every facilitator cohort onboarding; after any crisis protocol change*
*Change process: PR to `docs/ONBOARDING_FACILITATOR.md` · requires Program Lead + Tech Lead review*
*Companion documents: `COPY_POLICY.md` · `SECURITY_POLICY.md` · `crisis-reviewer-assignment.md` · `no-clinicians-commitment.md`*
*Every facilitator must sign the acknowledgement form confirming they have read this document before activation.*
