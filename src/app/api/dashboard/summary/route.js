import { NextResponse } from 'next/server'
import { getDashboardSummary } from '@features/dashboard/services/dashboardService'
import { requireSession } from '@/lib/session'

export async function GET() {
  const { error, session } = await requireSession()
  if (error) return error

  try {
    const summary = await getDashboardSummary(session.userId)
    return NextResponse.json(summary)
  } catch (err) {
    console.error('Dashboard summary error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
