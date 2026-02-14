'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Shield, Users, Gamepad2, FileBarChart, Star, TrendingUp,
  Calendar, Clock, ChevronRight, BarChart3, Target, Activity
} from 'lucide-react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

type Jogo = {
  id: string
  data_jogo: string
  adversario: string
  placar_clube: number | null
  placar_adversario: number | null
  competicao: string
  clubes: { nome: string } | null
}

type Avaliacao = {
  id: string
  data_avaliacao: string
  forca: number
  velocidade: number
  tecnica: number
  dinamica: number
  inteligencia: number
  um_contra_um: number
  atitude: number
  potencial: number
  atletas: { nome: string, posicao: string | null } | null
}

type AtletaPorCategoria = {
  categoria: string | null
  count: number
}

type AtletaPorPosicao = {
  posicao: string | null
  count: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    clubes: 0,
    atletas: 0,
    jogos: 0,
    analises: 0,
    avaliacoes: 0
  })
  const [ultimosJogos, setUltimosJogos] = useState<Jogo[]>([])
  const [ultimasAvaliacoes, setUltimasAvaliacoes] = useState<Avaliacao[]>([])
  const [atletasPorCategoria, setAtletasPorCategoria] = useState<AtletaPorCategoria[]>([])
  const [atletasPorPosicao, setAtletasPorPosicao] = useState<AtletaPorPosicao[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      // Stats counts
      const [clubesRes, atletasRes, jogosRes, analisesRes, avaliacoesRes] = await Promise.all([
        supabase.from('clubes').select('id', { count: 'exact', head: true }),
        supabase.from('atletas').select('id', { count: 'exact', head: true }),
        supabase.from('jogos').select('id', { count: 'exact', head: true }),
        supabase.from('analises_jogo').select('id', { count: 'exact', head: true }),
        supabase.from('avaliacoes_atleta').select('id', { count: 'exact', head: true })
      ])

      setStats({
        clubes: clubesRes.count || 0,
        atletas: atletasRes.count || 0,
        jogos: jogosRes.count || 0,
        analises: analisesRes.count || 0,
        avaliacoes: avaliacoesRes.count || 0
      })

      // Ultimos jogos
      const { data: jogosData } = await supabase
        .from('jogos')
        .select('id, data_jogo, adversario, placar_clube, placar_adversario, competicao, clubes(nome)')
        .order('data_jogo', { ascending: false })
        .limit(5)

      if (jogosData) setUltimosJogos(jogosData)

      // Ultimas avaliacoes
      const { data: avaliacoesData } = await supabase
        .from('avaliacoes_atleta')
        .select('id, data_avaliacao, forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial, atletas(nome, posicao)')
        .order('created_at', { ascending: false })
        .limit(5)

      if (avaliacoesData) setUltimasAvaliacoes(avaliacoesData)

      // Atletas por categoria
      const { data: atletasData } = await supabase
        .from('atletas')
        .select('categoria')

      if (atletasData) {
        const categoriaCount: Record<string, number> = {}
        atletasData.forEach(a => {
          const cat = a.categoria || 'Sem categoria'
          categoriaCount[cat] = (categoriaCount[cat] || 0) + 1
        })
        setAtletasPorCategoria(
          Object.entries(categoriaCount).map(([categoria, count]) => ({ categoria, count }))
        )
      }

      // Atletas por posicao
      const { data: posicaoData } = await supabase
        .from('atletas')
        .select('posicao')

      if (posicaoData) {
        const posicaoCount: Record<string, number> = {}
        posicaoData.forEach(a => {
          const pos = a.posicao || 'Sem posicao'
          posicaoCount[pos] = (posicaoCount[pos] || 0) + 1
        })
        setAtletasPorPosicao(
          Object.entries(posicaoCount)
            .map(([posicao, count]) => ({ posicao, count }))
            .sort((a, b) => b.count - a.count)
        )
      }

      setLoading(false)
    }
    loadData()
  }, [supabase])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const calcularMedia = (av: Avaliacao) => {
    const soma = av.forca + av.velocidade + av.tecnica + av.dinamica +
                 av.inteligencia + av.um_contra_um + av.atitude + av.potencial
    return (soma / 8).toFixed(1)
  }

  // Calcular estatisticas extras
  const jogosStats = ultimosJogos.reduce((acc, jogo) => {
    if (jogo.placar_clube !== null && jogo.placar_adversario !== null) {
      if (jogo.placar_clube > jogo.placar_adversario) acc.vitorias++
      else if (jogo.placar_clube < jogo.placar_adversario) acc.derrotas++
      else acc.empates++
    }
    return acc
  }, { vitorias: 0, derrotas: 0, empates: 0 })

  const mediaGeral = ultimasAvaliacoes.length > 0
    ? (ultimasAvaliacoes.reduce((acc, av) => acc + parseFloat(calcularMedia(av)), 0) / ultimasAvaliacoes.length).toFixed(1)
    : '0.0'

  // Dados para grafico de categorias (cores vibrantes para dark mode)
  const categoriasLabels = atletasPorCategoria.map(a => a.categoria || 'Sem categoria')
  const categoriasData = atletasPorCategoria.map(a => a.count)
  const categoriasColors = [
    '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee'
  ]

  const chartCategorias = {
    labels: categoriasLabels,
    datasets: [{
      data: categoriasData,
      backgroundColor: categoriasColors.slice(0, categoriasData.length),
      borderWidth: 0
    }]
  }

  // Dados para grafico de posicoes (cor vibrante para dark mode)
  const chartPosicoes = {
    labels: atletasPorPosicao.slice(0, 8).map(a => a.posicao || 'Sem posicao'),
    datasets: [{
      label: 'Atletas',
      data: atletasPorPosicao.slice(0, 8).map(a => a.count),
      backgroundColor: '#34d399',
      borderRadius: 8
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#94a3b8'
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#e2e8f0'
        },
        grid: {
          display: false
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#94a3b8'
        }
      }
    },
    cutout: '60%'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 mt-1">Visao geral do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Clubes */}
        <Link
          href="/clubes"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Clubes</p>
                <p className="text-2xl font-bold text-slate-100">{loading ? '-' : stats.clubes}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">cadastrados</p>
            </div>
          </div>
        </Link>

        {/* Atletas */}
        <Link
          href="/atletas"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Atletas</p>
                <p className="text-2xl font-bold text-slate-100">{loading ? '-' : stats.atletas}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-400">{atletasPorPosicao.length} posicoes</p>
              <p className="text-xs text-indigo-400">{atletasPorCategoria.length} categorias</p>
            </div>
          </div>
        </Link>

        {/* Jogos */}
        <Link
          href="/jogos"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Jogos</p>
                <p className="text-2xl font-bold text-slate-100">{loading ? '-' : stats.jogos}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold" style={{ color: '#86efac' }}>{jogosStats.vitorias} vitorias</p>
              <p className="text-xs font-bold" style={{ color: '#fde047' }}>{jogosStats.empates} empates</p>
              <p className="text-xs font-bold" style={{ color: '#fca5a5' }}>{jogosStats.derrotas} derrotas</p>
            </div>
          </div>
        </Link>

        {/* Analises */}
        <Link
          href="/analises"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                <FileBarChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Analises</p>
                <p className="text-2xl font-bold text-slate-100">{loading ? '-' : stats.analises}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-400">de jogos</p>
            </div>
          </div>
        </Link>

        {/* Avaliacoes */}
        <Link
          href="/avaliacoes"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#a855f7' }}>
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Avaliacoes</p>
                <p className="text-2xl font-bold text-slate-100">{loading ? '-' : stats.avaliacoes}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-purple-400">de atletas</p>
              {parseFloat(mediaGeral) > 0 && (
                <p className="text-xs text-purple-400 flex items-center gap-1 justify-end">
                  <Activity className="w-3 h-3" /> {mediaGeral}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Atletas por Categoria */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-100">Atletas por Categoria</h2>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {atletasPorCategoria.length > 0 ? (
              atletasPorCategoria.map((item, index) => {
                const maxCount = Math.max(...atletasPorCategoria.map(a => a.count))
                const percentage = (item.count / maxCount) * 100
                const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee']
                return (
                  <div key={item.categoria} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 truncate" style={{ width: '100px', minWidth: '100px' }}>{item.categoria || 'Sem categoria'}</span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#334155' }}>
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                      >
                        <span className="text-xs font-bold text-slate-900">{item.count}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Nenhum dado disponivel
              </div>
            )}
          </div>
        </div>

        {/* Atletas por Posicao */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-100">Atletas por Posicao</h2>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {atletasPorPosicao.length > 0 ? (
              atletasPorPosicao.slice(0, 8).map((item, index) => {
                const maxCount = Math.max(...atletasPorPosicao.map(a => a.count))
                const percentage = (item.count / maxCount) * 100
                const colors = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#22d3ee', '#f87171', '#4ade80']
                return (
                  <div key={item.posicao} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 truncate" style={{ width: '100px', minWidth: '100px' }}>{item.posicao || 'Sem posicao'}</span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#334155' }}>
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                      >
                        <span className="text-xs font-bold text-slate-900">{item.count}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Nenhum dado disponivel
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ultimos Jogos */}
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #475569' }}>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-green-500" />
              <h2 className="font-bold text-slate-100">Ultimos Jogos</h2>
            </div>
            <Link href="/jogos" className="text-sm text-amber-500 hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-600">
            {ultimosJogos.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Nenhum jogo cadastrado
              </div>
            ) : (
              ultimosJogos.map((jogo) => (
                <Link
                  key={jogo.id}
                  href={`/jogos/${jogo.id}`}
                  className="p-4 flex items-center justify-between transition-colors cursor-pointer"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-900/50 rounded-xl flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-100">
                        {jogo.clubes?.nome || 'Clube'} vs {jogo.adversario}
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(jogo.data_jogo)}
                        <span className="text-slate-600">|</span>
                        {jogo.competicao}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {jogo.placar_clube !== null && jogo.placar_adversario !== null ? (
                      <span className={`font-bold text-lg ${
                        jogo.placar_clube > jogo.placar_adversario
                          ? 'text-green-400'
                          : jogo.placar_clube < jogo.placar_adversario
                            ? 'text-red-400'
                            : 'text-slate-400'
                      }`}>
                        {jogo.placar_clube} x {jogo.placar_adversario}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-sm">Sem placar</span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Ultimas Avaliacoes */}
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #475569' }}>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-slate-100">Ultimas Avaliacoes</h2>
            </div>
            <Link href="/avaliacoes" className="text-sm text-amber-500 hover:underline flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-600">
            {ultimasAvaliacoes.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Nenhuma avaliacao cadastrada
              </div>
            ) : (
              ultimasAvaliacoes.map((av) => (
                <Link
                  key={av.id}
                  href={`/avaliacoes/${av.id}`}
                  className="p-4 flex items-center justify-between transition-colors cursor-pointer"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-900/50 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-100">
                        {av.atletas?.nome || 'Atleta'}
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatDate(av.data_avaliacao)}
                        {av.atletas?.posicao && (
                          <>
                            <span className="text-slate-600">|</span>
                            {av.atletas.posicao}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-amber-500">{calcularMedia(av)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/clubes/novo"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#3b82f6' }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Adicionar</p>
          <p className="text-lg font-bold text-slate-100">Novo Clube</p>
        </Link>
        <Link
          href="/atletas/novo"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#6366f1' }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Adicionar</p>
          <p className="text-lg font-bold text-slate-100">Novo Atleta</p>
        </Link>
        <Link
          href="/jogos/novo"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#22c55e' }}
            >
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Adicionar</p>
          <p className="text-lg font-bold text-slate-100">Novo Jogo</p>
        </Link>
        <Link
          href="/avaliacoes/nova"
          className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#a855f7' }}
            >
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Adicionar</p>
          <p className="text-lg font-bold text-slate-100">Nova Avaliacao</p>
        </Link>
      </div>
    </div>
  )
}
