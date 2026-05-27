import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'
import { createCustomer, listCustomers } from '@features/customers/services/customerService'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error

  try {
    return NextResponse.json({ customers: await listCustomers() })
  } catch (err) {
    console.error('Get customers error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const { error, session } = await requireSession()
  if (error) return error

  try {
    const result = await createCustomer(await request.json(), session.userId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ customer: result.customer })
  } catch (err) {
    console.error('Create customer error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
