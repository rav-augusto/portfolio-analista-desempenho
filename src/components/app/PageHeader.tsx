'use client'

import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 mb-5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-strong tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-soft mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}
