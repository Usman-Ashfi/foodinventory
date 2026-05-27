import pool from '@/lib/db'
import { ensureBusinessTables } from '@/lib/schema'

const statuses = ['pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed', 'canceled']

function serializeDelivery(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    address: row.address,
    driverName: row.driver_name,
    driverPhone: row.driver_phone,
    status: row.status || 'pending',
    scheduledAt: row.scheduled_at,
    deliveredAt: row.delivered_at,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function payload(body) {
  return {
    orderId: Number(body.orderId),
    address: String(body.address || '').trim() || null,
    driverName: String(body.driverName || '').trim() || null,
    driverPhone: String(body.driverPhone || '').trim() || null,
    scheduledAt: body.scheduledAt || null,
    notes: String(body.notes || '').trim() || null,
  }
}

function validate(data) {
  if (!Number.isInteger(data.orderId) || data.orderId <= 0) return 'Order is required'
  if (data.scheduledAt && Number.isNaN(new Date(data.scheduledAt).getTime())) return 'Scheduled time must be valid'
  return null
}

async function getOrderSnapshot(orderId) {
  const result = await pool.query(
    `SELECT o.id, o.order_number, o.customer_name, o.customer_phone, c.address
     FROM food_orders o LEFT JOIN food_customers c ON c.id = o.customer_id
     WHERE o.id = $1`,
    [orderId]
  )
  return result.rows[0]
}

export async function listDeliveries() {
  await ensureBusinessTables()
  const result = await pool.query('SELECT * FROM food_deliveries ORDER BY created_at DESC')
  return result.rows.map(serializeDelivery)
}

export async function createDelivery(body, userId) {
  await ensureBusinessTables()
  const data = payload(body)
  const validationError = validate(data)
  if (validationError) return { error: validationError }

  const order = await getOrderSnapshot(data.orderId)
  if (!order) return { error: 'Order not found' }

  const result = await pool.query(
    `INSERT INTO food_deliveries
      (order_id, order_number, customer_name, customer_phone, address, driver_name, driver_phone, scheduled_at, notes, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [data.orderId, order.order_number, order.customer_name, order.customer_phone, data.address || order.address, data.driverName, data.driverPhone, data.scheduledAt, data.notes, userId]
  )

  return { delivery: serializeDelivery(result.rows[0]) }
}

export async function updateDelivery(id, body) {
  await ensureBusinessTables()
  const deliveryId = Number(id)
  const data = payload(body)
  const validationError = validate(data)
  if (!Number.isInteger(deliveryId) || deliveryId <= 0) return { error: 'Valid delivery id is required' }
  if (validationError) return { error: validationError }

  const order = await getOrderSnapshot(data.orderId)
  if (!order) return { error: 'Order not found' }

  const result = await pool.query(
    `UPDATE food_deliveries SET order_id=$1, order_number=$2, customer_name=$3, customer_phone=$4,
     address=$5, driver_name=$6, driver_phone=$7, scheduled_at=$8, notes=$9, updated_at=CURRENT_TIMESTAMP
     WHERE id=$10 RETURNING *`,
    [data.orderId, order.order_number, order.customer_name, order.customer_phone, data.address || order.address, data.driverName, data.driverPhone, data.scheduledAt, data.notes, deliveryId]
  )

  if (!result.rows[0]) return { error: 'Delivery not found', status: 404 }
  return { delivery: serializeDelivery(result.rows[0]) }
}

export async function updateDeliveryStatus(id, status) {
  await ensureBusinessTables()
  const deliveryId = Number(id)
  const nextStatus = String(status || '')
  if (!Number.isInteger(deliveryId) || deliveryId <= 0) return { error: 'Valid delivery id is required' }
  if (!statuses.includes(nextStatus)) return { error: 'Invalid delivery status' }

  const result = await pool.query(
    `UPDATE food_deliveries
     SET status=$1::varchar,
      delivered_at=CASE WHEN $1::varchar = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END,
      updated_at=CURRENT_TIMESTAMP
     WHERE id=$2 RETURNING *`,
    [nextStatus, deliveryId]
  )

  if (!result.rows[0]) return { error: 'Delivery not found', status: 404 }
  return { delivery: serializeDelivery(result.rows[0]) }
}

export async function deleteDelivery(id) {
  await ensureBusinessTables()
  const deliveryId = Number(id)
  if (!Number.isInteger(deliveryId) || deliveryId <= 0) return { error: 'Valid delivery id is required' }

  const result = await pool.query('DELETE FROM food_deliveries WHERE id = $1 RETURNING id', [deliveryId])
  if (!result.rows[0]) return { error: 'Delivery not found', status: 404 }
  return { id: deliveryId }
}
