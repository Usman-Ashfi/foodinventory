'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ConfirmAction from '@shared/components/ui/ConfirmAction'
import EmptyState from '@shared/components/ui/EmptyState'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import StatusBadge from '@shared/components/ui/StatusBadge'
import { customerInitialForm, customerStatuses } from '@features/customers/schema/customerConfig'

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
const panel = 'rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5'
const inputClass = 'w-full rounded-[1.15rem] border border-black/5 bg-[#f8faf7] px-4 py-3 text-sm font-bold text-black outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-[#ffe078]'

const normalizeForm = (customer) => customer ? { ...customerInitialForm, ...customer } : customerInitialForm

const initials = (name) => String(name || 'C').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()

function CustomerHero({ metrics }) {
  return (
    <motion.section variants={fade} className={`${panel} relative isolate overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#28704d_56%,#f1950c_138%)]" />
      <div className="absolute -right-16 top-8 -z-10 size-64 rounded-full bg-black/20" />
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-10 top-12 hidden rounded-[2rem] bg-white/12 p-5 ring-1 ring-white/15 backdrop-blur md:block"
      >
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffe078]">Preferred buyer</p>
        <p className="mt-3 text-3xl font-black">{metrics[1]?.value || 0}</p>
        <p className="text-sm font-bold text-white/55">active profiles</p>
      </motion.div>
      <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">
        Customer intelligence
      </span>
      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
        Keep every buyer close to the workflow.
      </h1>
      <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">
        Build profiles with contact, delivery, and preference notes so orders and deliveries stay personal and organized.
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

function Field({ label, value, onChange, name, type = 'text', placeholder, textarea }) {
  return (
    <label className={textarea ? 'block sm:col-span-2' : 'block'}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value || ''} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} className={`${inputClass} resize-none`} />
      ) : (
        <input type={type} value={value || ''} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} required={name === 'name'} className={inputClass} />
      )}
    </label>
  )
}

function StatusPicker({ value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Status</span>
      <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#f8faf7] p-1">
        {customerStatuses.map((item) => {
          const active = value === item.value
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange('status', item.value)}
              className={`rounded-full px-4 py-3 text-sm font-black transition ${active ? 'bg-[#153a20] text-white shadow-lg shadow-black/10' : 'text-zinc-500 hover:bg-white'}`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CustomerForm({ form, editingId, saving, error, message, onChange, onSubmit, onReset }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Directory form</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-black">{editingId ? 'Edit customer' : 'Add customer'}</h2>
      {(error || message) && (
        <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-[#d9ffb9] text-[#153a20]'}`}>
          {error || message}
        </div>
      )}
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name" name="name" value={form.name} onChange={onChange} placeholder="Ayesha Khan" />
          <StatusPicker value={form.status} onChange={onChange} />
          <Field label="Phone" name="phone" value={form.phone} onChange={onChange} placeholder="+92 300 0000000" />
          <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} placeholder="customer@example.com" />
          <Field label="Delivery address" name="address" value={form.address} onChange={onChange} placeholder="Street, area, city" textarea />
          <Field label="Preferences and notes" name="notes" value={form.notes} onChange={onChange} placeholder="Favorite items, delivery notes, allergies..." textarea />
        </div>
        <div className="flex gap-3">
          <button disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 disabled:opacity-60">
            <Icon name={editingId ? 'check' : 'plus'} className="size-4" />
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create customer'}
          </button>
          {editingId && (
            <button type="button" onClick={onReset} className="rounded-full bg-[#f8faf7] px-5 py-3 text-sm font-black text-zinc-600 hover:bg-[#d9ffb9]">
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.section>
  )
}

