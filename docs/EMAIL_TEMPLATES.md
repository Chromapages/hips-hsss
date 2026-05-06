# H.I.P.S. Email Templates

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Email Templates Reference
**Version:** 1.0
**Status:** Canonical — all platform emails must conform to these templates
**Date:** April 24, 2026
**Authority:** Tech Lead + Program Lead
**Companion Documents:** `COPY_POLICY.md` · `DESIGN_SYSTEM.md`
**Email Provider:** Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`)

---

## Table of Contents

1. [How to Use This Document](#1-how-to-use-this-document)
2. [Participant Emails — Transactional](#2-participant-emails--transactional)
3. [Participant Emails — Scholarship](#3-participant-emails--scholarship)
4. [Participant Emails — Account](#4-participant-emails--account)
5. [Commerce Emails](#5-commerce-emails)
6. [Org Buyer Emails](#6-org-buyer-emails)
7. [Facilitator & Admin Emails (Internal)](#7-facilitator--admin-emails-internal)
8. [Group Cohort Emails](#8-group-cohort-emails)
9. [Global Template Rules](#9-global-template-rules)

---

## 1. How to Use This Document

### Structure of Each Template

Every template in this document follows this format:

```
Template ID:    Unique identifier used in code (e.g., BOOKING_CONFIRMATION)
Trigger:        What platform event sends this email
Audience:       Who receives it
Subject:        Exact subject line (max 50 chars, no ALL CAPS)
Preheader:      Displayed in email client preview pane (max 100 chars)
From:           Always "H.I.P.S. Foundation" — never a personal name
Unsubscribe:    Required / Not required (transactional emails do not require it)
Disclaimer:     Required / Not required
Body:           Section-by-section content spec
Variables:      Template variables populated at send time
```

### Template Variables

Variables are wrapped in double curly braces: `{{variable_name}}`. These are populated by the Resend send call in the relevant API route or webhook handler.

**Standard variables available to all templates:**

| Variable | Value |
|---|---|
| `{{app_url}}` | `https://hips.foundation` |
| `{{dashboard_url}}` | `https://hips.foundation/dashboard` |
| `{{support_email}}` | `support@hips.foundation` |
| `{{org_name}}` | `H.I.P.S. Foundation` |
| `{{org_ein}}` | `[EIN — set before launch]` |
| `{{current_year}}` | Current year (rendered at send time) |

### Implementation Notes

- All templates are implemented as `.mjml` or React Email components in `apps/web/emails/`
- The `REQUIRED_DISCLAIMER` constant is imported from `packages/types/src/copy-policy.ts` — never retyped inline
- Crisis resources (`CRISIS_RESOURCES`) are imported from the same file for any template that requires them
- The copy CI scanner (`pnpm check:copy`) scans all files in `apps/web/emails/` — banned terms in email templates block PR merge
- Sender name `"H.I.P.S. Foundation"` is set globally in the Resend client configuration — never override it per-template

### Trigger Map (Quick Reference)

| Template ID | Trigger |
|---|---|
| `BOOKING_CONFIRMATION` | `POST /api/v1/sessions/book` success |
| `SESSION_REMINDER_24H` | Cron job — 24h before `session.scheduledAt` |
| `PACKAGE_PURCHASE` | `POST /api/v1/packages/purchase` success |
| `PACKAGE_EXPIRY_WARNING` | Cron job — when `usedSessions / totalSessions >= 0.75` |
| `FOLLOW_UP_SURVEY` | Cron job — 48h after `session.status = COMPLETED` |
| `SCHOLARSHIP_APPROVED` | `PATCH /api/v1/scholarships/:id` → status: APPROVED |
| `SCHOLARSHIP_DENIED` | `PATCH /api/v1/scholarships/:id` → status: DENIED |
| `WELCOME` | Firebase `user.created` webhook |
| `SESSION_CANCELLATION` | `session.status = CANCELLED` (any actor) |
| `ACCOUNT_DELETION_CONFIRMATION` | Participant deletion request processed |
| `DONATION_RECEIPT` | `payment_intent.succeeded` (donation PaymentIntent) |
| `DIGITAL_PRODUCT_DELIVERY` | `payment_intent.succeeded` (digital product) |
| `MEMBERSHIP_WELCOME` | `customer.subscription.created` |
| `MEMBERSHIP_CANCELLATION` | `customer.subscription.deleted` |
| `ORG_INQUIRY_RECEIVED` | `POST /api/v1/organizations/inquiry` success |
| `ORG_QUOTE_SENT` | Admin sends quote from `/admin/organizations` |
| `ORG_DEPOSIT_CONFIRMED` | Org deposit `payment_intent.succeeded` |
| `ORG_PRE_EVENT_LOGISTICS` | Cron job — 48h before confirmed org event |
| `CRISIS_ALERT_INTERNAL` | `POST /safety/v1/crisis/:id` — facilitator/admin only |
| `FACILITATOR_SESSION_ASSIGNED` | Admin assigns facilitator to session |
| `FACILITATOR_NO_SHOW_ALERT` | Session start + 10min with no facilitator join |
| `COHORT_CONFIRMATION` | Cohort booking `payment_intent.succeeded` |
| `COHORT_REMINDER_72H` | Cron job — 72h before each cohort session |
| `COHORT_CANCELLATION_HIPS` | Admin cancels cohort |
| `COHORT_CANCELLATION_PARTICIPANT` | Participant cancels cohort seat |

