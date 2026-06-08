'use client'

import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-app hover:bg-brand-hover shadow-sm shadow-brand/20',
  secondary:
    'bg-surface-2 text-strong border border-line hover:bg-surface-2/80 hover:border-line-strong',
  ghost:
    'text-soft hover:text-strong hover:bg-surface-2',
  danger:
    'bg-negative text-white hover:bg-negative/90',
  outline:
    'border border-line text-strong hover:bg-surface-2 hover:border-line-strong',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
  icon: 'h-9 w-9',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', fullWidth, type, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
