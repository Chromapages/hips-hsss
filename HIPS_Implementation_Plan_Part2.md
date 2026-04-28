# H.I.P.S. Implementation Plan — Part 2

**Phases 4–11: Session Engine → Production Launch**

---

## PHASE 4 — Email & Notifications (Week 8-9)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 4.1 | Configure Resend transactional email templates | BE | M | 0.12 |
| 4.2 | Booking confirmation email (24hr reminder) | BE | M | 3.2 |
| 4.3 | Payment receipt email (Stripe data, nonprofit disclaimer) | BE | M | 3.6 |
| 4.4 | Scholarship approval/denial email | BE | S | 3.10 |
| 4.5 | Donation receipt email (501(c)(3) tax language) | BE | M | 3.7 |
| 4.6 | Package expiry warning email (75% window) | BE | S | 1A.5 |
| 4.7 | Session reminder cron (24hr advance) | BE | M | 3.2 |
| 4.8 | Org inquiry acknowledgement email | BE | S | 3.8 |

**Phase 4 Gate:** All transactional emails render correctly, no PII leaks in email logs, disclaimer present on all receipts.

### Email Content Rules

- ❌ **Never** use: "therapy", "treatment", "diagnosis", "clinical", "patient"
- ✅ **Always** use: "peer support", "coaching", "care navigation", "participant"
- ✅ **Always** include: crisis resource (988) in session-related emails
- ✅ **Always** include: 501(c)(3) nonprofit disclaimer on donation receipts

---

## PHASE 5 — Session Engine: WebRTC + Three.js (Weeks 9-13) 🎯 Core Product

> This is the **core product experience** — anonymous voice sessions in a virtual office.

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 5.1 | Provision LiveKit server (self-hosted, HIPAA VPC) | Infra | L | 1C.1 |
| 5.2 | Build LiveKit token issuance service (anonymous identity) | BE | L | 2.5, 5.1 |
| 5.3 | Build session lifecycle manager (create → active → end) | BE | L | 1B.2 |
| 5.4 | Build WebRTC voice connection handler | FE | L | 5.1-2 |
| 5.5 | Build Three.js virtual office room scene | FE | XL | — |
| 5.6 | Build avatar system (12 styles × 3 palettes, gesture presets) | FE | XL | 5.5 |
| 5.7 | Build voice controls bar (mute, gesture, flag, end) | FE | L | 5.4 |
| 5.8 | Build session header (anon handle, timer, connection quality) | FE | M | 5.4 |
| 5.9 | Build group session lobby (waiting room, participant list) | FE | L | 5.3 |
| 5.10 | Build active speaker detection + avatar ring animation | FE | M | 5.4, 5.6 |
| 5.11 | Build session flag/report handler | Full | M | 5.7 |
| 5.12 | Build mobile block page (sessions require laptop ≥1024px) | FE | S | — |
| 5.13 | Build WebGL fallback (audio-only if WebGL unavailable) | FE | M | 5.5 |
| 5.14 | Session reconnection logic (network interruption handling) | Full | L | 5.3-4 |
| 5.15 | Build facilitator session view (notes panel, participant list) | FE | L | 5.5-8 |

### Three.js Performance Targets

| Metric | Target |
|---|---|
| Frame rate | 60fps on MacBook Air M1 |
| Max draw calls | 50 per frame |
| Avatar polygon count | ~2,000 polys max |
| Shadow maps | Disabled on `navigator.hardwareConcurrency < 4` |
| Asset loading | `React.lazy` + `Suspense`, cached in `sessionStorage` |

### Avatar System Rules

- 12 base styles (abstract, non-photorealistic — **no real faces**)
- 3 color palette options per style
- Parameters **lock on session start** — no mid-session changes
- Stored in session token only — **never persisted to identity**
- Facilitator avatar: distinct border ring, not labeled by real name
- 5 gesture presets: `idle`, `nodding`, `raised-hand`, `thinking`, `applause`

### LiveKit Token Security

```typescript
// Session Service: Generate anonymous LiveKit token
const generateSessionToken = (sessionId: string): string => {
  const anonIdentity = crypto.randomUUID(); // No Firebase UID
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: anonIdentity,     // Random, ephemeral
    ttl: SESSION_DURATION + 300, // Session + 5min buffer
  });
  token.addGrant({
    roomJoin: true,
    room: `session-${sessionId}`,
    canPublish: true,
    canSubscribe: true,
  });
  return token.toJwt();
};
```

**Phase 5 Gate:** 1:1 and group voice sessions work end-to-end, avatars render correctly, mobile block enforced, WebGL fallback functional.

---