function CustomerFilters({ search, setSearch, status, setStatus, shown }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
      <label className="relative block">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} rounded-full pl-11`} placeholder="Search customers" />
      </label>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className={`${inputClass} rounded-full`}>
        <option value="all">All status</option>
        {customerStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <span className="inline-flex items-center justify-center rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">{shown} shown</span>
    </div>
  )
}

function CustomerCard({ customer, deletingId, onEdit, onRemove }) {
  const contact = [customer.phone, customer.email].filter(Boolean).join(' / ') || 'No contact details'

  return (
    <motion.article layout whileHover={{ y: -4 }} className="rounded-[1.5rem] bg-[#f8faf7] p-4">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#153a20] text-sm font-black text-[#ffe078] shadow-lg shadow-black/10">
          {initials(customer.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-black">{customer.name}</h3>
            <StatusBadge status={customer.status} />
          </div>
          <p className="mt-2 truncate text-sm font-bold text-zinc-500">{contact}</p>
          <p className="mt-1 truncate text-sm font-medium text-zinc-500">{customer.address || customer.notes || 'No address saved'}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-zinc-500">Profile</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onEdit(customer)} className="grid size-9 place-items-center rounded-full bg-white text-zinc-500 shadow-sm transition hover:text-[#153a20]" aria-label={`Edit ${customer.name}`} title={`Edit ${customer.name}`}>
            <Icon name="edit" className="size-4" />
          </button>
          <ConfirmAction label={customer.name} disabled={deletingId === customer.id} onConfirm={() => onRemove(customer)} />
        </div>
      </div>
    </motion.article>
  )
}

function CustomerList({ customers, search, setSearch, status, setStatus, deletingId, onEdit, onRemove }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Records</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Customer list</h2>
      <div className="mt-5">
        <CustomerFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} shown={customers.length} />
      </div>
      <div className="mt-6">
        {customers.length === 0 ? (
          <EmptyState icon="users" title="No customers found" description="Create a customer or adjust filters to see more records." />
        ) : (
          <motion.div layout className="grid gap-4 lg:grid-cols-2">
            {customers.map((customer) => <CustomerCard key={customer.id} customer={customer} deletingId={deletingId} onEdit={onEdit} onRemove={onRemove} />)}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default function CustomerModule() {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(customerInitialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return customers.filter((customer) => {
      const text = [customer.name, customer.phone, customer.email, customer.address].join(' ').toLowerCase()
      return (!query || text.includes(query)) && (status === 'all' || customer.status === status)
    })
  }, [customers, search, status])

  const metrics = useMemo(() => {
    const recent = customers.filter((customer) => Date.now() - new Date(customer.createdAt).getTime() < 7 * 86400000).length
    return [
      { label: 'Total customers', value: customers.length, icon: 'users' },
      { label: 'Active', value: customers.filter((item) => item.status === 'active').length, icon: 'check' },
      { label: 'Inactive', value: customers.filter((item) => item.status === 'inactive').length, icon: 'user' },
      { label: 'New this week', value: recent, icon: 'calendar' },
    ]
  }, [customers])

  useEffect(() => {
    let active = true
    async function load() {
      const [meRes, customersRes] = await Promise.all([fetch('/api/me'), fetch('/api/customers')])
      const meData = await meRes.json()
      const customersData = await customersRes.json()
      if (!active) return
      if (!meData.user) return router.push('/login')
      setCustomers(customersData.customers || [])
      setLoading(false)
    }
    load().catch(() => active && setLoading(false))
    return () => { active = false }
  }, [router])

  function changeField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setForm(customerInitialForm)
    setEditingId(null)
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const url = editingId ? `/api/customers/${editingId}` : '/api/customers'
    const res = await fetch(url, { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return setError(data.error || 'Failed to save customer')
    setCustomers((prev) => editingId ? prev.map((item) => item.id === editingId ? data.customer : item) : [data.customer, ...prev])
    setMessage(editingId ? 'Customer updated' : 'Customer created')
    resetForm()
  }

  async function removeCustomer(customer) {
    setDeletingId(customer.id)
    const res = await fetch(`/api/customers/${customer.id}`, { method: 'DELETE' })
    const data = await res.json()
    setDeletingId(null)
    if (!res.ok) return setError(data.error || 'Failed to delete customer')
    setCustomers((prev) => prev.filter((item) => item.id !== customer.id))
    setMessage('Customer deleted')
  }

  function editCustomer(customer) {
    setEditingId(customer.id)
    setForm(normalizeForm(customer))
  }

  if (loading) return <LoadingState label="Loading customers..." contained />

  return (
    <motion.main variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <CustomerHero metrics={metrics} />
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <CustomerForm form={form} editingId={editingId} saving={saving} error={error} message={message} onChange={changeField} onSubmit={submit} onReset={resetForm} />
        <CustomerList customers={filteredCustomers} search={search} setSearch={setSearch} status={status} setStatus={setStatus} deletingId={deletingId} onEdit={editCustomer} onRemove={removeCustomer} />
      </section>
    </motion.main>
  )
}
