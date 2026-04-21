'use client'

type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({ value, onChange, label, options, placeholder = 'Selecione' }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-amber-500 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
