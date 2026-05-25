'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import PageHero from '@/components/dashboard/PageHero'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'
import MetricCard from '@/components/ui/MetricCard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'

function BarList({ rows, labelKey = 'status', valueKey = 'count' }) {
  const max = Math.max(1, ...rows.map((row) => Number(row[valueKey] || 0)))
  if (rows.length === 0) return <EmptyState icon="report" title="No data yet" description="Reports will populate as orders and deliveries are created." />

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row[labelKey]} className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold capitalize text-slate-700">{String(row[labelKey] || 'Unknown').replaceAll('_', ' ')}</span>
            <span className="text-slate-500">{row[valueKey]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(Number(row[valueKey] || 0) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ReportModule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const metrics = useMemo(() => {
    if (!summary) return []
    return [
      { label: 'Revenue', value: `Rs ${Number(summary.sales.revenue || 0).toFixed(2)}`, icon: 'chart', tone: 'emerald' },
      { label: 'Orders', value: summary.sales.orders || 0, icon: 'receipt', tone: 'sky' },
      { label: 'Avg order', value: `Rs ${Number(summary.sales.average_order || 0).toFixed(2)}`, icon: 'report', tone: 'violet' },
      { label: 'Low stock', value: summary.inventory.low_stock || 0, icon: 'alert', tone: 'amber' },
    ]
  }, [summary])

  async function loadReports() {
    setLoading(true)
    const query = new URLSearchParams()
    if (startDate) query.set('startDate', startDate)
    if (endDate) query.set('endDate', endDate)
    const [meRes, reportRes] = await Promise.all([fetch('/api/me'), fetch(`/api/reports/summary?${query}`)])
    const [meData, reportData] = await Promise.all([meRes.json(), reportRes.json()])
    if (!meData.user) return router.push('/login')
    setUser(meData.user)
    setSummary(reportData.summary)
    setLoading(false)
  }

  useEffect(() => {
    loadReports().catch(() => setLoading(false))
  }, [])

  if (loading && !summary) return <LoadingState label="Loading reports..." />

  return (
    <DashboardShell user={user} label="Reports">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PageHero eyebrow="Insights" title="Reports" description="Track sales, orders, inventory health, and delivery performance with lightweight operational reporting." icon="report" asideTitle="Live summaries" asideText="Date filters apply to order and sales metrics." />
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <button onClick={loadReports} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Apply filters</button>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
        <section className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Order status" eyebrow="Orders"><BarList rows={summary?.orders.statusBreakdown || []} /></SectionCard>
          <SectionCard title="Most used inventory" eyebrow="Inventory"><BarList rows={summary?.inventory.mostUsed || []} labelKey="name" valueKey="quantity" /></SectionCard>
          <SectionCard title="Top customers" eyebrow="Sales"><BarList rows={summary?.orders.topCustomers || []} labelKey="name" valueKey="total" /></SectionCard>
          <SectionCard title="Delivery health" eyebrow="Dispatch">
            <div className="grid gap-3 sm:grid-cols-3">
              {[['delivered', summary?.deliveries.delivered], ['in progress', summary?.deliveries.in_progress], ['needs review', summary?.deliveries.problem]].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4"><StatusBadge status={label.replace(' ', '_')} /><p className="mt-3 text-2xl font-bold text-slate-950">{value || 0}</p></div>
              ))}
            </div>
          </SectionCard>
        </section>
      </main>
    </DashboardShell>
  )
}