---

## 2. Participant Emails — Transactional

---

### T-01 · BOOKING_CONFIRMATION

```
Template ID:    BOOKING_CONFIRMATION
Trigger:        POST /api/v1/sessions/book — success
Audience:       Participant (Firebase email)
Subject:        "Your session is confirmed — {{session_date}}"
Preheader:      "You're booked for {{session_time}}. Here's everything you need."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        Your session is confirmed.

Section 1 — Session Details
  Service:      {{service_name}}   [approved term only — e.g. "Care Access Session"]
  Date:         {{session_date}}   [e.g. "Monday, May 12, 2026"]
  Time:         {{session_time}}   [e.g. "2:00 PM – 3:00 PM PDT"]
  Format:       Voice session with avatar — laptop or desktop required

Section 2 — How to Join
  "On the day of your session, sign in at hips.foundation and click
   'Join Session' from your dashboard. Sessions require a laptop or
   desktop — mobile devices cannot initiate sessions."
  CTA button:   "Go to Dashboard"  →  {{dashboard_url}}

Section 3 — Need to reschedule?
  "Life happens. If you need to reschedule, contact us at least
   24 hours in advance at {{support_email}}."

Section 4 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Section 5 — Crisis resources (always included)
  "If you need support before your session:
   988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}} · {{app_url}}
```

**Variables required:** `session_date`, `session_time`, `service_name`

**Tone:** Warm, practical, brief. No urgency. No clinical language.

---

### T-02 · SESSION_REMINDER_24H

```
Template ID:    SESSION_REMINDER_24H
Trigger:        Cron — 24h before session.scheduledAt
Audience:       Participant
Subject:        "Your session is tomorrow — {{session_time}}"
Preheader:      "A quick reminder for your {{service_name}} tomorrow."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required (reminder only)
```

**Body:**

```
Heading:        See you tomorrow.

Section 1 — Session Details (brief)
  Date:         {{session_date}}
  Time:         {{session_time}}
  Join:         Sign in at hips.foundation → Dashboard → Join Session

Section 2 — Technical reminder
  "Sessions require a laptop or desktop. Make sure your microphone
   is working before you join."
  CTA button:   "Go to Dashboard"  →  {{dashboard_url}}

Section 3 — Reschedule link
  "Need to reschedule? Contact us at {{support_email}} as soon as possible."

Section 4 — Crisis resources (always included)
  "988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `session_date`, `session_time`, `service_name`

**Tone:** Brief, calm, practical. Shorter than the confirmation email.

---

### T-03 · PACKAGE_PURCHASE

```
Template ID:    PACKAGE_PURCHASE
Trigger:        POST /api/v1/packages/purchase — success
Audience:       Participant
Subject:        "Your session package is ready"
Preheader:      "{{total_sessions}} sessions are now in your account. Here's how to use them."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        Your package is ready.

Section 1 — Package Summary
  Package:      {{package_name}}   [e.g. "4-Session Package"]
  Sessions:     {{total_sessions}} sessions
  Expires:      {{expiry_date}}    [90 days from purchase]
  Amount paid:  ${{amount_paid}}

Section 2 — How to book
  "Book your sessions one at a time from your dashboard. Your
   session balance is always visible at the top of your dashboard."
  CTA button:   "Book Your First Session"  →  {{dashboard_url}}/book

Section 3 — Expiry reminder
  "Sessions in this package expire on {{expiry_date}}. Packages
   are non-refundable after the first session is used."

Section 4 — Scholarship note (show only if isScholarship = true)
  "Scholarship pricing has been applied to your package.
   You'll receive the same experience as all other participants."

Section 5 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `package_name`, `total_sessions`, `expiry_date`, `amount_paid`, `is_scholarship` (boolean)

**Tone:** Encouraging, practical. Scholarship note must be dignified — not pitying.

---

### T-04 · PACKAGE_EXPIRY_WARNING

```
Template ID:    PACKAGE_EXPIRY_WARNING
Trigger:        Cron — when usedSessions / totalSessions >= 0.75
Audience:       Participant
Subject:        "Your session package expires on {{expiry_date}}"
Preheader:      "You have {{sessions_remaining}} session(s) left. Book before they expire."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        A reminder about your session package.

Section 1 — Status
  Sessions remaining:   {{sessions_remaining}}
  Expiry date:          {{expiry_date}}

Section 2 — CTA
  "Book your remaining session(s) before they expire."
  CTA button:   "Book Now"  →  {{dashboard_url}}/book

Section 3 — Renewal
  "When you're ready for more, you can purchase a new package
   from your dashboard at any time."

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `sessions_remaining`, `expiry_date`

**Tone:** Gentle reminder. No urgency language. No "Act now" — no "Don't wait."

---

### T-05 · FOLLOW_UP_SURVEY

```
Template ID:    FOLLOW_UP_SURVEY
Trigger:        Cron — 48h after session.status = COMPLETED
Audience:       Participant
Subject:        "How was your session?"
Preheader:      "When you're ready, we'd love to hear from you. No obligation."
From:           H.I.P.S. Foundation
Unsubscribe:    Required (marketing-adjacent)
Disclaimer:     Not required
```

**Body:**

```
Heading:        How was your session?

