'use client'

type NumberFieldProps = {
  value: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
}

export function NumberField({ value, onChange, label, min = 0, max = 100 }: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-amber-500 mb-2">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
      />
    </div>
  )
}
