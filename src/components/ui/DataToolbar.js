import Icon from '@/components/ui/Icon'

export default function DataToolbar({ search, onSearch, filters = [] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_repeat(var(--filters),minmax(140px,180px))]" style={{ '--filters': filters.length || 1 }}>
      <div className="relative">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Search records" />
      </div>
      {filters.map((filter) => (
        <select key={filter.name} value={filter.value} onChange={(e) => filter.onChange(e.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ))}
    </div>
  )
}
