# H.I.P.S. Foundation Platform

Hiding in Plain Sight is a nonprofit anonymous peer-support platform. This
workspace implements the local foundation from `HIPS_Implementation_Plan_Part1.md`:
strict TypeScript, a Next.js demo, separated database schemas, service
boundaries, environment templates, and CI guardrails.

## Workspace

```text
apps/web                  Next.js commerce and demo UI
packages/db               Separate Prisma schemas for commerce, session, vault
packages/types            Shared non-PII TypeScript contracts
services/session          Anonymous session-token boundary
services/safety           Safety escalation boundary
services/vault            Identity-vault crypto boundary
infra/cdk                 AWS infrastructure notes
scripts                   Verification scripts
```

## Commands

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm separation
pnpm build
```

## Hard Anonymity Rule

Session data must never contain commerce or identity fields. The local
`pnpm separation` check scans the session/safety surfaces for forbidden
identifiers and blocks cross-service ownership imports.

## Demo

Run `pnpm dev` and open `/demo` for the frontend-only client prototype showing
the proof-of-anonymity flow, mock booking dashboard, CSS virtual office, and
crisis overlay concept.
