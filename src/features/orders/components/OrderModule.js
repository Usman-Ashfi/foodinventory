'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import EmptyState from '@shared/components/ui/EmptyState'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import OrderForm from './OrderForm'
import OrderList from './OrderList'
import { orderInitialForm, orderStatuses } from '@features/orders/schema/orderConfig'

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
const panel = 'rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5'
const inputClass = 'rounded-full border border-black/5 bg-[#f8faf7] px-4 py-3 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-[#ffe078]'

function formFromOrder(order) {
  return {
    customerId: order.customerId || '',
    paymentStatus: order.paymentStatus,
    deliveryFee: String(order.deliveryFee),
    discount: String(order.discount),
    notes: order.notes || '',
    items: order.items.map((item) => ({ inventoryItemId: item.inventoryItemId || '', quantity: String(item.quantity), unitPrice: String(item.unitPrice) })),
  }
}

function OrdersHero({ metrics }) {
  return (
    <motion.section variants={fade} className={`${panel} relative isolate overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#2a7450_58%,#ffe078_145%)]" />
      <motion.div animate={{ x: [0, 18, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-8 top-10 hidden rounded-full bg-black px-5 py-3 text-sm font-black md:block">
        Kitchen queue
      </motion.div>
      <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">Sales workflow</span>
      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Orders that move with your inventory.</h1>
      <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">Create food orders, link stock items, confirm usage, and push each ticket through the kitchen pipeline.</p>
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

function OrderFilters({ search, setSearch, status, setStatus, shown }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
      <label className="relative block">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} w-full pl-11`} placeholder="Search orders" type="search" />
      </label>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
        <option value="all">All status</option>
        {orderStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <span className="inline-flex items-center justify-center rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">{shown} shown</span>
    </div>
  )
}

export default function OrderModule() {
  const router = useRouter()
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
    { label: 'Total orders', value: orders.length, icon: 'receipt' },
    { label: 'Pending', value: orders.filter((item) => item.orderStatus === 'pending').length, icon: 'calendar' },
    { label: 'In progress', value: orders.filter((item) => ['confirmed', 'preparing'].includes(item.orderStatus)).length, icon: 'list' },
    { label: 'Completed', value: orders.filter((item) => item.orderStatus === 'completed').length, icon: 'check' },
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

  async function submit(event) {
    event.preventDefault()
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
    const inventoryData = await (await fetch('/api/inventory')).json()
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

  if (loading) return <LoadingState label="Loading orders..." contained />

  return (
    <motion.main variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <OrdersHero metrics={metrics} />
      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Order desk</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-black">{editingId ? 'Edit order' : 'Create order'}</h2>
          {(error || message) && <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-[#d9ffb9] text-[#153a20]'}`}>{error || message}</div>}
          <OrderForm customers={customers} inventory={inventory} form={form} setForm={setForm} editingId={editingId} saving={saving} onSubmit={submit} onCancel={resetForm} />
        </motion.section>
        <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Pipeline</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Orders</h2>
          <div className="mt-5"><OrderFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} shown={filteredOrders.length} /></div>
          <div className="mt-6">{filteredOrders.length === 0 ? <EmptyState icon="receipt" title="No orders found" description="Create an order or adjust filters to see the pipeline." /> : <OrderList orders={filteredOrders} deletingId={deletingId} onDelete={removeOrder} onStatus={updateStatus} onEdit={(order) => { setEditingId(order.id); setForm(formFromOrder(order)) }} />}</div>
        </motion.section>
      </section>
    </motion.main>
  )
}
