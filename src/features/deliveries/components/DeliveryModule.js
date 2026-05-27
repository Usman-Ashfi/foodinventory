'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ConfirmAction from '@shared/components/ui/ConfirmAction'
import EmptyState from '@shared/components/ui/EmptyState'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import StatusBadge from '@shared/components/ui/StatusBadge'
import DeliveryTimeline from './DeliveryTimeline'
import { deliveryFields, deliveryInitialForm, deliveryStatuses, nextDeliveryStatuses } from '@features/deliveries/schema/deliveryConfig'

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
const panel = 'rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5'
const inputClass = 'w-full rounded-[1.15rem] border border-black/5 bg-[#f8faf7] px-4 py-3 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-[#ffe078]'

function formFromDelivery(delivery) {
  return { ...deliveryInitialForm, ...delivery, orderId: delivery.orderId || '', scheduledAt: delivery.scheduledAt ? String(delivery.scheduledAt).slice(0, 16) : '' }
}

function Hero({ metrics }) {
  return (
    <motion.section variants={fade} className={`${panel} relative isolate overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#28704d_56%,#f1950c_138%)]" />
      <motion.div animate={{ x: [0, -16, 0], y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-8 top-10 hidden size-24 rounded-full bg-[#ffe078]/25 md:block" />
      <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">Dispatch board</span>
      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Deliveries with every handoff visible.</h1>
      <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">Assign orders, track riders, and move delivery jobs from pending to delivered without losing context.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div key={metric.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
            <Icon name={metric.icon} className="size-5 text-[#ffe078]" />
            <p className="mt-4 text-3xl font-black">{metric.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-white/55">{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function Field({ field, value, onChange }) {
  const textarea = field.type === 'textarea'
  return (
    <label className={textarea ? 'block sm:col-span-2' : 'block'}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{field.label}</span>
      {textarea ? <textarea rows={field.rows || 3} value={value || ''} onChange={(event) => onChange(field.name, event.target.value)} placeholder={field.placeholder} className={`${inputClass} resize-none`} /> : <input type={field.type || 'text'} value={value || ''} onChange={(event) => onChange(field.name, event.target.value)} placeholder={field.placeholder} className={inputClass} />}
    </label>
  )
}

function DeliveryForm({ orders, form, editingId, saving, error, message, onChange, onSubmit, onCancel }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Assignment</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-black">{editingId ? 'Edit delivery' : 'Create delivery'}</h2>
      {(error || message) && <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-[#d9ffb9] text-[#153a20]'}`}>{error || message}</div>}
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Order</span>
          <select value={form.orderId} onChange={(event) => onChange('orderId', event.target.value)} required className={inputClass}>
            <option value="">Select order</option>
            {orders.map((order) => <option key={order.id} value={order.id}>{order.orderNumber} / {order.customerName}</option>)}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">{deliveryFields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={onChange} />)}</div>
        <div className="flex gap-3">
          <button disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white disabled:opacity-60"><Icon name={editingId ? 'check' : 'plus'} className="size-4" />{saving ? 'Saving...' : editingId ? 'Save delivery' : 'Create delivery'}</button>
          {editingId && <button type="button" onClick={onCancel} className="rounded-full bg-[#f8faf7] px-5 py-3 text-sm font-black text-zinc-600 hover:bg-[#d9ffb9]">Cancel</button>}
        </div>
      </form>
    </motion.section>
  )
}

