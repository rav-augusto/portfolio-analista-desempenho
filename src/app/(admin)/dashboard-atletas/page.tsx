'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, TrendingUp, Scale, Ruler, Star, BarChart3, Trophy, Search, Clock } from 'lucide-react'
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
  { key: 'forca', label: 'Força', shortLabel: 'FOR', color: '#ef4444' },
  { key: 'velocidade', label: 'Velocidade', shortLabel: 'VEL', color: '#f97316' },
  { key: 'tecnica', label: 'Técnica', shortLabel: 'TEC', color: '#eab308' },
  { key: 'dinamica', label: 'Dinâmica', shortLabel: 'DIN', color: '#22c55e' },
  { key: 'inteligencia', label: 'Inteligência', shortLabel: 'INT', color: '#06b6d4' },
  { key: 'um_contra_um', label: '1 contra 1', shortLabel: '1x1', color: '#3b82f6' },
  { key: 'atitude', label: 'Atitude', shortLabel: 'ATI', color: '#8b5cf6' },
  { key: 'potencial', label: 'Potencial', shortLabel: 'POT', color: '#ec4899' }
]

// Dimensoes Ofensivas
const dimensoesOFE = [
  { key: 'penetracao', label: 'Penetração', shortLabel: 'PEN', color: '#10b981' },
  { key: 'cobertura_ofensiva', label: 'Cob. Ofensiva', shortLabel: 'COB', color: '#14b8a6' },
  { key: 'espaco_com_bola', label: 'Espaço c/ Bola', shortLabel: 'ECB', color: '#06b6d4' },
  { key: 'espaco_sem_bola', label: 'Espaço s/ Bola', shortLabel: 'ESB', color: '#0ea5e9' },
  { key: 'mobilidade', label: 'Mobilidade', shortLabel: 'MOB', color: '#3b82f6' },
  { key: 'unidade_ofensiva', label: 'Unid. Ofensiva', shortLabel: 'UNI', color: '#6366f1' }
]

// Dimensoes Defensivas
const dimensoesDEF = [
  { key: 'contencao', label: 'Contenção', shortLabel: 'CON', color: '#dc2626' },
  { key: 'cobertura_defensiva', label: 'Cob. Defensiva', shortLabel: 'CBD', color: '#ea580c' },
  { key: 'equilibrio_recuperacao', label: 'Equil. Recup.', shortLabel: 'EQR', color: '#d97706' },
  { key: 'equilibrio_defensivo', label: 'Equil. Def.', shortLabel: 'EQD', color: '#ca8a04' },
  { key: 'concentracao_def', label: 'Concentração', shortLabel: 'CNC', color: '#65a30d' },
  { key: 'unidade_defensiva', label: 'Unid. Defensiva', shortLabel: 'UND', color: '#16a34a' }
]

// Todas as dimensoes
const todasDimensoes = [...dimensoesCBF, ...dimensoesOFE, ...dimensoesDEF]

