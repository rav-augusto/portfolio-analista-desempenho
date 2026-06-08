'use client'

import { cn } from '@/lib/utils/cn'
import { TextareaHTMLAttributes, forwardRef, useId } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-faint mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg bg-app border border-line text-strong text-sm p-3 resize-y',
            'placeholder:text-faint',
            'transition-colors duration-150',
            'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-negative focus:border-negative focus:ring-negative/20',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-negative">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-faint">{hint}</p>
        ) : null}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
