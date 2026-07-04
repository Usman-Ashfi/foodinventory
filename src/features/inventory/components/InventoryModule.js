'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ConfirmAction from '@shared/components/ui/ConfirmAction'
import EmptyState from '@shared/components/ui/EmptyState'
import FormField from '@shared/components/ui/FormField'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import StatusBadge from '@shared/components/ui/StatusBadge'
import { categories, formatDate, getDaysUntilExpiry, getItemStatus, inventoryFields, inventoryInitialForm } from '@features/inventory/schema/inventoryConfig'
import { fade, panel, pillInput as selectClass } from '@shared/theme'

const statusOptions = [
  { value: 'all', label: 'All status' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'low', label: 'Low stock' },
  { value: 'expiring', label: 'Expiring soon' },
  { value: 'expired', label: 'Expired' },
]

function statusTone(status) {
  return {
    expired: 'bg-red-500',
    expiring: 'bg-amber-400',
    low: 'bg-orange-400',
    fresh: 'bg-emerald-500',
  }[status] || 'bg-emerald-500'
}

function InventoryHero({ user, metrics }) {
  return (
    <motion.section variants={fade} className={`${panel} relative isolate overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#246f49_55%,#ffe078_145%)]" />
      <div className="absolute -right-24 top-8 -z-10 size-72 rounded-full border border-dashed border-white/20" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute right-10 top-14 -z-10 size-40 rounded-full border border-dashed border-[#ffe078]/50"
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">
          Stock intelligence
        </span>
        <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/75">
          {user?.role || 'workspace'} control
        </span>
      </div>
      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
        Fresh inventory, monitored in real time.
      </h1>
      <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">
        Add ingredients, track reorder levels, watch expiry windows, and keep every storage location moving with confidence.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur"
          >
            <Icon name={metric.icon} className="size-5 text-[#ffe078]" />
            <p className="mt-4 text-3xl font-black">{metric.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-white/55">{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function StockForm({ form, saving, error, message, onChange, onSubmit }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">New stock</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Add food item</h2>
      {(error || message) && (
        <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-[#d9ffb9] text-[#153a20]'}`}>
          {error || message}
        </div>
      )}
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {inventoryFields.slice(0, 6).map((field) => (
            <FormField key={field.name} field={field} value={form[field.name]} onChange={onChange} />
          ))}
        </div>
        {inventoryFields.slice(6).map((field) => (
          <FormField key={field.name} field={field} value={form[field.name]} onChange={onChange} />
        ))}
        <button
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Icon name="plus" className="size-4" /> {saving ? 'Adding item...' : 'Add item'}
        </button>
      </form>
    </motion.section>
  )
}

