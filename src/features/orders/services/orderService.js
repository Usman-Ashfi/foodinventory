import pool from '@/lib/db'
import { ensureBusinessTables } from '@/lib/schema'

const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'canceled']
const paymentStatuses = ['unpaid', 'paid']

function numberValue(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : NaN
}

function serializeOrder(row, items = []) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    discount: Number(row.discount || 0),
    total: Number(row.total || 0),
    notes: row.notes,
    inventoryDeductedAt: row.inventory_deducted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  }
}

function serializeItem(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    inventoryItemId: row.inventory_item_id,
    itemName: row.item_name,
    quantity: Number(row.quantity || 0),
    unitPrice: Number(row.unit_price || 0),
    lineTotal: Number(row.line_total || 0),
  }
}

function buildOrderPayload(body) {
  const deliveryFee = numberValue(body.deliveryFee, 0)
  const discount = numberValue(body.discount, 0)
  const paymentStatus = String(body.paymentStatus || 'unpaid')
  const items = Array.isArray(body.items) ? body.items : []

  return {
    customerId: Number(body.customerId),
    paymentStatus,
    deliveryFee,
    discount,
    notes: String(body.notes || '').trim() || null,
    items: items.map((item) => ({
      inventoryItemId: Number(item.inventoryItemId),
      quantity: numberValue(item.quantity, 0),
      unitPrice: numberValue(item.unitPrice, 0),
    })),
  }
}

function validateOrder(data) {
  if (!Number.isInteger(data.customerId) || data.customerId <= 0) return 'Customer is required'
  if (!paymentStatuses.includes(data.paymentStatus)) return 'Invalid payment status'
  if (Number.isNaN(data.deliveryFee) || data.deliveryFee < 0) return 'Delivery fee must be valid'
  if (Number.isNaN(data.discount) || data.discount < 0) return 'Discount must be valid'
  if (data.items.length === 0) return 'At least one order item is required'
  if (data.items.some((item) => !Number.isInteger(item.inventoryItemId) || item.inventoryItemId <= 0)) return 'Each item needs an inventory item'
  if (data.items.some((item) => Number.isNaN(item.quantity) || item.quantity <= 0)) return 'Each item needs a positive quantity'
  if (data.items.some((item) => Number.isNaN(item.unitPrice) || item.unitPrice < 0)) return 'Each item needs a valid unit price'
  return null
}

async function hydrateOrders(rows) {
  if (rows.length === 0) return []
  const ids = rows.map((row) => row.id)
  const items = await pool.query('SELECT * FROM food_order_items WHERE order_id = ANY($1::int[]) ORDER BY id ASC', [ids])
  const itemsByOrder = new Map()
  items.rows.forEach((row) => {
    const collection = itemsByOrder.get(row.order_id) || []
    collection.push(serializeItem(row))
    itemsByOrder.set(row.order_id, collection)
  })
  return rows.map((row) => serializeOrder(row, itemsByOrder.get(row.id) || []))
}

async function getOrderRows(client, id) {
  const orders = await client.query('SELECT * FROM food_orders WHERE id = $1', [id])
  const items = await client.query('SELECT * FROM food_order_items WHERE order_id = $1 ORDER BY id ASC', [id])
  if (!orders.rows[0]) return null
  return serializeOrder(orders.rows[0], items.rows.map(serializeItem))
}