Section 1 — Invitation
  "When you're ready, we'd love a few minutes of your feedback.
   There's no obligation to respond — and no right or wrong answers."
  CTA button:   "Share Your Feedback"  →  {{survey_url}}

Section 2 — Low pressure close
  "Your feedback helps us improve the experience for everyone
   who uses H.I.P.S. Thank you for being here."

Section 3 — Crisis resources (always included)
  "If you need support:
   988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}} · Unsubscribe
```

**Variables required:** `survey_url`

**Tone:** Low-pressure, appreciative. "When you're ready" — never "Please respond by [date]."

---

## 3. Participant Emails — Scholarship

---

### S-01 · SCHOLARSHIP_APPROVED

```
Template ID:    SCHOLARSHIP_APPROVED
Trigger:        PATCH /api/v1/scholarships/:id → status: APPROVED
Audience:       Participant
Subject:        "Your scholarship application has been approved"
Preheader:      "Your discount code is ready. Here's how to use it."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (SCHOLARSHIP_DISCLAIMER from copy-policy.ts)
```

**Body:**

```
Heading:        You're all set.

Section 1 — Approval notice
  "We're glad to make this accessible. Your scholarship has been
   approved for the following:"
  Service:          {{service_name}}
  Approved amount:  ${{approved_amount}} off
  Discount code:    {{discount_code}}
  Code expires:     {{code_expiry_date}}   [30 days from approval]

Section 2 — How to use
  "Enter your discount code at checkout. It applies automatically
   to the service listed above."
  CTA button:   "Book Now"  →  {{booking_url}}

Section 3 — Scholarship disclaimer
  {{SCHOLARSHIP_DISCLAIMER}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `service_name`, `approved_amount`, `discount_code`, `code_expiry_date`, `booking_url`

**Tone:** Encouraging, not pitying. "We're glad to make this accessible" — never "We know this is hard for you." Never imply charity. Never reveal the underlying pricing or scholarship budget.

**Hard rules:**
- Do not include the participant's stated reason for needing scholarship in this email
- Do not reveal how much scholarship budget remains
- Scholarship recipients receive identical service — the email must not suggest otherwise

---

### S-02 · SCHOLARSHIP_DENIED

```
Template ID:    SCHOLARSHIP_DENIED
Trigger:        PATCH /api/v1/scholarships/:id → status: DENIED
Audience:       Participant
Subject:        "Your H.I.P.S. scholarship application"
Preheader:      "Here's what's available to support your access."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Thank you for applying.

Section 1 — Denial notice (warm, non-dismissive)
  "We weren't able to approve this application at this time.
   We know access matters, so here's what's available:"

Section 2 — Alternatives
  Option A — Sliding-scale pricing
    "Our sliding-scale options start at {{sliding_scale_min}} for
     this service. Select your rate at checkout — no application needed."
    CTA button: "View Pricing"  →  {{service_url}}

  Option B — Waitlist (show only if scholarship cap is reached)
    "Our scholarship fund is currently at capacity. We've added
     you to the waitlist — we'll notify you when a spot opens."

Section 3 — Reapplication
  "You're welcome to reapply in 30 days. Applications are reviewed
   within 48 hours."
  CTA button:   "Reapply"  →  {{scholarship_url}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `sliding_scale_min`, `service_url`, `scholarship_url`, `is_waitlisted` (boolean)

**Tone:** Warm, non-dismissive. Never state the reason for denial. No income-related language. No judgment. "We weren't able to approve this application" — not "You don't qualify."

---

## 4. Participant Emails — Account

---

### A-01 · WELCOME

```
Template ID:    WELCOME
Trigger:        Firebase user.created webhook
Audience:       New participant (all roles)
Subject:        "Welcome to H.I.P.S."
Preheader:      "Your account is ready. Here's where to start."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        Welcome. We're glad you're here.

Section 1 — Brief introduction
  "H.I.P.S. is a space for peer support, coaching, and care
   navigation — built for leaders who need a confidential place
   to restore. Your account is ready."

Section 2 — What to do next
  - "Browse available sessions" → {{app_url}}/services
  - "Book your first session" → {{dashboard_url}}/book
  - "Apply for scholarship pricing" → {{app_url}}/scholarship

Section 3 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Section 4 — Crisis resources
  "If you need support right now:
   988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}} · {{app_url}}
