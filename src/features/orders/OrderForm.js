'use client'

import FormField from '@/components/ui/FormField'
import Icon from '@/components/ui/Icon'
import { orderInitialForm, paymentStatuses } from './orderConfig'

const moneyFields = [
  { name: 'deliveryFee', label: 'Delivery fee', type: 'number', min: '0', step: '0.01' },
  { name: 'discount', label: 'Discount', type: 'number', min: '0', step: '0.01' },
]

export default function OrderForm({ customers, inventory, form, setForm, editingId, saving, onSubmit, onCancel }) {
  const subtotal = form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0)
  const total = Math.max(0, subtotal + Number(form.deliveryFee || 0) - Number(form.discount || 0))

  function change(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function changeItem(index, name, value) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, current) => current === index ? { ...item, [name]: value } : item),
    }))
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, orderInitialForm.items[0]] }))
  }

  function removeItem(index) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, current) => current !== index) }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField field={{ name: 'customerId', label: 'Customer', type: 'select', required: true, options: [{ value: '', label: 'Select customer' }, ...customers.map((customer) => ({ value: customer.id, label: customer.name }))] }} value={form.customerId} onChange={change} />
      <FormField field={{ name: 'paymentStatus', label: 'Payment status', type: 'select', options: paymentStatuses }} value={form.paymentStatus} onChange={change} />
      <div className="grid gap-4 sm:grid-cols-2">
        {moneyFields.map((field) => <FormField key={field.name} field={field} value={form[field.name]} onChange={change} />)}
      </div>
      <FormField field={{ name: 'notes', label: 'Notes', type: 'textarea', rows: 2, placeholder: 'Kitchen notes or customer requests' }} value={form.notes} onChange={change} />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Order items</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <Icon name="plus" className="h-3.5 w-3.5" /> Add item
          </button>
        </div>
        <div className="space-y-3">
          {form.items.map((item, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_88px_108px_36px]">
                <select value={item.inventoryItemId} onChange={(e) => changeItem(index, 'inventoryItemId', e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="">Inventory item</option>
                  {inventory.map((stock) => <option key={stock.id} value={stock.id}>{stock.name} ({stock.quantity} {stock.unit})</option>)}
                </select>
                <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(e) => changeItem(index, 'quantity', e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Qty" />
                <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => changeItem(index, 'unitPrice', e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Price" />
                <button type="button" onClick={() => removeItem(index)} disabled={form.items.length === 1} className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-red-600 disabled:opacity-40">
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between font-bold text-slate-950"><span>Total</span><span>{total.toFixed(2)}</span></div>
      </div>

      <div className="flex gap-3">
        <button disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          <Icon name={editingId ? 'check' : 'plus'} className="h-4 w-4" /> {saving ? 'Saving...' : editingId ? 'Save order' : 'Create order'}
        </button>
        {editingId && <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>}
      </div>
    </form>
  )
}
