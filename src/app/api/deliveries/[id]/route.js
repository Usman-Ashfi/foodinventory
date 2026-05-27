import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { deleteDelivery, updateDelivery } from '@features/deliveries/services/deliveryService'

export async function PATCH(request, { params }) {
  const { error } = await requireSession()
  if (error) return error
  try {
    const { id } = await params
    const result = await updateDelivery(id, await request.json())
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ delivery: result.delivery })
  } catch (err) {
    console.error('Update delivery error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requireSession()
  if (error) return error
  try {
    const { id } = await params
    const result = await deleteDelivery(id)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('Delete delivery error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
