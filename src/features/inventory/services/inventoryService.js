import pool from '@/lib/db'
import { ensureInventoryTable } from '@/lib/schema'

function numberValue(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : NaN
}

function isValidDateInput(value) {
  if (!value) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
}

export function serializeInventoryItem(item) {
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

export async function listInventoryItems() {
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

  return result.rows.map(serializeInventoryItem)
}

function inventoryPayload(body) {
  return {
    name: String(body.name || '').trim(),
    category: String(body.category || 'Other').trim() || 'Other',
    quantity: numberValue(body.quantity, 0),
    unit: String(body.unit || 'pcs').trim() || 'pcs',
    minQuantity: numberValue(body.minQuantity, 0),
    expiryDate: body.expiryDate || null,
    location: String(body.location || 'Pantry').trim() || 'Pantry',
    notes: String(body.notes || '').trim() || null,
  }
}

function validateInventoryItem(data) {
  if (!data.name) return 'Item name is required'
  if (Number.isNaN(data.quantity) || data.quantity < 0) return 'Quantity must be a valid positive number'
  if (Number.isNaN(data.minQuantity) || data.minQuantity < 0) return 'Reorder level must be a valid positive number'
  if (!isValidDateInput(data.expiryDate)) return 'Expiry date must be a valid date'
  return null
}

export async function createInventoryItem(body, userId) {
  await ensureInventoryTable()
  const data = inventoryPayload(body)
  const validationError = validateInventoryItem(data)
  if (validationError) return { error: validationError }

  const result = await pool.query(
    `INSERT INTO food_inventory_items
      (name, category, quantity, unit, min_quantity, expiry_date, location, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, name, category, quantity, unit, min_quantity, expiry_date,
      location, notes, created_by, created_at, updated_at`,
    [data.name, data.category, data.quantity, data.unit, data.minQuantity, data.expiryDate || null, data.location, data.notes, userId]
  )

  return { item: serializeInventoryItem(result.rows[0]) }
}

export async function deleteInventoryItem(id) {
  await ensureInventoryTable()
  const itemId = Number(id)
  if (!Number.isInteger(itemId) || itemId <= 0) return { error: 'Valid item id is required' }

  const result = await pool.query('DELETE FROM food_inventory_items WHERE id = $1 RETURNING id', [itemId])
  if (result.rows.length === 0) return { error: 'Item not found', status: 404 }

  return { id: itemId }
}
