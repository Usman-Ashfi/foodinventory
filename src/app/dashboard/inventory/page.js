'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardFloatingNav from '@/components/DashboardFloatingNav'

const initialForm = {
  name: '',
  category: 'Produce',
  quantity: '1',
  unit: 'pcs',
  minQuantity: '0',
  expiryDate: '',
  location: 'Pantry',
  notes: '',
}

const categories = [
  'Produce',
  'Dairy',
  'Meat',
  'Seafood',
  'Bakery',
  'Frozen',
  'Dry Goods',
  'Beverages',
  'Condiments',
  'Other',
]

const units = ['pcs', 'kg', 'g', 'lb', 'L', 'ml', 'pack', 'box', 'bag', 'can', 'bottle']

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    alert: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    ),
    arrow: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    ),
    box: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5-9 5m18 0-9 5m9-5v9l-9 5m0-9-9-5m9 5v9m-9-14v9l9 5" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    ),
    filter: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10m-7 6h4" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
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

function parseDate(value) {
  if (!value) return null

  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

function formatDate(value) {
  const date = parseDate(value)
  if (!date) return 'No expiry'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
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

  if (days !== null && days < 0) return 'expired'
  if (days !== null && days <= 7) return 'expiring'

  return 'fresh'
}

function getStatusLabel(status) {
  const labels = {
    expired: 'Expired',
    expiring: 'Expiring soon',
    fresh: 'Fresh',
    low: 'Low stock',
  }

  return labels[status]
}

function StatusBadge({ status }) {
  const tones = {
    expired: 'bg-red-50 text-red-700 ring-red-100',
    expiring: 'bg-amber-50 text-amber-700 ring-amber-100',
    fresh: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    low: 'bg-orange-50 text-orange-700 ring-orange-100',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[status]}`}>
      {getStatusLabel(status)}
    </span>
  )
}

function MetricCard({ label, value, icon, tone }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
        <Icon name={icon} />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
    </div>
  )
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function EmptyInventory({ hasFilters }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <Icon name={hasFilters ? 'filter' : 'box'} className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {hasFilters ? 'No matching items' : 'No inventory items yet'}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? 'Adjust your search, category, or status filters to find more items.'
          : 'Add your first food item to start tracking stock, expiry dates, and reorder levels.'}
      </p>
    </div>
  )
}

export default function InventoryPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const metrics = useMemo(() => {
    const statuses = items.map(getItemStatus)

    return [
      { label: 'Total items', value: items.length, icon: 'box', tone: 'emerald' },
      {
        label: 'Low stock',
        value: statuses.filter((status) => status === 'low').length,
        icon: 'alert',
        tone: 'amber',
      },
      {
        label: 'Expiring soon',
        value: statuses.filter((status) => status === 'expired' || status === 'expiring').length,
        icon: 'calendar',
        tone: 'rose',
      },
      {
        label: 'Categories',
        value: new Set(items.map((item) => item.category)).size,
        icon: 'filter',
        tone: 'sky',
      },
    ]
  }, [items])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const status = getItemStatus(item)
      const matchesSearch =
        !query ||
        String(item.name || '').toLowerCase().includes(query) ||
        String(item.category || '').toLowerCase().includes(query) ||
        String(item.location || '').toLowerCase().includes(query)
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [categoryFilter, items, search, statusFilter])

  useEffect(() => {
    let active = true

    async function loadInventory() {
      try {
        const [meRes, inventoryRes] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/inventory'),
        ])

        const meData = await meRes.json()
        const inventoryData = await inventoryRes.json()

        if (!active) return

        if (!meData.user) {
          router.push('/login')
          return
        }

        setUser(meData.user)

        if (inventoryData.items) {
          setItems(inventoryData.items)
        }
      } catch {
        if (active) {
          setError('Failed to load inventory')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadInventory()

    return () => {
      active = false
    }
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to add inventory item')
        return
      }

      setItems((prev) => [data.item, ...prev])
      setForm(initialForm)
      setSuccess('Inventory item added')
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteItem(item) {
    const confirmed = window.confirm(
      `Delete ${item.name}? This action cannot be undone.`
    )

    if (!confirmed) return

    setError('')
    setSuccess('')
    setDeletingId(item.id)

    try {
      const res = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to delete item')
        return
      }

      setItems((prev) => prev.filter((current) => current.id !== item.id))
      setSuccess('Inventory item deleted')
    } catch {
      setError('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <Icon name="box" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-emerald-950">PantryPro</p>
              <p className="mt-1 text-xs text-slate-500">Inventory</p>
            </div>
          </Link>

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
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_62%,#ecfdf5_100%)]" />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            <Icon name="arrow" className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Stock control
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Inventory
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Add food items, track quantities, monitor expiry dates, and keep pantry operations organized.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Icon name="check" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Food inventory ready</p>
                  <p className="mt-1 text-xs text-slate-500">Add, filter, and remove stock records.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                New stock
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                Add food item
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Record item details so PantryPro can flag low stock and expiry risk.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <Field id="name" label="Item name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Tomatoes"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="category" label="Category">
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </Field>

                <Field id="location" label="Location">
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Pantry"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field id="quantity" label="Quantity">
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </Field>

                <Field id="unit" label="Unit">
                  <select
                    id="unit"
                    name="unit"
                    value={form.unit}
                    onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </Field>

                <Field id="minQuantity" label="Reorder at">
                  <input
                    id="minQuantity"
                    name="minQuantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minQuantity}
                    onChange={(e) => setForm((prev) => ({ ...prev, minQuantity: e.target.value }))}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </Field>
              </div>

              <Field id="expiryDate" label="Expiry date">
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </Field>

              <Field id="notes" label="Notes">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Supplier, batch, storage notes..."
                />
              </Field>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Adding item...
                  </>
                ) : (
                  <>
                    <Icon name="plus" className="h-4 w-4" />
                    Add item
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Stock list
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                  Food items
                </h2>
              </div>
              <span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                {filteredItems.length} shown
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_160px_150px]">
              <div className="relative">
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Search items, categories, locations"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All status</option>
                <option value="fresh">Fresh</option>
                <option value="low">Low stock</option>
                <option value="expiring">Expiring soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="mt-5">
              {filteredItems.length === 0 ? (
                <EmptyInventory hasFilters={search || categoryFilter !== 'all' || statusFilter !== 'all'} />
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredItems.map((item) => {
                    const status = getItemStatus(item)
                    const days = getDaysUntilExpiry(item.expiryDate)

                    return (
                      <div key={item.id} className="grid gap-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-slate-950">
                              {item.name || 'Untitled item'}
                            </h3>
                            <StatusBadge status={status} />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>{item.category || 'Other'}</span>
                            <span>{item.location || 'Pantry'}</span>
                            <span>{formatDate(item.expiryDate)}</span>
                            {days !== null && (
                              <span>
                                {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                              {item.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-3 lg:justify-end">
                          <div className="text-left lg:text-right">
                            <p className="text-sm font-bold text-slate-950">
                              {item.quantity} {item.unit || 'pcs'}
                            </p>
                            <p className="text-xs text-slate-500">
                              Reorder at {item.minQuantity} {item.unit || 'pcs'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item)}
                            disabled={deletingId === item.id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Delete ${item.name}`}
                            title={`Delete ${item.name}`}
                          >
                            {deletingId === item.id ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                            ) : (
                              <Icon name="trash" className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <DashboardFloatingNav />
    </div>
  )
}
