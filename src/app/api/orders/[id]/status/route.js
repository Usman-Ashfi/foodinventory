import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { updateOrderStatus } from '@/features/orders/orderService'

export async function PATCH(request, { params }) {
  const { error } = await requireSession()
  if (error) return error
  try {
    const { id } = await params
    const { status } = await request.json()
    const result = await updateOrderStatus(id, status)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ order: result.order })
  } catch (err) {
    console.error('Update order status error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
