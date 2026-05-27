import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { createDelivery, listDeliveries } from '@features/deliveries/services/deliveryService'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error
  try {
    return NextResponse.json({ deliveries: await listDeliveries() })
  } catch (err) {
    console.error('Get deliveries error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const { error, session } = await requireSession()
  if (error) return error
  try {
    const result = await createDelivery(await request.json(), session.userId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ delivery: result.delivery })
  } catch (err) {
    console.error('Create delivery error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
