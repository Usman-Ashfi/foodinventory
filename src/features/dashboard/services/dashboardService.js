import pool from '@/lib/db'
import { ensureBusinessTables } from '@/lib/schema'

export async function getDashboardSummary(userId) {
  await ensureBusinessTables()

  const [user, inventory, customers, orders, deliveries] = await Promise.all([
    pool.query('SELECT id, username, full_name, role FROM food_users WHERE id = $1', [userId]),
    pool.query('SELECT id, quantity, min_quantity, expiry_date, category FROM food_inventory_items'),
    pool.query('SELECT id, status FROM food_customers'),
    pool.query(`
      SELECT id, order_number, customer_name, order_status, total, created_at
      FROM food_orders
      ORDER BY created_at DESC
      LIMIT 20
    `),
    pool.query('SELECT id, status FROM food_deliveries'),
  ])

  return {
    user: user.rows[0] ? {
      id: user.rows[0].id,
      username: user.rows[0].username,
      fullName: user.rows[0].full_name,
      role: user.rows[0].role,
    } : null,
    data: {
      inventory: inventory.rows.map((item) => ({
        id: item.id,
        quantity: Number(item.quantity || 0),
        minQuantity: Number(item.min_quantity || 0),
        expiryDate: item.expiry_date,
        category: item.category,
      })),
      customers: customers.rows,
      orders: orders.rows.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        orderStatus: order.order_status,
        total: Number(order.total || 0),
        createdAt: order.created_at,
      })),
      deliveries: deliveries.rows,
    },
  }
}
