'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, TrendingUp, Scale, Ruler, Star, BarChart3, Trophy, Search } from 'lucide-react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Radar, Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

type Atleta = {
  id: string
  nome: string
  foto_url: string | null
  posicao: string | null
  altura: number | null
  peso: number | null
  data_nascimento: string | null
  clubes: { nome: string } | null
}

type Avaliacao = {
  id: string
  atleta_id: string
  data_avaliacao: string
  forca: number | null
  velocidade: number | null
  tecnica: number | null
  dinamica: number | null
  inteligencia: number | null
  um_contra_um: number | null
  atitude: number | null
  potencial: number | null
  pontos_fortes: string | null
  pontos_desenvolver: string | null
  observacoes: string | null
}

const dimensoes = [
  { key: 'forca', label: 'Forca', color: '#ef4444' },
  { key: 'velocidade', label: 'Velocidade', color: '#f97316' },
  { key: 'tecnica', label: 'Tecnica', color: '#eab308' },
  { key: 'dinamica', label: 'Dinamica', color: '#22c55e' },
  { key: 'inteligencia', label: 'Inteligencia', color: '#06b6d4' },
  { key: 'um_contra_um', label: '1 contra 1', color: '#3b82f6' },
  { key: 'atitude', label: 'Atitude', color: '#8b5cf6' },
  { key: 'potencial', label: 'Potencial', color: '#ec4899' }
]

