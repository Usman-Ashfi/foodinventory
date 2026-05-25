import pool from '@/lib/db'
import { ensureInventoryTable } from '@/lib/schema'

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
