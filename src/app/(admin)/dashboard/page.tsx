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

  const cards = [
    { title: 'Clubes', value: stats.clubes, icon: Shield, href: '/clubes', bgColor: '#3b82f6' },
    { title: 'Atletas', value: stats.atletas, icon: Users, href: '/atletas', bgColor: '#6366f1' },
    { title: 'Jogos', value: stats.jogos, icon: Gamepad2, href: '/jogos', bgColor: '#22c55e' },
    { title: 'Analises', value: stats.analises, icon: FileBarChart, href: '/analises', bgColor: '#f97316' },
    { title: 'Avaliacoes', value: stats.avaliacoes, icon: Star, href: '/avaliacoes', bgColor: '#a855f7' }
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const calcularMedia = (av: Avaliacao) => {
    const soma = av.forca + av.velocidade + av.tecnica + av.dinamica +
                 av.inteligencia + av.um_contra_um + av.atitude + av.potencial
    return (soma / 8).toFixed(1)
  }

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
          color: '#334155'
        }
      },
      x: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: '#334155'
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
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">{card.title}</p>
            <p className="text-2xl font-bold text-slate-100">
              {loading ? '-' : card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Atletas por Categoria */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-100">Atletas por Categoria</h2>
          </div>
          <div className="h-64">
            {atletasPorCategoria.length > 0 ? (
              <Doughnut data={chartCategorias} options={doughnutOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Nenhum dado disponivel
              </div>
            )}
          </div>
        </div>

        {/* Atletas por Posicao */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-100">Atletas por Posicao</h2>
          </div>
          <div className="h-64">
            {atletasPorPosicao.length > 0 ? (
              <Bar data={chartPosicoes} options={chartOptions} />
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
        <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-green-500" />
              <h2 className="font-bold text-slate-100">Ultimos Jogos</h2>
            </div>
            <Link href="/jogos" className="text-sm text-amber-500 hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {ultimosJogos.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Nenhum jogo cadastrado
              </div>
            ) : (
              ultimosJogos.map((jogo) => (
                <Link
                  key={jogo.id}
                  href={`/jogos/${jogo.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
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
        <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-slate-100">Ultimas Avaliacoes</h2>
            </div>
            <Link href="/avaliacoes" className="text-sm text-amber-500 hover:underline flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {ultimasAvaliacoes.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Nenhuma avaliacao cadastrada
              </div>
            ) : (
              ultimasAvaliacoes.map((av) => (
                <Link
                  key={av.id}
                  href={`/avaliacoes/${av.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
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
      <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Acoes Rapidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/clubes/novo"
            className="flex flex-col items-center gap-2 p-4 bg-blue-900/30 rounded-xl hover:bg-blue-900/50 transition-colors text-center"
          >
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Novo Clube</span>
          </Link>
          <Link
            href="/atletas/novo"
            className="flex flex-col items-center gap-2 p-4 bg-indigo-900/30 rounded-xl hover:bg-indigo-900/50 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">Novo Atleta</span>
          </Link>
          <Link
            href="/jogos/novo"
            className="flex flex-col items-center gap-2 p-4 bg-green-900/30 rounded-xl hover:bg-green-900/50 transition-colors text-center"
          >
            <Gamepad2 className="w-6 h-6 text-green-400" />
            <span className="text-sm font-medium text-slate-300">Novo Jogo</span>
          </Link>
          <Link
            href="/avaliacoes/nova"
            className="flex flex-col items-center gap-2 p-4 bg-purple-900/30 rounded-xl hover:bg-purple-900/50 transition-colors text-center"
          >
            <Star className="w-6 h-6 text-purple-400" />
            <span className="text-sm font-medium text-slate-300">Nova Avaliacao</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
