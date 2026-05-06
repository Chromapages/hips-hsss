'use client'
import { useState, useEffect, useCallback } from 'react'
import { DollarSign, TrendingUp, Heart, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@hips/ui'

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

interface RevenueAPIResponse {
  summary: {
    totalRevenue: number
    serviceRevenue: number
    donationRevenue: number
    scholarshipDiscount: number
  }
  byCategory: Array<{ category: string; revenue: number; sessionCount: number }>
  kpis: {
    sessionCompletionRate: number
    packageUtilizationRate: number
    cohortFillRate: number
    donationConversionRate: number
    scholarshipUsageRate: number
  }
}

function KPICard({ label, value, icon: Icon, trend }: { label: string; value: string; icon: any; trend?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
            {trend && <p className="mt-1 text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" aria-hidden="true" />{trend}</p>}
          </div>
          <div className="rounded-full bg-brand-primary/10 p-3">
            <Icon className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChart({ data }: { data: typeof MOCK_BY_CATEGORY }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
  return (
    <div className="space-y-3">
      {data.filter(d => d.revenue > 0).map(d => (
        <div key={d.category} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700 font-medium">{d.category.replace('_', ' ')}</span>
            <span className="text-neutral-500">{formatCurrency(d.revenue)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-neutral-100">
            <div
              className="h-3 rounded-full bg-brand-primary transition-all duration-500"
              style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
              role="progressbar"
              aria-valuenow={d.revenue}
              aria-valuemax={maxRevenue}
            />
          </div>
          <p className="text-xs text-neutral-400">{d.sessionCount} sessions</p>
        </div>
      ))}
    </div>
  )
}

export default function RevenuePage() {
  const [startDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().split('T')[0]
  })
  const [endDate] = useState(() => new Date().toISOString().split('T')[0])

  const [data, setData] = useState<RevenueAPIResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRevenue = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/v1/admin/revenue?startDate=${startDate}&endDate=${endDate}`)
      if (!res.ok) throw new Error('Failed to load revenue data')
      const json = await res.json() as { data: RevenueAPIResponse; error: null }
      if (json.error) throw new Error(json.error.message)
      setData(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchRevenue()
  }, [fetchRevenue])

  const summary = data?.summary ?? { totalRevenue: 0, serviceRevenue: 0, donationRevenue: 0, scholarshipDiscount: 0 }
  const kpis = data?.kpis ?? { sessionCompletionRate: 0, packageUtilizationRate: 0, cohortFillRate: 0, donationConversionRate: 0, scholarshipUsageRate: 0 }
  const byCategory = data?.byCategory ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">Revenue</h2>
          <p className="text-sm text-neutral-600 mt-1">
            {new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} — {new Date(endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={fetchRevenue}
          disabled={loading}
          className="text-sm text-brand-primary hover:text-brand-primary/80 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-error/10 text-error text-sm p-3">{error}</div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon={DollarSign} trend="+12% vs last month" />
        <KPICard label="Service Revenue" value={formatCurrency(summary.serviceRevenue)} icon={Users} />
        <KPICard label="Donations" value={formatCurrency(summary.donationRevenue)} icon={Heart} />
        <KPICard label="Scholarship Discount" value={formatCurrency(summary.scholarshipDiscount)} icon={TrendingUp} trend="22% of revenue" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue by category */}
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={byCategory} />
          </CardContent>
        </Card>

        {/* KPIs */}
        <Card>
          <CardHeader><CardTitle>Key Performance Indicators</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Session Completion Rate', value: kpis.sessionCompletionRate },
              { label: 'Package Utilization', value: kpis.packageUtilizationRate },
              { label: 'Cohort Fill Rate', value: kpis.cohortFillRate },
              { label: 'Donation Conversion', value: kpis.donationConversionRate },
              { label: 'Scholarship Usage', value: kpis.scholarshipUsageRate },
            ].map(kpi => (
              <div key={kpi.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">{kpi.label}</span>
                  <span className="font-medium text-neutral-900">{(kpi.value * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100">
                  <div className="h-2 rounded-full bg-brand-accent transition-all duration-500" style={{ width: `${kpi.value * 100}%` }} role="progressbar" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
