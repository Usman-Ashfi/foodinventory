import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { getReportSummary } from '@features/reports/services/reportService'

export async function GET(request) {
  const { error } = await requireSession()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const summary = await getReportSummary({
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    })
    return NextResponse.json({ summary })
  } catch (err) {
    console.error('Report summary error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
