'use client'

import { cn } from '@/lib/utils/cn'
import { ComponentType, ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-line bg-surface/40 p-8 sm:p-10 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-2xl bg-surface-2 border border-line flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-faint" />
        </div>
      )}
      <p className="text-sm sm:text-base font-semibold text-strong">{title}</p>
      {description && (
        <p className="text-sm text-soft mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
