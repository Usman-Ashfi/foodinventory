import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { updateDeliveryStatus } from '@/features/deliveries/deliveryService'

export async function PATCH(request, { params }) {
  const { error } = await requireSession()
  if (error) return error
  try {
    const { id } = await params
    const { status } = await request.json()
    const result = await updateDeliveryStatus(id, status)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ delivery: result.delivery })
  } catch (err) {
    console.error('Update delivery status error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
