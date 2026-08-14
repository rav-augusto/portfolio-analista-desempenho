'use client'

import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface InfoTipProps {
  text: string
  className?: string
  side?: 'top' | 'bottom'
}

// Ícone de ajuda com explicação ao passar o mouse (desktop) ou tocar (mobile).
export function InfoTip({ text, className, side = 'top' }: InfoTipProps) {
  const [open, setOpen] = useState(false)
  return (
    <span className={cn('relative inline-flex align-middle', className)}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen((o) => !o) }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        className="text-faint hover:text-brand transition-colors focus:outline-none focus-visible:text-brand"
        aria-label="Explicação"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 left-1/2 -translate-x-1/2 w-56 max-w-[70vw] rounded-lg bg-surface-2 border border-line p-2.5',
            'text-[11px] leading-relaxed text-soft shadow-xl shadow-black/50 text-left font-normal normal-case tracking-normal pointer-events-none',
            side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          )}
        >
          {text}
        </span>
      )}
    </span>
  )
}
