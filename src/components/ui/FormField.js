export default function FormField({ field, value, onChange }) {
  const base = 'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-semibold text-slate-700">
        {field.label}
      </label>
      {field.type === 'select' ? (
        <select id={field.name} value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} className={`mt-1.5 ${base}`}>
          {(field.options || []).map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea id={field.name} rows={field.rows || 3} value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} className={`mt-1.5 resize-none ${base}`} placeholder={field.placeholder} />
      ) : (
        <input id={field.name} type={field.type || 'text'} required={field.required} min={field.min} step={field.step} value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} className={`mt-1.5 ${base}`} placeholder={field.placeholder} />
      )}
    </div>
  )
}
