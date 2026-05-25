import pool from '@/lib/db'
import { ensureBusinessTables } from '@/lib/schema'

const validStatuses = ['active', 'inactive']

export function serializeCustomer(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    notes: row.notes,
    status: row.status || 'active',
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function payloadFromBody(body) {
  const status = String(body.status || 'active').trim()

  return {
    name: String(body.name || '').trim(),
    phone: String(body.phone || '').trim() || null,
    email: String(body.email || '').trim() || null,
    address: String(body.address || '').trim() || null,
    notes: String(body.notes || '').trim() || null,
    status: validStatuses.includes(status) ? status : null,
  }
}

function validateCustomer(data) {
  if (!data.name) return 'Customer name is required'
  if (!data.status) return 'Invalid customer status'
  return null
}

export async function listCustomers() {
  await ensureBusinessTables()
  const result = await pool.query(`
    SELECT id, name, phone, email, address, notes, status, created_by, created_at, updated_at
    FROM food_customers
    ORDER BY created_at DESC
  `)

  return result.rows.map(serializeCustomer)
}

export async function createCustomer(body, userId) {
  await ensureBusinessTables()
  const data = payloadFromBody(body)
  const validationError = validateCustomer(data)

  if (validationError) return { error: validationError }

  const result = await pool.query(
    `INSERT INTO food_customers (name, phone, email, address, notes, status, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, phone, email, address, notes, status, created_by, created_at, updated_at`,
    [data.name, data.phone, data.email, data.address, data.notes, data.status, userId]
  )

  return { customer: serializeCustomer(result.rows[0]) }
}

export async function updateCustomer(id, body) {
  await ensureBusinessTables()
  const customerId = Number(id)
  const data = payloadFromBody(body)
  const validationError = validateCustomer(data)

  if (!Number.isInteger(customerId) || customerId <= 0) return { error: 'Valid customer id is required' }
  if (validationError) return { error: validationError }

  const result = await pool.query(
    `UPDATE food_customers
     SET name = $1, phone = $2, email = $3, address = $4, notes = $5, status = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, name, phone, email, address, notes, status, created_by, created_at, updated_at`,
    [data.name, data.phone, data.email, data.address, data.notes, data.status, customerId]
  )

  if (result.rows.length === 0) return { error: 'Customer not found', status: 404 }
  return { customer: serializeCustomer(result.rows[0]) }
}

export async function deleteCustomer(id) {
  await ensureBusinessTables()
  const customerId = Number(id)

  if (!Number.isInteger(customerId) || customerId <= 0) return { error: 'Valid customer id is required' }

  const result = await pool.query('DELETE FROM food_customers WHERE id = $1 RETURNING id', [customerId])
  if (result.rows.length === 0) return { error: 'Customer not found', status: 404 }

  return { id: customerId }
}