```

**Tone:** Warm, brief, grounded. "We're glad you're here" — not "Thank you for registering." No urgency CTAs.

---

### A-02 · SESSION_CANCELLATION

```
Template ID:    SESSION_CANCELLATION
Trigger:        session.status = CANCELLED (any actor — participant, admin, or facilitator no-show)
Audience:       Participant
Subject:        "Your session on {{session_date}} has been cancelled"
Preheader:      "Here's what happened and how to rebook."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Your session has been cancelled.

Section 1 — What happened
  Conditional copy by cancellation actor:

  IF cancelled by participant:
    "Your session on {{session_date}} at {{session_time}} has
     been cancelled as requested."

  IF cancelled by admin / facilitator no-show:
    "We had to cancel your session on {{session_date}} at
     {{session_time}}. We're sorry for the disruption."

Section 2 — Session balance (show only if session was from a package)
  "Your session has been returned to your package balance.
   You still have {{sessions_remaining}} session(s) available."

Section 3 — Rebook CTA
  CTA button:   "Book a New Session"  →  {{dashboard_url}}/book

Section 4 — Crisis resources
  "If you need support in the meantime:
   988 — call or text | Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `session_date`, `session_time`, `cancelled_by` (enum: PARTICIPANT | PLATFORM), `sessions_remaining` (optional)

**Tone:** Honest, calm, non-alarming. Admin/platform cancellations acknowledge the disruption directly.

---

### A-03 · ACCOUNT_DELETION_CONFIRMATION

```
Template ID:    ACCOUNT_DELETION_CONFIRMATION
Trigger:        Participant deletion request processed (soft-delete applied)
Audience:       Participant
Subject:        "Your H.I.P.S. account deletion request"
Preheader:      "We've received your request. Here's what happens next."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        We've received your deletion request.

Section 1 — What was deleted
  "The following data has been removed from your account:
   · Your account profile
   · Your Identity Vault record (name, emergency contact, region)
   · Your IP address and device data
   Hard deletion completes within 30 days."

Section 2 — What is retained (with legal basis)
  "Some records are retained as required by law:
   · Financial records (session bookings, payments) — 7 years, IRS requirement
   · Donation records — permanent, IRS 501(c)(3) requirement
   · Consent and disclosure records — permanent, platform legal record
   · Audit log entries — permanent, legal record
   These records contain no personal identification — your name
   and contact details have been removed."

Section 3 — Questions
  "If you have questions about your data, contact us at
   privacy@hips.foundation."

Footer:         {{org_name}} · privacy@hips.foundation
```

**Tone:** Clear, factual, non-defensive. Explain what is retained and why, without making the participant feel their request was ignored.

---

## 5. Commerce Emails

---

### C-01 · DONATION_RECEIPT

```
Template ID:    DONATION_RECEIPT
Trigger:        payment_intent.succeeded (donation PaymentIntent only)
Audience:       Donor (authenticated or anonymous)
Subject:        "Thank you — your donation receipt from H.I.P.S. Foundation"
Preheader:      "Your tax-deductible receipt for ${{amount}} on {{donation_date}}."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (DONATION_RECEIPT_DISCLAIMER from copy-policy.ts)
```

**Body:**

```
Heading:        Thank you for your support.

Section 1 — Impact statement (brief, honest)
  Conditional by donation tier:
  SPONSOR_SESSION:  "Your gift funds a peer support session for someone who needs it."
  RESTORE_SESSION:  "Your gift funds a coaching session for a leader in restoration."
  RESTORE_LEADER:   "Your gift funds a full coaching package for a leader in need."
  CUSTOM:           "Your gift supports the H.I.P.S. scholarship fund."

Section 2 — Receipt (verbatim from DONATION_RECEIPT_DISCLAIMER)
  {{DONATION_RECEIPT_DISCLAIMER}}
  Populated fields:
    Org name:   H.I.P.S. Foundation
    EIN:        {{org_ein}}
    Amount:     ${{amount}}
    Date:       {{donation_date}}

Section 3 — Optional: donate again
  CTA button:   "Make Another Gift"  →  {{app_url}}/donate
  (Low-key, no pressure copy — "Whenever you're ready.")

Footer:         {{org_name}} · {{org_ein}} · {{support_email}}
```

**Variables required:** `amount`, `donation_date`, `donation_tier`

**Hard rules:**
- Donations and service purchases are always separate Stripe charges — this receipt covers the donation only
- Receipt text must match the `DONATION_RECEIPT_DISCLAIMER` constant exactly — do not paraphrase
- For donations over $250: the "no goods or services" statement is legally required (included in the constant)

---

### C-02 · DIGITAL_PRODUCT_DELIVERY

```
Template ID:    DIGITAL_PRODUCT_DELIVERY
Trigger:        payment_intent.succeeded (digital product)
Audience:       Participant
Subject:        "Your download from H.I.P.S. is ready"
Preheader:      "{{product_name}} is ready to download. Your link expires in 24 hours."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (DIGITAL_PRODUCT_DISCLAIMER from copy-policy.ts)
```

**Body:**

