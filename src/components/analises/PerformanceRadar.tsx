'use client'

import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface PerformanceRadarProps {
  qualidadeCriacao: number
  pressaoIntensidade: number
  compactacaoBloco: number
  transOfensivaVelocidade: number
  transOfensivaEfetividade: number
  transDefensivaVelocidade: number
  bpDefSolidez: number
  className?: string
}

export function PerformanceRadar({
  qualidadeCriacao,
  pressaoIntensidade,
  compactacaoBloco,
  transOfensivaVelocidade,
  transOfensivaEfetividade,
  transDefensivaVelocidade,
  bpDefSolidez,
  className = '',
}: PerformanceRadarProps) {
  const data = {
    labels: [
      'Criacao',
      'Pressao',
      'Compactacao',
      'Vel. Trans. Of.',
      'Efet. Trans.',
      'Vel. Trans. Def.',
      'Solidez BP',
    ],
    datasets: [
      {
        label: 'Desempenho',
        data: [
          qualidadeCriacao,
          pressaoIntensidade,
          compactacaoBloco,
          transOfensivaVelocidade,
          transOfensivaEfetividade,
          transDefensivaVelocidade,
          bpDefSolidez,
        ],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 0,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.5)',
        },
        angleLines: {
          color: 'rgba(71, 85, 105, 0.5)',
        },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 11 },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
  }

  return (
    <div className={className}>
      <Radar data={data} options={options} />
    </div>
  )
}

export default PerformanceRadar
