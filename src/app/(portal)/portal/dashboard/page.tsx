'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Users, TrendingUp, Scale, Star, BarChart3, Trophy, Clock, User } from 'lucide-react'
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
  clubes: { nome: string } | { nome: string }[] | null
}

const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
}

type Avaliacao = {
  id: string
  atleta_id: string
  data_avaliacao: string
  minutos_jogados: number | null
  gols: number | null
  assistencias: number | null
  // CBF
  forca: number | null
  velocidade: number | null
  tecnica: number | null
  dinamica: number | null
  inteligencia: number | null
  um_contra_um: number | null
  atitude: number | null
  potencial: number | null
  // OFE
  penetracao: number | null
  cobertura_ofensiva: number | null
  espaco_com_bola: number | null
  espaco_sem_bola: number | null
  mobilidade: number | null
  unidade_ofensiva: number | null
  // DEF
  contencao: number | null
  cobertura_defensiva: number | null
  equilibrio_recuperacao: number | null
  equilibrio_defensivo: number | null
  concentracao_def: number | null
  unidade_defensiva: number | null
  // Outros
  pontos_fortes: string | null
  pontos_desenvolver: string | null
  observacoes: string | null
}

// Dimensoes CBF
const dimensoesCBF = [
  { key: 'forca', label: 'Forca', shortLabel: 'FOR', color: '#ef4444' },
  { key: 'velocidade', label: 'Velocidade', shortLabel: 'VEL', color: '#f97316' },
  { key: 'tecnica', label: 'Tecnica', shortLabel: 'TEC', color: '#eab308' },
  { key: 'dinamica', label: 'Dinamica', shortLabel: 'DIN', color: '#22c55e' },
  { key: 'inteligencia', label: 'Inteligencia', shortLabel: 'INT', color: '#06b6d4' },
  { key: 'um_contra_um', label: '1 contra 1', shortLabel: '1x1', color: '#3b82f6' },
  { key: 'atitude', label: 'Atitude', shortLabel: 'ATI', color: '#8b5cf6' },
  { key: 'potencial', label: 'Potencial', shortLabel: 'POT', color: '#ec4899' }
]

// Dimensoes Ofensivas
const dimensoesOFE = [
  { key: 'penetracao', label: 'Penetracao', shortLabel: 'PEN', color: '#10b981' },
  { key: 'cobertura_ofensiva', label: 'Cob. Ofensiva', shortLabel: 'COB', color: '#14b8a6' },
  { key: 'espaco_com_bola', label: 'Espaco c/ Bola', shortLabel: 'ECB', color: '#06b6d4' },
  { key: 'espaco_sem_bola', label: 'Espaco s/ Bola', shortLabel: 'ESB', color: '#0ea5e9' },
  { key: 'mobilidade', label: 'Mobilidade', shortLabel: 'MOB', color: '#3b82f6' },
  { key: 'unidade_ofensiva', label: 'Unid. Ofensiva', shortLabel: 'UNI', color: '#6366f1' }
]

// Dimensoes Defensivas
const dimensoesDEF = [
  { key: 'contencao', label: 'Contencao', shortLabel: 'CON', color: '#dc2626' },
  { key: 'cobertura_defensiva', label: 'Cob. Defensiva', shortLabel: 'CBD', color: '#ea580c' },
  { key: 'equilibrio_recuperacao', label: 'Equil. Recup.', shortLabel: 'EQR', color: '#d97706' },
  { key: 'equilibrio_defensivo', label: 'Equil. Def.', shortLabel: 'EQD', color: '#ca8a04' },
  { key: 'concentracao_def', label: 'Concentracao', shortLabel: 'CNC', color: '#65a30d' },
  { key: 'unidade_defensiva', label: 'Unid. Defensiva', shortLabel: 'UND', color: '#16a34a' }
]

// Todas as dimensoes
const todasDimensoes = [...dimensoesCBF, ...dimensoesOFE, ...dimensoesDEF]

