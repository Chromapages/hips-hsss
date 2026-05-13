'use client'
import { useState } from 'react'
import { Users, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge, Button, Card, EmptyState, SkeletonTableRow } from '@hips/ui'

export default function FacilitatorsPage() {
  const [page, setPage] = useState(1)
  const [loading] = useState(false)
  const facilitators: any[] = []
  const pagination = { page: 1, limit: 50, total: 0, totalPages: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">Facilitators</h2>
          <p className="text-sm text-neutral-600 mt-1">Manage facilitator schedules and availability</p>
        </div>
      </div>

      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <table className="w-full">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Facilitator</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Sessions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Upcoming</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Hours This Week</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>{Array.from({ length: 3 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)}</tbody>
            </table>
          ) : facilitators.length === 0 ? (
            <EmptyState heading="No facilitators yet" body="Facilitator accounts will appear here once created." />
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Facilitator</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Sessions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Upcoming</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Hours This Week</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {facilitators.map((f: any) => (
                  <tr key={f.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                        <span className="font-mono text-xs text-neutral-500">{f.id?.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{f.totalSessions ?? 0} total</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{f.upcomingCount ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {f.hoursThisWeek ?? 0}h
                    </td>
                    <td className="px-4 py-3"><Badge variant={f.isActive ? 'success' : 'error'}>{f.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card.Content>
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
