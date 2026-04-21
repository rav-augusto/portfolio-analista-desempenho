'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Star, Calendar, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Radar, Line } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
)

type Avaliacao = {
  id: string
  data_avaliacao: string
  tipo: string
  minutos_jogados: number | null
  gols: number | null
  assistencias: number | null
  forca: number
  velocidade: number
  tecnica: number
  dinamica: number
  inteligencia: number
  um_contra_um: number
  atitude: number
  potencial: number
  penetracao: number | null
  cobertura_ofensiva: number | null
  espaco_com_bola: number | null
  espaco_sem_bola: number | null
  mobilidade: number | null
  unidade_ofensiva: number | null
  contencao: number | null
  cobertura_defensiva: number | null
  equilibrio_recuperacao: number | null
  equilibrio_defensivo: number | null
  concentracao_def: number | null
  unidade_defensiva: number | null
  pontos_fortes: string | null
  pontos_desenvolver: string | null
  jogos: { adversario: string; data_jogo: string } | null
}

const dimensoesCBF = [
  { key: 'forca', label: 'Forca', color: '#ef4444' },
  { key: 'velocidade', label: 'Velocidade', color: '#f59e0b' },
  { key: 'tecnica', label: 'Tecnica', color: '#22c55e' },
  { key: 'dinamica', label: 'Dinamica', color: '#3b82f6' },
  { key: 'inteligencia', label: 'Inteligencia', color: '#8b5cf6' },
  { key: 'um_contra_um', label: '1v1', color: '#ec4899' },
  { key: 'atitude', label: 'Atitude', color: '#06b6d4' },
  { key: 'potencial', label: 'Potencial', color: '#f97316' },
]

