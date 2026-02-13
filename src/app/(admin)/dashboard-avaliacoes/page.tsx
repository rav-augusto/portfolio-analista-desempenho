'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Star, TrendingUp, BarChart3, Target, UserPlus, RefreshCw, ThumbsUp, ThumbsDown, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react'
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
import { Radar, Bar, Line } from 'react-chartjs-2'

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
  atletas: {
    id: string
    nome: string
    foto_url: string | null
    posicao: string | null
    clubes: { id: string; nome: string } | null
  } | null
}

type Clube = {
  id: string
  nome: string
}

type BenchmarkValues = {
  forca: number
  velocidade: number
  tecnica: number
  dinamica: number
  inteligencia: number
  um_contra_um: number
  atitude: number
  potencial: number
}

type AtletaExterno = {
  nome: string
  posicao: string
  valores: BenchmarkValues
}

const dimensoes = [
  { key: 'forca', label: 'Forca', color: '#ef4444', icon: '💪' },
  { key: 'velocidade', label: 'Velocidade', color: '#f97316', icon: '⚡' },
  { key: 'tecnica', label: 'Tecnica', color: '#eab308', icon: '🎯' },
  { key: 'dinamica', label: 'Dinamica', color: '#22c55e', icon: '🔄' },
  { key: 'inteligencia', label: 'Inteligencia', color: '#06b6d4', icon: '🧠' },
  { key: 'um_contra_um', label: '1 contra 1', color: '#3b82f6', icon: '⚔️' },
  { key: 'atitude', label: 'Atitude', color: '#8b5cf6', icon: '🔥' },
  { key: 'potencial', label: 'Potencial', color: '#ec4899', icon: '⭐' }
]

const posicoes = [
  'Goleiro', 'Lateral Direito', 'Lateral Esquerdo', 'Zagueiro', 'Volante',
  'Meio-Campo', 'Meia Atacante', 'Ponta Direita', 'Ponta Esquerda', 'Centroavante', 'Atacante'
]

// Benchmarks de referencia por posicao (valores ideais/esperados)
const benchmarksPorPosicao: Record<string, BenchmarkValues> = {
  'Goleiro': { forca: 3.5, velocidade: 3.0, tecnica: 3.5, dinamica: 3.0, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 3.5 },
  'Lateral Direito': { forca: 3.5, velocidade: 4.0, tecnica: 3.5, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 3.5, atitude: 4.0, potencial: 3.5 },
  'Lateral Esquerdo': { forca: 3.5, velocidade: 4.0, tecnica: 3.5, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 3.5, atitude: 4.0, potencial: 3.5 },
  'Zagueiro': { forca: 4.0, velocidade: 3.5, tecnica: 3.0, dinamica: 3.5, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 3.5 },
  'Volante': { forca: 4.0, velocidade: 3.5, tecnica: 3.5, dinamica: 4.0, inteligencia: 4.0, um_contra_um: 3.5, atitude: 4.0, potencial: 3.5 },
  'Meio-Campo': { forca: 3.0, velocidade: 3.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 4.5, um_contra_um: 3.0, atitude: 3.5, potencial: 4.0 },
  'Meia Atacante': { forca: 3.0, velocidade: 3.5, tecnica: 4.5, dinamica: 4.0, inteligencia: 4.5, um_contra_um: 3.5, atitude: 3.5, potencial: 4.0 },
  'Ponta Direita': { forca: 3.0, velocidade: 4.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 4.0, atitude: 3.5, potencial: 4.0 },
  'Ponta Esquerda': { forca: 3.0, velocidade: 4.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 4.0, atitude: 3.5, potencial: 4.0 },
  'Centroavante': { forca: 4.0, velocidade: 3.5, tecnica: 3.5, dinamica: 3.5, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 4.0 },
  'Atacante': { forca: 3.5, velocidade: 4.0, tecnica: 4.0, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 4.0, atitude: 3.5, potencial: 4.0 }
}

const defaultBenchmark: BenchmarkValues = { forca: 3.5, velocidade: 3.5, tecnica: 3.5, dinamica: 3.5, inteligencia: 3.5, um_contra_um: 3.5, atitude: 3.5, potencial: 3.5 }

const calcularMediaBenchmark = (b: BenchmarkValues) => {
  return Object.values(b).reduce((a, v) => a + v, 0) / Object.values(b).length
}

const calcularMedia = (a: Avaliacao) => {
  const valores = dimensoes.map(d => a[d.key as keyof Avaliacao] as number || 0)
  return valores.reduce((acc, v) => acc + v, 0) / valores.length
}

