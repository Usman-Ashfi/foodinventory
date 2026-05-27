export const inventoryInitialForm = {
  name: '',
  category: 'Produce',
  quantity: '1',
  unit: 'pcs',
  minQuantity: '0',
  expiryDate: '',
  location: 'Pantry',
  notes: '',
}

export const categories = [
  'Produce',
  'Dairy',
  'Meat',
  'Seafood',
  'Bakery',
  'Frozen',
  'Dry Goods',
  'Beverages',
  'Condiments',
  'Other',
]

export const units = ['pcs', 'kg', 'g', 'lb', 'L', 'ml', 'pack', 'box', 'bag', 'can', 'bottle']

export const inventoryFields = [
  { name: 'name', label: 'Item name', required: true, placeholder: 'Tomatoes' },
  { name: 'category', label: 'Category', type: 'select', options: categories },
  { name: 'location', label: 'Location', placeholder: 'Pantry' },
  { name: 'quantity', label: 'Quantity', type: 'number', min: '0', step: '0.01', required: true },
  { name: 'unit', label: 'Unit', type: 'select', options: units },
  { name: 'minQuantity', label: 'Reorder at', type: 'number', min: '0', step: '0.01' },
  { name: 'expiryDate', label: 'Expiry date', type: 'date' },
  { name: 'notes', label: 'Notes', type: 'textarea', rows: 3, placeholder: 'Supplier, batch, storage notes...' },
]

export function getDaysUntilExpiry(value) {
  if (!value) return null
  const date = new Date(String(value).slice(0, 10))
  if (Number.isNaN(date.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((date.getTime() - today.getTime()) / 86400000)
}

export function getItemStatus(item) {
  if (Number(item.quantity) <= Number(item.minQuantity || 0)) return 'low'
  const days = getDaysUntilExpiry(item.expiryDate)
  if (days !== null && days < 0) return 'expired'
  if (days !== null && days <= 7) return 'expiring'
  return 'fresh'
}

export function formatDate(value) {
  if (!value) return 'No expiry'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}
