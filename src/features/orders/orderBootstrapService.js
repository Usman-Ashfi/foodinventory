import { listCustomers } from '@/features/customers/customerService'
import { listInventoryItems } from '@/features/inventory/inventoryService'
import { listOrders } from '@/features/orders/orderService'
import pool from '@/lib/db'

export async function getOrdersBootstrap(userId) {
  const [user, customers, inventory, orders] = await Promise.all([
    pool.query('SELECT id, username, full_name, role FROM food_users WHERE id = $1', [userId]),
    listCustomers(),
    listInventoryItems(),
    listOrders(),
  ])

  return {
    user: user.rows[0] ? {
      id: user.rows[0].id,
      username: user.rows[0].username,
      fullName: user.rows[0].full_name,
      role: user.rows[0].role,
    } : null,
    customers,
    inventory,
    orders,
  }
}
