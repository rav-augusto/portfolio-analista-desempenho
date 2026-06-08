'use client'

import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { ComponentType, ReactNode } from 'react'

type Tone = 'brand' | 'portal' | 'info' | 'positive' | 'caution' | 'negative' | 'violet' | 'indigo'

interface StatCardProps {
  label: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  tone?: Tone
  href?: string
  meta?: ReactNode
  loading?: boolean
  className?: string
}

const toneClasses: Record<Tone, { icon: string; iconBg: string }> = {
  brand:    { icon: 'text-brand',    iconBg: 'bg-brand/15    ring-1 ring-brand/30' },
  portal:   { icon: 'text-portal',   iconBg: 'bg-portal/15   ring-1 ring-portal/30' },
  info:     { icon: 'text-info',     iconBg: 'bg-info/15     ring-1 ring-info/30' },
  positive: { icon: 'text-positive', iconBg: 'bg-positive/15 ring-1 ring-positive/30' },
  caution:  { icon: 'text-caution',  iconBg: 'bg-caution/15  ring-1 ring-caution/30' },
  negative: { icon: 'text-negative', iconBg: 'bg-negative/15 ring-1 ring-negative/30' },
  violet:   { icon: 'text-purple-400', iconBg: 'bg-purple-500/15 ring-1 ring-purple-500/30' },
  indigo:   { icon: 'text-indigo-400', iconBg: 'bg-indigo-500/15 ring-1 ring-indigo-500/30' },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  href,
  meta,
  loading,
  className,
}: StatCardProps) {
  const tones = toneClasses[tone]
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0',
            tones.iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', tones.icon)} />
        </div>
        {meta && <div className="text-right text-[11px] text-soft leading-tight">{meta}</div>}
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-strong tabular-nums mt-0.5">
          {loading ? '—' : value}
        </p>
      </div>
    </>
  )

  const baseCls = cn(
    'group block rounded-2xl bg-surface border border-line p-4 sm:p-5 transition-all duration-150',
    href && 'hover:bg-surface-2 hover:border-line-strong',
    className
  )

  if (href) {
    return (
      <Link href={href} className={baseCls}>
        {content}
      </Link>
    )
  }
  return <div className={baseCls}>{content}</div>
}
