'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import PageHero from '@/components/dashboard/PageHero'
import DataToolbar from '@/components/ui/DataToolbar'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'
import MetricCard from '@/components/ui/MetricCard'
import SectionCard from '@/components/ui/SectionCard'
import OrderForm from './OrderForm'
import OrderList from './OrderList'
import { orderInitialForm, orderStatuses } from './orderConfig'

function formFromOrder(order) {
  return {
    customerId: order.customerId || '',
    paymentStatus: order.paymentStatus,
    deliveryFee: String(order.deliveryFee),
    discount: String(order.discount),
    notes: order.notes || '',
    items: order.items.map((item) => ({
      inventoryItemId: item.inventoryItemId || '',
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
    })),
  }
}

export default function OrderModule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [customers, setCustomers] = useState([])
  const [inventory, setInventory] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(orderInitialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const metrics = useMemo(() => [
    { label: 'Total orders', value: orders.length, icon: 'receipt', tone: 'emerald' },
    { label: 'Pending', value: orders.filter((item) => item.orderStatus === 'pending').length, icon: 'calendar', tone: 'amber' },
    { label: 'In progress', value: orders.filter((item) => ['confirmed', 'preparing'].includes(item.orderStatus)).length, icon: 'list', tone: 'sky' },
    { label: 'Completed', value: orders.filter((item) => item.orderStatus === 'completed').length, icon: 'check', tone: 'violet' },
  ], [orders])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const text = [order.orderNumber, order.customerName, order.customerPhone, order.notes].join(' ').toLowerCase()
      return (!query || text.includes(query)) && (status === 'all' || order.orderStatus === status)
    })
  }, [orders, search, status])

  useEffect(() => {
    let active = true
    async function load() {
      const res = await fetch('/api/orders/bootstrap')
      const data = await res.json()
      if (!active) return
      if (!data.user) return router.push('/login')
      setUser(data.user)
      setCustomers(data.customers || [])
      setInventory(data.inventory || [])
      setOrders(data.orders || [])
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => { active = false }
  }, [router])

  function resetForm() {
    setForm(orderInitialForm)
    setEditingId(null)
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const res = await fetch(editingId ? `/api/orders/${editingId}` : '/api/orders', { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return setError(data.error || 'Failed to save order')
    setOrders((prev) => editingId ? prev.map((item) => item.id === editingId ? data.order : item) : [data.order, ...prev])
    setMessage(editingId ? 'Order updated' : 'Order created')
    resetForm()
  }

  async function updateStatus(order, nextStatus) {
    const res = await fetch(`/api/orders/${order.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed to update order')
    setOrders((prev) => prev.map((item) => item.id === order.id ? data.order : item))
    const inventoryRes = await fetch('/api/inventory')
    const inventoryData = await inventoryRes.json()
    setInventory(inventoryData.items || [])
    setMessage('Order status updated')
  }

  async function removeOrder(order) {
    setDeletingId(order.id)
    const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
    const data = await res.json()
    setDeletingId(null)
    if (!res.ok) return setError(data.error || 'Failed to delete order')
    setOrders((prev) => prev.filter((item) => item.id !== order.id))
    setMessage('Order deleted')
  }

  if (loading) return <LoadingState label="Loading orders..." />

  return (
    <DashboardShell user={user} label="Order management">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PageHero eyebrow="Sales workflow" title="Order management" description="Build inventory-linked orders, confirm stock usage, and move kitchen work from pending to completed." icon="receipt" asideTitle="Inventory linked" asideText="Stock is reduced when orders are confirmed." />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title={editingId ? 'Edit order' : 'Create order'} eyebrow="Order desk">
            {(error || message) && <div className={`mb-5 rounded-lg px-3 py-2.5 text-sm font-medium ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
            <OrderForm customers={customers} inventory={inventory} form={form} setForm={setForm} editingId={editingId} saving={saving} onSubmit={submit} onCancel={resetForm} />
          </SectionCard>
          <SectionCard title="Orders" eyebrow="Pipeline" action={<span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{filteredOrders.length} shown</span>}>
            <DataToolbar search={search} onSearch={setSearch} filters={[{ name: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All status' }, ...orderStatuses] }]} />
            <div className="mt-5">
              {filteredOrders.length === 0 ? <EmptyState icon="receipt" title="No orders found" description="Create an order or adjust your filters to see the pipeline." /> : <OrderList orders={filteredOrders} deletingId={deletingId} onDelete={removeOrder} onStatus={updateStatus} onEdit={(order) => { setEditingId(order.id); setForm(formFromOrder(order)) }} />}
            </div>
          </SectionCard>
        </section>
      </main>
    </DashboardShell>
  )
}
