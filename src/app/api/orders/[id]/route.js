import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { deleteOrder, updateOrder } from '@/features/orders/orderService'

export async function PATCH(request, { params }) {
  const { error } = await requireSession()
  if (error) return error
  try {
    const { id } = await params
    const result = await updateOrder(id, await request.json())
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ order: result.order })
  } catch (err) {
    console.error('Update order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requireSession()
  if (error) return error
  try {
    const { id } = await params
    const result = await deleteOrder(id)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('Delete order error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
