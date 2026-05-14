import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT id, username, full_name, role FROM food_users WHERE id = $1',
      [payload.userId]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
