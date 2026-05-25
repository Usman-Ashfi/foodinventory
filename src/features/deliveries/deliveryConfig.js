export const deliveryStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'picked_up', label: 'Picked up' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'canceled', label: 'Canceled' },
]

export const deliveryInitialForm = {
  orderId: '',
  address: '',
  driverName: '',
  driverPhone: '',
  scheduledAt: '',
  notes: '',
}

export const deliveryFields = [
  { name: 'driverName', label: 'Driver name', placeholder: 'Driver or rider name' },
  { name: 'driverPhone', label: 'Driver phone', placeholder: '+92 300 0000000' },
  { name: 'scheduledAt', label: 'Scheduled time', type: 'datetime-local' },
  { name: 'address', label: 'Delivery address', type: 'textarea', rows: 3, placeholder: 'Customer delivery address' },
  { name: 'notes', label: 'Notes', type: 'textarea', rows: 2, placeholder: 'Gate code, handoff notes, or delivery instructions' },
]

export const deliveryFlow = deliveryStatuses.map((status) => status.value)

export function nextDeliveryStatuses(status) {
  const map = {
    pending: ['assigned', 'canceled'],
    assigned: ['picked_up', 'failed', 'canceled'],
    picked_up: ['out_for_delivery', 'failed'],
    out_for_delivery: ['delivered', 'failed'],
    delivered: [],
    failed: [],
    canceled: [],
  }

  return map[status] || []
}
