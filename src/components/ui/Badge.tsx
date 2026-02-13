'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-semibold uppercase tracking-wider rounded-full',
          // Variants
          variant === 'default' && 'bg-gray-100 text-gray-700',
          variant === 'primary' && 'bg-primary/10 text-primary',
          variant === 'accent' && 'bg-accent/10 text-accent',
          variant === 'success' && 'bg-success/10 text-success',
          variant === 'warning' && 'bg-warning/10 text-warning',
          variant === 'danger' && 'bg-danger/10 text-danger',
          // Sizes
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'md' && 'px-3 py-1 text-sm',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
