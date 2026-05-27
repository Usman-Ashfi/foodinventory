'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import EmptyState from '@shared/components/ui/EmptyState'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import StatusBadge from '@shared/components/ui/StatusBadge'
import { buildDashboardStats, buildInventoryHealth, quickActions } from '@features/dashboard/utility/dashboardUtils'

const emptyData = { inventory: [], customers: [], orders: [], deliveries: [] }
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
const panel = 'rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5'

function money(value) {
  return `$${Number(value || 0).toLocaleString()}`
}

function HeroPanel({ user, data, health }) {
  const openOrders = data.orders.filter((item) => !['completed', 'canceled'].includes(item.orderStatus)).length
  const activeDeliveries = data.deliveries.filter((item) => ['assigned', 'picked_up', 'out_for_delivery'].includes(item.status)).length

  return (
    <motion.section variants={fade} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className={`${panel} relative isolate min-h-80 overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#1f6f49_54%,#f1950c_135%)]" />
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 rounded-bl-[7rem] bg-black/20" />
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">
            Live kitchen ops
          </span>
          <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/75">
            {data.inventory.length} tracked items
          </span>
        </div>
        <h1 className="mt-8 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
          Good to see you, {user?.fullName || user?.username || 'there'}.
        </h1>
        <p className="mt-4 max-w-xl text-base font-medium leading-7 text-white/70">
          A fast, animated command center for stock freshness, order flow, customers, delivery movement, and reports.
        </p>
        <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ['Open orders', openOrders, 'receipt'],
            ['Active runs', activeDeliveries, 'delivery'],
            ['Customers', data.customers.length, 'users'],
          ].map(([label, value, icon]) => (
            <div key={label} className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
              <Icon name={icon} className="size-5 text-[#ffe078]" />
              <p className="mt-4 text-3xl font-black">{value}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${panel} overflow-hidden p-5 sm:p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Freshness radar</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Inventory health</h2>
          </div>
          <span className="rounded-full bg-[#d9ffb9] px-3 py-1 text-xs font-black text-[#153a20]">Live</span>
        </div>
        <div className="relative mt-7 h-52 overflow-hidden rounded-[1.75rem] bg-[#f8faf7] p-5">
          <div className="absolute inset-x-6 top-1/2 h-px bg-black/10" />
          <div className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="size-full rounded-full border border-dashed border-[#153a20]/25"
            />
          </div>
          <div className="relative grid h-full grid-cols-3 items-end gap-3">
            {health.map((item, index) => (
              <div key={item.label} className="text-center">
                <motion.div
                  animate={{ height: [`${Math.max(item.percent, 8)}%`, `${Math.min(item.percent + 18, 100)}%`, `${Math.max(item.percent, 8)}%`] }}
                  transition={{ duration: 2.6 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                  className={`mx-auto w-full max-w-16 rounded-t-full ${item.color}`}
                />
                <p className="mt-3 text-xl font-black text-black">{item.value}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function MetricGrid({ stats }) {
  return (
    <motion.section variants={fade} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className={`${panel} relative overflow-hidden p-5`}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1 bg-[#ffe078]"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="flex items-center justify-between gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[#153a20] text-[#ffe078]">
              <Icon name={stat.icon} />
            </span>
            <span className="rounded-full bg-[#f8faf7] px-3 py-1 text-xs font-black uppercase text-zinc-500">{stat.detail}</span>
          </div>
          <p className="mt-6 text-4xl font-black tracking-tight text-black">{stat.value}</p>
          <p className="mt-1 text-sm font-bold text-zinc-500">{stat.label}</p>
        </motion.div>
      ))}
    </motion.section>
  )
}

function ActionsAndFlow({ data }) {
  const focus = [
    ['Pending orders', data.orders.filter((item) => item.orderStatus === 'pending').length, 'pending'],
    ['Out for delivery', data.deliveries.filter((item) => item.status === 'out_for_delivery').length, 'out_for_delivery'],
    ['Low stock', data.inventory.filter((item) => Number(item.quantity) <= Number(item.minQuantity || 0)).length, 'low'],
  ]

  return (
    <motion.section variants={fade} className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className={`${panel} p-5 sm:p-6`}>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Launch pad</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Quick actions</h2>
        <div className="mt-5 grid gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="group flex items-center gap-4 rounded-[1.4rem] bg-[#f8faf7] p-4 transition hover:bg-[#d9ffb9]">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#153a20] shadow-lg shadow-black/5">
                <Icon name={action.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-black">{action.title}</span>
                <span className="mt-1 block truncate text-xs font-bold text-zinc-500">{action.description}</span>
              </span>
              <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>

      <div className={`${panel} overflow-hidden p-5 sm:p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Focus lane</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Today in motion</h2>
          </div>
          <span className="rounded-full bg-black px-4 py-2 text-xs font-black text-white">Auto sync</span>
        </div>
        <div className="mt-6 grid gap-4">
          {focus.map(([label, value, status], index) => (
            <div key={label} className="relative overflow-hidden rounded-[1.5rem] bg-[#f8faf7] p-4">
              <motion.span
                className="absolute inset-y-0 left-0 bg-[#ffe078]/60"
                animate={{ width: ['12%', `${Math.min(22 + value * 12, 86)}%`, '12%'] }}
                transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-black">{label}</p>
                  <p className="mt-1 text-xs font-bold text-zinc-500">{value} records need attention</p>
                </div>
                <StatusBadge status={status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function RecentOrders({ orders }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Order stream</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Recent orders</h2>
        </div>
        <Link href="/dashboard/orders" className="inline-flex items-center gap-2 rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">
          View orders <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
      {orders.length === 0 ? (
        <EmptyState icon="receipt" title="No recent orders yet" description="Orders will appear here once the workflow starts moving." />
      ) : (
        <div className="mt-6 grid gap-3">
          {orders.slice(0, 5).map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid gap-3 rounded-[1.35rem] bg-[#f8faf7] p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-black text-black">{order.orderNumber}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">{order.customerName}</p>
              </div>
              <p className="text-sm font-black text-[#153a20]">{money(order.total)}</p>
              <StatusBadge status={order.orderStatus} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  )
}

export default function DashboardHome() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [data, setData] = useState(emptyData)
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
      setData(summary.data || emptyData)
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => { active = false }
  }, [router])

  if (loading) return <LoadingState label="Loading dashboard..." contained />

  return (
    <motion.main
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="show"
      className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8"
    >
      <HeroPanel user={user} data={data} health={health} />
      <MetricGrid stats={stats} />
      <ActionsAndFlow data={data} />
      <RecentOrders orders={data.orders} />
    </motion.main>
  )
}
