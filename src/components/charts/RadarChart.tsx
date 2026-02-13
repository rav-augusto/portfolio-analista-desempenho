'use client'

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  data: number[]
  labels?: string[]
  size?: number
}

const defaultLabels = [
  'Forca',
  'Velocidade',
  'Tecnica',
  'Dinamica',
  'Inteligencia',
  '1x1',
  'Atitude',
  'Potencial',
]

export function RadarChart({ data, labels = defaultLabels, size = 200 }: RadarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Avaliacao',
        data,
        backgroundColor: 'rgba(26, 95, 42, 0.3)',
        borderColor: 'rgba(26, 95, 42, 1)',
        borderWidth: 2,
        pointBackgroundColor: '#f7931e',
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
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          display: false,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 10,
          },
          color: '#495057',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: { raw: unknown }) {
            return `${context.raw}/5.0`
          },
        },
      },
    },
  }

  return (
    <div style={{ width: size, height: size, margin: '0 auto' }}>
      <Radar data={chartData} options={options} />
    </div>
  )
}
