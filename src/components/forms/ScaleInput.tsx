'use client'

import { Star } from 'lucide-react'

type ScaleInputProps = {
  value: number
  onChange: (value: number) => void
  label: string
  max?: number
}

export function ScaleInput({ value, onChange, label, max = 5 }: ScaleInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-amber-500 mb-2">{label}</label>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-colors hover:scale-110"
          >
            <Star
              className="w-6 h-6 transition-colors"
              style={{
                fill: star <= value ? '#f59e0b' : 'transparent',
                color: star <= value ? '#f59e0b' : '#475569',
              }}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-400">{value}/{max}</span>
      </div>
    </div>
  )
}