function Filters({ search, setSearch, status, setStatus, shown }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_190px_auto]">
      <label className="relative block">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} rounded-full pl-11`} placeholder="Search deliveries" type="search" />
      </label>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className={`${inputClass} rounded-full`}>
        <option value="all">All status</option>
        {deliveryStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <span className="inline-flex items-center justify-center rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">{shown} shown</span>
    </div>
  )
}

function DeliveryCard({ delivery, deletingId, onEdit, onRemove, onStatus }) {
  return (
    <motion.article layout whileHover={{ y: -4 }} className="rounded-[1.5rem] bg-[#f8faf7] p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-black text-black">{delivery.orderNumber}</h3><StatusBadge status={delivery.status} /></div>
          <p className="mt-2 text-sm font-bold text-zinc-500">{delivery.customerName} / {delivery.address || 'No address'}</p>
          <p className="mt-1 text-xs font-bold text-zinc-500">{delivery.driverName || 'No driver assigned'} {delivery.driverPhone ? `/ ${delivery.driverPhone}` : ''}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {nextDeliveryStatuses(delivery.status).map((item) => <button key={item} type="button" onClick={() => onStatus(delivery, item)} className="rounded-full bg-[#d9ffb9] px-3 py-2 text-xs font-black capitalize text-[#153a20] hover:bg-[#ffe078]">{item.replaceAll('_', ' ')}</button>)}
          <button type="button" onClick={() => onEdit(delivery)} className="grid size-9 place-items-center rounded-full bg-white text-zinc-500 shadow-sm hover:text-[#153a20]"><Icon name="edit" className="size-4" /></button>
          <ConfirmAction label={delivery.orderNumber} disabled={deletingId === delivery.id} onConfirm={() => onRemove(delivery)} />
        </div>
      </div>
      <DeliveryTimeline status={delivery.status} />
    </motion.article>
  )
}

export default function DeliveryModule() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [form, setForm] = useState(deliveryInitialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const metrics = useMemo(() => [
    { label: 'Total deliveries', value: deliveries.length, icon: 'delivery' },
    { label: 'In progress', value: deliveries.filter((item) => ['assigned', 'picked_up', 'out_for_delivery'].includes(item.status)).length, icon: 'list' },
    { label: 'Delivered', value: deliveries.filter((item) => item.status === 'delivered').length, icon: 'check' },
    { label: 'Needs review', value: deliveries.filter((item) => ['failed', 'canceled'].includes(item.status)).length, icon: 'alert' },
  ], [deliveries])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return deliveries.filter((delivery) => {
      const text = [delivery.orderNumber, delivery.customerName, delivery.driverName, delivery.address].join(' ').toLowerCase()
      return (!query || text.includes(query)) && (status === 'all' || delivery.status === status)
    })
  }, [deliveries, search, status])

  useEffect(() => {
    let active = true
    async function load() {
      const data = await (await fetch('/api/deliveries/bootstrap')).json()
      if (!active) return
      if (!data.user) return router.push('/login')
      setOrders(data.orders || [])
      setDeliveries(data.deliveries || [])
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => { active = false }
  }, [router])

  function change(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setForm(deliveryInitialForm)
    setEditingId(null)
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const res = await fetch(editingId ? `/api/deliveries/${editingId}` : '/api/deliveries', { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return setError(data.error || 'Failed to save delivery')
    setDeliveries((prev) => editingId ? prev.map((item) => item.id === editingId ? data.delivery : item) : [data.delivery, ...prev])
    setMessage(editingId ? 'Delivery updated' : 'Delivery created')
    resetForm()
  }

  async function updateStatus(delivery, nextStatus) {
    const res = await fetch(`/api/deliveries/${delivery.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed to update delivery')
    setDeliveries((prev) => prev.map((item) => item.id === delivery.id ? data.delivery : item))
    setMessage('Delivery status updated')
  }

  async function removeDelivery(delivery) {
    setDeletingId(delivery.id)
    const res = await fetch(`/api/deliveries/${delivery.id}`, { method: 'DELETE' })
    const data = await res.json()
    setDeletingId(null)
    if (!res.ok) return setError(data.error || 'Failed to delete delivery')
    setDeliveries((prev) => prev.filter((item) => item.id !== delivery.id))
    setMessage('Delivery deleted')
  }

  if (loading) return <LoadingState label="Loading deliveries..." contained />

  return (
    <motion.main variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <Hero metrics={metrics} />
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <DeliveryForm orders={orders} form={form} editingId={editingId} saving={saving} error={error} message={message} onChange={change} onSubmit={submit} onCancel={resetForm} />
        <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Tracking</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Delivery board</h2>
          <div className="mt-5"><Filters search={search} setSearch={setSearch} status={status} setStatus={setStatus} shown={filtered.length} /></div>
          <div className="mt-6">{filtered.length === 0 ? <EmptyState icon="delivery" title="No deliveries found" description="Create a delivery or adjust filters to view active work." /> : <motion.div layout className="grid gap-4">{filtered.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} deletingId={deletingId} onStatus={updateStatus} onEdit={(item) => { setEditingId(item.id); setForm(formFromDelivery(item)) }} onRemove={removeDelivery} />)}</motion.div>}</div>
        </motion.section>
      </section>
    </motion.main>
  )
}
