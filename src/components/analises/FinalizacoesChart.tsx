'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface FinalizacoesChartProps {
  total: number
  noGol: number
  fora: number
  bloqueadas: number
  className?: string
}

export function FinalizacoesChart({
  total,
  noGol,
  fora,
  bloqueadas,
  className = '',
}: FinalizacoesChartProps) {
  const hasData = total > 0

  const data = {
    labels: ['No Gol', 'Fora', 'Bloqueadas'],
    datasets: [
      {
        data: hasData ? [noGol, fora, bloqueadas] : [1, 1, 1],
        backgroundColor: hasData
          ? ['#22c55e', '#ef4444', '#3b82f6']
          : ['#334155', '#334155', '#334155'],
        borderColor: hasData
          ? ['#16a34a', '#dc2626', '#2563eb']
          : ['#475569', '#475569', '#475569'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: hasData,
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>) {
            const value = (context.raw as number) || 0
            const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0
            return `${context.label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  const precisao = total > 0 ? ((noGol / total) * 100).toFixed(0) : 0

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative" style={{ height: '200px' }}>
        <Doughnut data={data} options={options} />
        {/* Centro do donut com total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-100">{total}</span>
          <span className="text-xs text-slate-400">Total</span>
        </div>
      </div>

      {/* Legenda customizada */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-sm text-slate-300">No Gol</span>
          </div>
          <span className="text-sm font-semibold text-slate-100">{noGol}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-sm text-slate-300">Fora</span>
          </div>
          <span className="text-sm font-semibold text-slate-100">{fora}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
            <span className="text-sm text-slate-300">Bloqueadas</span>
          </div>
          <span className="text-sm font-semibold text-slate-100">{bloqueadas}</span>
        </div>
      </div>

      {/* Precisão */}
      <div
        className="mt-4 p-3 rounded-xl text-center"
        style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
      >
        <span className="text-xs text-slate-400 uppercase tracking-wider">Precisao</span>
        <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>
          {precisao}%
        </div>
      </div>
    </div>
  )
}

export default FinalizacoesChart
