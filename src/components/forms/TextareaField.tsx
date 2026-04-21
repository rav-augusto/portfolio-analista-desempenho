'use client'

type TextareaFieldProps = {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  rows?: number
  labelColor?: string
}

export function TextareaField({
  value,
  onChange,
  label,
  placeholder = '',
  rows = 3,
  labelColor = 'text-amber-500'
}: TextareaFieldProps) {
  return (
    <div>
      <label className={`block text-sm font-medium ${labelColor} mb-2`}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
      />
    </div>
  )
}
