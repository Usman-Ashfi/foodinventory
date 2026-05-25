'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: 'box' },
  { label: 'Customers', href: '/dashboard/customers', icon: 'users' },
  { label: 'Orders', href: '/dashboard/orders', icon: 'receipt' },
  { label: 'Delivery', href: '/dashboard/deliveries', icon: 'delivery' },
  { label: 'Reports', href: '/dashboard/reports', icon: 'report' },
  { label: 'Users', href: '/dashboard/user', icon: 'shield' },
]

export default function DashboardFloatingNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Dashboard navigation" className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(calc(100%-1rem),58rem)] items-center justify-start gap-1 overflow-x-auto rounded-full border border-emerald-100 bg-white/95 p-1.5 shadow-lg shadow-slate-900/10 backdrop-blur">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

        return (
          <Link key={item.href} href={item.href} className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
            <Icon name={item.icon} className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
