'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

type Variant = 'default' | 'elevated' | 'flat'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-surface border border-line',
  elevated: 'bg-surface-2 border border-line shadow-lg shadow-black/30',
  flat: 'bg-surface-2/40 border border-line/60',
}

const paddingClasses = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      interactive = false,
      padding = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-colors duration-150',
          variantClasses[variant],
          paddingClasses[padding],
          interactive &&
            'cursor-pointer hover:border-line-strong hover:bg-surface-2',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between gap-3 pb-3 mb-3 border-b border-line/70',
      className
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold text-strong', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'
