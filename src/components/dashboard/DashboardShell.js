'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardFloatingNav from '@/components/DashboardFloatingNav'
import Icon from '@/components/ui/Icon'

export function BrandMark({ label = 'Operations' }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
        <Icon name="box" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-none text-emerald-950">PantryPro</p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>
      </div>
    </Link>
  )
}

export default function DashboardShell({ user, label, children, showLogout = false }) {
  const router = useRouter()

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandMark label={label} />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.fullName || user?.username}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role || 'user'}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
              {(user?.fullName || user?.username || 'U').charAt(0)}
            </div>
            {showLogout && (
              <button type="button" onClick={logout} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600" aria-label="Sign out" title="Sign out">
                <Icon name="logout" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>
      {children}
      <DashboardFloatingNav />
    </div>
  )
}
