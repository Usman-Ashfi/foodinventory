const tones = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  assigned: 'bg-sky-50 text-sky-700 ring-sky-100',
  canceled: 'bg-slate-100 text-slate-600 ring-slate-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  confirmed: 'bg-sky-50 text-sky-700 ring-sky-100',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  expired: 'bg-red-50 text-red-700 ring-red-100',
  expiring: 'bg-amber-50 text-amber-700 ring-amber-100',
  failed: 'bg-red-50 text-red-700 ring-red-100',
  fresh: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
  in_progress: 'bg-sky-50 text-sky-700 ring-sky-100',
  low: 'bg-orange-50 text-orange-700 ring-orange-100',
  needs_review: 'bg-rose-50 text-rose-700 ring-rose-100',
  out_for_delivery: 'bg-violet-50 text-violet-700 ring-violet-100',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  pending: 'bg-amber-50 text-amber-700 ring-amber-100',
  picked_up: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  preparing: 'bg-violet-50 text-violet-700 ring-violet-100',
  ready: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  unpaid: 'bg-rose-50 text-rose-700 ring-rose-100',
}

function label(value) {
  return String(value || '').replaceAll('_', ' ')
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${tones[status] || tones.pending}`}>
      {label(status)}
    </span>
  )
}
