'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardFloatingNav from '@/components/DashboardFloatingNav'

const quickActions = [
  {
    title: 'Add inventory item',
    description: 'Create a new stock record with quantity, category, and expiry date.',
    icon: 'plus',
    href: '/dashboard/inventory',
    status: 'Open',
  },
  {
    title: 'Review low stock',
    description: 'Check ingredients that are close to the reorder point.',
    icon: 'alert',
    href: '/dashboard/inventory',
    status: 'Open',
  },
  {
    title: 'Plan shopping list',
    description: 'Prepare the next restock run from items that need replenishing.',
    icon: 'list',
    href: '/dashboard/inventory',
    status: 'Open',
  },
]

function parseDate(value) {
  if (!value) return null

  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

function getDaysUntilExpiry(value) {
  const date = parseDate(value)
  if (!date) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Math.ceil((date.getTime() - today.getTime()) / 86400000)
}

function getItemStatus(item) {
  if (Number(item.quantity) <= Number(item.minQuantity || 0)) {
    return 'low'
  }

  const days = getDaysUntilExpiry(item.expiryDate)

  if (days !== null && days < 0) return 'critical'
  if (days !== null && days <= 7) return 'monitor'

  return 'fresh'
}

function buildStats(items) {
  const statuses = items.map(getItemStatus)

  return [
    {
      label: 'Total items',
      value: items.length,
      detail: 'Inventory records',
      tone: 'emerald',
      icon: 'box',
    },
    {
      label: 'Low stock',
      value: statuses.filter((status) => status === 'low').length,
      detail: 'Need attention',
      tone: 'amber',
      icon: 'alert',
    },
    {
      label: 'Expiring soon',
      value: statuses.filter((status) => status === 'monitor' || status === 'critical').length,
      detail: 'Use first',
      tone: 'rose',
      icon: 'calendar',
    },
    {
      label: 'Categories',
      value: new Set(items.map((item) => item.category || 'Other')).size,
      detail: 'Food groups',
      tone: 'sky',
      icon: 'chart',
    },
  ]
}

function buildInventoryHealth(items) {
  const total = items.length || 1
  const statuses = items.map(getItemStatus)
  const fresh = statuses.filter((status) => status === 'fresh').length
  const monitor = statuses.filter((status) => status === 'monitor' || status === 'low').length
  const critical = statuses.filter((status) => status === 'critical').length

  return [
    { label: 'Fresh', value: fresh, percent: Math.round((fresh / total) * 100), color: 'bg-emerald-500' },
    { label: 'Monitor', value: monitor, percent: Math.round((monitor / total) * 100), color: 'bg-amber-400' },
    { label: 'Critical', value: critical, percent: Math.round((critical / total) * 100), color: 'bg-rose-400' },
  ]
}

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    alert: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    ),
    arrow: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    ),
    box: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5-9 5m18 0-9 5m9-5v9l-9 5m0-9-9-5m9 5v9m-9-14v9l9 5" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    ),
    list: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    ),
    logout: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75" />
    ),
  }

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold leading-none text-emerald-950">PantryPro</p>
        <p className="mt-1 text-xs text-slate-500">Inventory command center</p>
      </div>
    </div>
  )
}

function DashboardShell({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandMark />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs capitalize text-slate-500">{user?.role || 'user'}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
              {(user?.fullName || user?.username || 'U').charAt(0)}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Sign out"
              title="Sign out"
            >
              <Icon name="logout" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}

function WorkspaceHeader({ user, inventoryHealth }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-emerald-100 bg-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_60%,#ecfdf5_100%)]" />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live workspace
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Good to see you, {user?.fullName || user?.username || 'there'}.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Monitor stock health, reduce food waste, and keep kitchen operations moving from one calm overview.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20">
              <Icon name="check" className="h-4 w-4" />
              Workspace ready
            </span>
            <span className="text-sm font-medium text-slate-500">
              Inventory tools are connected and ready for daily stock work.
            </span>
          </div>
        </div>

        <div className="border-emerald-100 lg:border-l lg:pl-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Inventory health</p>
              <p className="mt-1 text-xs text-slate-500">Current item status</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Stable
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {inventoryHealth.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
            Inventory insights update from your saved food items.
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[stat.tone]}`}>
          <Icon name={stat.icon} className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
          Today
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p>
        <p className="pb-1 text-xs font-medium text-slate-500">{stat.detail}</p>
      </div>
    </div>
  )
}

function SectionCard({ title, eyebrow, children, action }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function QuickActionList({ isAdmin }) {
  return (
    <div className="space-y-3">
      {quickActions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="group flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/70"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-slate-200 transition-colors group-hover:ring-emerald-200">
            <Icon name={action.icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">{action.title}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {action.status}
              </span>
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-500">{action.description}</span>
          </span>
        </Link>
      ))}

      {isAdmin && (
        <Link
          href="/dashboard/user"
          className="group flex w-full items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left transition-colors hover:bg-emerald-100/70"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 ring-1 ring-emerald-200">
            <Icon name="users" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-3 text-sm font-semibold text-emerald-950">
              Manage users
              <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-1 block text-sm leading-6 text-emerald-700">
              Add staff accounts and control dashboard access.
            </span>
          </span>
        </Link>
      )}
    </div>
  )
}

function EmptyActivity() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <Icon name="check" className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">No recent activity yet</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Stock updates, user changes, and expiry alerts will appear here once the workspace starts moving.
      </p>
    </div>
  )
}

function OperationsChecklist() {
  const items = [
    'Add your first inventory item',
    'Set low-stock thresholds',
    'Record expiry dates',
    'Invite team members',
  ]

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-slate-700">{item}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)

  const stats = useMemo(() => buildStats(inventoryItems), [inventoryItems])
  const inventoryHealth = useMemo(
    () => buildInventoryHealth(inventoryItems),
    [inventoryItems]
  )

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [meRes, inventoryRes] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/inventory'),
        ])

        const meData = await meRes.json()
        const inventoryData = await inventoryRes.json()

        if (!active) return

        if (meData.user) {
          setUser(meData.user)
        } else {
          router.push('/login')
          return
        }

        if (inventoryData.items) {
          setInventoryItems(inventoryData.items)
        }
      } catch {
        if (active) router.push('/login')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [router])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <WorkspaceHeader user={user} inventoryHealth={inventoryHealth} />

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SectionCard title="Quick actions" eyebrow="Operations">
            <QuickActionList isAdmin={user?.role === 'admin'} />
          </SectionCard>

          <SectionCard title="Getting started" eyebrow="Setup">
            <OperationsChecklist />
          </SectionCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionCard
            title="Recent activity"
            eyebrow="Timeline"
            action={
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                0 events
              </span>
            }
          >
            <EmptyActivity />
          </SectionCard>

          <SectionCard title="Upcoming focus" eyebrow="Planning">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Restock review', value: 'Ready' },
                { label: 'Expiry sweep', value: 'Clear' },
                { label: 'Waste report', value: 'Pending data' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>
      </main>
      <DashboardFloatingNav />
    </DashboardShell>
  )
}
