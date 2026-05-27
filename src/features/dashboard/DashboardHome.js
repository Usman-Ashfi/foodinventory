'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import EmptyState from '@/components/ui/EmptyState'
import Icon from '@/components/ui/Icon'
import LoadingState from '@/components/ui/LoadingState'
import MetricCard from '@/components/ui/MetricCard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { buildDashboardStats, buildInventoryHealth, quickActions } from './dashboardUtils'

function WorkspaceHeader({ user, health }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-emerald-100 bg-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_60%,#ecfdf5_100%)]" />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live workspace
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Good to see you, {user?.fullName || user?.username || 'there'}.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Monitor stock, customers, orders, deliveries, and reports from one calm operations center.
          </p>
        </div>
        <div className="border-emerald-100 lg:border-l lg:pl-8">
          <div className="flex items-start justify-between">
            <div><p className="text-sm font-semibold text-slate-900">Inventory health</p><p className="mt-1 text-xs text-slate-500">Current item status</p></div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Live</span>
          </div>
          <div className="mt-5 space-y-4">{health.map((item) => <div key={item.label}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-medium text-slate-600">{item.label}</span><span className="font-semibold text-slate-900">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} /></div></div>)}</div>
        </div>
      </div>
    </section>
  )
}

export default function DashboardHome() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [data, setData] = useState({ inventory: [], customers: [], orders: [], deliveries: [] })
  const [loading, setLoading] = useState(true)

  const stats = useMemo(() => buildDashboardStats(data), [data])
  const health = useMemo(() => buildInventoryHealth(data.inventory), [data.inventory])

  useEffect(() => {
    let active = true
    async function load() {
      const res = await fetch('/api/dashboard/summary')
      const summary = await res.json()
      if (!active) return
      if (!summary.user) return router.push('/login')
      setUser(summary.user)
      setData(summary.data || { inventory: [], customers: [], orders: [], deliveries: [] })
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => { active = false }
  }, [router])

  if (loading) return <LoadingState label="Loading dashboard..." contained />

  return (
    <>
      <WorkspaceHeader user={user} health={health} />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <MetricCard key={stat.label} {...stat} />)}</section>
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SectionCard title="Quick actions" eyebrow="Operations"><div className="space-y-3">{quickActions.map((action) => <Link key={action.title} href={action.href} className="group flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/70"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-slate-200"><Icon name={action.icon} /></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-900">{action.title}</span><Icon name="arrowRight" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" /></span><span className="mt-1 block text-sm leading-6 text-slate-500">{action.description}</span></span></Link>)}</div></SectionCard>
          <SectionCard title="Operational focus" eyebrow="Today"><div className="grid gap-3">{[['Orders', data.orders.filter((item) => item.orderStatus === 'pending').length, 'pending'], ['Deliveries', data.deliveries.filter((item) => item.status === 'out_for_delivery').length, 'out_for_delivery'], ['Low stock', data.inventory.filter((item) => Number(item.quantity) <= Number(item.minQuantity || 0)).length, 'low']].map(([label, value, status]) => <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-700">{label}</span><div className="flex items-center gap-2"><StatusBadge status={status} /><span className="text-sm font-bold text-slate-950">{value}</span></div></div>)}</div></SectionCard>
        </section>
        <SectionCard title="Recent orders" eyebrow="Activity">{data.orders.length === 0 ? <EmptyState icon="receipt" title="No recent orders yet" description="Orders will appear here once the workflow starts moving." /> : <div className="divide-y divide-slate-100">{data.orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between gap-4 py-3"><div><p className="text-sm font-semibold text-slate-950">{order.orderNumber}</p><p className="text-xs text-slate-500">{order.customerName}</p></div><StatusBadge status={order.orderStatus} /></div>)}</div>}</SectionCard>
      </main>
    </>
  )
}