```
Heading:        Your download is ready.

Section 1 — Product info
  Product:      {{product_name}}
  Amount paid:  ${{amount_paid}}

Section 2 — Download CTA
  "Your secure download link is below. It expires in 24 hours —
   save the file before it expires."
  CTA button:   "Download {{product_name}}"  →  {{signed_download_url}}

Section 3 — Link expiry notice
  "If your link expires before you download, sign in to your
   dashboard to generate a new one."
  Link:         {{dashboard_url}}/downloads

Section 4 — Disclaimer
  {{DIGITAL_PRODUCT_DISCLAIMER}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `product_name`, `amount_paid`, `signed_download_url`

**Hard rule:** `signed_download_url` must be generated at send time with a 24-hour Supabase signed URL (`SIGNED_URL_EXPIRY_SECONDS=86400`). Never store or reuse the URL.

---

### C-03 · MEMBERSHIP_WELCOME

```
Template ID:    MEMBERSHIP_WELCOME
Trigger:        customer.subscription.created (Membership subscription)
Audience:       Participant
Subject:        "Your H.I.P.S. membership is active"
Preheader:      "Your library access is ready. Here's everything that's included."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        Welcome to the membership library.

Section 1 — What's included
  "Your membership gives you access to:
   · All workbooks and course replays
   · The full Leadership Toolkit library
   · New resources as they're added"
  CTA button:   "Go to Your Library"  →  {{dashboard_url}}/downloads

Section 2 — Billing
  "Your membership renews on {{next_billing_date}} at $15/month.
   Cancel any time from your dashboard — cancellation takes effect
   at the end of your current billing period."

Section 3 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `next_billing_date`

---

### C-04 · MEMBERSHIP_CANCELLATION

```
Template ID:    MEMBERSHIP_CANCELLATION
Trigger:        customer.subscription.deleted (Membership subscription)
Audience:       Participant
Subject:        "Your H.I.P.S. membership has been cancelled"
Preheader:      "Your access continues until {{access_end_date}}."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Your membership has been cancelled.

Section 1 — Access window
  "Your library access continues until {{access_end_date}}.
   After that date, your downloads will no longer be available."

Section 2 — Reactivation
  "You can reactivate your membership at any time from your
   dashboard."
  CTA button:   "Reactivate Membership"  →  {{dashboard_url}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `access_end_date`

**Tone:** Calm, factual. No "We're sad to see you go." No urgency to reactivate.

---

## 6. Org Buyer Emails

---

### O-01 · ORG_INQUIRY_RECEIVED

```
Template ID:    ORG_INQUIRY_RECEIVED
Trigger:        POST /api/v1/organizations/inquiry — success
Audience:       Org contact (contactEmail from OrgInquiry)
Subject:        "We received your inquiry — H.I.P.S. Foundation"
Preheader:      "We'll be in touch with a quote within 48 hours."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        We received your inquiry.

Section 1 — Confirmation
  "Thank you for reaching out. We received your inquiry for
   {{event_type}} and will respond with a quote within 48 hours."

Section 2 — What to expect
  "Our team will review your request and send a custom quote
   to this email address. The quote will include a Stripe payment
   link for the 50% deposit required to confirm your booking."

Section 3 — Your inquiry summary
  Organization:   {{org_name}}
  Event type:     {{event_type}}
  Preferred date: {{preferred_date}}
  Headcount:      {{headcount}}

Section 4 — Questions
  "In the meantime, reach us at {{support_email}}."

Section 5 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `org_name`, `event_type`, `preferred_date`, `headcount`

---

### O-02 · ORG_QUOTE_SENT

```
Template ID:    ORG_QUOTE_SENT
Trigger:        Admin sends quote from /admin/organizations
Audience:       Org contact
Subject:        "Your H.I.P.S. quote is ready — {{org_name}}"
Preheader:      "Review your quote and pay the deposit to confirm your booking."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Your quote is ready.

Section 1 — Quote summary
  Organization:       {{org_name}}
  Event type:         {{event_type}}
  Date:               {{event_date}}
  Headcount:          {{headcount}}
  Quote total:        ${{quote_total}}
  Deposit required:   ${{deposit_amount}} (50% of total)
  Remaining balance:  ${{remainder_amount}} — due 7 days before event

Section 2 — Deposit CTA
  "Pay your deposit to confirm your booking. The remaining balance
   will be invoiced 7 days before your event."
  CTA button:   "Pay Deposit — ${{deposit_amount}}"  →  {{stripe_payment_link}}

Section 3 — Cancellation policy
  "Deposits are non-refundable if cancelled within 14 days of
   your event. Cancellations before that window receive a full
   refund of the deposit."

Section 4 — Questions
  "Reply to this email or contact us at {{support_email}}."

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `org_name`, `event_type`, `event_date`, `headcount`, `quote_total`, `deposit_amount`, `remainder_amount`, `stripe_payment_link`

---

### O-03 · ORG_DEPOSIT_CONFIRMED

```
Template ID:    ORG_DEPOSIT_CONFIRMED
Trigger:        Org deposit payment_intent.succeeded
Audience:       Org contact
Subject:        "Your booking is confirmed — {{event_date}}"
Preheader:      "Deposit received. Your event is confirmed."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Your booking is confirmed.

