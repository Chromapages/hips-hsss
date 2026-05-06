'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Badge, Button, Card, CardContent, EmptyState, SkeletonTableRow } from '@hips/ui'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function BookingsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('ALL')
  const [loading] = useState(false)
  const sessions: any[] = []
  const pagination = { page: 1, limit: 50, total: 0, totalPages: 0 }

  const statusVariant = (s: string) => {
    if (s === 'COMPLETED') return 'success'
    if (s === 'PENDING' || s === 'CONFIRMED') return 'warning'
    if (s === 'CANCELLED' || s === 'NO_SHOW') return 'error'
    return 'default'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">Bookings</h2>
          <p className="text-sm text-neutral-600 mt-1">Manage all session bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Session</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Paid</th>
              </tr></thead>
              <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)}</tbody>
            </table>
          ) : sessions.length === 0 ? (
            <EmptyState heading="No sessions yet" body="Book your first session to get started." />
          ) : (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Session</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Paid</th>
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {sessions.map((s: any) => (
                  <tr key={s.sessionId} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-neutral-500">{s.sessionId?.slice(0, 8)}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-xs text-neutral-500">{s.userId?.slice(0, 8)}</span></td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{s.serviceName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant(s.status) as any}>{s.status}</Badge></td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{formatPrice(s.pricePaid ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination.page === 1}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={pagination.page === pagination.totalPages}>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
