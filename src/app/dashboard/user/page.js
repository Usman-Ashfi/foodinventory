'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardFloatingNav from '@/components/DashboardFloatingNav'

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    arrow: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    ),
    key: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a4.5 4.5 0 1 1-1.32 3.18L21 15v3h-3v3h-3l-4.5-4.5" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 21a8 8 0 0 1 16 0" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75" />
    ),
  }

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

function formatDate(value) {
  if (!value) return 'Just now'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function getDisplayName(user) {
  return user.full_name || user.fullName || user.username
}

function PageShell({ currentUser, children }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
              <Icon name="users" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-emerald-950">PantryPro</p>
              <p className="mt-1 text-xs text-slate-500">User management</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {currentUser?.fullName || currentUser?.username}
              </p>
              <p className="text-xs capitalize text-slate-500">{currentUser?.role || 'admin'}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
              {(currentUser?.fullName || currentUser?.username || 'A').charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {children}
      <DashboardFloatingNav />
    </div>
  )
}

function StatCard({ label, value, icon, tone }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
    </div>
  )
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        isAdmin
          ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
      }`}
    >
      {isAdmin && <Icon name="shield" className="h-3.5 w-3.5" />}
      {role}
    </span>
  )
}

function EmptyUsers() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <Icon name="users" className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">No users found</h3>
      <p className="mt-2 text-sm text-slate-500">Create the first account to start building your team.</p>
    </div>
  )
}

export default function UserManagementPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'user',
  })

  const userStats = useMemo(() => {
    const admins = users.filter((user) => user.role === 'admin').length

    return [
      { label: 'Total users', value: users.length, icon: 'users', tone: 'emerald' },
      { label: 'Administrators', value: admins, icon: 'shield', tone: 'violet' },
      { label: 'Standard users', value: users.length - admins, icon: 'user', tone: 'sky' },
    ]
  }, [users])

  useEffect(() => {
    let active = true

    async function loadPage() {
      try {
        const meRes = await fetch('/api/me')
        const meData = await meRes.json()

        if (!active) return

        if (!meData.user) {
          router.push('/login')
          return
        }

        if (meData.user.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        setCurrentUser(meData.user)

        const usersRes = await fetch('/api/users')
        const usersData = await usersRes.json()

        if (!active) return

        if (usersData.users) {
          setUsers(usersData.users)
        }
      } catch {
        if (active) router.push('/login')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPage()

    return () => {
      active = false
    }
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create user')
        return
      }

      setSuccess('User created successfully')
      setUsers((prev) => [
        {
          ...data.user,
          full_name: data.user.fullName,
          created_at: data.user.createdAt,
        },
        ...prev,
      ])
      setForm({ username: '', fullName: '', password: '', role: 'user' })
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteUser(user) {
    if (user.id === currentUser?.id) {
      setError('You cannot delete your own account while signed in')
      setSuccess('')
      return
    }

    const confirmed = window.confirm(
      `Delete ${getDisplayName(user)}? This action cannot be undone.`
    )

    if (!confirmed) return

    setError('')
    setSuccess('')
    setDeletingId(user.id)

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to delete user')
        return
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      setSuccess('User deleted successfully')
    } catch {
      setError('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <PageShell currentUser={currentUser}>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_62%,#ecfdf5_100%)]" />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            <Icon name="arrow" className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Access control
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                User management
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Create team accounts, assign roles, and keep PantryPro access organized from one focused workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Icon name="key" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Admin only</p>
                  <p className="mt-1 text-xs text-slate-500">This area is protected by role checks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {userStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                New account
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                Add a user
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create credentials and choose the right access level for the team member.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <Field id="username" label="Username / Email">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="name@example.com"
                />
              </Field>

              <Field id="fullName" label="Full name">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Team member name"
                />
              </Field>

              <Field id="password" label="Password">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Create a secure password"
                />
              </Field>

              <Field id="role" label="Role">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Icon name="plus" className="h-4 w-4" />
                    Create user
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Directory
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                  Existing users
                </h2>
              </div>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                {users.length} total
              </span>
            </div>

            {(error || success) && (
              <div
                className={`mt-5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  error
                    ? 'bg-red-50 text-red-600'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {error || success}
              </div>
            )}

            {users.length === 0 ? (
              <div className="mt-5">
                <EmptyUsers />
              </div>
            ) : (
              <div className="mt-5 divide-y divide-slate-100">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
                        {getDisplayName(user).charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {getDisplayName(user)}
                        </p>
                        <p className="truncate text-xs text-slate-500">{user.username}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Added {formatDate(user.created_at || user.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <RoleBadge role={user.role} />
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingId === user.id || user.id === currentUser?.id}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Delete ${getDisplayName(user)}`}
                        title={
                          user.id === currentUser?.id
                            ? 'You cannot delete yourself'
                            : `Delete ${getDisplayName(user)}`
                        }
                      >
                        {deletingId === user.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                        ) : (
                          <Icon name="trash" className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
