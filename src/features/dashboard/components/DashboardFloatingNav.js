'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@shared/components/ui/Icon'

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
    <nav
      aria-label="Dashboard navigation"
      className="fixed inset-x-3 bottom-4 z-50 flex items-center gap-1 overflow-x-auto rounded-full bg-[#153a20] p-2 shadow-2xl shadow-black/25 lg:hidden"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-black transition ${isActive ? 'bg-white text-[#153a20]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon name={item.icon} className="size-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
