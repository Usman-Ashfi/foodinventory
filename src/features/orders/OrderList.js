'use client'

import ConfirmAction from '@/components/ui/ConfirmAction'
import Icon from '@/components/ui/Icon'
import StatusBadge from '@/components/ui/StatusBadge'
import { nextOrderStatuses, orderStatuses } from './orderConfig'

export default function OrderList({ orders, onEdit, onDelete, deletingId, onStatus }) {
  if (orders.length === 0) return null

  return (
    <div className="divide-y divide-slate-100">
      {orders.map((order) => (
        <div key={order.id} className="py-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-950">{order.orderNumber}</h3>
                <StatusBadge status={order.orderStatus} />
                <StatusBadge status={order.paymentStatus} />
              </div>
              <p className="mt-2 text-sm text-slate-500">{order.customerName || 'Walk-in customer'} · {order.items.length} items · Rs {order.total.toFixed(2)}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                {order.items.map((item) => <span key={item.id} className="rounded-full bg-slate-50 px-2 py-1">{item.itemName} x {item.quantity}</span>)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {nextOrderStatuses(order.orderStatus).map((status) => {
                const label = orderStatuses.find((item) => item.value === status)?.label
                return <button key={status} type="button" onClick={() => onStatus(order, status)} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">{label}</button>
              })}
              <button type="button" onClick={() => onEdit(order)} disabled={order.inventoryDeductedAt} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40" title={order.inventoryDeductedAt ? 'Confirmed orders cannot edit items' : 'Edit order'}>
                <Icon name="edit" className="h-4 w-4" />
              </button>
              <ConfirmAction label={order.orderNumber} disabled={deletingId === order.id} onConfirm={() => onDelete(order)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