## PHASE 6 — Safety Engine (Weeks 12-14) ⚠️ CRITICAL

> **Human-in-the-loop is mandatory.** No automated AI crisis decisions. Ever.

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 6.1 | Build Safety Engine NestJS service | BE | L | 1B.4, 1C.1 |
| 6.2 | Build keyword monitoring system (configurable word lists) | BE | L | 6.1 |
| 6.3 | Build facilitator manual flag API | BE | M | 6.1 |
| 6.4 | Build escalation queue (admin-facing) | BE | M | 6.1 |
| 6.5 | Build crisis protocol trigger (human-initiated only) | BE | L | 6.1, 1C.6 |
| 6.6 | Build crisis overlay component (`<CrisisEscalation>`) | FE | L | — |
| 6.7 | Build vault access request flow (justification required) | BE | L | 6.5, 1C.10 |
| 6.8 | Build SNS alerting for crisis events (PagerDuty + Slack) | Infra | M | 6.5 |
| 6.9 | Build safety queue admin UI | FE | L | 6.4 |
| 6.10 | Write crisis protocol integration tests | Full | L | ALL |

### Crisis Overlay Requirements (Non-Negotiable)

```tsx
// <CrisisEscalation> component must implement:
// - role="alertdialog"
// - aria-labelledby → heading
// - aria-describedby → resource list  
// - Focus trap (keyboard cannot leave overlay)
// - Escape key does NOT close overlay
// - Phone numbers as <a href="tel:988"> links
// - Screen reader announces "Crisis resources. Help is available."
```

### Crisis Escalation Flow

```
1. Flag triggered (facilitator manual OR keyword match)
2. → Safety Engine creates AuditEvent (INSERT only)
3. → Escalation appears in admin safety queue
4. → Admin reviews flag context (session ref, not identity)
5. → IF crisis: Admin initiates vault access with justification
6. → Vault API authenticates internal secret
7. → Vault decrypts emergency contact via KMS
8. → VaultAccessLog entry created (INSERT only, immutable)
9. → Admin contacts emergency services
10. → Crisis overlay displayed to participant
```

**Phase 6 Gate:** Crisis protocol tested end-to-end, VaultAccessLog immutability verified, overlay accessibility audited, SNS alerts confirmed firing.

---

## PHASE 7 — Frontend Build (Weeks 13-17)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 7.1 | Set up design system (`packages/ui`) with color/typography tokens | FE | L | — |
| 7.2 | Build marketing homepage | FE | L | 7.1 |
| 7.3 | Build service catalog page (/services) | FE | M | 3.1, 7.1 |
| 7.4 | Build service detail page (/services/:slug) | FE | M | 3.1 |
| 7.5 | Build booking flow (availability → checkout) | FE | L | 3.2, 3.9 |
| 7.6 | Build Stripe checkout page with Elements | FE | L | 3.5 |
| 7.7 | Build participant dashboard (/dashboard) | FE | L | 2.10 |
| 7.8 | Build packages page (/packages) | FE | M | 3.3 |
| 7.9 | Build scholarship application form | FE | M | 3.4 |
| 7.10 | Build donation page (/donate, 4 tiers) | FE | M | 3.7 |
| 7.11 | Build org inquiry page (/organizations) | FE | M | 3.8 |
| 7.12 | Build facilitator dashboard (/facilitator) | FE | L | 2.9 |
| 7.13 | Build responsive layouts (mobile browse, desktop sessions) | FE | L | ALL |

### Design System Tokens (from `DESIGN_SYSTEM.md`)

| Token | Value | Usage |
|---|---|---|
| `--color-brand-primary` | `#2D5A8E` | CTAs, active nav, focus rings |
| `--color-brand-secondary` | `#4A8FA8` | Secondary buttons, hover |
| `--color-brand-accent` | `#7BC4C4` | Highlights, badges, progress |
| `--color-brand-warm` | `#E8D5B7` | Background warmth, cards |
| `--color-brand-deep` | `#1A3A5C` | Dark headings, footer |
| `--color-crisis` | `#7F1D1D` | Crisis overlay ONLY |

### UI State Requirements (Every Component)

| State | Treatment |
|---|---|
| Loading | Skeleton matching component shape, `animate-pulse` |
| Empty | Icon (48px) + heading + body + CTA |
| Error | `semantic-error` banner + retry button |
| Success | `semantic-success` + next step |
| Disabled | `opacity-50`, `cursor-not-allowed`, tooltip |

**Phase 7 Gate:** All pages render, responsive layouts verified, axe-core zero violations, all 5 UI states implemented per component.

---

