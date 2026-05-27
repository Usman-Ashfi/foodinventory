import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getUserById } from '@features/users/services/userService'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ user: null }, { status: 401 })

    const user = await getUserById(session.userId)
    if (!user) return NextResponse.json({ user: null }, { status: 401 })

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Me error:', err)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
