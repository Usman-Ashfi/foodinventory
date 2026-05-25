import { NextResponse } from 'next/server'
import { getOrdersBootstrap } from '@/features/orders/orderBootstrapService'
import { requireSession } from '@/lib/session'

export async function GET() {
  const { error, session } = await requireSession()
  if (error) return error

  try {
    return NextResponse.json(await getOrdersBootstrap(session.userId))
  } catch (err) {
    console.error('Orders bootstrap error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
