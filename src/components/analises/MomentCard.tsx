'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type StatItem = {
  label: string
  value: string | number | null | undefined
}

interface MomentCardProps {
  title: string
  icon: React.ReactNode
  color: 'amber' | 'green' | 'red' | 'blue' | 'purple'
  stats?: StatItem[]
  observations?: string | null
  className?: string
}

const colorStyles = {
  amber: {
    header: 'rgba(245, 158, 11, 0.15)',
    border: '#f59e0b',
    text: '#f59e0b',
  },
  green: {
    header: 'rgba(34, 197, 94, 0.15)',
    border: '#22c55e',
    text: '#22c55e',
  },
  red: {
    header: 'rgba(239, 68, 68, 0.15)',
    border: '#ef4444',
    text: '#ef4444',
  },
  blue: {
    header: 'rgba(59, 130, 246, 0.15)',
    border: '#3b82f6',
    text: '#3b82f6',
  },
  purple: {
    header: 'rgba(168, 85, 247, 0.15)',
    border: '#a855f7',
    text: '#a855f7',
  },
}

export function MomentCard({
  title,
  icon,
  color,
  stats = [],
  observations,
  className = '',
}: MomentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const styles = colorStyles[color]

  const filteredStats = stats.filter(
    (stat) => stat.value !== null && stat.value !== undefined && stat.value !== ''
  )

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: '#1e293b', border: `1px solid #475569` }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: styles.header, borderBottom: `2px solid ${styles.border}` }}
      >
        <span style={{ color: styles.text }}>{icon}</span>
        <h3 className="text-sm font-semibold" style={{ color: styles.text }}>
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredStats.length > 0 ? (
          <div className="space-y-3">
            {filteredStats.map((stat, index) => (
              <div key={index} className="flex items-start justify-between gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-sm text-slate-200 text-right font-medium max-w-[60%]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Sem dados cadastrados</p>
        )}

        {/* Observations (collapsible) */}
        {observations && (
          <div className="mt-4 pt-3 border-t border-slate-700">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors w-full"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="uppercase tracking-wider">Observacoes</span>
            </button>
            {isExpanded && (
              <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {observations}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MomentCard
