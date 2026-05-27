'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import EmptyState from '@shared/components/ui/EmptyState'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import StatusBadge from '@shared/components/ui/StatusBadge'

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
const panel = 'rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5'
const inputClass = 'rounded-full border border-black/5 bg-[#f8faf7] px-4 py-3 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-[#ffe078]'

function money(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`
}

function BarList({ rows, labelKey = 'status', valueKey = 'count' }) {
  const max = Math.max(1, ...rows.map((row) => Number(row[valueKey] || 0)))
  if (rows.length === 0) return <EmptyState icon="report" title="No data yet" description="Reports will populate as orders and deliveries are created." />

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const value = Number(row[valueKey] || 0)
        return (
          <div key={row[labelKey]} className="rounded-[1.25rem] bg-[#f8faf7] p-4">
            <div className="mb-3 flex items-center justify-between gap-3 text-sm">
              <span className="font-black capitalize text-black">{String(row[labelKey] || 'Unknown').replaceAll('_', ' ')}</span>
              <span className="font-bold text-zinc-500">{valueKey === 'total' ? money(value) : value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${(value / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.05 }} className="h-full rounded-full bg-[#153a20]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ReportsHero({ metrics }) {
  return (
    <motion.section variants={fade} className={`${panel} relative isolate overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#28704d_56%,#ffe078_145%)]" />
      <motion.svg viewBox="0 0 360 160" className="absolute right-4 top-8 hidden h-36 w-80 text-[#ffe078]/55 md:block">
        <motion.path d="M8 130 C62 42 104 110 156 60 C210 10 246 118 346 34" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" animate={{ pathLength: [0.2, 1, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.svg>
      <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">Insights</span>
      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Reports that make the kitchen visible.</h1>
      <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">Track revenue, order health, stock pressure, top customers, and dispatch movement with one focused reporting board.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div key={metric.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
            <Icon name={metric.icon} className="size-5 text-[#ffe078]" />
            <p className="mt-4 text-2xl font-black">{metric.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-white/55">{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function ReportCard({ title, eyebrow, children }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </motion.section>
  )
}

export default function ReportModule() {
  const router = useRouter()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const metrics = useMemo(() => {
    if (!summary) return []
    return [
      { label: 'Revenue', value: money(summary.sales.revenue), icon: 'chart' },
      { label: 'Orders', value: summary.sales.orders || 0, icon: 'receipt' },
      { label: 'Avg order', value: money(summary.sales.average_order), icon: 'report' },
      { label: 'Low stock', value: summary.inventory.low_stock || 0, icon: 'alert' },
    ]
  }, [summary])

  async function loadReports() {
    setLoading(true)
    const query = new URLSearchParams()
    if (startDate) query.set('startDate', startDate)
    if (endDate) query.set('endDate', endDate)
    const [meData, reportData] = await Promise.all([fetch('/api/me').then((res) => res.json()), fetch(`/api/reports/summary?${query}`).then((res) => res.json())])
    if (!meData.user) return router.push('/login')
    setSummary(reportData.summary)
    setLoading(false)
  }

  useEffect(() => {
    loadReports().catch(() => setLoading(false))
  }, [])

  if (loading && !summary) return <LoadingState label="Loading reports..." contained />

  return (
    <motion.main variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <ReportsHero metrics={metrics} />
      <motion.section variants={fade} className={`${panel} p-4`}>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} />
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} />
          <button onClick={loadReports} className="rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">Apply filters</button>
        </div>
      </motion.section>
      <section className="grid gap-6 lg:grid-cols-2">
        <ReportCard title="Order status" eyebrow="Orders"><BarList rows={summary?.orders.statusBreakdown || []} /></ReportCard>
        <ReportCard title="Most used inventory" eyebrow="Inventory"><BarList rows={summary?.inventory.mostUsed || []} labelKey="name" valueKey="quantity" /></ReportCard>
        <ReportCard title="Top customers" eyebrow="Sales"><BarList rows={summary?.orders.topCustomers || []} labelKey="name" valueKey="total" /></ReportCard>
        <ReportCard title="Delivery health" eyebrow="Dispatch">
          <div className="grid gap-3 sm:grid-cols-3">
            {[['delivered', summary?.deliveries.delivered], ['in progress', summary?.deliveries.in_progress], ['needs review', summary?.deliveries.problem]].map(([label, value]) => (
              <div key={label} className="rounded-[1.25rem] bg-[#f8faf7] p-4"><StatusBadge status={label.replace(' ', '_')} /><p className="mt-4 text-3xl font-black text-black">{value || 0}</p></div>
            ))}
          </div>
        </ReportCard>
      </section>
    </motion.main>
  )
}
