import { NextResponse } from 'next/server'
import { getDeliveriesBootstrap } from '@features/deliveries/services/deliveryBootstrapService'
import { requireSession } from '@/lib/session'

export async function GET() {
  const { error, session } = await requireSession()
  if (error) return error

  try {
    return NextResponse.json(await getDeliveriesBootstrap(session.userId))
  } catch (err) {
    console.error('Deliveries bootstrap error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
