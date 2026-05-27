import pool from '@/lib/db'
import { ensureBusinessTables } from '@/lib/schema'

function dateFilter(startDate, endDate, alias = 'created_at') {
  const clauses = []
  const params = []

  if (startDate) {
    params.push(startDate)
    clauses.push(`${alias}::date >= $${params.length}`)
  }
  if (endDate) {
    params.push(endDate)
    clauses.push(`${alias}::date <= $${params.length}`)
  }

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

export async function getReportSummary({ startDate, endDate }) {
  await ensureBusinessTables()
  const ordersFilter = dateFilter(startDate, endDate, 'created_at')

  const [sales, statusRows, topCustomers, recentOrders, inventory, usedItems, deliveries] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS orders,
       COALESCE(SUM(CASE WHEN order_status IN ('confirmed','preparing','ready','completed') THEN total ELSE 0 END),0)::float AS revenue,
       COALESCE(AVG(NULLIF(total,0)),0)::float AS average_order,
       COUNT(*) FILTER (WHERE payment_status = 'paid')::int AS paid,
       COUNT(*) FILTER (WHERE payment_status = 'unpaid')::int AS unpaid
       FROM food_orders ${ordersFilter.where}`,
      ordersFilter.params
    ),
    pool.query(`SELECT order_status AS status, COUNT(*)::int AS count FROM food_orders ${ordersFilter.where} GROUP BY order_status`, ordersFilter.params),
    pool.query(
      `SELECT customer_name AS name, COUNT(*)::int AS orders, COALESCE(SUM(total),0)::float AS total
       FROM food_orders ${ordersFilter.where} GROUP BY customer_name ORDER BY total DESC LIMIT 5`,
      ordersFilter.params
    ),
    pool.query(
      `SELECT id, order_number, customer_name, order_status, total, created_at FROM food_orders
       ${ordersFilter.where} ORDER BY created_at DESC LIMIT 5`,
      ordersFilter.params
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total_items,
       COUNT(*) FILTER (WHERE quantity <= min_quantity)::int AS low_stock,
       COUNT(*) FILTER (WHERE expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + INTERVAL '7 days')::int AS expiring
       FROM food_inventory_items`
    ),
    pool.query(
      `SELECT item_name AS name, COALESCE(SUM(quantity),0)::float AS quantity
       FROM food_order_items GROUP BY item_name ORDER BY quantity DESC LIMIT 5`
    ),
    pool.query(
      `SELECT
       COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered,
       COUNT(*) FILTER (WHERE status IN ('assigned','picked_up','out_for_delivery'))::int AS in_progress,
       COUNT(*) FILTER (WHERE status IN ('failed','canceled'))::int AS problem
       FROM food_deliveries`
    ),
  ])

  return {
    sales: sales.rows[0],
    orders: {
      statusBreakdown: statusRows.rows,
      topCustomers: topCustomers.rows,
      recent: recentOrders.rows,
    },
    inventory: {
      ...inventory.rows[0],
      mostUsed: usedItems.rows,
    },
    deliveries: deliveries.rows[0],
  }
}