export default function PortalDashboardPage() {
  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'geral' | 'cbf' | 'ofe' | 'def'>('geral')
  const [avaliacaoIndex, setAvaliacaoIndex] = useState<number>(-1) // -1 = ultima
  const supabase = createClient()
  const { user: usuario, isLoading: userLoading } = useUser()

  // Dimensoes ativas baseadas na tab
  const dimensoesAtivas = activeTab === 'geral' ? todasDimensoes : activeTab === 'cbf' ? dimensoesCBF : activeTab === 'ofe' ? dimensoesOFE : dimensoesDEF

  // Carregar dados do atleta logado
  useEffect(() => {
    if (!userLoading && usuario?.atleta_id) {
      loadData()
    }
  }, [userLoading, usuario])

  const loadData = async () => {
    if (!usuario?.atleta_id) return

    // Load athlete data
    const { data: atletaData } = await supabase
      .from('atletas')
      .select('id, nome, foto_url, posicao, altura, peso, data_nascimento, clubes(nome)')
      .eq('id', usuario.atleta_id)
      .single()

    if (atletaData) setAtleta(atletaData)

    // Load evaluations
    const { data: avaliacoesData } = await supabase
      .from('avaliacoes_atleta')
      .select('*')
      .eq('atleta_id', usuario.atleta_id)
      .order('data_avaliacao', { ascending: true })

    if (avaliacoesData) setAvaliacoes(avaliacoesData)
    setLoading(false)
  }

  // Avaliacao selecionada (ultima por padrao)
  const avaliacaoSelecionada = useMemo(() => {
    if (avaliacoes.length === 0) return null
    if (avaliacaoIndex === -1 || avaliacaoIndex >= avaliacoes.length) {
      return avaliacoes[avaliacoes.length - 1]
    }
    return avaliacoes[avaliacaoIndex]
  }, [avaliacoes, avaliacaoIndex])

  // Media geral do atleta (todas as dimensoes preenchidas)
  const mediaGeral = useMemo(() => {
    if (!avaliacaoSelecionada) return 0
    const valores = todasDimensoes
      .map(d => avaliacaoSelecionada[d.key as keyof Avaliacao] as number || 0)
      .filter(v => v > 0)
    if (valores.length === 0) return 0
    return valores.reduce((a, b) => a + b, 0) / valores.length
  }, [avaliacaoSelecionada])

  // Total de minutos jogados
  const minutosData = useMemo(() => {
    const avaliacoesComMinutos = avaliacoes.filter(a => a.minutos_jogados && a.minutos_jogados > 0)
    const total = avaliacoesComMinutos.reduce((acc, a) => acc + (a.minutos_jogados || 0), 0)
    return { total, jogos: avaliacoesComMinutos.length, avaliacoes: avaliacoesComMinutos }
  }, [avaliacoes])

  // Total de gols e assistencias
  const golsAssistencias = useMemo(() => {
    const totalGols = avaliacoes.reduce((acc, a) => acc + (a.gols || 0), 0)
    const totalAssistencias = avaliacoes.reduce((acc, a) => acc + (a.assistencias || 0), 0)
    return { gols: totalGols, assistencias: totalAssistencias }
  }, [avaliacoes])

  // Dados do grafico de minutagem
  const minutagemChartData = useMemo(() => {
    if (minutosData.avaliacoes.length === 0) return null

    const avaliacoesOrdenadas = [...minutosData.avaliacoes].sort(
      (a, b) => new Date(a.data_avaliacao).getTime() - new Date(b.data_avaliacao).getTime()
    )

    return {
      labels: avaliacoesOrdenadas.map(a => {
        const date = new Date(a.data_avaliacao + 'T12:00:00')
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      }),
      datasets: [{
        label: 'Minutos',
        data: avaliacoesOrdenadas.map(a => a.minutos_jogados || 0),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2,
      }]
    }
  }, [minutosData])

  // Dados do grafico de gols e assistencias
  const golsAssistenciasChartData = useMemo(() => {
    const avaliacoesComStats = avaliacoes.filter(a => (a.gols && a.gols > 0) || (a.assistencias && a.assistencias > 0))
    if (avaliacoesComStats.length === 0) return null

    const avaliacoesOrdenadas = [...avaliacoes].sort(
      (a, b) => new Date(a.data_avaliacao).getTime() - new Date(b.data_avaliacao).getTime()
    )

    return {
      labels: avaliacoesOrdenadas.map(a => {
        const date = new Date(a.data_avaliacao + 'T12:00:00')
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      }),
      datasets: [
        {
          label: 'Gols',
          data: avaliacoesOrdenadas.map(a => a.gols || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: '#22c55e',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Assistencias',
          data: avaliacoesOrdenadas.map(a => a.assistencias || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 4,
        }
      ]
    }
  }, [avaliacoes])

  // Dados do radar chart
  const radarData = useMemo(() => {
    const corPrincipal = activeTab === 'geral' ? 'rgba(139, 92, 246, 1)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 1)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
    const corBg = activeTab === 'geral' ? 'rgba(139, 92, 246, 0.2)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 0.2)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'

    if (!avaliacaoSelecionada) {
      return {
        labels: dimensoesAtivas.map(d => d.shortLabel),
        datasets: []
      }
    }

    return {
      labels: dimensoesAtivas.map(d => d.shortLabel),
      datasets: [
        {
          label: 'Ultima Avaliacao',
          data: dimensoesAtivas.map(d => avaliacaoSelecionada[d.key as keyof Avaliacao] as number || 0),
          backgroundColor: corBg,
          borderColor: corPrincipal,
          borderWidth: 2,
          pointBackgroundColor: corPrincipal,
          pointBorderColor: '#1e293b',
          pointHoverBackgroundColor: '#1e293b',
          pointHoverBorderColor: corPrincipal
        }
      ]
    }
  }, [avaliacaoSelecionada, dimensoesAtivas, activeTab])

  // Dados comparativo primeira vs ultima avaliacao
  const comparativoData = useMemo(() => {
    if (avaliacoes.length < 2) return null
    const primeira = avaliacoes[0]
    const ultima = avaliacoes[avaliacoes.length - 1]

    return dimensoesAtivas.map(d => {
      const valorPrimeira = primeira[d.key as keyof Avaliacao] as number || 0
      const valorUltima = ultima[d.key as keyof Avaliacao] as number || 0
      const evolucao = valorUltima - valorPrimeira
      return {
        ...d,
        primeira: valorPrimeira,
        ultima: valorUltima,
        evolucao,
        percentual: valorPrimeira > 0 ? ((evolucao / valorPrimeira) * 100) : 0
      }
    })
  }, [avaliacoes, dimensoesAtivas])

  // Maiores evolucoes (ordenadas)
  const maioresEvolucoes = useMemo(() => {
    if (!comparativoData) return null
    return [...comparativoData]
      .filter(d => d.primeira > 0 || d.ultima > 0)
      .sort((a, b) => b.evolucao - a.evolucao)
  }, [comparativoData])

  // Dados do grafico de barras de evolucao
  const evolucaoBarData = useMemo(() => {
    if (!comparativoData || avaliacoes.length < 2) {
      return { labels: [], datasets: [] }
    }

    const dados = comparativoData.filter(d => d.primeira > 0 || d.ultima > 0)

    const getColor = (evolucao: number) => {
      if (evolucao > 0) return 'rgba(34, 197, 94, 0.8)'
      if (evolucao < 0) return 'rgba(239, 68, 68, 0.8)'
      return 'rgba(100, 116, 139, 0.8)'
    }

    const getBorderColor = (evolucao: number) => {
      if (evolucao > 0) return '#22c55e'
      if (evolucao < 0) return '#ef4444'
      return '#64748b'
    }

    return {
      labels: dados.map(d => d.shortLabel),
      datasets: [
        {
          label: 'Evolucao',
          data: dados.map(d => d.evolucao === 0 ? 0.15 : d.evolucao),
          backgroundColor: dados.map(d => getColor(d.evolucao)),
          borderColor: dados.map(d => getBorderColor(d.evolucao)),
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    }
  }, [comparativoData, avaliacoes])

  // Opcoes do grafico de barras de evolucao
  const evolucaoBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
        callbacks: {
          label: (ctx: { raw: number }) => {
            const val = ctx.raw as number
            return val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1)
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(71, 85, 105, 0.3)' },
        ticks: {
          color: '#94a3b8',
          callback: (value: number) => value >= 0 ? `+${value}` : value
        },
        suggestedMin: -2,
        suggestedMax: 2
      }
    }
  }

  // Modelo 1: Media por grupo (CBF, OFE, DEF)
  const mediaPorGrupo = useMemo(() => {
    if (!avaliacaoSelecionada) return null

    const calcMedia = (dims: typeof dimensoesCBF) => {
      const valores = dims.map(d => avaliacaoSelecionada[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)
      if (valores.length === 0) return 0
      return valores.reduce((a, b) => a + b, 0) / valores.length
    }

    return {
      cbf: calcMedia(dimensoesCBF),
      ofe: calcMedia(dimensoesOFE),
      def: calcMedia(dimensoesDEF)
    }
  }, [avaliacaoSelecionada])

  // Modelo 3: Perfil do atleta (ofensivo vs defensivo)
  const perfilAtleta = useMemo(() => {
    if (!avaliacaoSelecionada) return null

    const mediaOfe = dimensoesOFE.map(d => avaliacaoSelecionada[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)
    const mediaDef = dimensoesDEF.map(d => avaliacaoSelecionada[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)

    const ofe = mediaOfe.length > 0 ? mediaOfe.reduce((a, b) => a + b, 0) / mediaOfe.length : 0
    const def = mediaDef.length > 0 ? mediaDef.reduce((a, b) => a + b, 0) / mediaDef.length : 0
    const total = ofe + def

    return {
      ofe,
      def,
      percentOfe: total > 0 ? (ofe / total) * 100 : 50,
      percentDef: total > 0 ? (def / total) * 100 : 50
    }
  }, [avaliacaoSelecionada])

  // Modelo 4: Estatisticas gerais
  const estatisticas = useMemo(() => {
    if (!comparativoData || avaliacoes.length < 2) return null

    const melhoraram = comparativoData.filter(d => d.evolucao > 0).length
    const pioraram = comparativoData.filter(d => d.evolucao < 0).length
    const estagnaram = comparativoData.filter(d => d.evolucao === 0).length

    const mediaPrimeira = comparativoData.map(d => d.primeira).filter(v => v > 0)
    const mediaUltima = comparativoData.map(d => d.ultima).filter(v => v > 0)

    return {
      melhoraram,
      pioraram,
      estagnaram,
      total: comparativoData.length,
      mediaPrimeira: mediaPrimeira.length > 0 ? mediaPrimeira.reduce((a, b) => a + b, 0) / mediaPrimeira.length : 0,
      mediaUltima: mediaUltima.length > 0 ? mediaUltima.reduce((a, b) => a + b, 0) / mediaUltima.length : 0,
      maiorEvolucao: maioresEvolucoes ? maioresEvolucoes[0] : null,
      maiorQueda: maioresEvolucoes ? maioresEvolucoes[maioresEvolucoes.length - 1] : null
    }
  }, [comparativoData, avaliacoes, maioresEvolucoes])

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
          color: '#94a3b8',
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: { size: 11, weight: 'bold' as const },
          color: '#e2e8f0'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)'
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.15)'
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!atleta) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Perfil nao encontrado</p>
          <p className="text-sm text-slate-500">Entre em contato com seu analista</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Meu Dashboard</h1>
        <p className="text-slate-400 mt-1">Acompanhe sua evolucao completa</p>
      </div>

      {/* Card do Atleta */}
      <div className="rounded-2xl p-6 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex items-center gap-6">
          {/* Foto */}
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {atleta.foto_url ? (
              <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-12 h-12 text-slate-500" />
            )}
          </div>

          {/* Nome e Info */}
          <div className="flex-shrink-0">
            <h2 className="text-2xl font-bold text-slate-100">{atleta.nome}</h2>
            <p className="text-slate-400">
              {atleta.posicao || 'Posicao nao informada'}
              {getClubeName(atleta.clubes) && ` - ${getClubeName(atleta.clubes)}`}
            </p>
          </div>

          {/* Indicador de Evolucao */}
          {avaliacoes.length >= 2 && estatisticas && (
            <div
              className="flex flex-col items-center justify-center px-4 py-2 rounded-xl ml-auto"
              style={{
                backgroundColor: estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <div className="flex items-center gap-2">
                {estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
                )}
                <p className={`text-2xl font-black ${estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? 'text-green-500' : 'text-red-500'}`}>
                  {estatisticas.mediaPrimeira > 0 ? (estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? '+' : '') + (((estatisticas.mediaUltima - estatisticas.mediaPrimeira) / estatisticas.mediaPrimeira) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <p className={`text-xs font-medium ${estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? 'text-green-400' : 'text-red-400'}`}>
                {estatisticas.mediaUltima > estatisticas.mediaPrimeira ? 'Evoluindo' : estatisticas.mediaUltima < estatisticas.mediaPrimeira ? 'Em Queda' : 'Estavel'}
              </p>
            </div>
          )}
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-700 text-center">
          <BarChart3 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhuma Avaliacao</h3>
          <p className="text-slate-400 mb-4">Voce ainda nao possui avaliacoes registradas.</p>
        </div>
      ) : (
        <>
          {/* Tabs Geral / CBF / OFE / DEF */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('geral')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium transition-all"
              style={activeTab === 'geral' ? { backgroundColor: '#8b5cf6', color: '#ffffff' } : { backgroundColor: '#334155', color: '#94a3b8', border: '1px solid #475569' }}
            >
              <span>📊</span> Geral (20)
            </button>
            <button
              onClick={() => setActiveTab('cbf')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium transition-all"
              style={activeTab === 'cbf' ? { backgroundColor: '#f59e0b', color: '#0f172a' } : { backgroundColor: '#334155', color: '#94a3b8', border: '1px solid #475569' }}
            >
              <span>⚽</span> CBF (8)
            </button>
            <button
              onClick={() => setActiveTab('ofe')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium transition-all"
              style={activeTab === 'ofe' ? { backgroundColor: '#22c55e', color: '#0f172a' } : { backgroundColor: '#334155', color: '#94a3b8', border: '1px solid #475569' }}
            >
              <span>↗️</span> OFE (6)
            </button>
            <button
              onClick={() => setActiveTab('def')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium transition-all"
              style={activeTab === 'def' ? { backgroundColor: '#ef4444', color: '#ffffff' } : { backgroundColor: '#334155', color: '#94a3b8', border: '1px solid #475569' }}
            >
              <span>🛡️</span> DEF (6)
            </button>
          </div>

          {/* Linha 1: Radar + Evolucao */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Radar Chart */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5" style={{ color: activeTab === 'geral' ? '#8b5cf6' : activeTab === 'cbf' ? '#f59e0b' : activeTab === 'ofe' ? '#22c55e' : '#ef4444' }} />
                <h3 className="text-lg font-semibold text-slate-100">
                  Radar {activeTab === 'geral' ? 'Geral' : activeTab === 'cbf' ? 'CBF' : activeTab === 'ofe' ? 'Ofensivo' : 'Defensivo'}
                </h3>
              </div>
              <div className="h-[280px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
              {avaliacaoSelecionada && (
                <p className="text-xs text-slate-400 text-center mt-2">
                  Avaliacao de {new Date(avaliacaoSelecionada.data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            {/* Grafico de Evolucao */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-slate-100">Evolucao</h3>
                  <span className="text-xs text-slate-500">(1a vs ultima avaliacao)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: '#22c55e' }} />
                    <span className="text-slate-400">Melhorou</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: '#64748b' }} />
                    <span className="text-slate-400">Igual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: '#ef4444' }} />
                    <span className="text-slate-400">Piorou</span>
                  </div>
                </div>
              </div>

              {avaliacoes.length < 2 ? (
                <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">
                  Necessario pelo menos 2 avaliacoes para comparar evolucao
                </div>
              ) : (
                <div className="h-[240px]">
                  <Bar data={evolucaoBarData} options={evolucaoBarOptions as object} />
                </div>
              )}
            </div>
          </div>

          {/* Linha 2: Resumo (3 cards) e Destaques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Coluna 1: 3 cards empilhados */}
            <div className="flex flex-col gap-3">
              {/* Card 1: Medias */}
              <div className="flex-1 rounded-2xl p-4 shadow-sm flex items-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                {mediaPorGrupo && (
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-violet-500" />
                      <h3 className="text-lg font-semibold text-slate-100">Medias</h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-6">
                      <div className="flex flex-col items-center">
                        <div className="relative" style={{ width: 44, height: 44 }}>
                          <svg className="-rotate-90" width="44" height="44" viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="18" stroke="#334155" strokeWidth="3" fill="none" />
                            <circle cx="22" cy="22" r="18" stroke="#8b5cf6" strokeWidth="3" fill="none"
                              strokeDasharray={`${(mediaGeral / 5) * 113} 113`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-violet-500">{mediaGeral.toFixed(1)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Geral</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="relative" style={{ width: 44, height: 44 }}>
                          <svg className="-rotate-90" width="44" height="44" viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="18" stroke="#334155" strokeWidth="3" fill="none" />
                            <circle cx="22" cy="22" r="18" stroke="#f59e0b" strokeWidth="3" fill="none"
                              strokeDasharray={`${(mediaPorGrupo.cbf / 5) * 113} 113`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-amber-500">{mediaPorGrupo.cbf.toFixed(1)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">CBF</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="relative" style={{ width: 44, height: 44 }}>
                          <svg className="-rotate-90" width="44" height="44" viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="18" stroke="#334155" strokeWidth="3" fill="none" />
                            <circle cx="22" cy="22" r="18" stroke="#22c55e" strokeWidth="3" fill="none"
                              strokeDasharray={`${(mediaPorGrupo.ofe / 5) * 113} 113`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-green-500">{mediaPorGrupo.ofe.toFixed(1)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">OFE</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="relative" style={{ width: 44, height: 44 }}>
                          <svg className="-rotate-90" width="44" height="44" viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="18" stroke="#334155" strokeWidth="3" fill="none" />
                            <circle cx="22" cy="22" r="18" stroke="#ef4444" strokeWidth="3" fill="none"
                              strokeDasharray={`${(mediaPorGrupo.def / 5) * 113} 113`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-red-500">{mediaPorGrupo.def.toFixed(1)}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">DEF</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Perfil */}
              <div className="flex-1 rounded-2xl p-4 shadow-sm flex items-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                {perfilAtleta && (
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-cyan-500" />
                      <h3 className="text-lg font-semibold text-slate-100">Perfil</h3>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-3 px-4">
                      <div className="w-full flex items-center gap-3">
                        <span className="text-xs font-bold text-green-400">OFE</span>
                        <div className="flex-1 h-7 rounded-full overflow-hidden flex shadow-lg" style={{ backgroundColor: '#1e293b', border: '2px solid #475569' }}>
                          <div
                            className="h-full flex items-center justify-center transition-all duration-500"
                            style={{
                              width: `${perfilAtleta.percentOfe}%`,
                              background: 'linear-gradient(90deg, #10b981 0%, #22c55e 50%, #4ade80 100%)',
                              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 0 10px rgba(34,197,94,0.5)'
                            }}
                          >
                            <span className="text-xs font-bold text-white drop-shadow">{perfilAtleta.ofe.toFixed(1)}</span>
                          </div>
                          <div
                            className="h-full flex items-center justify-center transition-all duration-500"
                            style={{
                              width: `${perfilAtleta.percentDef}%`,
                              background: 'linear-gradient(90deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
                              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 0 10px rgba(239,68,68,0.5)'
                            }}
                          >
                            <span className="text-xs font-bold text-white drop-shadow">{perfilAtleta.def.toFixed(1)}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-red-400">DEF</span>
                      </div>
                      <span className="text-sm font-medium text-slate-100 mt-10">
                        {perfilAtleta.percentOfe > 55 ? '↗️ Atleta Ofensivo' : perfilAtleta.percentDef > 55 ? '🛡️ Atleta Defensivo' : '⚖️ Atleta Equilibrado'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3: Evolucao */}
              <div className="flex-1 rounded-2xl p-4 shadow-sm overflow-hidden" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                {estatisticas ? (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <h3 className="text-lg font-semibold text-slate-100">Evolucao</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div
                        className="flex flex-col items-center p-2 rounded-lg"
                        style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 100%)', border: '1px solid rgba(34,197,94,0.3)' }}
                      >
                        <span className="text-lg font-bold text-green-400">{estatisticas.melhoraram}</span>
                        <span className="text-[9px] text-green-400/70 text-center leading-tight">Melhoraram</span>
                      </div>
                      <div
                        className="flex flex-col items-center p-2 rounded-lg"
                        style={{ background: 'linear-gradient(180deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        <span className="text-lg font-bold text-red-400">{estatisticas.pioraram}</span>
                        <span className="text-[9px] text-red-400/70 text-center leading-tight">Pioraram</span>
                      </div>
                      <div
                        className="flex flex-col items-center p-2 rounded-lg"
                        style={{ background: 'linear-gradient(180deg, rgba(100,116,139,0.2) 0%, rgba(100,116,139,0.05) 100%)', border: '1px solid rgba(100,116,139,0.3)' }}
                      >
                        <span className="text-lg font-bold text-slate-400">{estatisticas.estagnaram}</span>
                        <span className="text-[9px] text-slate-400/70 text-center leading-tight">Estaveis</span>
                      </div>
                      <div
                        className="flex flex-col items-center p-2 rounded-lg"
                        style={{
                          background: estatisticas.mediaUltima >= estatisticas.mediaPrimeira
                            ? 'linear-gradient(180deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)'
                            : 'linear-gradient(180deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)',
                          border: estatisticas.mediaUltima >= estatisticas.mediaPrimeira
                            ? '1px solid rgba(245,158,11,0.3)'
                            : '1px solid rgba(239,68,68,0.3)'
                        }}
                      >
                        <span className={`text-lg font-bold ${estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? 'text-amber-400' : 'text-red-400'}`}>
                          {estatisticas.mediaPrimeira > 0 ? (estatisticas.mediaUltima >= estatisticas.mediaPrimeira ? '+' : '') + (((estatisticas.mediaUltima - estatisticas.mediaPrimeira) / estatisticas.mediaPrimeira) * 100).toFixed(0) : 0}%
                        </span>
                        <span className="text-[9px] text-slate-400 text-center leading-tight">Evolucao</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <h3 className="text-lg font-semibold text-slate-100">Evolucao</h3>
                    </div>
                    <span className="flex-1 text-center text-xs text-slate-500">Necessario 2+ avaliacoes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna 2: Destaques */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-slate-100">Destaques</h3>
              </div>
              {maioresEvolucoes && avaliacoes.length >= 2 ? (
                <div className="space-y-4">
                  {/* Top 3 Evolucao */}
                  <div>
                    <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                      <span>↑</span> Maiores Evolucoes
                    </p>
                    <div className="space-y-1.5">
                      {maioresEvolucoes.slice(0, 3).map((d, idx) => (
                        <div
                          key={d.key}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: '#22c55e', color: '#fff' }}
                          >
                            {idx + 1}
                          </div>
                          <span className="text-sm text-slate-200 flex-1 truncate">{d.label}</span>
                          <span className="text-xs text-slate-500">{d.primeira.toFixed(1)}→{d.ultima.toFixed(1)}</span>
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                            +{d.evolucao.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top 3 Queda */}
                  <div>
                    <p className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1">
                      <span>↓</span> Pontos de Atencao
                    </p>
                    <div className="space-y-1.5">
                      {maioresEvolucoes.slice(-3).reverse().filter(d => d.evolucao <= 0 || maioresEvolucoes.indexOf(d) >= maioresEvolucoes.length - 3).map((d, idx) => (
                        <div
                          key={d.key}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ backgroundColor: d.evolucao < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)' }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: d.evolucao < 0 ? '#ef4444' : '#64748b', color: '#fff' }}
                          >
                            {idx + 1}
                          </div>
                          <span className="text-sm text-slate-200 flex-1 truncate">{d.label}</span>
                          <span className="text-xs text-slate-500">{d.primeira.toFixed(1)}→{d.ultima.toFixed(1)}</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${d.evolucao < 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
                            {d.evolucao > 0 ? '+' : ''}{d.evolucao.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Necessario pelo menos 2 avaliacoes</p>
                </div>
              )}
            </div>
          </div>

          {/* Estatisticas de Jogo - Minutagem, Gols e Assistencias */}
          {(minutosData.total > 0 || golsAssistencias.gols > 0 || golsAssistencias.assistencias > 0) && (
            <div className="rounded-2xl p-6 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Estatisticas de Jogo</h3>
                    <p className="text-xs text-slate-400">Minutagem, gols e assistencias</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Gols */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: '#0f172a', border: '1px solid #22c55e40' }}>
                    <span className="text-xl">⚽</span>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-500">{golsAssistencias.gols}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Gols</p>
                    </div>
                  </div>
                  {/* Assistencias */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: '#0f172a', border: '1px solid #3b82f640' }}>
                    <span className="text-xl">🎯</span>
                    <div className="text-center">
                      <p className="text-2xl font-black text-blue-500">{golsAssistencias.assistencias}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Assist.</p>
                    </div>
                  </div>
                  {/* Minutagem */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b40' }}>
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-500">{minutosData.total}&apos;</p>
                      <p className="text-[10px] text-slate-400 uppercase">{minutosData.jogos} jogos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graficos lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Grafico de Minutagem */}
                {minutagemChartData && minutosData.total > 0 && (
                  <div>
                    <p className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Minutagem por Jogo
                    </p>
                    <div style={{ height: '160px' }}>
                      <Line
                        data={minutagemChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              min: 0,
                              max: 120,
                              ticks: {
                                stepSize: 30,
                                color: '#94a3b8',
                                callback: (value) => `${value}'`
                              },
                              grid: { color: 'rgba(71, 85, 105, 0.3)' }
                            },
                            x: {
                              ticks: { color: '#e2e8f0', font: { size: 10 } },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: '#0f172a',
                              titleColor: '#f59e0b',
                              bodyColor: '#ffffff',
                              borderColor: '#f59e0b',
                              borderWidth: 1,
                              padding: 12,
                              displayColors: false,
                              callbacks: {
                                title: (items) => `📅 ${items[0]?.label || ''}`,
                                label: (ctx) => `⏱️ ${ctx.raw} minutos jogados`
                              }
                            }
                          },
                          elements: {
                            point: {
                              radius: 5,
                              hoverRadius: 8,
                              backgroundColor: '#f59e0b',
                              borderColor: '#1e293b',
                              borderWidth: 2
                            },
                            line: {
                              borderWidth: 3,
                              tension: 0.3
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Grafico de Gols e Assistencias */}
                {golsAssistenciasChartData && (
                  <div>
                    <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                      ⚽ Gols e Assistencias por Jogo
                    </p>
                    <div style={{ height: '160px' }}>
                      <Bar
                        data={golsAssistenciasChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              min: 0,
                              ticks: {
                                stepSize: 1,
                                color: '#94a3b8'
                              },
                              grid: { color: 'rgba(71, 85, 105, 0.3)' }
                            },
                            x: {
                              ticks: { color: '#e2e8f0', font: { size: 10 } },
                              grid: { display: false }
                            }
                          },
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top' as const,
                              labels: {
                                color: '#e2e8f0',
                                boxWidth: 12,
                                padding: 8,
                                font: { size: 10 }
                              }
                            },
                            tooltip: {
                              backgroundColor: '#0f172a',
                              titleColor: '#22c55e',
                              bodyColor: '#ffffff',
                              borderColor: '#22c55e',
                              borderWidth: 1,
                              padding: 12
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detalhes da Avaliacao */}
          {avaliacoes.length > 0 && (
            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Detalhes da Avaliacao</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Data:</span>
                  <select
                    value={avaliacaoIndex}
                    onChange={(e) => setAvaliacaoIndex(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
                  >
                    <option value={-1}>
                      {new Date(avaliacoes[avaliacoes.length - 1].data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')} (Ultima)
                    </option>
                    {avaliacoes.slice(0, -1).reverse().map((av, idx) => {
                      const realIndex = avaliacoes.length - 2 - idx
                      return (
                        <option key={av.id} value={realIndex}>
                          {new Date(av.data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </option>
                      )
                    })}
                  </select>
                  {avaliacoes.length > 1 && (
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => setAvaliacaoIndex(prev => {
                          const currentIdx = prev === -1 ? avaliacoes.length - 1 : prev
                          return currentIdx > 0 ? currentIdx - 1 : currentIdx
                        })}
                        disabled={avaliacaoIndex === 0}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                        style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
                        title="Avaliacao anterior"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setAvaliacaoIndex(prev => {
                          const currentIdx = prev === -1 ? avaliacoes.length - 1 : prev
                          return currentIdx < avaliacoes.length - 1 ? currentIdx + 1 : -1
                        })}
                        disabled={avaliacaoIndex === -1}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                        style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
                        title="Proxima avaliacao"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {avaliacaoSelecionada && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {avaliacaoSelecionada.pontos_fortes && (
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-2">Pontos Fortes</h4>
                      <p className="text-sm text-slate-300 bg-green-900/30 p-3 rounded-xl border border-green-800/50">
                        {avaliacaoSelecionada.pontos_fortes}
                      </p>
                    </div>
                  )}
                  {avaliacaoSelecionada.pontos_desenvolver && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Pontos a Desenvolver</h4>
                      <p className="text-sm text-slate-300 bg-orange-900/30 p-3 rounded-xl border border-orange-800/50">
                        {avaliacaoSelecionada.pontos_desenvolver}
                      </p>
                    </div>
                  )}
                  {avaliacaoSelecionada.observacoes && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-400 mb-2">Observacoes</h4>
                      <p className="text-sm text-slate-300 bg-blue-900/30 p-3 rounded-xl border border-blue-800/50">
                        {avaliacaoSelecionada.observacoes}
                      </p>
                    </div>
                  )}
                  {!avaliacaoSelecionada.pontos_fortes && !avaliacaoSelecionada.pontos_desenvolver && !avaliacaoSelecionada.observacoes && (
                    <div className="col-span-full text-center py-4">
                      <p className="text-slate-500">Nenhuma observacao registrada nesta avaliacao</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
