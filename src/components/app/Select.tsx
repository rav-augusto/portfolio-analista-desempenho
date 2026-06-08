'use client'

import { cn } from '@/lib/utils/cn'
import { ChevronDown } from 'lucide-react'
import { SelectHTMLAttributes, forwardRef, useId } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, id, children, disabled, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-faint mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full h-10 rounded-lg bg-app border border-line text-strong text-sm',
              'appearance-none pl-3 pr-9',
              'transition-colors duration-150',
              'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-negative focus:border-negative focus:ring-negative/20',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-negative">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-faint">{hint}</p>
        ) : null}
      </div>
    )
  }
)
Select.displayName = 'Select'
