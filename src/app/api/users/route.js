import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await pool.query(
      'SELECT id, username, full_name, role, created_at FROM food_users ORDER BY created_at DESC'
    )

    return NextResponse.json({ users: result.rows })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { username, fullName, password, role } = await request.json()

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      )
    }

    const validRoles = ['admin', 'user']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or user' },
        { status: 400 }
      )
    }

    const existing = await pool.query(
      'SELECT id FROM food_users WHERE username = $1',
      [username]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO food_users (username, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, username, full_name, role, created_at',
      [username, passwordHash, fullName || null, role]
    )

    const user = result.rows[0]

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await request.json()
    const userId = Number(id)

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'Valid user id is required' },
        { status: 400 }
      )
    }

    if (userId === Number(payload.userId)) {
      return NextResponse.json(
        { error: 'You cannot delete your own account while signed in' },
        { status: 400 }
      )
    }

    const existing = await pool.query(
      'SELECT id, role FROM food_users WHERE id = $1',
      [userId]
    )

    const user = existing.rows[0]

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role === 'admin') {
      const adminCount = await pool.query(
        "SELECT COUNT(*)::int AS count FROM food_users WHERE role = 'admin'"
      )

      if (adminCount.rows[0].count <= 1) {
        return NextResponse.json(
          { error: 'At least one admin account must remain' },
          { status: 400 }
        )
      }
    }

    await pool.query('DELETE FROM food_users WHERE id = $1', [userId])

    return NextResponse.json({ success: true, id: userId })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
