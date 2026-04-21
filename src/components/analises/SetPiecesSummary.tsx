'use client'

import { useState } from 'react'

interface SetPiecesSummaryProps {
  // Ofensivas
  escanteioCobrador?: string | null
  escanteioTipo?: string | null
  escanteioMovimentacoes?: string | null
  faltasCaracteristicas?: string | null
  // Defensivas
  escanteioDefMarcacao?: string | null
  escanteioDefPosicaoGk?: string | null
  escanteioDefPrimeiroPau?: string | null
  escanteioDefSegundoPau?: string | null
  bpVulnerabilidades?: string | null
  className?: string
}

export function SetPiecesSummary({
  escanteioCobrador,
  escanteioTipo,
  escanteioMovimentacoes,
  faltasCaracteristicas,
  escanteioDefMarcacao,
  escanteioDefPosicaoGk,
  escanteioDefPrimeiroPau,
  escanteioDefSegundoPau,
  bpVulnerabilidades,
  className = '',
}: SetPiecesSummaryProps) {
  const [activeTab, setActiveTab] = useState<'ofensivas' | 'defensivas'>('ofensivas')

  const offensiveItems = [
    { label: 'Cobrador', value: escanteioCobrador },
    { label: 'Tipo de Cobranca', value: escanteioTipo },
    { label: 'Movimentacoes', value: escanteioMovimentacoes },
    { label: 'Faltas', value: faltasCaracteristicas },
  ].filter((item) => item.value)

  const defensiveItems = [
    { label: 'Marcacao', value: escanteioDefMarcacao },
    { label: 'Posicao GK', value: escanteioDefPosicaoGk },
    { label: '1o Pau', value: escanteioDefPrimeiroPau },
    { label: '2o Pau', value: escanteioDefSegundoPau },
    { label: 'Vulnerabilidades', value: bpVulnerabilidades },
  ].filter((item) => item.value)

  const items = activeTab === 'ofensivas' ? offensiveItems : defensiveItems
  const hasOffensive = offensiveItems.length > 0
  const hasDefensive = defensiveItems.length > 0

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
    >
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('ofensivas')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'ofensivas'
              ? 'text-amber-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Ofensivas
          {hasOffensive && (
            <span
              className="ml-2 w-5 h-5 text-xs rounded-full inline-flex items-center justify-center"
              style={{
                backgroundColor:
                  activeTab === 'ofensivas'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(148, 163, 184, 0.2)',
                color: activeTab === 'ofensivas' ? '#f59e0b' : '#94a3b8',
              }}
            >
              {offensiveItems.length}
            </span>
          )}
          {activeTab === 'ofensivas' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: '#f59e0b' }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('defensivas')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'defensivas'
              ? 'text-red-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Defensivas
          {hasDefensive && (
            <span
              className="ml-2 w-5 h-5 text-xs rounded-full inline-flex items-center justify-center"
              style={{
                backgroundColor:
                  activeTab === 'defensivas'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(148, 163, 184, 0.2)',
                color: activeTab === 'defensivas' ? '#ef4444' : '#94a3b8',
              }}
            >
              {defensiveItems.length}
            </span>
          )}
          {activeTab === 'defensivas' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: '#ef4444' }}
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index}>
                <span
                  className="text-xs uppercase tracking-wider mb-1 block"
                  style={{
                    color: activeTab === 'ofensivas' ? '#f59e0b' : '#ef4444',
                  }}
                >
                  {item.label}
                </span>
                <p className="text-sm text-slate-200 whitespace-pre-wrap">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic text-center py-4">
            Sem dados de bolas paradas {activeTab}
          </p>
        )}
      </div>
    </div>
  )
}

export default SetPiecesSummary