export default function DashboardAtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [atletaSelecionado, setAtletaSelecionado] = useState<string>('')
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  // Carregar atletas
  useEffect(() => {
    const loadAtletas = async () => {
      const { data } = await supabase
        .from('atletas')
        .select('id, nome, foto_url, posicao, altura, peso, data_nascimento, clubes(nome)')
        .order('nome')

      if (data) setAtletas(data)
      setLoading(false)
    }
    loadAtletas()
  }, [supabase])

  // Carregar avaliacoes do atleta selecionado
  useEffect(() => {
    if (!atletaSelecionado) {
      setAvaliacoes([])
      return
    }

    const loadAvaliacoes = async () => {
      setLoadingAvaliacoes(true)
      const { data } = await supabase
        .from('avaliacoes_atleta')
        .select('*')
        .eq('atleta_id', atletaSelecionado)
        .order('data_avaliacao', { ascending: true })

      if (data) setAvaliacoes(data)
      setLoadingAvaliacoes(false)
    }
    loadAvaliacoes()
  }, [atletaSelecionado, supabase])

  // Atleta atual
  const atletaAtual = useMemo(() => {
    return atletas.find(a => a.id === atletaSelecionado)
  }, [atletas, atletaSelecionado])

  // Ultima avaliacao
  const ultimaAvaliacao = useMemo(() => {
    if (avaliacoes.length === 0) return null
    return avaliacoes[avaliacoes.length - 1]
  }, [avaliacoes])

  // Media geral do atleta
  const mediaGeral = useMemo(() => {
    if (!ultimaAvaliacao) return 0
    const valores = dimensoes.map(d => ultimaAvaliacao[d.key as keyof Avaliacao] as number || 0)
    return valores.reduce((a, b) => a + b, 0) / valores.length
  }, [ultimaAvaliacao])

  // Dados do radar chart
  const radarData = useMemo(() => {
    if (!ultimaAvaliacao) {
      return {
        labels: dimensoes.map(d => d.label),
        datasets: []
      }
    }

    return {
      labels: dimensoes.map(d => d.label),
      datasets: [
        {
          label: 'Ultima Avaliacao',
          data: dimensoes.map(d => ultimaAvaliacao[d.key as keyof Avaliacao] as number || 0),
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(245, 158, 11, 1)',
          pointBorderColor: '#1e293b',
          pointHoverBackgroundColor: '#1e293b',
          pointHoverBorderColor: 'rgba(245, 158, 11, 1)'
        }
      ]
    }
  }, [ultimaAvaliacao])

  // Dados do grafico de evolucao
  const evolucaoData = useMemo(() => {
    if (avaliacoes.length === 0) {
      return { labels: [], datasets: [] }
    }

    const labels = avaliacoes.map(a => {
      const date = new Date(a.data_avaliacao + 'T12:00:00')
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    })

    return {
      labels,
      datasets: dimensoes.map((d, index) => ({
        label: d.label,
        data: avaliacoes.map(a => a[d.key as keyof Avaliacao] as number || 0),
        borderColor: d.color,
        backgroundColor: d.color + '20',
        tension: 0.3,
        fill: false,
        hidden: index > 3 // Mostrar apenas as 4 primeiras por padrao
      }))
    }
  }, [avaliacoes])

  // Dados do grafico de media por dimensao
  const mediaPorDimensaoData = useMemo(() => {
    if (avaliacoes.length === 0) {
      return { labels: [], datasets: [] }
    }

    const medias = dimensoes.map(d => {
      const valores = avaliacoes.map(a => a[d.key as keyof Avaliacao] as number || 0)
      return valores.reduce((a, b) => a + b, 0) / valores.length
    })

    return {
      labels: dimensoes.map(d => d.label),
      datasets: [
        {
          label: 'Media',
          data: medias,
          backgroundColor: dimensoes.map(d => d.color + '80'),
          borderColor: dimensoes.map(d => d.color),
          borderWidth: 2
        }
      ]
    }
  }, [avaliacoes])

  // Filtrar atletas
  const atletasFiltrados = useMemo(() => {
    if (!search) return atletas
    return atletas.filter(a =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.posicao?.toLowerCase().includes(search.toLowerCase()) ||
      a.clubes?.nome.toLowerCase().includes(search.toLowerCase())
    )
  }, [atletas, search])

  // Calcular idade
  const calcularIdade = (dataNascimento: string | null) => {
    if (!dataNascimento) return null
    const hoje = new Date()
    const nascimento = new Date(dataNascimento + 'T12:00:00')
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 10 },
          color: '#94a3b8'
        },
        pointLabels: {
          font: { size: 11, weight: 500 },
          color: '#e2e8f0'
        },
        grid: {
          color: '#334155'
        },
        angleLines: {
          color: '#334155'
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { color: '#334155' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 12, padding: 10, color: '#e2e8f0' }
      }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { color: '#334155' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard de Atletas</h1>
          <p className="text-slate-400 mt-1">Acompanhe a evolucao dos atletas</p>
        </div>
        <Link
          href="/avaliacoes/nova"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          <Star className="w-5 h-5" />
          Nova Avaliacao
        </Link>
      </div>

      {/* Filtro de Atleta */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar atleta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex-1">
            <select
              value={atletaSelecionado}
              onChange={(e) => setAtletaSelecionado(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="">Selecione um atleta</option>
              {atletasFiltrados.map((atleta) => (
                <option key={atleta.id} value={atleta.id}>
                  {atleta.nome} {atleta.posicao && `- ${atleta.posicao}`} {atleta.clubes && `(${atleta.clubes.nome})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!atletaSelecionado ? (
        // Estado vazio
        <div className="bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-700 text-center">
          <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Selecione um Atleta</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Escolha um atleta no filtro acima para visualizar seus graficos de evolucao, radar das 8 dimensoes CBF e historico de avaliacoes.
          </p>
        </div>
      ) : loadingAvaliacoes ? (
        <div className="bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-700 text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dados do atleta...</p>
        </div>
      ) : (
        <>
          {/* Card do Atleta */}
          {atletaAtual && (
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                  {atletaAtual.foto_url ? (
                    <img src={atletaAtual.foto_url} alt={atletaAtual.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-100">{atletaAtual.nome}</h2>
                  <p className="text-slate-400">
                    {atletaAtual.posicao || 'Posicao nao informada'}
                    {atletaAtual.clubes && ` - ${atletaAtual.clubes.nome}`}
                  </p>
                </div>
                <div className="hidden sm:flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-100">
                      {atletaAtual.data_nascimento ? calcularIdade(atletaAtual.data_nascimento) : '-'}
                    </p>
                    <p className="text-xs text-slate-400">anos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-100">
                      {atletaAtual.altura ? `${atletaAtual.altura}m` : '-'}
                    </p>
                    <p className="text-xs text-slate-400">altura</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-100">
                      {atletaAtual.peso ? `${atletaAtual.peso}kg` : '-'}
                    </p>
                    <p className="text-xs text-slate-400">peso</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-500">
                      {mediaGeral > 0 ? mediaGeral.toFixed(1) : '-'}
                    </p>
                    <p className="text-xs text-slate-400">media geral</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-100">{avaliacoes.length}</p>
                    <p className="text-xs text-slate-400">avaliacoes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {avaliacoes.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-700 text-center">
              <BarChart3 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhuma Avaliacao</h3>
              <p className="text-slate-400 mb-4">Este atleta ainda nao possui avaliacoes registradas.</p>
              <Link
                href="/avaliacoes/nova"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors"
              >
                <Star className="w-5 h-5" />
                Criar Primeira Avaliacao
              </Link>
            </div>
          ) : (
            <>
              {/* Grid de Graficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Radar Chart */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-slate-100">Radar das 8 Dimensoes</h3>
                  </div>
                  <div className="h-[300px]">
                    <Radar data={radarData} options={radarOptions} />
                  </div>
                  {ultimaAvaliacao && (
                    <p className="text-xs text-slate-400 text-center mt-2">
                      Baseado na avaliacao de {new Date(ultimaAvaliacao.data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Media por Dimensao */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-slate-100">Media por Dimensao</h3>
                  </div>
                  <div className="h-[300px]">
                    <Bar data={mediaPorDimensaoData} options={barOptions} />
                  </div>
                  <p className="text-xs text-slate-400 text-center mt-2">
                    Media de {avaliacoes.length} avaliacao(oes)
                  </p>
                </div>
              </div>

              {/* Grafico de Evolucao */}
              <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-slate-100">Evolucao ao Longo do Tempo</h3>
                </div>
                <div className="h-[350px]">
                  <Line data={evolucaoData} options={lineOptions} />
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">
                  Clique nas legendas para mostrar/ocultar dimensoes
                </p>
              </div>

              {/* Detalhes da Ultima Avaliacao */}
              {ultimaAvaliacao && (
                <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Ultima Avaliacao</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ultimaAvaliacao.pontos_fortes && (
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2">Pontos Fortes</h4>
                        <p className="text-sm text-slate-300 bg-green-900/30 p-3 rounded-xl border border-green-800/50">
                          {ultimaAvaliacao.pontos_fortes}
                        </p>
                      </div>
                    )}
                    {ultimaAvaliacao.pontos_desenvolver && (
                      <div>
                        <h4 className="text-sm font-medium text-orange-400 mb-2">Pontos a Desenvolver</h4>
                        <p className="text-sm text-slate-300 bg-orange-900/30 p-3 rounded-xl border border-orange-800/50">
                          {ultimaAvaliacao.pontos_desenvolver}
                        </p>
                      </div>
                    )}
                    {ultimaAvaliacao.observacoes && (
                      <div>
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Observacoes</h4>
                        <p className="text-sm text-slate-300 bg-blue-900/30 p-3 rounded-xl border border-blue-800/50">
                          {ultimaAvaliacao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
