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
import { customerFields, customerInitialForm, customerStatuses } from './customerConfig'

function normalizeForm(customer) {
  return customer ? { ...customerInitialForm, ...customer } : customerInitialForm
}

export default function CustomerModule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
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
    const recent = customers.filter((customer) => {
      const created = new Date(customer.createdAt)
      return Date.now() - created.getTime() < 7 * 86400000
    }).length

    return [
      { label: 'Total customers', value: customers.length, icon: 'users', tone: 'emerald' },
      { label: 'Active', value: customers.filter((item) => item.status === 'active').length, icon: 'check', tone: 'sky' },
      { label: 'Inactive', value: customers.filter((item) => item.status === 'inactive').length, icon: 'user', tone: 'amber' },
      { label: 'New this week', value: recent, icon: 'calendar', tone: 'violet' },
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
      setUser(meData.user)
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

  async function submit(e) {
    e.preventDefault()
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

  if (loading) return <LoadingState label="Loading customers..." />

  return (
    <DashboardShell user={user} label="Customer management">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PageHero eyebrow="Relationships" title="Customer management" description="Create customer profiles, keep contact details close, and connect every order to the right person." icon="users" asideTitle="Customer records" asideText="Ready for orders, reports, and delivery tracking." />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <SectionCard title={editingId ? 'Edit customer' : 'Add customer'} eyebrow="Directory">
            {(error || message) && <div className={`mb-5 rounded-lg px-3 py-2.5 text-sm font-medium ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
            <form onSubmit={submit} className="space-y-5">
              {customerFields.map((field) => <FormField key={field.name} field={field} value={form[field.name]} onChange={changeField} />)}
              <div className="flex gap-3">
                <button disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">
                  <Icon name={editingId ? 'check' : 'plus'} className="h-4 w-4" />
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create customer'}
                </button>
                {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>}
              </div>
            </form>
          </SectionCard>
          <SectionCard title="Customer list" eyebrow="Records" action={<span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{filteredCustomers.length} shown</span>}>
            <DataToolbar search={search} onSearch={setSearch} filters={[{ name: 'status', value: status, onChange: setStatus, options: [{ value: 'all', label: 'All status' }, ...customerStatuses] }]} />
            <div className="mt-5">
              {filteredCustomers.length === 0 ? <EmptyState icon="users" title="No customers found" description="Create a customer or adjust your filters to see more records." /> : (
                <div className="divide-y divide-slate-100">{filteredCustomers.map((customer) => (
                  <div key={customer.id} className="grid gap-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-semibold text-slate-950">{customer.name}</h3><StatusBadge status={customer.status} /></div>
                      <p className="mt-2 text-sm text-slate-500">{[customer.phone, customer.email].filter(Boolean).join(' · ') || 'No contact details'}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{customer.address || customer.notes || 'No address saved'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => { setEditingId(customer.id); setForm(normalizeForm(customer)) }} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" aria-label={`Edit ${customer.name}`} title={`Edit ${customer.name}`}><Icon name="edit" className="h-4 w-4" /></button>
                      <ConfirmAction label={customer.name} disabled={deletingId === customer.id} onConfirm={() => removeCustomer(customer)} />
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          </SectionCard>
        </section>
      </main>
    </DashboardShell>
  )
}
