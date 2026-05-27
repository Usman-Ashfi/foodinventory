import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { createUser, deleteUser, listUsers } from '@features/users/services/userService'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    return NextResponse.json({ users: await listUsers() })
  } catch (err) {
    console.error('Get users error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const result = await createUser(await request.json())
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ user: result.user })
  } catch (err) {
    console.error('Create user error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { error, session } = await requireAdmin()
  if (error) return error

  try {
    const result = await deleteUser((await request.json()).id, session.userId)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 })
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('Delete user error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
