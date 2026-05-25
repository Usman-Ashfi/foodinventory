import { getItemStatus } from '@/features/inventory/inventoryConfig'

export function buildDashboardStats({ inventory, customers, orders, deliveries }) {
  return [
    { label: 'Inventory items', value: inventory.length, detail: 'Stock records', tone: 'emerald', icon: 'box' },
    { label: 'Customers', value: customers.length, detail: 'Profiles', tone: 'sky', icon: 'users' },
    { label: 'Open orders', value: orders.filter((item) => !['completed', 'canceled'].includes(item.orderStatus)).length, detail: 'In progress', tone: 'amber', icon: 'receipt' },
    { label: 'Deliveries', value: deliveries.filter((item) => ['assigned', 'picked_up', 'out_for_delivery'].includes(item.status)).length, detail: 'Active', tone: 'violet', icon: 'delivery' },
  ]
}

export function buildInventoryHealth(items) {
  const total = items.length || 1
  const statuses = items.map(getItemStatus)
  return [
    { label: 'Fresh', value: statuses.filter((status) => status === 'fresh').length, percent: Math.round((statuses.filter((status) => status === 'fresh').length / total) * 100), color: 'bg-emerald-500' },
    { label: 'Monitor', value: statuses.filter((status) => ['expiring', 'low'].includes(status)).length, percent: Math.round((statuses.filter((status) => ['expiring', 'low'].includes(status)).length / total) * 100), color: 'bg-amber-400' },
    { label: 'Critical', value: statuses.filter((status) => status === 'expired').length, percent: Math.round((statuses.filter((status) => status === 'expired').length / total) * 100), color: 'bg-rose-400' },
  ]
}

export const quickActions = [
  { title: 'Add inventory item', description: 'Create a new stock record with quantity, category, and expiry date.', icon: 'plus', href: '/dashboard/inventory' },
  { title: 'Create customer', description: 'Save contact and delivery details before creating a new order.', icon: 'users', href: '/dashboard/customers' },
  { title: 'Create order', description: 'Build an inventory-linked order and move it into the kitchen workflow.', icon: 'receipt', href: '/dashboard/orders' },
  { title: 'Track delivery', description: 'Assign drivers and monitor delivery progress by status.', icon: 'delivery', href: '/dashboard/deliveries' },
]
