import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { createOrder, listOrders } from '@features/orders/services/orderService'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error
  try {
    return NextResponse.json({ orders: await listOrders() })
  } catch (err) {
    console.error('Get orders error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const { error, session } = await requireSession()
  if (error) return error
  try {
    const result = await createOrder(await request.json(), session.userId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ order: result.order })
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
