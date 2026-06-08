'use client'

import { cn } from '@/lib/utils/cn'
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-faint mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-10 rounded-lg bg-app border border-line text-strong text-sm',
              'placeholder:text-faint',
              'transition-colors duration-150',
              'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10 pr-3' : 'px-3',
              rightIcon && 'pr-10',
              error && 'border-negative focus:border-negative focus:ring-negative/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-faint">
              {rightIcon}
            </span>
          )}
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
Input.displayName = 'Input'
