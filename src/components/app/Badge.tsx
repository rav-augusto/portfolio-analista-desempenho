'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

type Variant =
  | 'neutral'
  | 'brand'
  | 'portal'
  | 'positive'
  | 'negative'
  | 'caution'
  | 'info'

type Size = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  neutral: 'bg-surface-2 text-soft border border-line',
  brand: 'bg-brand-soft text-brand border border-brand/30',
  portal: 'bg-portal-soft text-portal border border-portal/30',
  positive: 'bg-positive/15 text-positive border border-positive/30',
  negative: 'bg-negative/15 text-negative border border-negative/30',
  caution: 'bg-caution/15 text-caution border border-caution/30',
  info: 'bg-info/15 text-info border border-info/30',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-5 px-2 text-[10px]',
  md: 'h-6 px-2.5 text-xs',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
