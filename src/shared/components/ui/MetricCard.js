import Icon from '@shared/components/ui/Icon'

const tones = {
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
}

export default function MetricCard({ label, value, detail, icon = 'chart', tone = 'emerald', className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
        <Icon name={icon} />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        {detail && <p className="pb-1 text-xs font-medium text-slate-500">{detail}</p>}
      </div>
    </div>
  )
}
