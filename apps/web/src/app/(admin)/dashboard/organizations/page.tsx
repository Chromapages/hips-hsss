'use client'
import { useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, Mail, ExternalLink, DollarSign } from 'lucide-react'
import { Badge, Button, Card, CardContent, EmptyState, SkeletonTableRow } from '@hips/ui'

const STATUS_BADGES: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  NEW: 'info', QUOTED: 'warning', DEPOSIT_PAID: 'success', CONFIRMED: 'success', COMPLETED: 'success', CANCELLED: 'error'
}

export default function OrganizationsPage() {
  const [page, setPage] = useState(1)
  const [loading] = useState(false)
  const inquiries: any[] = []
  const pagination = { page: 1, limit: 50, total: 0, totalPages: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">Organizations</h2>
          <p className="text-sm text-neutral-600 mt-1">Manage org inquiries and workshop bookings</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)}</tbody>
            </table>
          ) : inquiries.length === 0 ? (
            <EmptyState heading="No inquiries yet" body="Organization inquiries will appear here." />
          ) : (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {inquiries.map((inq: any) => (
                  <tr key={inq.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                        <span className="text-sm font-medium text-neutral-900">{inq.orgName}</span>
                        {inq.isNonprofit && <Badge variant="info">501(c)(3)</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        {inq.contactEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{inq.eventType}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{inq.preferredDate ? new Date(inq.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_BADGES[inq.status] ?? 'default'}>{inq.status.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        View
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
