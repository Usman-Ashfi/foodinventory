'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import PageHero from '@/components/dashboard/PageHero'
import ConfirmAction from '@/components/ui/ConfirmAction'
import EmptyState from '@/components/ui/EmptyState'
import FormField from '@/components/ui/FormField'
import Icon from '@/components/ui/Icon'
import LoadingState from '@/components/ui/LoadingState'
import MetricCard from '@/components/ui/MetricCard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'

const initialForm = { username: '', fullName: '', password: '', role: 'user' }
const fields = [
  { name: 'username', label: 'Username / Email', required: true, placeholder: 'name@example.com' },
  { name: 'fullName', label: 'Full name', placeholder: 'Team member name' },
  { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Create a secure password' },
  { name: 'role', label: 'Role', type: 'select', options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }] },
]

function displayName(user) {
  return user.full_name || user.fullName || user.username
}

function formatDate(value) {
  if (!value) return 'Just now'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export default function UserModule() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const metrics = useMemo(() => {
    const admins = users.filter((user) => user.role === 'admin').length
    return [
      { label: 'Total users', value: users.length, icon: 'users', tone: 'emerald' },
      { label: 'Administrators', value: admins, icon: 'shield', tone: 'violet' },
      { label: 'Standard users', value: users.length - admins, icon: 'user', tone: 'sky' },
    ]
  }, [users])

  useEffect(() => {
    let active = true
    async function load() {
      const meRes = await fetch('/api/me')
      const meData = await meRes.json()
      if (!active) return
      if (!meData.user) return router.push('/login')
      if (meData.user.role !== 'admin') return router.push('/dashboard')
      setCurrentUser(meData.user)
      const usersRes = await fetch('/api/users')
      const usersData = await usersRes.json()
      if (!active) return
      setUsers(usersData.users || [])
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
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return setError(data.error || 'Failed to create user')
    setUsers((prev) => [{ ...data.user, full_name: data.user.fullName, created_at: data.user.createdAt }, ...prev])
    setForm(initialForm)
    setMessage('User created successfully')
  }

  async function removeUser(user) {
    if (user.id === currentUser?.id) return setError('You cannot delete your own account while signed in')
    setDeletingId(user.id)
    const res = await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) })
    const data = await res.json()
    setDeletingId(null)
    if (!res.ok) return setError(data.error || 'Failed to delete user')
    setUsers((prev) => prev.filter((item) => item.id !== user.id))
    setMessage('User deleted successfully')
  }

  if (loading) return <LoadingState label="Loading users..." />

  return (
    <DashboardShell user={currentUser} label="User management">
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PageHero eyebrow="Access control" title="User management" description="Create team accounts, assign roles, and keep PantryPro access organized from one focused workspace." icon="key" asideTitle="Admin only" asideText="This area is protected by role checks." />
        <section className="grid gap-4 sm:grid-cols-3">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Add a user" eyebrow="New account">
            {(error || message) && <div className={`mb-5 rounded-lg px-3 py-2.5 text-sm font-medium ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
            <form onSubmit={submit} className="space-y-5">
              {fields.map((field) => <FormField key={field.name} field={field} value={form[field.name]} onChange={change} />)}
              <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                <Icon name="plus" className="h-4 w-4" /> {saving ? 'Creating...' : 'Create user'}
              </button>
            </form>
          </SectionCard>
          <SectionCard title="Existing users" eyebrow="Directory" action={<span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{users.length} total</span>}>
            {users.length === 0 ? <EmptyState icon="users" title="No users found" description="Create the first account to start building your team." /> : <div className="divide-y divide-slate-100">{users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">{displayName(user).charAt(0)}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-950">{displayName(user)}</p><p className="truncate text-xs text-slate-500">{user.username}</p><p className="mt-1 text-xs text-slate-400">Added {formatDate(user.created_at || user.createdAt)}</p></div></div>
                <div className="flex shrink-0 items-center gap-2"><StatusBadge status={user.role === 'admin' ? 'confirmed' : 'active'} /><ConfirmAction label={displayName(user)} title={user.id === currentUser?.id ? 'You cannot delete yourself' : `Delete ${displayName(user)}`} disabled={deletingId === user.id || user.id === currentUser?.id} onConfirm={() => removeUser(user)} /></div>
              </div>
            ))}</div>}
          </SectionCard>
        </section>
      </main>
    </DashboardShell>
  )
}
