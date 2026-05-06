'use client'
import { useState } from 'react'
import { AlertOctagon, ChevronLeft, ChevronRight, ShieldAlert, CheckCircle, Clock } from 'lucide-react'
import { Badge, Button, Card, CardContent, EmptyState, SkeletonTableRow } from '@hips/ui'

const SEVERITY_BADGES: Record<string, 'error' | 'warning' | 'info'> = {
  TIER_1: 'info',
  TIER_2: 'warning',
  TIER_3: 'error',
}

export default function SafetyPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'PENDING' | 'REVIEWING' | 'RESOLVED'>('PENDING')
  const [loading] = useState(false)
  const escalations: any[] = []
  const pagination = { page: 1, limit: 50, total: 0, totalPages: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">Safety</h2>
          <p className="text-sm text-neutral-600 mt-1">Monitor session escalations and crisis protocols</p>
        </div>
      </div>

      {/* Crisis alert banner — shows only when TIER_3 active */}
      <div className="rounded-lg bg-crisis/5 border border-crisis/20 p-4 flex items-center gap-3" role="alert" aria-live="polite">
        <AlertOctagon className="h-5 w-5 text-crisis shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-crisis">No active crisis protocols</p>
          <p className="text-xs text-crisis/80 mt-0.5">All sessions are operating normally. Crisis resources are available 24/7.</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {(['PENDING', 'REVIEWING', 'RESOLVED'] as const).map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${status === s ? 'border-brand-primary text-brand-primary' : 'border-transparent text-neutral-600 hover:text-neutral-900'}`}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
            {s === 'PENDING' && escalations.length > 0 && (
              <span className="ml-2 rounded-full bg-error/10 text-error text-xs px-2 py-0.5">{escalations.length}</span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Session</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Flag Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">SLA Due</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>{Array.from({ length: 3 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)}</tbody>
            </table>
          ) : escalations.length === 0 ? (
            <EmptyState heading="Queue is clear" body="No active escalations." />
          ) : (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Session</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Flag Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">SLA Due</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {escalations.map((e: any) => (
                  <tr key={e.escalationId} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-neutral-500">{e.sessionId?.slice(0, 8)}</span></td>
                    <td className="px-4 py-3"><Badge variant={SEVERITY_BADGES[e.tier] ?? 'default'}>Tier {e.tier.replace('TIER_', '')}</Badge></td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{e.flagType}</td>
                    <td className="px-4 py-3">
                      {e.slaDue ? (
                        <span className="text-sm text-neutral-600 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {new Date(e.slaDue).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3"><Badge variant={e.status === 'RESOLVED' ? 'success' : e.status === 'REVIEWING' ? 'warning' : 'default'}>{e.status}</Badge></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        {e.status === 'RESOLVED' ? 'View' : 'Review'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination.page === 1}><ChevronLeft className="h-4 w-4" aria-hidden="true" /></Button>
            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={pagination.page === pagination.totalPages}><ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
