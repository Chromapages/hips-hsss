# H.I.P.S. Platform — No Clinicians Commitment
**Document Type:** Binding Decision Record
**Decision Date:** April 23, 2026
**Decision:** No clinicians — peer support / coaching only, v1 through v3
**Authority:** Founder
**Status:** LOCKED — change requires founder + legal + full compliance re-scope

---

## Commitment Statement

The H.I.P.S. platform provides **peer support, coaching, and care navigation
services only**. The platform does not, and will not in versions 1 through 3:

- Staff licensed therapists, psychologists, social workers, or any licensed
  mental health professionals in a clinical capacity
- Deliver licensed therapy, counseling, or mental health treatment
- Accept insurance or generate superbills
- Operate as a HIPAA covered entity (clinical)
- Provide diagnosis, clinical assessment, or treatment planning

This commitment is binding on all engineering, product, content, and
operational decisions for versions 1 through 3 of the platform.

---

## What This Means for the Build

| Domain | Implication |
|---|---|
| **Service copy** | All content uses approved language from `copy-policy.ts`. "Therapy," "treatment," "diagnosis," "clinical" are banned. |
| **Disclaimers** | `REQUIRED_DISCLAIMER` from `copy-policy.ts` appears on every service page. No exceptions. |
| **Safety Engine** | Crisis pathway displays 988 + local resources. Human facilitator (not clinician) initiates escalation. No clinical supervision workflow. |
| **Facilitators** | Trained peer support leaders. Not licensed. Introductions never imply clinical credentials. |
| **AI Services** | No diagnostic language. No clinical recommendations. No treatment references. |
| **Legal review** | All copy reviewed against approved language list. No legal review required for copy that uses only approved terms. |
| **Org sales** | Workshop and retreat language describes "coaching," "training," and "peer support" — never "clinical intervention" or "mental health treatment." |

---

## If Clinicians Are Ever Considered (Future)

Adding licensed clinicians is NOT a feature addition to this platform.
It requires:

1. A separate legal entity (or formal restructuring)
2. Full HIPAA covered entity compliance re-scope
3. State licensure in every jurisdiction where participants reside
4. Clinical supervision audit trail (new architecture component)
5. Professional liability / malpractice insurance
6. Complete rewrite of all platform copy, disclaimers, and service descriptions
7. New BAA agreements with every vendor that touches clinical data

**This is effectively a new platform, not a new feature.**

---

## Approved Language Reference

See `packages/types/src/copy-policy.ts` for the complete approved/banned
language list, `REQUIRED_DISCLAIMER` text, and `CRISIS_RESOURCES` constants.

---

## Sign-off

> **Founder:** ___________________________  **Date:** April 23, 2026
> **Legal Reviewer:** ___________________ (required before first public launch)