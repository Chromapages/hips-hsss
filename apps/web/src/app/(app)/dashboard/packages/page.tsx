import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Package, AlertCircle, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Package Balance — H.I.P.S.',
  robots: { index: false },
}

const MOCK_PACKAGES = [
  {
    id: 'pkg_1',
    serviceName: '4-Session Package',
    serviceSlug: '4-session-package',
    totalSessions: 4,
    usedSessions: 1,
    purchasedAt: '2026-04-01',
    expiresAt: '2026-07-01',
    status: 'ACTIVE',
  },
  {
    id: 'pkg_2',
    serviceName: '8-Session Package',
    serviceSlug: '8-session-package',
    totalSessions: 8,
    usedSessions: 0,
    purchasedAt: '2026-03-15',
    expiresAt: '2026-06-15',
    status: 'ACTIVE',
  },
]

function ExpiryWarning({ expiresAt }: { expiresAt: string }) {
  const daysLeft = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )
  if (daysLeft <= 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-error">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        Expired — no refunds
      </span>
    )
  }
  if (daysLeft <= 14) {
    return (
      <span className="flex items-center gap-1 text-xs text-warning">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
      </span>
    )
  }
  return (
    <span className="text-xs text-neutral-500">
      Expires {new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
    </span>
  )
}

export default function PackagesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-brand-deep mb-6">Package Balance</h1>

      <div className="space-y-4">
        {MOCK_PACKAGES.map(pkg => {
          const remaining = pkg.totalSessions - pkg.usedSessions
          const percentUsed = (pkg.usedSessions / pkg.totalSessions) * 100

          return (
            <article
              key={pkg.id}
              className="rounded-xl border border-neutral-200 bg-white overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      {pkg.serviceName}
                    </h2>
                    <ExpiryWarning expiresAt={pkg.expiresAt} />
                  </div>
                  <span className="font-mono text-2xl font-bold text-brand-primary">
                    {remaining}
                    <span className="text-sm font-normal text-neutral-400">
                      /{pkg.totalSessions}
                    </span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-accent rounded-full transition-all"
                    style={{ width: `${100 - percentUsed}%` }}
                    role="progressbar"
                    aria-valuenow={remaining}
                    aria-valuemin={0}
                    aria-valuemax={pkg.totalSessions}
                    aria-label={`${remaining} sessions remaining`}
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-neutral-500">
                    {pkg.usedSessions} session{pkg.usedSessions !== 1 ? 's' : ''}{' '}
                    used · Purchased {new Date(pkg.purchasedAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/book/${pkg.serviceSlug}`}
                    className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
                  >
                    Book next session
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {MOCK_PACKAGES.length === 0 && (
        <div className="text-center py-12 rounded-lg border border-neutral-200 bg-white">
          <Package className="h-12 w-12 text-neutral-200 mx-auto mb-4" aria-hidden="true" />
          <h3 className="font-semibold text-neutral-900 mb-1">No active packages</h3>
          <p className="text-sm text-neutral-500 mb-4">
            Purchase a package to get discounted sessions.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
          >
            View Services
          </Link>
        </div>
      )}
    </div>
  )
}
