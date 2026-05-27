import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { validUserRoles } from '@features/users/schema/userConfig'

export function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    role: user.role,
    createdAt: user.created_at,
  }
}

export async function listUsers() {
  const result = await pool.query(
    'SELECT id, username, full_name, role, created_at FROM food_users ORDER BY created_at DESC'
  )
  return result.rows.map(serializeUser)
}

export async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, username, full_name, role, created_at FROM food_users WHERE id = $1',
    [id]
  )
  return result.rows[0] ? serializeUser(result.rows[0]) : null
}

export async function createUser(body) {
  const username = String(body.username || '').trim()
  const fullName = String(body.fullName || '').trim() || null
  const password = String(body.password || '')
  const role = String(body.role || '')

  if (!username || !password || !role) return { error: 'Username, password, and role are required' }
  if (!validUserRoles.includes(role)) return { error: 'Invalid role. Must be admin or user' }

  const existing = await pool.query('SELECT id FROM food_users WHERE username = $1', [username])
  if (existing.rows.length > 0) return { error: 'Username already exists', status: 409 }

  const passwordHash = await bcrypt.hash(password, 10)
  const result = await pool.query(
    'INSERT INTO food_users (username, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, username, full_name, role, created_at',
    [username, passwordHash, fullName, role]
  )

  return { user: serializeUser(result.rows[0]) }
}

export async function deleteUser(id, currentUserId) {
  const userId = Number(id)
  if (!Number.isInteger(userId) || userId <= 0) return { error: 'Valid user id is required' }
  if (userId === Number(currentUserId)) return { error: 'You cannot delete your own account while signed in' }

  const existing = await pool.query('SELECT id, role FROM food_users WHERE id = $1', [userId])
  const user = existing.rows[0]
  if (!user) return { error: 'User not found', status: 404 }

  if (user.role === 'admin') {
    const adminCount = await pool.query("SELECT COUNT(*)::int AS count FROM food_users WHERE role = 'admin'")
    if (adminCount.rows[0].count <= 1) return { error: 'At least one admin account must remain' }
  }

  await pool.query('DELETE FROM food_users WHERE id = $1', [userId])
  return { id: userId }
}