## PHASE 8 — Admin Panel (Weeks 16-18)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 8.1 | Build admin dashboard with KPI cards | FE | L | 3.11 |
| 8.2 | Build scholarship approval queue | FE | L | 3.10 |
| 8.3 | Build safety escalation queue | FE | L | 6.9 |
| 8.4 | Build revenue reporting dashboard | FE | L | 3.11 |
| 8.5 | Build org inquiry management | FE | M | 3.8 |
| 8.6 | Build facilitator management (assign/remove) | FE | M | 2.3 |
| 8.7 | Build vault access audit log viewer | FE | M | 1C.11 |
| 8.8 | Build session history viewer (anonymized) | FE | M | 1B.2 |

**Phase 8 Gate:** Admin can manage all operational workflows, vault access log is read-only with no raw PII exposed.

---

## PHASE 9 — Testing & QA (Weeks 18-20)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 9.1 | Unit tests: all API routes (Zod validation, auth, business logic) | Full | L | ALL |
| 9.2 | Integration tests: cross-service separation (assert connection refused) | Full | L | ALL |
| 9.3 | E2E tests: booking → payment → session → end (Playwright) | Full | XL | ALL |
| 9.4 | Load testing: concurrent voice sessions (target: 50 simultaneous) | Infra | L | 5.1 |
| 9.5 | Accessibility audit: axe-core + manual keyboard + screen reader | FE | L | 7.1-13 |
| 9.6 | Security scan: `gitleaks` + `pnpm audit` + ESLint rules | Infra | M | ALL |
| 9.7 | Cross-service data separation integration test suite | Full | L | ALL |
| 9.8 | Crisis protocol full-path test (flag → escalation → vault → overlay) | Full | L | 6.1-10 |
| 9.9 | Copy audit: scan all UI for banned clinical language | FE | M | 7.1-13 |

### Data Separation Test Suite (Critical)

```typescript
// Must pass before any production traffic
describe('Data Separation', () => {
  it('session service cannot connect to commerce DB', async () => {
    await expect(sessionService.query('SELECT 1 FROM "User"'))
      .rejects.toThrow();
  });
  
  it('commerce service cannot connect to vault DB', async () => {
    await expect(commerceService.query('SELECT 1 FROM "IdentityRecord"'))
      .rejects.toThrow();
  });
  
  it('session DB contains no PII fields', async () => {
    const columns = await getSessionDBColumns();
    const piiFields = ['email', 'realName', 'phone', 'firebaseUid'];
    piiFields.forEach(field => {
      expect(columns).not.toContain(field);
    });
  });
});
```

---

## PHASE 10 — Pre-Launch Security Gates (Week 20-21)

> **Every gate must pass. No exceptions. No deferrals.**

### Security Checklist

- [ ] Identity Vault penetration test — all findings resolved
- [ ] Session ↔ Commerce separation integration test passes
- [ ] CloudTrail active (all regions)
- [ ] GuardDuty active
- [ ] Security Hub active (HIPAA standard)
- [ ] All production secrets in AWS Secrets Manager / Vercel — zero in VCS
- [ ] CloudWatch alarms verified firing (test each)
- [ ] AWS HIPAA BAA signed and activated
- [ ] `gitleaks` pre-commit hook installed
- [ ] VaultAccessLog INSERT-only constraint verified in production
- [ ] KMS key rotation confirmed active (90-day schedule)
- [ ] All DB users verified: no UPDATE/DELETE on audit tables
- [ ] Rate limits configured and tested on all endpoints

### CloudWatch Alarms (Must Be Active)

| Alarm | Threshold | Action |
|---|---|---|
| Vault Access Spike | ≥2 accesses in 10min outside crisis | SNS → PagerDuty P0 |
| Vault Auth Failures | ≥5 failures in 5min | SNS → PagerDuty P1 |
| KMS Decrypt Spike | ≥50 calls in 5min | SNS → PagerDuty + Slack |
| Commerce Auth Failures | ≥20 in 5min | SNS → Slack |
| 5xx Error Spike | ≥10 in 2min | SNS → PagerDuty P1 |

---

## PHASE 11 — Production Launch (Week 21-22)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 11.1 | Switch Stripe test → live keys | Infra | S | 10.ALL |
| 11.2 | Register production webhook endpoint in Stripe | Infra | S | 11.1 |
| 11.3 | Process $1 test transaction → verify receipt → refund | Full | S | 11.1-2 |
| 11.4 | Configure production domain DNS | Infra | S | — |
| 11.5 | Deploy all services to production ECS | Infra | L | ALL |
| 11.6 | Run full post-deploy verification checklist | Full | M | 11.5 |
| 11.7 | Soft launch: invite-only beta (10-20 participants) | Ops | — | 11.6 |
| 11.8 | Monitor for 72 hours: Sentry, CloudWatch, Stripe | Ops | — | 11.7 |
| 11.9 | Public launch | Ops | — | 11.8 |

