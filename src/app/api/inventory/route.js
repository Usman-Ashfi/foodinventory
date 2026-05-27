import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { createInventoryItem, deleteInventoryItem, listInventoryItems } from '@features/inventory/services/inventoryService'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error

  try {
    return NextResponse.json({ items: await listInventoryItems() })
  } catch (err) {
    console.error('Get inventory error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const { error, session } = await requireSession()
  if (error) return error

  try {
    const result = await createInventoryItem(await request.json(), session.userId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ item: result.item })
  } catch (err) {
    console.error('Create inventory item error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { error } = await requireSession()
  if (error) return error

  try {
    const result = await deleteInventoryItem((await request.json()).id)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('Delete inventory item error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
