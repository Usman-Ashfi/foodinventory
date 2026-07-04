import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { dispatchNextDelivery } from '@features/deliveries/services/deliveryService'

export async function POST() {
  const { error } = await requireSession()
  if (error) return error
  try {
    const result = await dispatchNextDelivery()
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Dispatch delivery error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
