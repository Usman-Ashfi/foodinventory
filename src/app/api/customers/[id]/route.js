import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { deleteCustomer, updateCustomer } from '@/features/customers/customerService'

export async function PATCH(request, { params }) {
  const { error } = await requireSession()
  if (error) return error

  try {
    const { id } = await params
    const result = await updateCustomer(id, await request.json())
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ customer: result.customer })
  } catch (err) {
    console.error('Update customer error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requireSession()
  if (error) return error

  try {
    const { id } = await params
    const result = await deleteCustomer(id)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('Delete customer error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