Section 1 — Confirmation
  Organization:       {{org_name}}
  Event:              {{event_type}}
  Date:               {{event_date}}
  Deposit paid:       ${{deposit_amount}} on {{payment_date}}
  Balance due:        ${{remainder_amount}} by {{balance_due_date}}

Section 2 — Next steps
  "We'll send logistics details 48 hours before your event.
   The remaining balance of ${{remainder_amount}} will be invoiced
   by {{balance_due_date}}."

Section 3 — Questions
  "Contact us at {{support_email}} with any questions."

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `org_name`, `event_type`, `event_date`, `deposit_amount`, `payment_date`, `remainder_amount`, `balance_due_date`

---

### O-04 · ORG_PRE_EVENT_LOGISTICS

```
Template ID:    ORG_PRE_EVENT_LOGISTICS
Trigger:        Cron — 48h before confirmed org event date
Audience:       Org contact
Subject:        "Your event is in 48 hours — here's everything you need"
Preheader:      "Logistics for {{event_type}} on {{event_date}}."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        You're 48 hours away.

Section 1 — Event reminder
  Event:        {{event_type}}
  Date:         {{event_date}}
  Time:         {{event_time}}
  Location:     {{event_location}}   [or "Virtual — join link below"]

Section 2 — Logistics
  "Here's what to expect on the day:
   · {{logistics_details}}"   [admin-populated field from quote builder]

Section 3 — Join / location details
  IF virtual:   "Join link: {{virtual_join_link}}"
  IF in-person: "Address: {{event_address}}"

Section 4 — Final balance reminder (if unpaid)
  "A reminder that your final balance of ${{remainder_amount}}
   was due on {{balance_due_date}}. Please contact us at
   {{support_email}} if you have any questions about payment."
  [Show only if payment_status != PAID]

Section 5 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `event_type`, `event_date`, `event_time`, `event_location`, `logistics_details`, `remainder_amount`, `balance_due_date`, `payment_status`

---

## 7. Facilitator & Admin Emails (Internal)

These emails are sent to facilitator or admin email addresses only. They are never sent to participants. They use operational language — warm tone is not required.

---

### I-01 · FACILITATOR_SESSION_ASSIGNED

```
Template ID:    FACILITATOR_SESSION_ASSIGNED
Trigger:        Admin assigns facilitator to session in /admin/bookings
Audience:       Facilitator (Firebase email)
Subject:        "New session assigned — {{session_date}} at {{session_time}}"
Preheader:      "A session has been assigned to your calendar."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required
Disclaimer:     Not required
```

**Body:**

```
Heading:        You have a new session.

Section 1 — Session details
  Service:      {{service_name}}
  Date:         {{session_date}}
  Time:         {{session_time}}
  Session ID:   {{session_id}}   [anonymous — no participant name or identity]

Section 2 — Action
  "This session will appear in your dashboard.
   Join 5 minutes before the scheduled start time."
  CTA button:   "View in Dashboard"  →  {{admin_bookings_url}}

Section 3 — Reminders
  "Remember: you will not see the participant's real name or
   identity. Sessions require a laptop. Have 988 available."

Footer:         {{org_name}} · Internal · {{support_email}}
```

**Variables required:** `session_date`, `session_time`, `service_name`, `session_id`

**Hard rule:** Never include participant name, email, or any identity in this email. `session_id` is the anonymous session reference only.

---

### I-02 · CRISIS_ALERT_INTERNAL

```
Template ID:    CRISIS_ALERT_INTERNAL
Trigger:        POST /safety/v1/crisis/:id — crisis protocol initiated
Audience:       Designated crisis reviewers (FACILITATOR + ADMIN roles)
Subject:        "⚠️ Crisis flag — Session {{session_id}} requires review"
Preheader:      "Human review required within 15 minutes."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required
Disclaimer:     Not required
```

**Body:**

```
Heading:        ⚠️ Crisis flag — immediate review required.

Section 1 — Alert
  Session ID:   {{session_id}}   [anonymous]
  Flagged at:   {{flag_timestamp}}
  SLA:          Review required by {{sla_deadline}}   [flag_timestamp + 15 min]

Section 2 — Action
  "Open the safety queue to review and respond."
  CTA button:   "Open Safety Queue"  →  {{admin_safety_url}}

Section 3 — Reminder
  "You are accessing this session under the crisis protocol.
   Only emergencyContact, region, and country will be surfaced
   from the Identity Vault. All access is permanently logged."

