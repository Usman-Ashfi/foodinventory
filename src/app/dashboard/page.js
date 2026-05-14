'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        } else {
          router.push('/login')
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        router.push('/login')
      })
  }, [router])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back,{' '}
              <span className="font-semibold text-gray-900">
                {user?.fullName || user?.username}
              </span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Sign out
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="mt-4 text-sm text-gray-500">No recent activity yet.</p>
        </div>
      </div>
    </div>
  )
}
