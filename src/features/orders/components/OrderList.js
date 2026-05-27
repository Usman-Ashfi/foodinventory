'use client'

import { motion } from 'framer-motion'
import ConfirmAction from '@shared/components/ui/ConfirmAction'
import Icon from '@shared/components/ui/Icon'
import StatusBadge from '@shared/components/ui/StatusBadge'
import { nextOrderStatuses, orderStatuses } from '@features/orders/schema/orderConfig'

export default function OrderList({ orders, onEdit, onDelete, deletingId, onStatus }) {
  return (
    <motion.div layout className="grid gap-4">
      {orders.map((order) => (
        <motion.article key={order.id} layout whileHover={{ y: -4 }} className="rounded-[1.5rem] bg-[#f8faf7] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-black text-black">{order.orderNumber}</h3>
                <StatusBadge status={order.orderStatus} />
                <StatusBadge status={order.paymentStatus} />
              </div>
              <p className="mt-2 text-sm font-bold text-zinc-500">{order.customerName || 'Walk-in customer'} / {order.items.length} items / Rs {order.total.toFixed(2)}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-zinc-500">
                {order.items.map((item) => <span key={item.id} className="rounded-full bg-white px-3 py-1">{item.itemName} x {item.quantity}</span>)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {nextOrderStatuses(order.orderStatus).map((status) => {
                const label = orderStatuses.find((item) => item.value === status)?.label
                return <button key={status} type="button" onClick={() => onStatus(order, status)} className="rounded-full bg-[#d9ffb9] px-3 py-2 text-xs font-black text-[#153a20] hover:bg-[#ffe078]">{label}</button>
              })}
              <button type="button" onClick={() => onEdit(order)} disabled={order.inventoryDeductedAt} className="grid size-9 place-items-center rounded-full bg-white text-zinc-500 shadow-sm hover:text-[#153a20] disabled:opacity-40" title={order.inventoryDeductedAt ? 'Confirmed orders cannot edit items' : 'Edit order'}>
                <Icon name="edit" className="size-4" />
              </button>
              <ConfirmAction label={order.orderNumber} disabled={deletingId === order.id} onConfirm={() => onDelete(order)} />
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