async function insertItems(client, orderId, items) {
  const inventoryIds = items.map((item) => item.inventoryItemId)
  const inventory = await client.query('SELECT id, name FROM food_inventory_items WHERE id = ANY($1::int[])', [inventoryIds])
  const names = new Map(inventory.rows.map((item) => [item.id, item.name]))

  if (names.size !== new Set(inventoryIds).size) return 'One or more inventory items were not found'

  for (const item of items) {
    const lineTotal = item.quantity * item.unitPrice
    await client.query(
      `INSERT INTO food_order_items (order_id, inventory_item_id, item_name, quantity, unit_price, line_total)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, item.inventoryItemId, names.get(item.inventoryItemId), item.quantity, item.unitPrice, lineTotal]
    )
  }

  return null
}

async function adjustStock(client, orderId, direction) {
  const items = await client.query('SELECT inventory_item_id, quantity FROM food_order_items WHERE order_id = $1', [orderId])

  for (const item of items.rows) {
    if (!item.inventory_item_id) continue
    const inventory = await client.query('SELECT quantity, name FROM food_inventory_items WHERE id = $1 FOR UPDATE', [item.inventory_item_id])
    const current = Number(inventory.rows[0]?.quantity || 0)
    const quantity = Number(item.quantity || 0)

    if (direction === -1 && current < quantity) {
      return `Insufficient stock for ${inventory.rows[0]?.name || 'an item'}`
    }

    await client.query('UPDATE food_inventory_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [direction * quantity, item.inventory_item_id])
  }

  return null
}

export async function listOrders() {
  await ensureBusinessTables()
  const result = await pool.query('SELECT * FROM food_orders ORDER BY created_at DESC')
  return hydrateOrders(result.rows)
}

export async function createOrder(body, userId) {
  await ensureBusinessTables()
  const data = buildOrderPayload(body)
  const validationError = validateOrder(data)
  if (validationError) return { error: validationError }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const customer = await client.query('SELECT name, phone FROM food_customers WHERE id = $1', [data.customerId])
    if (!customer.rows[0]) {
      await client.query('ROLLBACK')
      return { error: 'Customer not found' }
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const total = Math.max(0, subtotal + data.deliveryFee - data.discount)
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`
    const order = await client.query(
      `INSERT INTO food_orders (order_number, customer_id, customer_name, customer_phone, payment_status, subtotal, delivery_fee, discount, total, notes, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [orderNumber, data.customerId, customer.rows[0].name, customer.rows[0].phone, data.paymentStatus, subtotal, data.deliveryFee, data.discount, total, data.notes, userId]
    )
    const itemError = await insertItems(client, order.rows[0].id, data.items)
    if (itemError) {
      await client.query('ROLLBACK')
      return { error: itemError }
    }

    await client.query('COMMIT')
    return { order: await getOrderRows(pool, order.rows[0].id) }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function updateOrder(id, body) {
  await ensureBusinessTables()
  const orderId = Number(id)
  const data = buildOrderPayload(body)
  const validationError = validateOrder(data)
  if (!Number.isInteger(orderId) || orderId <= 0) return { error: 'Valid order id is required' }
  if (validationError) return { error: validationError }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const existing = await client.query('SELECT * FROM food_orders WHERE id = $1 FOR UPDATE', [orderId])
    if (!existing.rows[0]) {
      await client.query('ROLLBACK')
      return { error: 'Order not found', status: 404 }
    }
    if (existing.rows[0].inventory_deducted_at) {
      await client.query('ROLLBACK')
      return { error: 'Confirmed orders cannot edit items' }
    }

    const customer = await client.query('SELECT name, phone FROM food_customers WHERE id = $1', [data.customerId])
    if (!customer.rows[0]) {
      await client.query('ROLLBACK')
      return { error: 'Customer not found' }
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const total = Math.max(0, subtotal + data.deliveryFee - data.discount)
    await client.query('DELETE FROM food_order_items WHERE order_id = $1', [orderId])
    const itemError = await insertItems(client, orderId, data.items)
    if (itemError) {
      await client.query('ROLLBACK')
      return { error: itemError }
    }

    await client.query(
      `UPDATE food_orders SET customer_id=$1, customer_name=$2, customer_phone=$3, payment_status=$4,
       subtotal=$5, delivery_fee=$6, discount=$7, total=$8, notes=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10`,
      [data.customerId, customer.rows[0].name, customer.rows[0].phone, data.paymentStatus, subtotal, data.deliveryFee, data.discount, total, data.notes, orderId]
    )
    await client.query('COMMIT')
    return { order: await getOrderRows(pool, orderId) }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function updateOrderStatus(id, status) {
  await ensureBusinessTables()
  const orderId = Number(id)
  const nextStatus = String(status || '')
  if (!Number.isInteger(orderId) || orderId <= 0) return { error: 'Valid order id is required' }
  if (!orderStatuses.includes(nextStatus)) return { error: 'Invalid order status' }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const current = await client.query('SELECT * FROM food_orders WHERE id = $1 FOR UPDATE', [orderId])
    const order = current.rows[0]
    if (!order) {
      await client.query('ROLLBACK')
      return { error: 'Order not found', status: 404 }
    }
    if (order.order_status === 'completed' && nextStatus === 'canceled') {
      await client.query('ROLLBACK')
      return { error: 'Completed orders cannot be canceled' }
    }

    if (!order.inventory_deducted_at && ['confirmed', 'preparing', 'ready', 'completed'].includes(nextStatus)) {
      const stockError = await adjustStock(client, orderId, -1)
      if (stockError) {
        await client.query('ROLLBACK')
        return { error: stockError }
      }
      await client.query('UPDATE food_orders SET inventory_deducted_at = CURRENT_TIMESTAMP WHERE id = $1', [orderId])
    }

    if (order.inventory_deducted_at && nextStatus === 'canceled' && order.order_status !== 'completed') {
      await adjustStock(client, orderId, 1)
      await client.query('UPDATE food_orders SET inventory_deducted_at = NULL WHERE id = $1', [orderId])
    }

    await client.query('UPDATE food_orders SET order_status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2', [nextStatus, orderId])
    await client.query('COMMIT')
    return { order: await getOrderRows(pool, orderId) }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function deleteOrder(id) {
  await ensureBusinessTables()
  const orderId = Number(id)
  if (!Number.isInteger(orderId) || orderId <= 0) return { error: 'Valid order id is required' }
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const current = await client.query('SELECT * FROM food_orders WHERE id = $1 FOR UPDATE', [orderId])
    if (!current.rows[0]) {
      await client.query('ROLLBACK')
      return { error: 'Order not found', status: 404 }
    }
    if (current.rows[0].inventory_deducted_at && current.rows[0].order_status !== 'completed') await adjustStock(client, orderId, 1)
    await client.query('DELETE FROM food_orders WHERE id = $1', [orderId])
    await client.query('COMMIT')
    return { id: orderId }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
