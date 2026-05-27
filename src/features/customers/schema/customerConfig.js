export const customerStatuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const customerInitialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  status: 'active',
}

export const customerFields = [
  { name: 'name', label: 'Customer name', required: true, placeholder: 'Ayesha Khan' },
  { name: 'phone', label: 'Phone', placeholder: '+92 300 0000000' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'customer@example.com' },
  { name: 'status', label: 'Status', type: 'select', options: customerStatuses },
  { name: 'address', label: 'Address', type: 'textarea', rows: 3, placeholder: 'Delivery address' },
  { name: 'notes', label: 'Notes', type: 'textarea', rows: 3, placeholder: 'Preferences or special notes' },
]