Footer:         {{org_name}} · Internal — DO NOT FORWARD
```

**Variables required:** `session_id`, `flag_timestamp`, `sla_deadline`

**Hard rules:**
- Subject line includes `⚠️` emoji — this is intentional to break through notification filters
- Never include participant name, email, or any identity in this email
- `DO NOT FORWARD` in footer — this is an operational requirement
- This email is supplementary to the SMS alert — both fire simultaneously; do not rely on email alone for crisis response

---

### I-03 · FACILITATOR_NO_SHOW_ALERT

```
Template ID:    FACILITATOR_NO_SHOW_ALERT
Trigger:        Session start time + 10 minutes with no facilitator join event
Audience:       Admin
Subject:        "⚠️ Facilitator no-show — Session {{session_id}}"
Preheader:      "No facilitator has joined. Participant needs reassignment."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required
Disclaimer:     Not required
```

**Body:**

```
Heading:        Facilitator has not joined.

Section 1 — Details
  Session ID:       {{session_id}}
  Scheduled time:   {{session_time}}
  Facilitator ID:   {{facilitator_id}}   [Firebase user ID — not shown to participant]
  Time elapsed:     10 minutes past scheduled start

Section 2 — Required actions
  "1. Contact the facilitator immediately.
   2. Notify the participant — they will receive an email and
      rescheduling offer automatically.
   3. Mark the session NO_SHOW (facilitator) in the admin panel.
   4. Reassign or reschedule the session."
  CTA button:   "Open Session in Admin"  →  {{admin_session_url}}

Footer:         {{org_name}} · Internal
```

**Variables required:** `session_id`, `session_time`, `facilitator_id`

**Note:** The participant receives the `SESSION_CANCELLATION` email (A-02) automatically. Their session balance is not consumed. This email goes to admin only.

---

## 8. Group Cohort Emails

---

### G-01 · COHORT_CONFIRMATION

```
Template ID:    COHORT_CONFIRMATION
Trigger:        payment_intent.succeeded (cohort booking)
Audience:       Participant
Subject:        "You're in — {{cohort_name}} starts {{cohort_start_date}}"
Preheader:      "Your cohort seat is confirmed. Here's what to expect."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Required (REQUIRED_DISCLAIMER)
```

**Body:**

```
Heading:        You're in the cohort.

Section 1 — Cohort details
  Cohort:           {{cohort_name}}
  Start date:       {{cohort_start_date}}
  Session schedule: {{session_schedule}}   [e.g. "Tuesdays at 6pm PDT — 6 sessions"]
  Format:           Voice session with avatar — laptop or desktop required
  Amount paid:      ${{amount_paid}}

Section 2 — What to expect
  "You'll receive a reminder 72 hours before each session.
   Sessions are anonymous — your avatar is your identity in the room.
   The cohort holds 4–12 participants."

Section 3 — Refund policy
  "Full refund if you leave before Week 1. 50% refund if you
   leave after Week 1. No refund after Week 2."

Section 4 — Join instructions
  "On session day, sign in at hips.foundation and click
   'Join Cohort' from your dashboard."
  CTA button:   "Go to Dashboard"  →  {{dashboard_url}}

Section 5 — Disclaimer
  {{REQUIRED_DISCLAIMER}}

Section 6 — Crisis resources
  "If you need support:
   988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `cohort_name`, `cohort_start_date`, `session_schedule`, `amount_paid`

---

### G-02 · COHORT_REMINDER_72H

```
Template ID:    COHORT_REMINDER_72H
Trigger:        Cron — 72h before each cohort session date
Audience:       All confirmed cohort participants
Subject:        "Your cohort session is in 3 days — {{session_date}}"
Preheader:      "A reminder for {{cohort_name}} on {{session_date}} at {{session_time}}."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Your next cohort session is coming up.

Section 1 — Session reminder
  Cohort:       {{cohort_name}}
  Date:         {{session_date}}
  Time:         {{session_time}}

Section 2 — Join instructions
  "Sign in at hips.foundation and join from your dashboard.
   Sessions require a laptop or desktop."
  CTA button:   "Go to Dashboard"  →  {{dashboard_url}}

Section 3 — Crisis resources (always included)
  "988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `cohort_name`, `session_date`, `session_time`

**Tone:** Brief. This is a utility email — don't over-engineer it.

---

### G-03 · COHORT_CANCELLATION_HIPS

```
Template ID:    COHORT_CANCELLATION_HIPS
Trigger:        Admin cancels cohort from /admin/bookings
Audience:       All confirmed cohort participants
Subject:        "Important: {{cohort_name}} has been cancelled"
Preheader:      "A full refund is on its way."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        We've had to cancel this cohort.

Section 1 — Cancellation notice
  "We've had to cancel {{cohort_name}}. We're sorry for the
   disruption. A full refund of ${{amount_paid}} will be
   returned to your original payment method within 5–10
   business days."

Section 2 — Next steps
  "If you'd like to join a future cohort, you can view upcoming
   dates on our website."
  CTA button:   "View Upcoming Cohorts"  →  {{app_url}}/services

Section 3 — Questions
  "Contact us at {{support_email}} — we're here."

Section 4 — Crisis resources
  "988 Suicide & Crisis Lifeline — call or text 988
   Crisis Text Line — text HOME to 741741"

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `cohort_name`, `amount_paid`

