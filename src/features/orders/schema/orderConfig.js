export const orderStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
]

export const paymentStatuses = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
]

export const orderInitialForm = {
  customerId: '',
  paymentStatus: 'unpaid',
  deliveryFee: '0',
  discount: '0',
  notes: '',
  items: [{ inventoryItemId: '', quantity: '1', unitPrice: '0' }],
}

export function nextOrderStatuses(status) {
  const map = {
    pending: ['confirmed', 'canceled'],
    confirmed: ['preparing', 'canceled'],
    preparing: ['ready', 'canceled'],
    ready: ['completed', 'canceled'],
    completed: [],
    canceled: [],
  }

  return map[status] || []
}
