export default function LoadingState({ label = 'Loading...', contained = false }) {
  return (
    <div className={`flex items-center justify-center px-4 ${contained ? 'min-h-[calc(100vh-5rem)] bg-[#f8faf7]' : 'min-h-screen bg-slate-50'}`}>
      <div className="rounded-4xl bg-white px-7 py-6 text-center shadow-2xl shadow-black/10">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#d9ffb9] border-t-[#153a20]" />
        <p className="mt-4 text-sm font-black text-zinc-500">{label}</p>
      </div>
    </div>
  )
}