**Tone:** Direct and honest. Acknowledge the disruption. Do not minimize it.

---

### G-04 · COHORT_CANCELLATION_PARTICIPANT

```
Template ID:    COHORT_CANCELLATION_PARTICIPANT
Trigger:        Participant cancels cohort seat (admin-processed)
Audience:       Participant
Subject:        "Your cohort cancellation — {{cohort_name}}"
Preheader:      "Your cancellation has been processed. Here's your refund status."
From:           H.I.P.S. Foundation
Unsubscribe:    Not required (transactional)
Disclaimer:     Not required
```

**Body:**

```
Heading:        Your cancellation has been processed.

Section 1 — Refund status
  Conditional by timing:

  IF before Week 1:
    "A full refund of ${{amount_paid}} will be returned to your
     original payment method within 5–10 business days."

  IF after Week 1 (through Week 2):
    "A 50% refund of ${{refund_amount}} will be returned to your
     original payment method within 5–10 business days."

  IF after Week 2:
    "Per our cohort policy, cancellations after Week 2 are not
     eligible for a refund. If you have an exceptional circumstance,
     please contact us at {{support_email}}."

Section 2 — Future options
  CTA button:   "View Other Sessions"  →  {{app_url}}/services

Footer:         {{org_name}} · {{support_email}}
```

**Variables required:** `cohort_name`, `amount_paid`, `refund_amount`, `cancellation_timing` (enum: BEFORE_WEEK_1 | AFTER_WEEK_1 | AFTER_WEEK_2)

---

## 9. Global Template Rules

These rules apply to every email in this document without exception. They are derived from `COPY_POLICY.md` Section 8. If a template in this document appears to conflict with these rules, these rules win.

### Subject Lines
- Maximum 50 characters
- No ALL CAPS
- No urgency language: "Act now," "Don't wait," "Last chance," "Urgent"
- Sentence case: capitalize first word only (except proper nouns)
- Variables in subject lines must never expose PII (no names, no email addresses)

### Sender Name
- Always: `H.I.P.S. Foundation`
- Never: a personal name, facilitator name, or admin name
- Configured globally in the Resend client — never overridden per template

### Preheader Text
- Required on every email
- Maximum 100 characters
- Must add context beyond the subject line — do not repeat the subject

### Unsubscribe Links
- **Required** on: `FOLLOW_UP_SURVEY`, `MEMBERSHIP_WELCOME`, `MEMBERSHIP_CANCELLATION`, and any future marketing email
- **Not required** on: all transactional emails (booking confirmations, receipts, crisis alerts, account emails)
- When required: link must be functional and honor the unsubscribe within 10 business days

### Disclaimer Constants
- `REQUIRED_DISCLAIMER` — import from `packages/types/src/copy-policy.ts` — never retype inline
- `DONATION_RECEIPT_DISCLAIMER` — import from same file
- `SCHOLARSHIP_DISCLAIMER` — import from same file
- `DIGITAL_PRODUCT_DISCLAIMER` — import from same file
- Running `pnpm check:copy` will catch any retyped or paraphrased disclaimer text

### Crisis Resources
- **988 link format:** `<a href="tel:988">988</a>` — never plain text only
- **Crisis Text Line link format:** `<a href="sms:741741">text HOME to 741741</a>`
- Required on: T-01, T-02, T-05, A-01, A-02, G-01, G-02, G-03 — and any new template that a participant might read in a distressed state
- Never minimize: do not use "if you're having a hard time" — use the verbatim crisis resource copy

### Banned Language
All emails are scanned by `pnpm check:copy` on every PR. Full banned term list is in `COPY_POLICY.md` Section 3. Key rules:
- Never: "therapy," "therapist," "counseling," "counselor," "treatment," "diagnosis," "clinical"
- Never: outcome predictions in any subject line, heading, or body copy
- Never: urgency language in any participant-facing email
- Never: participant's real name in any subject line (identity exposure risk)

### Footer Requirements
All emails must include:
- Org name: `H.I.P.S. Foundation`
- Contact: `support@hips.foundation` (or `privacy@hips.foundation` for data-related emails)
- Platform URL: `https://hips.foundation` (transactional emails only; not internal emails)
- Unsubscribe link (where required — see above)
- Current year (rendered at send time via `{{current_year}}`)

### Internal Emails
Internal emails (I-01, I-02, I-03) follow different rules:
- Warm tone is not required — operational clarity is the priority
- `DO NOT FORWARD` note is required on crisis alert emails (I-02)
- Never include participant PII, real name, email, or identity in any internal email
- Session references use anonymous session IDs only

---

*Document maintained by: Tech Lead + Program Lead*
*Review cycle: Before every public launch; when new email flows are added; when COPY_POLICY.md is updated*
*Change process: PR to `docs/EMAIL_TEMPLATES.md` · requires Tech Lead + Program Lead review · `pnpm check:copy` must pass*
*Implementation: `apps/web/emails/` · Resend send calls in API routes and webhook handlers*
*All template variables must be validated with Zod before the Resend send call is made.*
