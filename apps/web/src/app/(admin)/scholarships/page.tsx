'use client'
import { useState } from 'react'
import { Check, X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { Badge, Button, Card, CardContent, EmptyState, SkeletonTableRow } from '@hips/ui'

const STATUS_TABS = ['PENDING', 'APPROVED', 'DENIED', 'WAITLISTED']

export default function ScholarshipsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('PENDING')
  const [loading] = useState(false)
  const scholarships: any[] = []
  const pagination = { page: 1, limit: 50, total: 0, totalPages: 0 }
  const budgetStatus = { monthlyCapTotal: 50000, monthlyCapUsed: 0, monthlyCapRemaining: 50000, waitlistCount: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">Scholarships</h2>
          <p className="text-sm text-neutral-600 mt-1">Review and manage scholarship applications</p>
        </div>
      </div>

      {/* Budget status card */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-neutral-500 uppercase font-medium">Monthly Budget</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">${(budgetStatus.monthlyCapTotal / 100).toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-neutral-500 uppercase font-medium">Used</p>
          <p className="text-2xl font-bold text-warning mt-1">${(budgetStatus.monthlyCapUsed / 100).toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-neutral-500 uppercase font-medium">Remaining</p>
          <p className="text-2xl font-bold text-success mt-1">${(budgetStatus.monthlyCapRemaining / 100).toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-neutral-500 uppercase font-medium">Waitlisted</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{budgetStatus.waitlistCount}</p>
        </CardContent></Card>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${status === s ? 'border-brand-primary text-brand-primary' : 'border-transparent text-neutral-600 hover:text-neutral-900'}`}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Requested</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Approved</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)}</tbody>
            </table>
          ) : scholarships.length === 0 ? (
            <EmptyState heading={status === 'PENDING' ? 'All caught up' : 'No results'} body={status === 'PENDING' ? 'No pending scholarship applications.' : `No ${status.toLowerCase()} applications.`} />
          ) : (
            <table className="w-full" role="table">
              <thead><tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Requested</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Approved</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {scholarships.map((s: any) => (
                  <tr key={s.scholarshipId} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-neutral-500">{s.userId?.slice(0, 8)}</span></td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{s.serviceName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(s.requestedAmount) / 100)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{s.approvedAmount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(s.approvedAmount) / 100) : '—'}</td>
                    <td className="px-4 py-3"><Badge variant={s.status === 'APPROVED' ? 'success' : s.status === 'DENIED' ? 'error' : 'warning'}>{s.status}</Badge></td>
                    <td className="px-4 py-3">
                      {s.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm"><Check className="h-3 w-3" aria-hidden="true" /> Approve</Button>
                          <Button variant="ghost" size="sm"><X className="h-3 w-3" aria-hidden="true" /> Deny</Button>
                        </div>
                      )}
                      {s.status === 'APPROVED' && s.discountCode && (
                        <span className="font-mono text-xs bg-brand-accent/20 text-brand-deep px-2 py-1 rounded">{s.discountCode}</span>
                      )}
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
