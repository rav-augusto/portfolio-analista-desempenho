'use client'

interface ContraAtaqueFunnelProps {
  criados: number
  finalizados: number
  gols: number
  className?: string
}

export function ContraAtaqueFunnel({
  criados,
  finalizados,
  gols,
  className = '',
}: ContraAtaqueFunnelProps) {
  const conversaoFinalizados = criados > 0 ? ((finalizados / criados) * 100).toFixed(0) : 0
  const conversaoGols = finalizados > 0 ? ((gols / finalizados) * 100).toFixed(0) : 0

  const maxWidth = 100
  const finalizadosWidth = criados > 0 ? (finalizados / criados) * maxWidth : 0
  const golsWidth = criados > 0 ? (gols / criados) * maxWidth : 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Criados */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Contra-ataques criados</span>
          <span className="text-lg font-bold text-slate-100">{criados}</span>
        </div>
        <div className="relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-900">100%</span>
          </div>
        </div>
      </div>

      {/* Seta */}
      <div className="flex items-center justify-center">
        <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Finalizados */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Finalizados</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-100">{finalizados}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}
            >
              {conversaoFinalizados}%
            </span>
          </div>
        </div>
        <div className="relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
            style={{
              width: `${finalizadosWidth}%`,
              background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold" style={{ color: finalizadosWidth > 30 ? '#0f172a' : '#94a3b8' }}>
              {conversaoFinalizados}%
            </span>
          </div>
        </div>
      </div>

      {/* Seta */}
      <div className="flex items-center justify-center">
        <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Gols */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Gols marcados</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-100">{gols}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
            >
              {conversaoGols}%
            </span>
          </div>
        </div>
        <div className="relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
            style={{
              width: `${golsWidth}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold" style={{ color: golsWidth > 20 ? '#0f172a' : '#94a3b8' }}>
              {gols > 0 ? `${conversaoGols}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div
        className="mt-4 p-4 rounded-xl grid grid-cols-2 gap-4"
        style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
      >
        <div className="text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Taxa Finalizacao</span>
          <span className="text-xl font-bold text-amber-500">{conversaoFinalizados}%</span>
        </div>
        <div className="text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Taxa Conversao</span>
          <span className="text-xl font-bold text-emerald-500">{conversaoGols}%</span>
        </div>
      </div>
    </div>
  )
}

export default ContraAtaqueFunnel
