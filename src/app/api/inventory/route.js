import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  return verifyToken(token)
}

async function ensureInventoryTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS food_inventory_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      category VARCHAR(80) DEFAULT 'Other',
      quantity NUMERIC(10, 2) DEFAULT 0,
      unit VARCHAR(30) DEFAULT 'pcs',
      min_quantity NUMERIC(10, 2) DEFAULT 0,
      expiry_date DATE,
      location VARCHAR(80) DEFAULT 'Pantry',
      notes TEXT,
      created_by INTEGER REFERENCES food_users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

function serializeItem(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category || 'Other',
    quantity: Number(item.quantity || 0),
    unit: item.unit || 'pcs',
    minQuantity: Number(item.min_quantity || 0),
    expiryDate: item.expiry_date,
    location: item.location || 'Pantry',
    notes: item.notes,
    createdBy: item.created_by,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function parseNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback

  const number = Number(value)
  return Number.isFinite(number) ? number : NaN
}

function isValidDateInput(value) {
  if (!value) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

export async function GET() {
  try {
    const payload = await getSession()

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureInventoryTable()

    const result = await pool.query(
      `SELECT id, name, category, quantity, unit, min_quantity, expiry_date,
        location, notes, created_by, created_at, updated_at
       FROM food_inventory_items
       ORDER BY
        CASE WHEN expiry_date IS NULL THEN 1 ELSE 0 END,
        expiry_date ASC,
        created_at DESC`
    )

    return NextResponse.json({
      items: result.rows.map(serializeItem),
    })
  } catch (error) {
    console.error('Get inventory error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const payload = await getSession()

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureInventoryTable()

    const body = await request.json()
    const name = String(body.name || '').trim()
    const category = String(body.category || 'Other').trim() || 'Other'
    const unit = String(body.unit || 'pcs').trim() || 'pcs'
    const location = String(body.location || 'Pantry').trim() || 'Pantry'
    const notes = String(body.notes || '').trim() || null
    const expiryDate = body.expiryDate || null
    const quantity = parseNumber(body.quantity, 0)
    const minQuantity = parseNumber(body.minQuantity, 0)

    if (!name) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    if (Number.isNaN(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a valid positive number' },
        { status: 400 }
      )
    }

    if (Number.isNaN(minQuantity) || minQuantity < 0) {
      return NextResponse.json(
        { error: 'Reorder level must be a valid positive number' },
        { status: 400 }
      )
    }

    if (!isValidDateInput(expiryDate)) {
      return NextResponse.json(
        { error: 'Expiry date must be a valid date' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO food_inventory_items
        (name, category, quantity, unit, min_quantity, expiry_date, location, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, category, quantity, unit, min_quantity, expiry_date,
        location, notes, created_by, created_at, updated_at`,
      [
        name,
        category,
        quantity,
        unit,
        minQuantity,
        expiryDate || null,
        location,
        notes,
        payload.userId,
      ]
    )

    return NextResponse.json({ item: serializeItem(result.rows[0]) })
  } catch (error) {
    console.error('Create inventory item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const payload = await getSession()

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureInventoryTable()

    const { id } = await request.json()
    const itemId = Number(id)

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: 'Valid item id is required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      'DELETE FROM food_inventory_items WHERE id = $1 RETURNING id',
      [itemId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, id: itemId })
  } catch (error) {
    console.error('Delete inventory item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
