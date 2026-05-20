'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: 'inventory' },
  { label: 'Users', href: '/dashboard/user', icon: 'users' },
]

function NavIcon({ name }) {
  const icons = {
    dashboard: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 0 1 1-1h5v7H4V5Zm10-1h5a1 1 0 0 1 1 1v3h-6V4ZM4 15h6v5H5a1 1 0 0 1-1-1v-4Zm10-3h6v7a1 1 0 0 1-1 1h-5v-8Z" />
    ),
    inventory: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5-9 5m18 0-9 5m9-5v9l-9 5m0-9-9-5m9 5v9m-9-14v9l9 5" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75" />
    ),
  }

  return (
    <svg
      className="h-4 w-4"
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

export default function DashboardFloatingNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Dashboard navigation"
      className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-[min(calc(100%-2rem),28rem)] items-center justify-center rounded-full border border-emerald-100 bg-white/95 p-1.5 shadow-lg shadow-slate-900/10 backdrop-blur"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
