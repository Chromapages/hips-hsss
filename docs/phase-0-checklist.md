# Phase 0 Local Foundation Checklist

Implemented locally:

- pnpm workspace metadata.
- Strict TypeScript configuration.
- Next.js app moved to `apps/web`.
- Environment templates for Firebase, Stripe, databases, internal services, and
  email.
- GitHub Actions CI and data-separation workflows.
- Hard-anonymity separation scanner.
- Branching and commit convention docs.

External provisioning still required:

- Vercel project and production/preview environment variables.
- Railway PostgreSQL instances for commerce and session development.
- Firebase project, auth providers, and storage bucket.
- Stripe account and webhook endpoint.
- Resend account and verified sender domain.
