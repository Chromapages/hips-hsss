import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Session History — H.I.P.S.',
  robots: { index: false },
}

const MOCK_SESSIONS = [
  {
    id: 'ses_hist_1',
    serviceName: '60-Minute Support Session',
    facilitatorHandle: 'Facilitator #3',
    scheduledAt: '2026-04-28T14:00:00Z',
    status: 'COMPLETED',
  },
  {
    id: 'ses_hist_2',
    serviceName: '60-Minute Support Session',
    facilitatorHandle: 'Facilitator #7',
    scheduledAt: '2026-04-15T10:00:00Z',
    status: 'COMPLETED',
  },
  {
    id: 'ses_hist_3',
    serviceName: '30-Minute Intro Session',
    facilitatorHandle: 'Facilitator #3',
    scheduledAt: '2026-04-01T11:00:00Z',
    status: 'CANCELLED',
  },
]

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'text-success bg-success/10',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'text-neutral-500 bg-neutral-100',
  },
  NO_SHOW: {
    label: 'No Show',
    icon: XCircle,
    className: 'text-error bg-error/10',
  },
}

export default function SessionHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-deep">Session History</h1>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search sessions..."
            className="w-full rounded-lg border border-neutral-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            aria-label="Search sessions"
          />
        </div>
        <select
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Session list */}
      <div className="space-y-3">
        {MOCK_SESSIONS.map(session => {
          const config =
            STATUS_CONFIG[session.status] ?? STATUS_CONFIG.COMPLETED
          const Icon = config.icon
          return (
            <article
              key={session.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-warm">
                  <Calendar className="h-5 w-5 text-brand-deep" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">
                    {session.serviceName}
                  </h3>
                  <p className="text-sm text-neutral-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {new Date(session.scheduledAt).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {' · '}
                    <span className="font-mono text-xs">
                      {session.facilitatorHandle}
                    </span>
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {config.label}
              </span>
            </article>
          )
        })}
      </div>

      {/* Empty state */}
      {MOCK_SESSIONS.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-neutral-200 mx-auto mb-4" aria-hidden="true" />
          <h3 className="font-semibold text-neutral-900 mb-1">No sessions yet</h3>
          <p className="text-sm text-neutral-500 mb-4">
            Your completed sessions will appear here.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
          >
            Book a Session
          </Link>
        </div>
      )}
    </div>
  )
}
