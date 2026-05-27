import Link from 'next/link'
import Icon from '@shared/components/ui/Icon'

export default function PageHero({ eyebrow, title, description, icon = 'check', asideTitle, asideText }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_62%,#ecfdf5_100%)]" />
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
        <Icon name="arrowLeft" className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Icon name={icon} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{asideTitle}</p>
              <p className="mt-1 text-xs text-slate-500">{asideText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