function FilterBar({ search, setSearch, category, setCategory, status, setStatus, shown }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
      <label className="relative block">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-full border border-black/5 bg-[#f8faf7] py-3 pl-11 pr-4 text-sm font-bold text-black outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-[#ffe078]"
          placeholder="Search stock"
        />
      </label>
      <select value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
        <option value="all">All categories</option>
        {categories.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass}>
        {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <span className="inline-flex items-center justify-center rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">
        {shown} shown
      </span>
    </div>
  )
}

function StockCard({ item, deletingId, onRemove }) {
  const itemStatus = getItemStatus(item)
  const days = getDaysUntilExpiry(item.expiryDate)
  const min = Number(item.minQuantity || 0)
  const quantity = Number(item.quantity || 0)
  const fill = min > 0 ? Math.min(100, Math.round((quantity / Math.max(min * 2, 1)) * 100)) : 100

  return (
    <motion.article layout whileHover={{ y: -4 }} className="rounded-[1.5rem] bg-[#f8faf7] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-black">{item.name}</h3>
            <StatusBadge status={itemStatus} />
          </div>
          <p className="mt-2 text-xs font-bold text-zinc-500">{item.category} / {item.location}</p>
        </div>
        <ConfirmAction label={item.name} disabled={deletingId === item.id} onConfirm={() => onRemove(item)} />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
        <div>
          <p className="text-3xl font-black text-[#153a20]">{item.quantity}<span className="ml-1 text-sm text-zinc-500">{item.unit}</span></p>
          <p className="mt-1 text-xs font-bold text-zinc-500">Reorder at {item.minQuantity} {item.unit}</p>
        </div>
        <div className={`size-11 rounded-full ${statusTone(itemStatus)} shadow-lg shadow-black/10`} />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${statusTone(itemStatus)}`}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-zinc-500">
        <span className="rounded-full bg-white px-3 py-1">{formatDate(item.expiryDate)}</span>
        {days !== null && <span className="rounded-full bg-white px-3 py-1">{days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}</span>}
      </div>
      {item.notes && <p className="mt-3 truncate text-sm font-medium text-zinc-500">{item.notes}</p>}
    </motion.article>
  )
}

function StockList({ filtered, search, setSearch, category, setCategory, status, setStatus, deletingId, onRemove }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Stock list</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Food inventory</h2>
        </div>
      </div>
      <div className="mt-5">
        <FilterBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} status={status} setStatus={setStatus} shown={filtered.length} />
      </div>
      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState icon="box" title="No inventory items found" description="Add your first food item or adjust filters to see more stock." />
        ) : (
          <motion.div layout className="grid gap-4 lg:grid-cols-2">
            {filtered.map((item) => <StockCard key={item.id} item={item} deletingId={deletingId} onRemove={onRemove} />)}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default function InventoryModule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [form, setForm] = useState(inventoryInitialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const metrics = useMemo(() => {
    const statuses = items.map(getItemStatus)
    return [
      { label: 'Total items', value: items.length, icon: 'box' },
      { label: 'Low stock', value: statuses.filter((item) => item === 'low').length, icon: 'alert' },
      { label: 'Expiring soon', value: statuses.filter((item) => ['expired', 'expiring'].includes(item)).length, icon: 'calendar' },
      { label: 'Categories', value: new Set(items.map((item) => item.category)).size, icon: 'filter' },
    ]
  }, [items])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const itemStatus = getItemStatus(item)
      const text = [item.name, item.category, item.location].join(' ').toLowerCase()
      return (!query || text.includes(query)) && (category === 'all' || item.category === category) && (status === 'all' || itemStatus === status)
    })
  }, [category, items, search, status])

  useEffect(() => {
    let active = true
    async function load() {
      const [meRes, inventoryRes] = await Promise.all([fetch('/api/me'), fetch('/api/inventory')])
      const [meData, inventoryData] = await Promise.all([meRes.json(), inventoryRes.json()])
      if (!active) return
      if (!meData.user) return router.push('/login')
      setUser(meData.user)
      setItems(inventoryData.items || [])
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => { active = false }
  }, [router])

  function change(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const res = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return setError(data.error || 'Failed to add inventory item')
    setItems((prev) => [data.item, ...prev])
    setForm(inventoryInitialForm)
    setMessage('Inventory item added')
  }

  async function removeItem(item) {
    setDeletingId(item.id)
    const res = await fetch('/api/inventory', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) })
    const data = await res.json()
    setDeletingId(null)
    if (!res.ok) return setError(data.error || 'Failed to delete item')
    setItems((prev) => prev.filter((current) => current.id !== item.id))
    setMessage('Inventory item deleted')
  }

  if (loading) return <LoadingState label="Loading inventory..." contained />

  return (
    <motion.main variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <InventoryHero user={user} metrics={metrics} />
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <StockForm form={form} saving={saving} error={error} message={message} onChange={change} onSubmit={submit} />
        <StockList filtered={filtered} search={search} setSearch={setSearch} category={category} setCategory={setCategory} status={status} setStatus={setStatus} deletingId={deletingId} onRemove={removeItem} />
      </section>
    </motion.main>
  )
}
