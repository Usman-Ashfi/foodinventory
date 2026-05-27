'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHero from '@/components/dashboard/PageHero'
import ConfirmAction from '@/components/ui/ConfirmAction'
import DataToolbar from '@/components/ui/DataToolbar'
import EmptyState from '@/components/ui/EmptyState'
import FormField from '@/components/ui/FormField'
import Icon from '@/components/ui/Icon'
import LoadingState from '@/components/ui/LoadingState'
import MetricCard from '@/components/ui/MetricCard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { categories, formatDate, getDaysUntilExpiry, getItemStatus, inventoryFields, inventoryInitialForm } from './inventoryConfig'

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
      { label: 'Total items', value: items.length, icon: 'box', tone: 'emerald' },
      { label: 'Low stock', value: statuses.filter((item) => item === 'low').length, icon: 'alert', tone: 'amber' },
      { label: 'Expiring soon', value: statuses.filter((item) => ['expired', 'expiring'].includes(item)).length, icon: 'calendar', tone: 'rose' },
      { label: 'Categories', value: new Set(items.map((item) => item.category)).size, icon: 'filter', tone: 'sky' },
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

  async function submit(e) {
    e.preventDefault()
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
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHero eyebrow="Stock control" title="Inventory" description="Add food items, track quantities, monitor expiry dates, and keep pantry operations organized." icon="box" asideTitle="Food inventory ready" asideText="Add, filter, and remove stock records." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <SectionCard title="Add food item" eyebrow="New stock">
          {(error || message) && <div className={`mb-5 rounded-lg px-3 py-2.5 text-sm font-medium ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">{inventoryFields.slice(0, 6).map((field) => <FormField key={field.name} field={field} value={form[field.name]} onChange={change} />)}</div>
            {inventoryFields.slice(6).map((field) => <FormField key={field.name} field={field} value={form[field.name]} onChange={change} />)}
            <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
              <Icon name="plus" className="h-4 w-4" /> {saving ? 'Adding item...' : 'Add item'}
            </button>
          </form>
        </SectionCard>
        <SectionCard title="Food items" eyebrow="Stock list" action={<span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{filtered.length} shown</span>}>
          <DataToolbar search={search} onSearch={setSearch} filters={[{ name: 'category', value: category, onChange: setCategory, options: [{ value: 'all', label: 'All categories' }, ...categories.map((item) => ({ value: item, label: item }))] }, { name: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All status' }, { value: 'fresh', label: 'Fresh' }, { value: 'low', label: 'Low stock' }, { value: 'expiring', label: 'Expiring soon' }, { value: 'expired', label: 'Expired' }] }]} />
          <div className="mt-5">{filtered.length === 0 ? <EmptyState icon="box" title="No inventory items found" description="Add your first food item or adjust your filters to see more stock." /> : <div className="divide-y divide-slate-100">{filtered.map((item) => {
            const days = getDaysUntilExpiry(item.expiryDate)
            return (
              <div key={item.id} className="grid gap-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-semibold text-slate-950">{item.name}</h3><StatusBadge status={getItemStatus(item)} /></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>{item.category}</span><span>{item.location}</span><span>{formatDate(item.expiryDate)}</span>{days !== null && <span>{days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}</span>}</div>{item.notes && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.notes}</p>}</div>
                <div className="flex items-center justify-between gap-3 lg:justify-end"><div className="text-left lg:text-right"><p className="text-sm font-bold text-slate-950">{item.quantity} {item.unit}</p><p className="text-xs text-slate-500">Reorder at {item.minQuantity} {item.unit}</p></div><ConfirmAction label={item.name} disabled={deletingId === item.id} onConfirm={() => removeItem(item)} /></div>
              </div>
            )
          })}</div>}</div>
        </SectionCard>
      </section>
    </main>
  )
}
