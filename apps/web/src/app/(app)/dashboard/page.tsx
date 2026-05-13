'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/toast-provider'
import {
  Package,
  Calendar,
  Download,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react'
import { cn } from '@hips/ui'
import { SkeletonText } from '@hips/ui'

// Mock data — replace with API calls
const MOCK_USER = {
  name: 'Participant',
  packages: [
    {
      id: 'pkg_1',
      serviceName: '4-Session Package',
      totalSessions: 4,
      usedSessions: 1,
      expiresAt: '2026-08-01',
    },
  ],
  upcomingSessions: [
    {
      id: 'ses_1',
      serviceName: '60-Minute Support Session',
      facilitatorHandle: 'Facilitator #3',
      scheduledAt: '2026-05-12T14:00:00Z',
      status: 'CONFIRMED',
    },
  ],
  cohortAccess: {
    hasAccess: true,
    cohortName: 'Leadership Track — Spring 2026',
    nextSession: '2026-05-15T10:00:00Z',
  },
}

function ExpiryWarning({ expiresAt }: { expiresAt: string }) {
  const daysLeft = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )
  if (daysLeft <= 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-error">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        Expired
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
      Expires {new Date(expiresAt).toLocaleDateString()}
    </span>
  )
}

export default function DashboardPage() {
  const { addToast } = useToast()
  const [loading] = useState(false)

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Top nav */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-sans text-lg font-bold text-brand-deep">
            H.I.P.S.
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard/sessions"
              className="text-sm text-neutral-600 hover:text-brand-primary transition-colors"
            >
              Session History
            </Link>
            <Link
              href="/dashboard/packages"
              className="text-sm text-neutral-600 hover:text-brand-primary transition-colors"
            >
              Packages
            </Link>
            <Link
              href="/dashboard/downloads"
              className="text-sm text-neutral-600 hover:text-brand-primary transition-colors"
            >
              Downloads
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">
            Welcome back, {MOCK_USER.name}
          </h1>
          <p className="mt-1 text-neutral-500">
            Find Support. Stay Anonymous.
          </p>
        </div>

        {/* Package cards */}
        <section aria-labelledby="packages-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="packages-heading" className="text-lg font-semibold text-brand-deep">
              Your Packages
            </h2>
            <Link
              href="/dashboard/packages"
              className="text-sm text-brand-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <SkeletonText lines={1} className="h-32" />
              <SkeletonText lines={1} className="h-32" />
            </div>
          ) : MOCK_USER.packages.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
              <Package className="h-8 w-8 text-neutral-300 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-neutral-500 mb-4">
                No active packages. Book a session to get started.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {MOCK_USER.packages.map(pkg => (
                <article
                  key={pkg.id}
                  className="rounded-lg border border-neutral-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {pkg.serviceName}
                      </h3>
                      <ExpiryWarning expiresAt={pkg.expiresAt} />
                    </div>
                    <span className="font-mono text-sm text-brand-primary font-semibold">
                      {pkg.usedSessions}/{pkg.totalSessions}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full transition-all"
                        style={{
                          width: `${(pkg.usedSessions / pkg.totalSessions) * 100}%`,
                        }}
                        role="progressbar"
                        aria-valuenow={pkg.usedSessions}
                        aria-valuemin={0}
                        aria-valuemax={pkg.totalSessions}
                      />
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      {pkg.totalSessions - pkg.usedSessions} session
                      {pkg.totalSessions - pkg.usedSessions !== 1 ? 's' : ''}{' '}
                      remaining
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming sessions */}
        <section aria-labelledby="sessions-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sessions-heading" className="text-lg font-semibold text-brand-deep">
              Upcoming Sessions
            </h2>
            <Link
              href="/dashboard/sessions"
              className="text-sm text-brand-primary hover:underline flex items-center gap-1"
            >
              View history <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <SkeletonText lines={1} className="h-24" />
          ) : MOCK_USER.upcomingSessions.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
              <Calendar className="h-8 w-8 text-neutral-300 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-neutral-500 mb-4">
                No upcoming sessions scheduled.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
              >
                Book a Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_USER.upcomingSessions.map(session => (
                <article
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/10">
                      <Calendar
                        className="h-5 w-5 text-brand-accent"
                        aria-hidden="true"
                      />
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
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Confirmed
                    </span>
                    <Link
                      href={`/session/${session.id}`}
                      className="rounded-lg border border-brand-primary px-3 py-1.5 text-sm font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors"
                    >
                      Join
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Cohort access */}
        {MOCK_USER.cohortAccess.hasAccess && (
          <section aria-labelledby="cohort-heading">
            <h2 id="cohort-heading" className="text-lg font-semibold text-brand-deep mb-4">
              Cohort Access
            </h2>
            <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-brand-accent" aria-hidden="true" />
                <h3 className="font-semibold text-neutral-900">
                  {MOCK_USER.cohortAccess.cohortName}
                </h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Next session:{' '}
                {new Date(MOCK_USER.cohortAccess.nextSession).toLocaleString(
                  'en-US',
                  {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  },
                )}
              </p>
              <Link
                href="/lobby/cohort-spring-2026"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-accent/80 transition-colors"
              >
                Enter Cohort Lobby
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