---

## 8. AWS Infrastructure Summary

```
VPC: 10.0.0.0/16
├── Public Subnet (10.0.1.0/24)
│   └── ALB — TLS termination, routes to ECS
├── Private Subnet A (10.0.2.0/24) — Application
│   ├── ECS Fargate: hips-vault
│   ├── ECS Fargate: hips-session
│   ├── ECS Fargate: hips-safety
│   └── ECS Fargate: hips-calcom
└── Private Subnet B (10.0.3.0/24) — Data (ISOLATED)
    ├── RDS: vault-db  ← vault service SG ONLY
    └── RDS: session-db ← session + safety SG ONLY
    └── NO internet gateway route
```

### IAM Roles (Least Privilege)

| Role | Permissions |
|---|---|
| `hips-vault-service-role` | KMS Encrypt/Decrypt, Secrets Manager (vault only), RDS (vault-db only) |
| `hips-session-service-role` | Secrets Manager (session only), RDS (session-db only) |
| `hips-safety-service-role` | RDS (session-db read only), SNS Publish (crisis alerts) |
| `hips-infra-role` | ECS UpdateService, ECR Push — no production secret read |

> **Hard rule:** No IAM role has `*` on any resource. No cross-service DB access.

---

## 9. Timeline Summary

| Phase | Duration | Key Deliverable | Gate |
|---|---|---|---|
| **0** | Week 1 | Monorepo + CI + external services | CI green, no secrets in VCS |
| **0.5** | Week 1.5 | Interactive Client Demo | Client approval of visual direction |
| **1A/1B** | Weeks 2-3 | Database schemas | Migrations reversible, seed data works |
| **1C** | Weeks 3-5 | Identity Vault (⚠️ critical path) | Pen test passed, immutability verified |
| **2** | Weeks 5-6 | Firebase Auth + anonymous tokens | Auth flows verified, token isolation confirmed |
| **3** | Weeks 6-8 | Commerce API + Stripe | E2E payment in test mode |
| **4** | Weeks 8-9 | Email/notifications | All emails render, no PII in logs |
| **5** | Weeks 9-13 | WebRTC + Three.js sessions | Voice sessions work, avatar rendering |
| **6** | Weeks 12-14 | Safety Engine + crisis protocol | Crisis path tested, overlay accessible |
| **7** | Weeks 13-17 | Frontend (all pages) | axe-core zero violations |
| **8** | Weeks 16-18 | Admin panel | All ops workflows functional |
| **9** | Weeks 18-20 | Testing + QA | Data separation tests pass |
| **10** | Weeks 20-21 | Security gates | All gates passed |
| **11** | Weeks 21-22 | Production launch | Soft launch → public launch |

**Total estimated timeline: ~22 weeks (5.5 months)**

---

## 10. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Identity-session data linkage discovered | **P0 Critical** | Defense-in-depth: code, CI, infra, DB, test enforcement |
| KMS key compromise | **P0 Critical** | 90-day rotation, break-glass only admin access, CloudTrail |
| WebRTC quality issues on low-bandwidth | **P1 High** | Connection quality indicator, graceful degradation to audio-only |
| Three.js performance on older hardware | **P1 High** | Performance targets defined, WebGL fallback, shadow map toggle |
| Firebase Auth outage | **P1 High** | Session tokens independent of Firebase; active sessions unaffected |
| Stripe webhook failures | **P1 High** | Idempotent handlers, replay from Stripe dashboard |
| Clinical language in UI copy | **P2 Medium** | ESLint `check:copy` rule, quarterly legal review |
| Scholarship budget overrun | **P2 Medium** | Monthly cap tracking in admin dashboard |

---

## 11. Recurring Operations (Post-Launch)

| Cadence | Task |
|---|---|
| **Daily** | IP expiry job, session reminders, package warnings |
| **Weekly** | Sentry review, uptime check, Stripe webhook health, VaultAccessLog audit |
| **Monthly** | Rotate VAULT_API_SECRET + SESSION_SERVICE_SECRET, test DB backup restore |
| **Quarterly** | Full pen test, dependency audit, copy review, DR drill |
| **Annually** | Third-party security audit, KMS key policy review |

---

> **Critical Reminder:** The Identity Vault and the data separation between services are the **primary technical risks**. Any code change affecting cross-service communication must strictly adhere to the enforcement layers defined in this plan. No exceptions.
