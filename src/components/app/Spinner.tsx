'use client'

import { cn } from '@/lib/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <span
        className={cn(
          'rounded-full border-brand border-t-transparent animate-spin',
          sizeClasses[size]
        )}
        role="status"
        aria-label={label ?? 'Carregando'}
      />
      {label && <span className="text-xs text-soft">{label}</span>}
    </div>
  )
}
