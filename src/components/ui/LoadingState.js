export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  )
}
