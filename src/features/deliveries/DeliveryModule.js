'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
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
import DeliveryTimeline from './DeliveryTimeline'
import { deliveryFields, deliveryInitialForm, deliveryStatuses, nextDeliveryStatuses } from './deliveryConfig'

function formFromDelivery(delivery) {
  return { ...deliveryInitialForm, ...delivery, orderId: delivery.orderId || '', scheduledAt: delivery.scheduledAt ? String(delivery.scheduledAt).slice(0, 16) : '' }
}

export default function DeliveryModule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
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
    { label: 'Total deliveries', value: deliveries.length, icon: 'delivery', tone: 'emerald' },
    { label: 'In progress', value: deliveries.filter((item) => ['assigned', 'picked_up', 'out_for_delivery'].includes(item.status)).length, icon: 'list', tone: 'sky' },
    { label: 'Delivered', value: deliveries.filter((item) => item.status === 'delivered').length, icon: 'check', tone: 'violet' },
    { label: 'Needs review', value: deliveries.filter((item) => ['failed', 'canceled'].includes(item.status)).length, icon: 'alert', tone: 'rose' },
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
      const res = await fetch('/api/deliveries/bootstrap')
      const data = await res.json()
      if (!active) return
      if (!data.user) return router.push('/login')
      setUser(data.user)
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

  async function submit(e) {
    e.preventDefault()
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

  if (loading) return <LoadingState label="Loading deliveries..." />

  return (
    <DashboardShell user={user} label="Delivery tracking">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PageHero eyebrow="Dispatch" title="Delivery tracking" description="Assign orders, monitor delivery progress, and keep every handoff visible from one board." icon="delivery" asideTitle="Standard flow" asideText="Pending to delivered, with failed and canceled paths." />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <SectionCard title={editingId ? 'Edit delivery' : 'Create delivery'} eyebrow="Assignment">
            {(error || message) && <div className={`mb-5 rounded-lg px-3 py-2.5 text-sm font-medium ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
            <form onSubmit={submit} className="space-y-5">
              <FormField field={{ name: 'orderId', label: 'Order', type: 'select', required: true, options: [{ value: '', label: 'Select order' }, ...orders.map((order) => ({ value: order.id, label: `${order.orderNumber} · ${order.customerName}` }))] }} value={form.orderId} onChange={change} />
              {deliveryFields.map((field) => <FormField key={field.name} field={field} value={form[field.name]} onChange={change} />)}
              <div className="flex gap-3">
                <button disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Icon name={editingId ? 'check' : 'plus'} className="h-4 w-4" />{saving ? 'Saving...' : editingId ? 'Save delivery' : 'Create delivery'}</button>
                {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>}
              </div>
            </form>
          </SectionCard>
          <SectionCard title="Delivery board" eyebrow="Tracking" action={<span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{filtered.length} shown</span>}>
            <DataToolbar search={search} onSearch={setSearch} filters={[{ name: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All status' }, ...deliveryStatuses] }]} />
            <div className="mt-5">
              {filtered.length === 0 ? <EmptyState icon="delivery" title="No deliveries found" description="Create a delivery or adjust filters to view active work." /> : <div className="divide-y divide-slate-100">{filtered.map((delivery) => (
                <div key={delivery.id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-slate-950">{delivery.orderNumber}</h3><StatusBadge status={delivery.status} /></div><p className="mt-2 text-sm text-slate-500">{delivery.customerName} · {delivery.address || 'No address'}</p><p className="mt-1 text-xs text-slate-500">{delivery.driverName || 'No driver assigned'} {delivery.driverPhone ? `· ${delivery.driverPhone}` : ''}</p></div>
                    <div className="flex flex-wrap items-center gap-2">{nextDeliveryStatuses(delivery.status).map((item) => <button key={item} type="button" onClick={() => updateStatus(delivery, item)} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700 hover:bg-emerald-100">{item.replaceAll('_', ' ')}</button>)}<button type="button" onClick={() => { setEditingId(delivery.id); setForm(formFromDelivery(delivery)) }} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"><Icon name="edit" className="h-4 w-4" /></button><ConfirmAction label={delivery.orderNumber} disabled={deletingId === delivery.id} onConfirm={() => removeDelivery(delivery)} /></div>
                  </div>
                  <DeliveryTimeline status={delivery.status} />
                </div>
              ))}</div>}
            </div>
          </SectionCard>
        </section>
      </main>
    </DashboardShell>
  )
}