export default function DashboardAtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [atletaSelecionado, setAtletaSelecionado] = useState<string>('')
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'geral' | 'cbf' | 'ofe' | 'def'>('geral')
  const [avaliacaoIndex, setAvaliacaoIndex] = useState<number>(-1) // -1 = última
  const [modeloComparativo, setModeloComparativo] = useState<1 | 2 | 3 | 4>(1)
  const [dimensoesVisiveis, setDimensoesVisiveis] = useState<string[]>(dimensoesCBF.map(d => d.key)) // Começa com CBF
  const supabase = createClient()

  // Dimensoes ativas baseadas na tab
  const dimensoesAtivas = activeTab === 'geral' ? todasDimensoes : activeTab === 'cbf' ? dimensoesCBF : activeTab === 'ofe' ? dimensoesOFE : dimensoesDEF

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

  // Carregar avaliações do atleta selecionado
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

  // Avaliacao selecionada (última por padrão)
  const avaliacaoSelecionada = useMemo(() => {
    if (avaliacoes.length === 0) return null
    if (avaliacaoIndex === -1 || avaliacaoIndex >= avaliacoes.length) {
      return avaliacoes[avaliacoes.length - 1]
    }
    return avaliacoes[avaliacaoIndex]
  }, [avaliacoes, avaliacaoIndex])

  // Reset index quando muda de atleta
  useEffect(() => {
    setAvaliacaoIndex(-1)
  }, [atletaSelecionado])

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

  // Total de gols e assistências
  const golsAssistencias = useMemo(() => {
    const totalGols = avaliacoes.reduce((acc, a) => acc + (a.gols || 0), 0)
    const totalAssistencias = avaliacoes.reduce((acc, a) => acc + (a.assistencias || 0), 0)
    return { gols: totalGols, assistencias: totalAssistencias }
  }, [avaliacoes])

  // Dados do gráfico de minutagem
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

  // Dados do gráfico de gols e assistências
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
          label: 'Assistências',
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
          label: 'Última Avaliação',
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

  // Estilos de linha para diferenciar linhas sobrepostas
  const lineStyles = [
    { borderDash: [], pointStyle: 'circle' as const },
    { borderDash: [5, 5], pointStyle: 'rect' as const },
    { borderDash: [2, 2], pointStyle: 'triangle' as const },
    { borderDash: [10, 5], pointStyle: 'rectRot' as const },
    { borderDash: [], pointStyle: 'cross' as const },
    { borderDash: [5, 5], pointStyle: 'star' as const },
    { borderDash: [2, 2], pointStyle: 'crossRot' as const },
    { borderDash: [10, 5], pointStyle: 'dash' as const },
  ]

  // Dados do grafico de evolucao (filtrado por dimensoesVisiveis)
  const evolucaoData = useMemo(() => {
    if (avaliacoes.length === 0) {
      return { labels: [], datasets: [] }
    }

    const labels = avaliacoes.map(a => {
      const date = new Date(a.data_avaliacao + 'T12:00:00')
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    })

    // Filtrar apenas as dimensões visíveis
    const dimensoesFiltradas = todasDimensoes.filter(d => dimensoesVisiveis.includes(d.key))

    return {
      labels,
      datasets: dimensoesFiltradas.map((d, index) => ({
        label: d.label,
        data: avaliacoes.map(a => a[d.key as keyof Avaliacao] as number || 0),
        borderColor: d.color,
        backgroundColor: d.color + '20',
        tension: 0.3,
        fill: false,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: d.color,
        pointBorderColor: '#1e293b',
        pointBorderWidth: 1,
        ...lineStyles[index % lineStyles.length]
      }))
    }
  }, [avaliacoes, dimensoesVisiveis])

  // Dados do grafico de media por dimensao
  const mediaPorDimensaoData = useMemo(() => {
    if (avaliacoes.length === 0) {
      return { labels: [], datasets: [] }
    }

    const medias = dimensoesAtivas.map(d => {
      const valores = avaliacoes.map(a => a[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)
      if (valores.length === 0) return 0
      return valores.reduce((a, b) => a + b, 0) / valores.length
    })

    return {
      labels: dimensoesAtivas.map(d => d.shortLabel),
      datasets: [
        {
          label: 'Media',
          data: medias,
          backgroundColor: dimensoesAtivas.map(d => d.color + '80'),
          borderColor: dimensoesAtivas.map(d => d.color),
          borderWidth: 2
        }
      ]
    }
  }, [avaliacoes, dimensoesAtivas])

  // Dados comparativo primeira vs última avaliação
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

  // Maiores evoluções (ordenadas)
  const maioresEvolucoes = useMemo(() => {
    if (!comparativoData) return null
    return [...comparativoData]
      .filter(d => d.primeira > 0 || d.ultima > 0)
      .sort((a, b) => b.evolucao - a.evolucao)
  }, [comparativoData])

  // Dados do gráfico de barras de evolução (estilo momento de ataque)
  const evolucaoBarData = useMemo(() => {
    if (!comparativoData || avaliacoes.length < 2) {
      return { labels: [], datasets: [] }
    }

    const dados = comparativoData.filter(d => d.primeira > 0 || d.ultima > 0)

    const getColor = (evolucao: number) => {
      if (evolucao > 0) return 'rgba(34, 197, 94, 0.8)' // verde
      if (evolucao < 0) return 'rgba(239, 68, 68, 0.8)' // vermelho
      return 'rgba(100, 116, 139, 0.8)' // cinza para igual
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
          label: 'Evolução',
          data: dados.map(d => d.evolucao === 0 ? 0.15 : d.evolucao), // mostra barra pequena se igual
          backgroundColor: dados.map(d => getColor(d.evolucao)),
          borderColor: dados.map(d => getBorderColor(d.evolucao)),
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    }
  }, [comparativoData, avaliacoes])

  // Opções do gráfico de barras de evolução
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

  // Modelo 1: Média por grupo (CBF, OFE, DEF)
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

  // Modelo 2: Radar antes vs depois
  const radarAntesDepois = useMemo(() => {
    if (avaliacoes.length < 2) return null
    const primeira = avaliacoes[0]
    const ultima = avaliacoes[avaliacoes.length - 1]

    return {
      labels: dimensoesCBF.map(d => d.shortLabel),
      datasets: [
        {
          label: 'Primeira',
          data: dimensoesCBF.map(d => primeira[d.key as keyof Avaliacao] as number || 0),
          backgroundColor: 'rgba(100, 116, 139, 0.2)',
          borderColor: '#64748b',
          borderWidth: 2,
          pointBackgroundColor: '#64748b'
        },
        {
          label: 'Última',
          data: dimensoesCBF.map(d => ultima[d.key as keyof Avaliacao] as number || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: '#22c55e',
          borderWidth: 2,
          pointBackgroundColor: '#22c55e'
        }
      ]
    }
  }, [avaliacoes])

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

  // Modelo 4: Estatísticas gerais
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

  // Filtrar atletas
  const atletasFiltrados = useMemo(() => {
    if (!search) return atletas
    return atletas.filter(a =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.posicao?.toLowerCase().includes(search.toLowerCase()) ||
      getClubeName(a.clubes).toLowerCase().includes(search.toLowerCase())
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

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { display: false }
      },
      x: {
        ticks: { color: '#e2e8f0' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  // Funções para selecionar/desmarcar grupos de dimensões
  const toggleGrupo = (grupo: 'cbf' | 'ofe' | 'def' | 'todas') => {
    if (grupo === 'todas') {
      if (dimensoesVisiveis.length === todasDimensoes.length) {
        setDimensoesVisiveis([])
      } else {
        setDimensoesVisiveis(todasDimensoes.map(d => d.key))
      }
      return
    }

    const dimensoesGrupo = grupo === 'cbf' ? dimensoesCBF : grupo === 'ofe' ? dimensoesOFE : dimensoesDEF
    const keysGrupo = dimensoesGrupo.map(d => d.key)
    const todasSelecionadas = keysGrupo.every(k => dimensoesVisiveis.includes(k))

    if (todasSelecionadas) {
      setDimensoesVisiveis(prev => prev.filter(k => !keysGrupo.includes(k)))
    } else {
      setDimensoesVisiveis(prev => [...new Set([...prev, ...keysGrupo])])
    }
  }

  const toggleDimensao = (key: string) => {
    setDimensoesVisiveis(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { display: false }
      },
      x: {
        ticks: { color: '#e2e8f0', font: { size: 10 } },
        grid: { display: false }
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
          <p className="text-slate-400 mt-1">Acompanhe a evolução dos atletas</p>
        </div>
        <Link
          href="/avaliacoes/nova"
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <Star className="w-5 h-5" />
          Nova Avaliação
        </Link>
      </div>

      {/* Filtro de Atleta */}
      <div className="rounded-2xl p-4 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar atleta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-xl focus:outline-none"
                style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>
          <div className="flex-1">
            <select
              value={atletaSelecionado}
              onChange={(e) => setAtletaSelecionado(e.target.value)}
              className="w-full px-4 py-2 rounded-xl focus:outline-none"
              style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
            >
              <option value="">Selecione um atleta</option>
              {atletasFiltrados.map((atleta) => (
                <option key={atleta.id} value={atleta.id}>
                  {atleta.nome} {atleta.posicao && `- ${atleta.posicao}`} {getClubeName(atleta.clubes) && `(${getClubeName(atleta.clubes)})`}
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
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Escolha um atleta no filtro acima para acompanhar sua evolução completa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">⚽</span>
              </div>
              <p className="text-sm font-medium text-slate-200">8 Dimensões CBF</p>
              <p className="text-xs text-slate-500">Força, Velocidade, Técnica...</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">↗️</span>
              </div>
              <p className="text-sm font-medium text-slate-200">6 Dimensões Ofensivas</p>
              <p className="text-xs text-slate-500">Penetração, Mobilidade...</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🛡️</span>
              </div>
              <p className="text-sm font-medium text-slate-200">6 Dimensões Defensivas</p>
              <p className="text-xs text-slate-500">Contenção, Equilíbrio...</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            Visualize gráficos radar, evolução ao longo do tempo e média geral do atleta
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
            <div className="rounded-2xl p-6 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <div className="flex items-center gap-6">
                {/* Foto */}
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {atletaAtual.foto_url ? (
                    <img src={atletaAtual.foto_url} alt={atletaAtual.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-12 h-12 text-slate-500" />
                  )}
                </div>

                {/* Nome e Info */}
                <div className="flex-shrink-0">
                  <h2 className="text-2xl font-bold text-slate-100">{atletaAtual.nome}</h2>
                  <p className="text-slate-400">
                    {atletaAtual.posicao || 'Posição não informada'}
                    {getClubeName(atletaAtual.clubes) && ` - ${getClubeName(atletaAtual.clubes)}`}
                  </p>
                </div>

                {/* Indicador de Evolução */}
                {avaliacoes.length >= 2 && estatisticas && (
                  <div
                    className="flex flex-col items-center justify-center px-4 py-2 rounded-xl"
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
                      {estatisticas.mediaUltima > estatisticas.mediaPrimeira ? 'Evoluindo' : estatisticas.mediaUltima < estatisticas.mediaPrimeira ? 'Em Queda' : 'Estável'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {avaliacoes.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-700 text-center">
              <BarChart3 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhuma Avaliação</h3>
              <p className="text-slate-400 mb-4">Este atleta ainda não possui avaliações registradas.</p>
              <Link
                href="/avaliacoes/nova"
                className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors"
              >
                <Star className="w-5 h-5" />
                Criar Primeira Avaliação
              </Link>
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

              {/* Linha 1: Radar + Evolução ao Longo do Tempo */}
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
                      Avaliação de {new Date(avaliacaoSelecionada.data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Grafico de Evolução (Barras - estilo momento de ataque) */}
                <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <h3 className="text-lg font-semibold text-slate-100">Evolução</h3>
                      <span className="text-xs text-slate-500">(1ª vs última avaliação)</span>
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
                      Necessário pelo menos 2 avaliações para comparar evolução
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
                  {/* Card 1: Médias */}
                  <div className="flex-1 rounded-2xl p-4 shadow-sm flex items-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    {mediaPorGrupo && (
                      <div className="flex items-center w-full">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-violet-500" />
                          <h3 className="text-lg font-semibold text-slate-100">Médias</h3>
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

                  {/* Card 3: Evolução */}
                  <div className="flex-1 rounded-2xl p-4 shadow-sm overflow-hidden" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                    {estatisticas ? (
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-5 h-5 text-amber-500" />
                          <h3 className="text-lg font-semibold text-slate-100">Evolução</h3>
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
                            <span className="text-[9px] text-slate-400/70 text-center leading-tight">Estáveis</span>
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
                            <span className="text-[9px] text-slate-400 text-center leading-tight">Evolução</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center w-full">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-500" />
                          <h3 className="text-lg font-semibold text-slate-100">Evolução</h3>
                        </div>
                        <span className="flex-1 text-center text-xs text-slate-500">Necessário 2+ avaliações</span>
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
                      {/* Top 3 Evolução */}
                      <div>
                        <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                          <span>↑</span> Maiores Evoluções
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
                          <span>↓</span> Pontos de Atenção
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
                      <p className="text-slate-500 text-sm">Necessário pelo menos 2 avaliações</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estatísticas de Jogo - Minutagem, Gols e Assistências */}
              {(minutosData.total > 0 || golsAssistencias.gols > 0 || golsAssistencias.assistencias > 0) && (
                <div className="rounded-2xl p-6 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">Estatísticas de Jogo</h3>
                        <p className="text-xs text-slate-400">Minutagem, gols e assistências</p>
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
                      {/* Assistências */}
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

                  {/* Gráficos lado a lado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gráfico de Minutagem */}
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

                    {/* Gráfico de Gols e Assistências */}
                    {golsAssistenciasChartData && (
                      <div>
                        <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                          ⚽ Gols e Assistências por Jogo
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

              {/* Detalhes da Avaliação */}
              {avaliacoes.length > 0 && (
                <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-slate-100">Detalhes da Avaliação</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Data:</span>
                      <select
                        value={avaliacaoIndex}
                        onChange={(e) => setAvaliacaoIndex(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                        style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
                      >
                        <option value={-1}>
                          {new Date(avaliacoes[avaliacoes.length - 1].data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')} (Última)
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
                            title="Avaliação anterior"
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
                            title="Próxima avaliação"
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
                          <h4 className="text-sm font-medium text-blue-400 mb-2">Observações</h4>
                          <p className="text-sm text-slate-300 bg-blue-900/30 p-3 rounded-xl border border-blue-800/50">
                            {avaliacaoSelecionada.observacoes}
                          </p>
                        </div>
                      )}
                      {!avaliacaoSelecionada.pontos_fortes && !avaliacaoSelecionada.pontos_desenvolver && !avaliacaoSelecionada.observacoes && (
                        <div className="col-span-full text-center py-4">
                          <p className="text-slate-500">Nenhuma observação registrada nesta avaliação</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
