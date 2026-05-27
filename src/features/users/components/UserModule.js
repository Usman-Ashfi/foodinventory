'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ConfirmAction from '@shared/components/ui/ConfirmAction'
import EmptyState from '@shared/components/ui/EmptyState'
import Icon from '@shared/components/ui/Icon'
import LoadingState from '@shared/components/ui/LoadingState'
import StatusBadge from '@shared/components/ui/StatusBadge'
import { userInitialForm, userRoles } from '@features/users/schema/userConfig'

const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
const panel = 'rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5'
const inputClass = 'w-full rounded-[1.15rem] border border-black/5 bg-[#f8faf7] px-4 py-3 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-[#ffe078]'

function displayName(user) {
  return user.full_name || user.fullName || user.username
}

function formatDate(value) {
  if (!value) return 'Just now'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function Hero({ metrics }) {
  return (
    <motion.section variants={fade} className={`${panel} relative isolate overflow-hidden bg-[#153a20] p-6 text-white sm:p-8`}>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#153a20_0%,#28704d_56%,#f1950c_138%)]" />
      <motion.div animate={{ rotate: [0, 8, 0], y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-10 top-12 hidden rounded-[2rem] bg-white/12 p-5 ring-1 ring-white/15 md:block">
        <Icon name="shield" className="size-8 text-[#ffe078]" />
      </motion.div>
      <span className="rounded-full bg-[#ffe078] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#153a20]">Access control</span>
      <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Team access, protected and clear.</h1>
      <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">Create team accounts, assign roles, and keep management access tight inside the food operations workspace.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
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

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      <input required={name === 'username' || name === 'password'} type={type} value={value || ''} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} className={inputClass} />
    </label>
  )
}

function RolePicker({ value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Role</span>
      <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#f8faf7] p-1">
        {userRoles.map((role) => <button key={role.value} type="button" onClick={() => onChange('role', role.value)} className={`rounded-full px-4 py-3 text-sm font-black transition ${value === role.value ? 'bg-[#153a20] text-white' : 'text-zinc-500 hover:bg-white'}`}>{role.label}</button>)}
      </div>
    </div>
  )
}

function UserForm({ form, saving, error, message, onChange, onSubmit }) {
  return (
    <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">New account</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Add a user</h2>
      {(error || message) && <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-[#d9ffb9] text-[#153a20]'}`}>{error || message}</div>}
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <Field label="Username / Email" name="username" value={form.username} onChange={onChange} placeholder="name@example.com" />
        <Field label="Full name" name="fullName" value={form.fullName} onChange={onChange} placeholder="Team member name" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Create a secure password" />
        <RolePicker value={form.role} onChange={onChange} />
        <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white disabled:opacity-60"><Icon name="plus" className="size-4" /> {saving ? 'Creating...' : 'Create user'}</button>
      </form>
    </motion.section>
  )
}

function UserCard({ user, currentUser, deletingId, onRemove }) {
  const name = displayName(user)
  return (
    <motion.article layout whileHover={{ y: -4 }} className="rounded-[1.5rem] bg-[#f8faf7] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#153a20] text-sm font-black uppercase text-[#ffe078] shadow-lg shadow-black/10">{name.charAt(0)}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-black">{name}</p>
            <p className="truncate text-xs font-bold text-zinc-500">{user.username}</p>
            <p className="mt-1 text-xs font-bold text-zinc-400">Added {formatDate(user.created_at || user.createdAt)}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={user.role === 'admin' ? 'confirmed' : 'active'} />
          <ConfirmAction label={name} title={user.id === currentUser?.id ? 'You cannot delete yourself' : `Delete ${name}`} disabled={deletingId === user.id || user.id === currentUser?.id} onConfirm={() => onRemove(user)} />
        </div>
      </div>
    </motion.article>
  )
}

export default function UserModule() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(userInitialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const metrics = useMemo(() => {
    const admins = users.filter((user) => user.role === 'admin').length
    return [
      { label: 'Total users', value: users.length, icon: 'users' },
      { label: 'Administrators', value: admins, icon: 'shield' },
      { label: 'Standard users', value: users.length - admins, icon: 'user' },
    ]
  }, [users])

  useEffect(() => {
    let active = true
    async function load() {
      const meData = await (await fetch('/api/me')).json()
      if (!active) return
      if (!meData.user) return router.push('/login')
      if (meData.user.role !== 'admin') return router.push('/dashboard')
      setCurrentUser(meData.user)
      const usersData = await (await fetch('/api/users')).json()
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

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return setError(data.error || 'Failed to create user')
    setUsers((prev) => [data.user, ...prev])
    setForm(userInitialForm)
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

  if (loading) return <LoadingState label="Loading users..." contained />

  return (
    <motion.main variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <Hero metrics={metrics} />
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <UserForm form={form} saving={saving} error={error} message={message} onChange={change} onSubmit={submit} />
        <motion.section variants={fade} className={`${panel} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#f1950c]">Directory</p><h2 className="mt-2 text-2xl font-black tracking-tight text-black">Existing users</h2></div>
            <span className="rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white">{users.length} total</span>
          </div>
          <div className="mt-6">{users.length === 0 ? <EmptyState icon="users" title="No users found" description="Create the first account to start building your team." /> : <motion.div layout className="grid gap-4">{users.map((user) => <UserCard key={user.id} user={user} currentUser={currentUser} deletingId={deletingId} onRemove={removeUser} />)}</motion.div>}</div>
        </motion.section>
      </section>
    </motion.main>
  )
}