export default function EvolucaoPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDimensao, setSelectedDimensao] = useState<string>('all')

  const supabase = createClient()
  const { user: usuario, isLoading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && usuario?.atleta_id) {
      loadData()
    }
  }, [userLoading, usuario])

  const loadData = async () => {
    if (!usuario?.atleta_id) return

    const { data } = await supabase
      .from('avaliacoes_atleta')
      .select('*, jogos(adversario, data_jogo)')
      .eq('atleta_id', usuario.atleta_id)
      .order('data_avaliacao', { ascending: true })

    if (data) {
      setAvaliacoes(data)
    }
    setLoading(false)
  }

  const calcularMediaGeral = (av: Avaliacao) => {
    const valores = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
    const soma = valores.reduce((a, b) => a + (b || 0), 0)
    return soma / valores.length
  }

  const calcularVariacao = (atual: number, anterior: number) => {
    return atual - anterior
  }

  const getVariacaoIcon = (variacao: number) => {
    if (variacao > 0) return <ArrowUp className="w-4 h-4 text-green-400" />
    if (variacao < 0) return <ArrowDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const getVariacaoClass = (variacao: number) => {
    if (variacao > 0) return 'text-green-400'
    if (variacao < 0) return 'text-red-400'
    return 'text-slate-400'
  }

  // Evolution chart data
  const evolutionData = {
    labels: avaliacoes.map(av => new Date(av.data_avaliacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
    datasets: selectedDimensao === 'all'
      ? [{
          label: 'Media Geral',
          data: avaliacoes.map(av => calcularMediaGeral(av)),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      : [{
          label: dimensoesCBF.find(d => d.key === selectedDimensao)?.label || '',
          data: avaliacoes.map(av => (av as any)[selectedDimensao] || 0),
          borderColor: dimensoesCBF.find(d => d.key === selectedDimensao)?.color || '#f59e0b',
          backgroundColor: `${dimensoesCBF.find(d => d.key === selectedDimensao)?.color}20` || 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        }]
  }

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' },
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  // Latest vs First comparison radar
  const radarData = avaliacoes.length >= 2 ? {
    labels: dimensoesCBF.map(d => d.label),
    datasets: [
      {
        label: 'Primeira Avaliacao',
        data: dimensoesCBF.map(d => (avaliacoes[0] as any)[d.key] || 0),
        backgroundColor: 'rgba(100, 116, 139, 0.3)',
        borderColor: 'rgba(100, 116, 139, 1)',
        borderWidth: 2,
      },
      {
        label: 'Ultima Avaliacao',
        data: dimensoesCBF.map(d => (avaliacoes[avaliacoes.length - 1] as any)[d.key] || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
      },
    ],
  } : null

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, color: '#94a3b8', backdropColor: 'transparent' },
        grid: { color: '#334155' },
        angleLines: { color: '#334155' },
        pointLabels: { color: '#e2e8f0', font: { size: 11 } },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#e2e8f0' },
      },
    },
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando evolucao...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Minha Evolucao</h1>
        <p className="text-slate-400 mt-1">Acompanhe seu desenvolvimento ao longo do tempo</p>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhuma avaliacao ainda</p>
          <p className="text-sm text-slate-500">Suas avaliacoes aparecerao aqui quando forem registradas</p>
        </div>
      ) : (
        <>
          {/* Evolution Chart */}
          <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-slate-100">Grafico de Evolucao</h3>
              <select
                value={selectedDimensao}
                onChange={(e) => setSelectedDimensao(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
              >
                <option value="all">Media Geral</option>
                {dimensoesCBF.map(d => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="h-[300px]">
              <Line data={evolutionData} options={evolutionOptions} />
            </div>
          </div>

          {/* Comparison Radar (if multiple evaluations) */}
          {avaliacoes.length >= 2 && (
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <h3 className="text-lg font-bold text-slate-100 mb-4">Comparativo: Primeira vs Ultima</h3>
              <div className="h-[350px]">
                {radarData && <Radar data={radarData} options={radarOptions} />}
              </div>
            </div>
          )}

          {/* Dimension Cards */}
          {avaliacoes.length >= 2 && (
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <h3 className="text-lg font-bold text-slate-100 mb-4">Evolucao por Dimensao</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dimensoesCBF.map(dim => {
                  const primeira = (avaliacoes[0] as any)[dim.key] || 0
                  const ultima = (avaliacoes[avaliacoes.length - 1] as any)[dim.key] || 0
                  const variacao = calcularVariacao(ultima, primeira)

                  return (
                    <div
                      key={dim.key}
                      className="rounded-xl p-4 text-center"
                      style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                    >
                      <p className="text-xs text-slate-400 uppercase mb-1">{dim.label}</p>
                      <p className="text-2xl font-bold text-slate-100">{ultima.toFixed(1)}</p>
                      <div className={`flex items-center justify-center gap-1 mt-1 text-sm ${getVariacaoClass(variacao)}`}>
                        {getVariacaoIcon(variacao)}
                        <span>{variacao > 0 ? '+' : ''}{variacao.toFixed(1)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Evaluations List */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Historico de Avaliacoes</h3>
            <div className="space-y-3">
              {[...avaliacoes].reverse().map((av, index) => {
                const media = calcularMediaGeral(av)
                const anteriorIndex = avaliacoes.length - index - 2
                const anterior = anteriorIndex >= 0 ? avaliacoes[anteriorIndex] : null
                const mediaAnterior = anterior ? calcularMediaGeral(anterior) : null
                const variacao = mediaAnterior ? media - mediaAnterior : 0

                return (
                  <div
                    key={av.id}
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-100">
                            {new Date(av.data_avaliacao).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                            {av.tipo}
                          </span>
                        </div>
                        {av.jogos && (
                          <p className="text-sm text-slate-400">vs {av.jogos.adversario}</p>
                        )}
                        <div className="flex gap-3 mt-1 text-xs text-slate-500">
                          {av.minutos_jogados && <span>{av.minutos_jogados} min</span>}
                          {av.gols != null && av.gols > 0 && <span>{av.gols} gol(s)</span>}
                          {av.assistencias != null && av.assistencias > 0 && <span>{av.assistencias} assist.</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-500">{media.toFixed(1)}</p>
                      {mediaAnterior && (
                        <div className={`flex items-center justify-end gap-1 text-sm ${getVariacaoClass(variacao)}`}>
                          {getVariacaoIcon(variacao)}
                          <span>{variacao > 0 ? '+' : ''}{variacao.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