export default function DashboardAvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroClube, setFiltroClube] = useState('')
  const [atletaSelecionado, setAtletaSelecionado] = useState('')
  const [mostrarAtletaExterno, setMostrarAtletaExterno] = useState(false)
  const [atletaExterno, setAtletaExterno] = useState<AtletaExterno>({
    nome: '',
    posicao: '',
    valores: { ...defaultBenchmark }
  })
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const [avaliacoesRes, clubesRes] = await Promise.all([
        supabase
          .from('avaliacoes_atleta')
          .select('*, atletas(id, nome, foto_url, posicao, clubes(id, nome))')
          .order('data_avaliacao', { ascending: false }),
        supabase.from('clubes').select('id, nome').order('nome')
      ])

      if (avaliacoesRes.data) setAvaliacoes(avaliacoesRes.data)
      if (clubesRes.data) setClubes(clubesRes.data)
      setLoading(false)
    }
    loadData()
  }, [supabase])

  // Filtrar avaliacoes por clube
  const avaliacoesFiltradas = useMemo(() => {
    return avaliacoes.filter(a => {
      if (filtroClube && a.atletas?.clubes?.id !== filtroClube) return false
      return true
    })
  }, [avaliacoes, filtroClube])

  // Agrupar avaliacoes por atleta (pegar a mais recente de cada)
  const atletasComAvaliacao = useMemo(() => {
    const atletaMap = new Map<string, { atleta: Avaliacao['atletas'], avaliacao: Avaliacao }>()

    avaliacoesFiltradas.forEach(a => {
      if (!a.atletas) return
      const existing = atletaMap.get(a.atleta_id)
      if (!existing || new Date(a.data_avaliacao) > new Date(existing.avaliacao.data_avaliacao)) {
        atletaMap.set(a.atleta_id, { atleta: a.atletas, avaliacao: a })
      }
    })

    return Array.from(atletaMap.values())
  }, [avaliacoesFiltradas])

  // Todas avaliacoes do atleta selecionado (para historico)
  const avaliacoesDoAtleta = useMemo(() => {
    if (!atletaSelecionado) return []
    return avaliacoes
      .filter(a => a.atleta_id === atletaSelecionado)
      .sort((a, b) => new Date(a.data_avaliacao).getTime() - new Date(b.data_avaliacao).getTime())
  }, [avaliacoes, atletaSelecionado])

  // Atleta selecionado (ultima avaliacao)
  const atletaAtual = useMemo(() => {
    return atletasComAvaliacao.find(a => a.atleta?.id === atletaSelecionado)
  }, [atletasComAvaliacao, atletaSelecionado])

  // Benchmark para a posicao do atleta selecionado
  const benchmarkAtual = useMemo(() => {
    if (!atletaAtual?.atleta?.posicao) return defaultBenchmark
    return benchmarksPorPosicao[atletaAtual.atleta.posicao] || defaultBenchmark
  }, [atletaAtual])

  // Calcular diferenca do atleta em relacao ao benchmark
  const analiseDetalhada = useMemo(() => {
    if (!atletaAtual) return null

    const analise = dimensoes.map(d => {
      const valorAtleta = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
      const valorBenchmark = benchmarkAtual[d.key as keyof BenchmarkValues]
      const diferenca = valorAtleta - valorBenchmark
      return {
        ...d,
        valor: valorAtleta,
        benchmark: valorBenchmark,
        diferenca,
        status: diferenca >= 0.5 ? 'acima' : diferenca <= -0.5 ? 'abaixo' : 'dentro'
      }
    })

    const pontosFortes = analise.filter(a => a.status === 'acima').sort((a, b) => b.diferenca - a.diferenca)
    const pontosADesenvolver = analise.filter(a => a.status === 'abaixo').sort((a, b) => a.diferenca - b.diferenca)
    const dentroDaMedia = analise.filter(a => a.status === 'dentro')

    const mediaAtleta = calcularMedia(atletaAtual.avaliacao)
    const mediaBenchmark = calcularMediaBenchmark(benchmarkAtual)

    return {
      dimensoes: analise,
      pontosFortes,
      pontosADesenvolver,
      dentroDaMedia,
      mediaAtleta,
      mediaBenchmark,
      diferencaMedia: mediaAtleta - mediaBenchmark
    }
  }, [atletaAtual, benchmarkAtual])

  // Dados do radar comparativo
  const radarData = useMemo(() => {
    const datasets = []

    if (atletaAtual) {
      datasets.push({
        label: atletaAtual.atleta?.nome || 'Atleta',
        data: dimensoes.map(d => atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)'
      })

      datasets.push({
        label: `Benchmark (${atletaAtual.atleta?.posicao || 'Geral'})`,
        data: dimensoes.map(d => benchmarkAtual[d.key as keyof BenchmarkValues]),
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        borderColor: 'rgba(148, 163, 184, 0.8)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(148, 163, 184, 0.8)'
      })
    }

    if (mostrarAtletaExterno && atletaExterno.nome) {
      datasets.push({
        label: atletaExterno.nome,
        data: dimensoes.map(d => atletaExterno.valores[d.key as keyof BenchmarkValues]),
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)'
      })
    }

    return { labels: dimensoes.map(d => d.label), datasets }
  }, [atletaAtual, benchmarkAtual, mostrarAtletaExterno, atletaExterno])

  // Grafico de barras comparativo (atleta vs benchmark)
  const barComparativoData = useMemo(() => {
    if (!atletaAtual) return { labels: [], datasets: [] }

    return {
      labels: dimensoes.map(d => d.label),
      datasets: [
        {
          label: 'Atleta',
          data: dimensoes.map(d => atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0),
          backgroundColor: dimensoes.map(d => {
            const valor = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
            const bench = benchmarkAtual[d.key as keyof BenchmarkValues]
            if (valor >= bench + 0.5) return 'rgba(34, 197, 94, 0.8)'
            if (valor <= bench - 0.5) return 'rgba(249, 115, 22, 0.8)'
            return 'rgba(59, 130, 246, 0.8)'
          }),
          borderWidth: 0
        },
        {
          label: 'Benchmark',
          data: dimensoes.map(d => benchmarkAtual[d.key as keyof BenchmarkValues]),
          backgroundColor: 'rgba(100, 116, 139, 0.4)',
          borderWidth: 0
        }
      ]
    }
  }, [atletaAtual, benchmarkAtual])

  // Grafico de evolucao (historico)
  const evolucaoData = useMemo(() => {
    if (avaliacoesDoAtleta.length < 2) return null

    return {
      labels: avaliacoesDoAtleta.map(a => {
        const date = new Date(a.data_avaliacao + 'T12:00:00')
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      }),
      datasets: [
        {
          label: 'Media Geral',
          data: avaliacoesDoAtleta.map(a => calcularMedia(a)),
          borderColor: 'rgba(245, 158, 11, 1)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    }
  }, [avaliacoesDoAtleta])

  // Media por posicao (visao geral)
  const mediaPorPosicao = useMemo(() => {
    const posicaoMap = new Map<string, number[]>()

    atletasComAvaliacao.forEach(({ atleta, avaliacao }) => {
      if (!atleta?.posicao) return
      const media = calcularMedia(avaliacao)
      if (!posicaoMap.has(atleta.posicao)) {
        posicaoMap.set(atleta.posicao, [])
      }
      posicaoMap.get(atleta.posicao)!.push(media)
    })

    return Array.from(posicaoMap.entries()).map(([posicao, medias]) => ({
      posicao,
      media: medias.reduce((a, b) => a + b, 0) / medias.length,
      count: medias.length,
      benchmark: calcularMediaBenchmark(benchmarksPorPosicao[posicao] || defaultBenchmark)
    })).sort((a, b) => b.media - a.media)
  }, [atletasComAvaliacao])

  const barPosicaoData = useMemo(() => ({
    labels: mediaPorPosicao.map(p => p.posicao),
    datasets: [
      {
        label: 'Media dos Atletas',
        data: mediaPorPosicao.map(p => p.media),
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1
      },
      {
        label: 'Benchmark',
        data: mediaPorPosicao.map(p => p.benchmark),
        backgroundColor: 'rgba(100, 116, 139, 0.5)',
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: 1
      }
    ]
  }), [mediaPorPosicao])

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, font: { size: 10 }, color: '#94a3b8' },
        pointLabels: { font: { size: 11 }, color: '#e2e8f0' },
        grid: { color: '#334155' },
        angleLines: { color: '#334155' }
      }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 15, color: '#e2e8f0' } }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, color: '#e2e8f0' } }
    }
  }

  const barVerticalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: '#334155' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, color: '#e2e8f0' } }
    }
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: '#334155' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const handleExternoChange = (key: keyof BenchmarkValues, value: number) => {
    setAtletaExterno(prev => ({
      ...prev,
      valores: { ...prev.valores, [key]: value }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Comparativo de Avaliacoes</h1>
          <p className="text-slate-400 mt-1">Compare atletas com benchmarks e dados externos</p>
        </div>
        <Link
          href="/avaliacoes/nova"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          <Star className="w-5 h-5" />
          Nova Avaliacao
        </Link>
      </div>

      {/* Filtros e Selecao */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-1">Filtrar por Clube</label>
            <select
              value={filtroClube}
              onChange={(e) => { setFiltroClube(e.target.value); setAtletaSelecionado('') }}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="">Todos os clubes</option>
              {clubes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-amber-500 mb-1">Selecionar Atleta para Comparar</label>
            <select
              value={atletaSelecionado}
              onChange={(e) => setAtletaSelecionado(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="">Selecione um atleta</option>
              {atletasComAvaliacao.map(({ atleta }) => (
                <option key={atleta?.id} value={atleta?.id}>
                  {atleta?.nome} - {atleta?.posicao || 'Sem posicao'} {atleta?.clubes && `(${atleta.clubes.nome})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!atletaSelecionado ? (
        <>
          {/* Estado inicial - mostrar visao geral */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-100">Comparativo por Posicao</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Media dos seus atletas avaliados comparada com o benchmark de referencia para cada posicao
            </p>
            {mediaPorPosicao.length > 0 ? (
              <div className="h-[400px]">
                <Bar data={barPosicaoData} options={barOptions} />
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">Nenhuma avaliacao encontrada</p>
              </div>
            )}
          </div>

          {/* Cards de resumo por posicao */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaPorPosicao.slice(0, 8).map((p) => {
              const diff = p.media - p.benchmark
              return (
                <div key={p.posicao} className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
                  <p className="text-sm font-medium text-slate-100 mb-1">{p.posicao}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-100">{p.media.toFixed(1)}</span>
                    <span className={`text-sm font-medium ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{p.count} atleta(s) • Bench: {p.benchmark.toFixed(1)}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* Card do Atleta Selecionado */}
          {atletaAtual && analiseDetalhada && (
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                    {atletaAtual.atleta?.foto_url ? (
                      <img src={atletaAtual.atleta.foto_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">{atletaAtual.atleta?.nome}</h2>
                    <p className="text-slate-400">
                      {atletaAtual.atleta?.posicao || 'Sem posicao'}
                      {atletaAtual.atleta?.clubes && ` - ${atletaAtual.atleta.clubes.nome}`}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {avaliacoesDoAtleta.length} avaliacao(oes)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-500">{analiseDetalhada.mediaAtleta.toFixed(1)}</p>
                    <p className="text-xs text-slate-400">Media</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${analiseDetalhada.diferencaMedia >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                      {analiseDetalhada.diferencaMedia >= 0 ? '+' : ''}{analiseDetalhada.diferencaMedia.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-400">vs Benchmark</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pontos Fortes e A Desenvolver */}
          {analiseDetalhada && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Pontos Fortes */}
              <div className="bg-green-900/30 rounded-2xl p-5 border border-green-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsUp className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-green-300">Pontos Fortes</h3>
                  <span className="text-xs bg-green-800/50 text-green-300 px-2 py-0.5 rounded-full ml-auto">
                    {analiseDetalhada.pontosFortes.length} dimensao(oes)
                  </span>
                </div>
                {analiseDetalhada.pontosFortes.length > 0 ? (
                  <div className="space-y-2">
                    {analiseDetalhada.pontosFortes.map(p => (
                      <div key={p.key} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-300">{p.icon} {p.label}</span>
                        <span className="font-bold text-green-400">{p.valor.toFixed(1)} <span className="text-xs font-normal">(+{p.diferenca.toFixed(1)})</span></span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-400">Nenhuma dimensao acima do benchmark</p>
                )}
              </div>

              {/* Pontos a Desenvolver */}
              <div className="bg-orange-900/30 rounded-2xl p-5 border border-orange-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsDown className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-orange-300">Pontos a Desenvolver</h3>
                  <span className="text-xs bg-orange-800/50 text-orange-300 px-2 py-0.5 rounded-full ml-auto">
                    {analiseDetalhada.pontosADesenvolver.length} dimensao(oes)
                  </span>
                </div>
                {analiseDetalhada.pontosADesenvolver.length > 0 ? (
                  <div className="space-y-2">
                    {analiseDetalhada.pontosADesenvolver.map(p => (
                      <div key={p.key} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-300">{p.icon} {p.label}</span>
                        <span className="font-bold text-orange-400">{p.valor.toFixed(1)} <span className="text-xs font-normal">({p.diferenca.toFixed(1)})</span></span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-orange-400">Nenhuma dimensao abaixo do benchmark</p>
                )}
              </div>
            </div>
          )}

          {/* Graficos Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Radar Comparativo */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-100">Radar Comparativo</h3>
              </div>
              <div className="h-[320px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* Barras Comparativas */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-100">Comparativo por Dimensao</h3>
              </div>
              <div className="h-[320px]">
                <Bar data={barComparativoData} options={barVerticalOptions} />
              </div>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500"></span> <span className="text-slate-300">Acima</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> <span className="text-slate-300">Na media</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500"></span> <span className="text-slate-300">Abaixo</span></span>
              </div>
            </div>
          </div>

          {/* Evolucao e Tabela */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Grafico de Evolucao */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-100">Evolucao da Media</h3>
              </div>
              {evolucaoData ? (
                <div className="h-[250px]">
                  <Line data={evolucaoData} options={lineOptions} />
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
                  <p>Necessario pelo menos 2 avaliacoes para mostrar evolucao</p>
                </div>
              )}
            </div>

            {/* Tabela Detalhada */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-100">Detalhamento</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 font-medium text-slate-400">Dimensao</th>
                      <th className="text-center py-2 font-medium text-slate-400">Atleta</th>
                      <th className="text-center py-2 font-medium text-slate-400">Bench</th>
                      <th className="text-center py-2 font-medium text-slate-400">Dif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analiseDetalhada?.dimensoes.map(d => (
                      <tr key={d.key} className="border-b border-slate-700/50">
                        <td className="py-2 text-slate-300">{d.icon} {d.label}</td>
                        <td className="py-2 text-center font-medium text-slate-200">{d.valor.toFixed(1)}</td>
                        <td className="py-2 text-center text-slate-400">{d.benchmark.toFixed(1)}</td>
                        <td className="py-2 text-center">
                          <span className={`inline-flex items-center gap-0.5 font-medium ${
                            d.status === 'acima' ? 'text-green-400' : d.status === 'abaixo' ? 'text-orange-400' : 'text-blue-400'
                          }`}>
                            {d.status === 'acima' ? <ArrowUp className="w-3 h-3" /> : d.status === 'abaixo' ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {d.diferenca >= 0 ? '+' : ''}{d.diferenca.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Observacoes da ultima avaliacao */}
          {atletaAtual?.avaliacao && (atletaAtual.avaliacao.pontos_fortes || atletaAtual.avaliacao.pontos_desenvolver || atletaAtual.avaliacao.observacoes) && (
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Observacoes da Ultima Avaliacao</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {atletaAtual.avaliacao.pontos_fortes && (
                  <div className="bg-green-900/30 p-4 rounded-xl border border-green-800/50">
                    <p className="text-xs font-medium text-green-400 mb-1">Pontos Fortes</p>
                    <p className="text-sm text-slate-300">{atletaAtual.avaliacao.pontos_fortes}</p>
                  </div>
                )}
                {atletaAtual.avaliacao.pontos_desenvolver && (
                  <div className="bg-orange-900/30 p-4 rounded-xl border border-orange-800/50">
                    <p className="text-xs font-medium text-orange-400 mb-1">Pontos a Desenvolver</p>
                    <p className="text-sm text-slate-300">{atletaAtual.avaliacao.pontos_desenvolver}</p>
                  </div>
                )}
                {atletaAtual.avaliacao.observacoes && (
                  <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-800/50">
                    <p className="text-xs font-medium text-blue-400 mb-1">Observacoes</p>
                    <p className="text-sm text-slate-300">{atletaAtual.avaliacao.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Adicionar Atleta Externo para Comparacao */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-100">Comparar com Atleta Externo</h3>
              </div>
              <button
                onClick={() => setMostrarAtletaExterno(!mostrarAtletaExterno)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  mostrarAtletaExterno
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {mostrarAtletaExterno ? 'Ocultar' : 'Adicionar'}
              </button>
            </div>

            {mostrarAtletaExterno && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Insira os dados de um atleta de outra plataforma ou time para comparar no radar
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-1">Nome do Atleta</label>
                    <input
                      type="text"
                      value={atletaExterno.nome}
                      onChange={(e) => setAtletaExterno(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Jogador Referencia"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-1">Posicao</label>
                    <select
                      value={atletaExterno.posicao}
                      onChange={(e) => setAtletaExterno(prev => ({ ...prev, posicao: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="">Selecione</option>
                      {posicoes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dimensoes.map((d) => (
                    <div key={d.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">{d.icon} {d.label}</label>
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={atletaExterno.valores[d.key as keyof BenchmarkValues]}
                        onChange={(e) => handleExternoChange(d.key as keyof BenchmarkValues, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setAtletaExterno({ nome: '', posicao: '', valores: { ...defaultBenchmark } })}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Limpar dados
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
