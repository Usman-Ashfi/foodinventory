import { listDeliveries } from '@features/deliveries/services/deliveryService'
import { listOrders } from '@features/orders/services/orderService'
import pool from '@/lib/db'

export async function getDeliveriesBootstrap(userId) {
  const [user, orders, deliveries] = await Promise.all([
    pool.query('SELECT id, username, full_name, role FROM food_users WHERE id = $1', [userId]),
    listOrders(),
    listDeliveries(),
  ])

  return {
    user: user.rows[0] ? {
      id: user.rows[0].id,
      username: user.rows[0].username,
      fullName: user.rows[0].full_name,
      role: user.rows[0].role,
    } : null,
    orders,
    deliveries,
  }
}
