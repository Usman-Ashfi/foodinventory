export default function SectionCard({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{eyebrow}</p>}
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
