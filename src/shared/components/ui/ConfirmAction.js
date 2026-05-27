import Icon from '@shared/components/ui/Icon'

export default function ConfirmAction({ label, title, onConfirm, disabled }) {
  function handleClick() {
    if (window.confirm(`Delete ${label}? This action cannot be undone.`)) onConfirm()
  }

  return (
    <button type="button" onClick={handleClick} disabled={disabled} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label={title || `Delete ${label}`} title={title || `Delete ${label}`}>
      {disabled ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" /> : <Icon name="trash" className="h-4 w-4" />}
    </button>
  )
}
