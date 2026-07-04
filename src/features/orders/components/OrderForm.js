'use client'

import Icon from '@shared/components/ui/Icon'
import { orderInitialForm, paymentStatuses } from '@features/orders/schema/orderConfig'
import { fieldInput as inputClass } from '@shared/theme'

function Field({ label, children }) {
  return <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</span>{children}</label>
}

export default function OrderForm({ customers, inventory, form, setForm, editingId, saving, onSubmit, onCancel }) {
  const subtotal = form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0)
  const total = Math.max(0, subtotal + Number(form.deliveryFee || 0) - Number(form.discount || 0))

  function change(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function changeItem(index, name, value) {
    setForm((prev) => ({ ...prev, items: prev.items.map((item, current) => current === index ? { ...item, [name]: value } : item) }))
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...orderInitialForm.items[0] }] }))
  }

  function removeItem(index) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, current) => current !== index) }))
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer">
          <select value={form.customerId} onChange={(event) => change('customerId', event.target.value)} required className={inputClass}>
            <option value="">Select customer</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </select>
        </Field>
        <Field label="Payment">
          <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#f8faf7] p-1">
            {paymentStatuses.map((item) => <button key={item.value} type="button" onClick={() => change('paymentStatus', item.value)} className={`rounded-full px-4 py-3 text-sm font-black transition ${form.paymentStatus === item.value ? 'bg-[#153a20] text-white' : 'text-zinc-500 hover:bg-white'}`}>{item.label}</button>)}
          </div>
        </Field>
        <Field label="Delivery fee"><input className={inputClass} min="0" step="0.01" type="number" value={form.deliveryFee} onChange={(event) => change('deliveryFee', event.target.value)} /></Field>
        <Field label="Discount"><input className={inputClass} min="0" step="0.01" type="number" value={form.discount} onChange={(event) => change('discount', event.target.value)} /></Field>
      </div>
      <Field label="Kitchen notes">
        <textarea rows={2} value={form.notes} onChange={(event) => change('notes', event.target.value)} placeholder="Customer requests or prep notes" className={`${inputClass} resize-none`} />
      </Field>
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Order items</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-full bg-[#d9ffb9] px-3 py-2 text-xs font-black text-[#153a20]"><Icon name="plus" className="size-3.5" /> Add item</button>
        </div>
        <div className="space-y-3">
          {form.items.map((item, index) => (
            <div key={index} className="rounded-[1.25rem] bg-[#f8faf7] p-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_82px_102px_36px]">
                <select value={item.inventoryItemId} onChange={(event) => changeItem(index, 'inventoryItemId', event.target.value)} className={inputClass}>
                  <option value="">Inventory item</option>
                  {inventory.map((stock) => <option key={stock.id} value={stock.id}>{stock.name} ({stock.quantity} {stock.unit})</option>)}
                </select>
                <input min="0.01" step="0.01" value={item.quantity} onChange={(event) => changeItem(index, 'quantity', event.target.value)} className={inputClass} placeholder="Qty" type="number" />
                <input min="0" step="0.01" value={item.unitPrice} onChange={(event) => changeItem(index, 'unitPrice', event.target.value)} className={inputClass} placeholder="Price" type="number" />
                <button type="button" onClick={() => removeItem(index)} disabled={form.items.length === 1} className="grid size-11 place-items-center rounded-full bg-white text-zinc-400 hover:text-red-600 disabled:opacity-40"><Icon name="trash" className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[1.5rem] bg-[#f8faf7] p-4">
        <div className="flex justify-between text-sm font-bold text-zinc-500"><span>Subtotal</span><span>Rs {subtotal.toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between text-2xl font-black text-black"><span>Total</span><span>Rs {total.toFixed(2)}</span></div>
      </div>
      <div className="flex gap-3">
        <button disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#153a20] px-5 py-3 text-sm font-black text-white disabled:opacity-60"><Icon name={editingId ? 'check' : 'plus'} className="size-4" /> {saving ? 'Saving...' : editingId ? 'Save order' : 'Create order'}</button>
        {editingId && <button type="button" onClick={onCancel} className="rounded-full bg-[#f8faf7] px-5 py-3 text-sm font-black text-zinc-600 hover:bg-[#d9ffb9]">Cancel</button>}
      </div>
    </form>
  )
}
