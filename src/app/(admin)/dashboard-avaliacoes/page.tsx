'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Star, TrendingUp, BarChart3, Target, UserPlus, RefreshCw, Calendar, ArrowUp, ArrowDown, Minus, MessageSquare } from 'lucide-react'
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


type BenchmarkValuesCBF = {
  forca: number
  velocidade: number
  tecnica: number
  dinamica: number
  inteligencia: number
  um_contra_um: number
  atitude: number
  potencial: number
}

type BenchmarkValuesOFE = {
  penetracao: number
  cobertura_ofensiva: number
  espaco_com_bola: number
  espaco_sem_bola: number
  mobilidade: number
  unidade_ofensiva: number
}

type BenchmarkValuesDEF = {
  contencao: number
  cobertura_defensiva: number
  equilibrio_recuperacao: number
  equilibrio_defensivo: number
  concentracao_def: number
  unidade_defensiva: number
}

type AtletaExterno = {
  nome: string
  posicao: string
  valoresCBF: BenchmarkValuesCBF
  valoresOFE: BenchmarkValuesOFE
  valoresDEF: BenchmarkValuesDEF
}

const dimensoesCBF = [
  { key: 'forca', label: 'Forca', shortLabel: 'FOR', color: '#ef4444', icon: '💪' },
  { key: 'velocidade', label: 'Velocidade', shortLabel: 'VEL', color: '#f97316', icon: '⚡' },
  { key: 'tecnica', label: 'Tecnica', shortLabel: 'TEC', color: '#eab308', icon: '🎯' },
  { key: 'dinamica', label: 'Dinamica', shortLabel: 'DIN', color: '#22c55e', icon: '🔄' },
  { key: 'inteligencia', label: 'Inteligencia', shortLabel: 'INT', color: '#06b6d4', icon: '🧠' },
  { key: 'um_contra_um', label: '1 contra 1', shortLabel: '1v1', color: '#3b82f6', icon: '⚔️' },
  { key: 'atitude', label: 'Atitude', shortLabel: 'ATI', color: '#8b5cf6', icon: '🔥' },
  { key: 'potencial', label: 'Potencial', shortLabel: 'POT', color: '#ec4899', icon: '⭐' }
]

const dimensoesOFE = [
  { key: 'penetracao', label: 'Penetracao', shortLabel: 'PEN', color: '#22c55e', icon: '↗️' },
  { key: 'cobertura_ofensiva', label: 'Cobertura Ofensiva', shortLabel: 'COF', color: '#22c55e', icon: '🔗' },
  { key: 'espaco_com_bola', label: 'Espaco c/ Bola', shortLabel: 'ECB', color: '#22c55e', icon: '⚽' },
  { key: 'espaco_sem_bola', label: 'Espaco s/ Bola', shortLabel: 'ESB', color: '#22c55e', icon: '👟' },
  { key: 'mobilidade', label: 'Mobilidade', shortLabel: 'MOB', color: '#22c55e', icon: '🏃' },
  { key: 'unidade_ofensiva', label: 'Unidade Ofensiva', shortLabel: 'UOF', color: '#22c55e', icon: '🎯' }
]

const dimensoesDEF = [
  { key: 'contencao', label: 'Contencao', shortLabel: 'CON', color: '#ef4444', icon: '🛡️' },
  { key: 'cobertura_defensiva', label: 'Cobertura Defensiva', shortLabel: 'CDF', color: '#ef4444', icon: '🔒' },
  { key: 'equilibrio_recuperacao', label: 'Equilibrio Recup.', shortLabel: 'ERE', color: '#ef4444', icon: '⚖️' },
  { key: 'equilibrio_defensivo', label: 'Equilibrio Def.', shortLabel: 'EDF', color: '#ef4444', icon: '🧱' },
  { key: 'concentracao_def', label: 'Concentracao', shortLabel: 'CNC', color: '#ef4444', icon: '🎯' },
  { key: 'unidade_defensiva', label: 'Unidade Defensiva', shortLabel: 'UDF', color: '#ef4444', icon: '🏰' }
]

// Todas as dimensoes combinadas
const dimensoesGeral = [...dimensoesCBF, ...dimensoesOFE, ...dimensoesDEF]

const posicoes = [
  'Goleiro', 'Lateral Direito', 'Lateral Esquerdo', 'Zagueiro', 'Volante',
  'Meio-Campo', 'Meia Atacante', 'Ponta Direita', 'Ponta Esquerda', 'Centroavante', 'Atacante'
]

// Benchmarks de referencia por posicao (valores ideais/esperados)
const benchmarksCBFPorPosicao: Record<string, BenchmarkValuesCBF> = {
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

const benchmarksOFEPorPosicao: Record<string, BenchmarkValuesOFE> = {
  'Goleiro': { penetracao: 2.0, cobertura_ofensiva: 2.5, espaco_com_bola: 3.0, espaco_sem_bola: 2.0, mobilidade: 2.0, unidade_ofensiva: 3.0 },
  'Lateral Direito': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 3.5, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 3.5 },
  'Lateral Esquerdo': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 3.5, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 3.5 },
  'Zagueiro': { penetracao: 2.5, cobertura_ofensiva: 3.0, espaco_com_bola: 3.0, espaco_sem_bola: 2.5, mobilidade: 2.5, unidade_ofensiva: 3.5 },
  'Volante': { penetracao: 3.0, cobertura_ofensiva: 4.0, espaco_com_bola: 3.5, espaco_sem_bola: 3.5, mobilidade: 3.0, unidade_ofensiva: 4.0 },
  'Meio-Campo': { penetracao: 3.5, cobertura_ofensiva: 4.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.0, mobilidade: 3.5, unidade_ofensiva: 4.5 },
  'Meia Atacante': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 4.5, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 4.0 },
  'Ponta Direita': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.5, mobilidade: 4.5, unidade_ofensiva: 3.5 },
  'Ponta Esquerda': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.5, mobilidade: 4.5, unidade_ofensiva: 3.5 },
  'Centroavante': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 3.5, espaco_sem_bola: 4.0, mobilidade: 4.5, unidade_ofensiva: 3.5 },
  'Atacante': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.5, mobilidade: 4.5, unidade_ofensiva: 3.5 }
}

const benchmarksDEFPorPosicao: Record<string, BenchmarkValuesDEF> = {
  'Goleiro': { contencao: 4.0, cobertura_defensiva: 4.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 4.0, concentracao_def: 4.5, unidade_defensiva: 4.0 },
  'Lateral Direito': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 3.5 },
  'Lateral Esquerdo': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 3.5 },
  'Zagueiro': { contencao: 4.5, cobertura_defensiva: 4.5, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 4.5, concentracao_def: 4.5, unidade_defensiva: 4.5 },
  'Volante': { contencao: 4.0, cobertura_defensiva: 4.0, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 4.0, concentracao_def: 4.0, unidade_defensiva: 4.5 },
  'Meio-Campo': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 4.0 },
  'Meia Atacante': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.5 },
  'Ponta Direita': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'Ponta Esquerda': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'Centroavante': { contencao: 3.0, cobertura_defensiva: 2.5, equilibrio_recuperacao: 3.0, equilibrio_defensivo: 2.5, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'Atacante': { contencao: 3.0, cobertura_defensiva: 2.5, equilibrio_recuperacao: 3.0, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 }
}

const defaultBenchmarkCBF: BenchmarkValuesCBF = { forca: 3.5, velocidade: 3.5, tecnica: 3.5, dinamica: 3.5, inteligencia: 3.5, um_contra_um: 3.5, atitude: 3.5, potencial: 3.5 }
const defaultBenchmarkOFE: BenchmarkValuesOFE = { penetracao: 3.5, cobertura_ofensiva: 3.5, espaco_com_bola: 3.5, espaco_sem_bola: 3.5, mobilidade: 3.5, unidade_ofensiva: 3.5 }
const defaultBenchmarkDEF: BenchmarkValuesDEF = { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 3.5 }

const calcularMediaBenchmarkCBF = (b: BenchmarkValuesCBF) => {
  return Object.values(b).reduce((a, v) => a + v, 0) / Object.values(b).length
}

const calcularMediaBenchmarkOFE = (b: BenchmarkValuesOFE) => {
  return Object.values(b).reduce((a, v) => a + v, 0) / Object.values(b).length
}

const calcularMediaBenchmarkDEF = (b: BenchmarkValuesDEF) => {
  return Object.values(b).reduce((a, v) => a + v, 0) / Object.values(b).length
}

const calcularMediaCBF = (a: Avaliacao) => {
  const valores = dimensoesCBF.map(d => a[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)
  return valores.length > 0 ? valores.reduce((acc, v) => acc + v, 0) / valores.length : 0
}

const calcularMediaOFE = (a: Avaliacao) => {
  const valores = dimensoesOFE.map(d => a[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)
  return valores.length > 0 ? valores.reduce((acc, v) => acc + v, 0) / valores.length : 0
}

const calcularMediaDEF = (a: Avaliacao) => {
  const valores = dimensoesDEF.map(d => a[d.key as keyof Avaliacao] as number || 0).filter(v => v > 0)
  return valores.length > 0 ? valores.reduce((acc, v) => acc + v, 0) / valores.length : 0
}

const calcularMediaGeral = (a: Avaliacao) => {
  const cbf = calcularMediaCBF(a)
  const ofe = calcularMediaOFE(a)
  const def = calcularMediaDEF(a)
  const count = (cbf > 0 ? 1 : 0) + (ofe > 0 ? 1 : 0) + (def > 0 ? 1 : 0)
  return count > 0 ? (cbf + ofe + def) / count : 0
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
    valoresCBF: { ...defaultBenchmarkCBF },
    valoresOFE: { ...defaultBenchmarkOFE },
    valoresDEF: { ...defaultBenchmarkDEF }
  })
  const [activeTab, setActiveTab] = useState<'geral' | 'cbf' | 'ofe' | 'def'>('geral')
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


  // Benchmarks para a posicao do atleta selecionado
  const benchmarkAtualCBF = useMemo(() => {
    if (!atletaAtual?.atleta?.posicao) return defaultBenchmarkCBF
    return benchmarksCBFPorPosicao[atletaAtual.atleta.posicao] || defaultBenchmarkCBF
  }, [atletaAtual])

  const benchmarkAtualOFE = useMemo(() => {
    if (!atletaAtual?.atleta?.posicao) return defaultBenchmarkOFE
    return benchmarksOFEPorPosicao[atletaAtual.atleta.posicao] || defaultBenchmarkOFE
  }, [atletaAtual])

  const benchmarkAtualDEF = useMemo(() => {
    if (!atletaAtual?.atleta?.posicao) return defaultBenchmarkDEF
    return benchmarksDEFPorPosicao[atletaAtual.atleta.posicao] || defaultBenchmarkDEF
  }, [atletaAtual])

  // Calcular diferenca do atleta em relacao ao benchmark (por categoria)
  const analiseDetalhadaCBF = useMemo(() => {
    if (!atletaAtual) return null

    const analise = dimensoesCBF.map(d => {
      const valorAtleta = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
      const valorBenchmark = benchmarkAtualCBF[d.key as keyof BenchmarkValuesCBF]
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

    const mediaAtleta = calcularMediaCBF(atletaAtual.avaliacao)
    const mediaBenchmark = calcularMediaBenchmarkCBF(benchmarkAtualCBF)

    return { dimensoes: analise, pontosFortes, pontosADesenvolver, mediaAtleta, mediaBenchmark, diferencaMedia: mediaAtleta - mediaBenchmark }
  }, [atletaAtual, benchmarkAtualCBF])

  const analiseDetalhadaOFE = useMemo(() => {
    if (!atletaAtual) return null

    const analise = dimensoesOFE.map(d => {
      const valorAtleta = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
      const valorBenchmark = benchmarkAtualOFE[d.key as keyof BenchmarkValuesOFE]
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

    const mediaAtleta = calcularMediaOFE(atletaAtual.avaliacao)
    const mediaBenchmark = calcularMediaBenchmarkOFE(benchmarkAtualOFE)

    return { dimensoes: analise, pontosFortes, pontosADesenvolver, mediaAtleta, mediaBenchmark, diferencaMedia: mediaAtleta - mediaBenchmark }
  }, [atletaAtual, benchmarkAtualOFE])

  const analiseDetalhadaDEF = useMemo(() => {
    if (!atletaAtual) return null

    const analise = dimensoesDEF.map(d => {
      const valorAtleta = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
      const valorBenchmark = benchmarkAtualDEF[d.key as keyof BenchmarkValuesDEF]
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

    const mediaAtleta = calcularMediaDEF(atletaAtual.avaliacao)
    const mediaBenchmark = calcularMediaBenchmarkDEF(benchmarkAtualDEF)

    return { dimensoes: analise, pontosFortes, pontosADesenvolver, mediaAtleta, mediaBenchmark, diferencaMedia: mediaAtleta - mediaBenchmark }
  }, [atletaAtual, benchmarkAtualDEF])

  // Analise detalhada GERAL (combina todas)
  const analiseDetalhadaGeral = useMemo(() => {
    if (!atletaAtual) return null

    // Funcao para obter benchmark de qualquer dimensao
    const getBenchmarkValue = (key: string) => {
      if (key in benchmarkAtualCBF) return (benchmarkAtualCBF as Record<string, number>)[key]
      if (key in benchmarkAtualOFE) return (benchmarkAtualOFE as Record<string, number>)[key]
      if (key in benchmarkAtualDEF) return (benchmarkAtualDEF as Record<string, number>)[key]
      return 3.5
    }

    const analise = dimensoesGeral.map(d => {
      const valorAtleta = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
      const valorBenchmark = getBenchmarkValue(d.key)
      const diferenca = valorAtleta - valorBenchmark
      return {
        ...d,
        valor: valorAtleta,
        benchmark: valorBenchmark,
        diferenca,
        status: diferenca >= 0.5 ? 'acima' : diferenca <= -0.5 ? 'abaixo' : 'dentro'
      }
    })

    const pontosFortes = analise.filter(a => a.status === 'acima' && a.valor > 0).sort((a, b) => b.diferenca - a.diferenca)
    const pontosADesenvolver = analise.filter(a => a.status === 'abaixo' && a.valor > 0).sort((a, b) => a.diferenca - b.diferenca)

    // Media geral (somente valores preenchidos)
    const valoresPreenchidos = analise.filter(a => a.valor > 0)
    const mediaAtleta = valoresPreenchidos.length > 0 ? valoresPreenchidos.reduce((acc, a) => acc + a.valor, 0) / valoresPreenchidos.length : 0
    const mediaBenchmark = valoresPreenchidos.length > 0 ? valoresPreenchidos.reduce((acc, a) => acc + a.benchmark, 0) / valoresPreenchidos.length : 0

    return { dimensoes: analise, pontosFortes, pontosADesenvolver, mediaAtleta, mediaBenchmark, diferencaMedia: mediaAtleta - mediaBenchmark }
  }, [atletaAtual, benchmarkAtualCBF, benchmarkAtualOFE, benchmarkAtualDEF])

  // Analise atual baseada na tab selecionada
  const analiseDetalhada = activeTab === 'geral' ? analiseDetalhadaGeral : activeTab === 'cbf' ? analiseDetalhadaCBF : activeTab === 'ofe' ? analiseDetalhadaOFE : analiseDetalhadaDEF
  const dimensoesAtivas = activeTab === 'geral' ? dimensoesGeral : activeTab === 'cbf' ? dimensoesCBF : activeTab === 'ofe' ? dimensoesOFE : dimensoesDEF

  // Dados do radar comparativo (baseado na tab ativa)
  const radarData = useMemo(() => {
    const datasets = []
    const dims = activeTab === 'geral' ? dimensoesGeral : activeTab === 'cbf' ? dimensoesCBF : activeTab === 'ofe' ? dimensoesOFE : dimensoesDEF
    const corPrincipal = activeTab === 'geral' ? 'rgba(59, 130, 246, 1)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 1)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
    const corBg = activeTab === 'geral' ? 'rgba(59, 130, 246, 0.2)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 0.2)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'

    // Combinar benchmarks para GERAL
    const getBenchmarkValue = (key: string) => {
      if (key in benchmarkAtualCBF) return (benchmarkAtualCBF as Record<string, number>)[key]
      if (key in benchmarkAtualOFE) return (benchmarkAtualOFE as Record<string, number>)[key]
      if (key in benchmarkAtualDEF) return (benchmarkAtualDEF as Record<string, number>)[key]
      return 3.5
    }

    if (atletaAtual) {
      datasets.push({
        label: atletaAtual.atleta?.nome || 'Atleta',
        data: dims.map(d => atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0),
        backgroundColor: corBg,
        borderColor: corPrincipal,
        borderWidth: 2,
        pointBackgroundColor: corPrincipal
      })

      datasets.push({
        label: `Benchmark (${atletaAtual.atleta?.posicao || 'Geral'})`,
        data: dims.map(d => getBenchmarkValue(d.key)),
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        borderColor: 'rgba(148, 163, 184, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(148, 163, 184, 0.6)'
      })
    }

    if (mostrarAtletaExterno && atletaExterno.nome && activeTab !== 'geral') {
      const externoValores = activeTab === 'cbf' ? atletaExterno.valoresCBF : activeTab === 'ofe' ? atletaExterno.valoresOFE : atletaExterno.valoresDEF
      datasets.push({
        label: atletaExterno.nome,
        data: dims.map(d => (externoValores as Record<string, number>)[d.key]),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)'
      })
    }

    return { labels: dims.map(d => d.shortLabel), datasets }
  }, [atletaAtual, benchmarkAtualCBF, benchmarkAtualOFE, benchmarkAtualDEF, mostrarAtletaExterno, atletaExterno, activeTab])

  // Grafico de barras comparativo (atleta vs benchmark) baseado na tab ativa
  const barComparativoData = useMemo(() => {
    if (!atletaAtual) return { labels: [], datasets: [] }

    const dims = activeTab === 'geral' ? dimensoesGeral : activeTab === 'cbf' ? dimensoesCBF : activeTab === 'ofe' ? dimensoesOFE : dimensoesDEF

    // Funcao para obter benchmark de qualquer dimensao
    const getBenchmarkValue = (key: string) => {
      if (key in benchmarkAtualCBF) return (benchmarkAtualCBF as Record<string, number>)[key]
      if (key in benchmarkAtualOFE) return (benchmarkAtualOFE as Record<string, number>)[key]
      if (key in benchmarkAtualDEF) return (benchmarkAtualDEF as Record<string, number>)[key]
      return 3.5
    }

    return {
      labels: dims.map(d => d.shortLabel),
      datasets: [
        {
          label: 'Atleta',
          data: dims.map(d => atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0),
          backgroundColor: dims.map(d => {
            const valor = atletaAtual.avaliacao[d.key as keyof Avaliacao] as number || 0
            const bench = getBenchmarkValue(d.key)
            if (valor >= bench + 0.5) return 'rgba(34, 197, 94, 0.8)'
            if (valor <= bench - 0.5) return 'rgba(249, 115, 22, 0.8)'
            return 'rgba(59, 130, 246, 0.8)'
          }),
          borderWidth: 0
        },
        {
          label: 'Benchmark',
          data: dims.map(d => getBenchmarkValue(d.key)),
          backgroundColor: 'rgba(100, 116, 139, 0.4)',
          borderWidth: 0
        }
      ]
    }
  }, [atletaAtual, benchmarkAtualCBF, benchmarkAtualOFE, benchmarkAtualDEF, activeTab])

  // Grafico de evolucao (historico) baseado na tab ativa
  const evolucaoData = useMemo(() => {
    if (avaliacoesDoAtleta.length < 2) return null

    const calcFunc = activeTab === 'geral' ? calcularMediaGeral : activeTab === 'cbf' ? calcularMediaCBF : activeTab === 'ofe' ? calcularMediaOFE : calcularMediaDEF
    const cor = activeTab === 'geral' ? 'rgba(59, 130, 246, 1)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 1)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
    const corBg = activeTab === 'geral' ? 'rgba(59, 130, 246, 0.1)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 0.1)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'

    return {
      labels: avaliacoesDoAtleta.map(a => {
        const date = new Date(a.data_avaliacao + 'T12:00:00')
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      }),
      datasets: [
        {
          label: activeTab === 'geral' ? 'Media Geral' : activeTab === 'cbf' ? 'Media CBF' : activeTab === 'ofe' ? 'Media OFE' : 'Media DEF',
          data: avaliacoesDoAtleta.map(a => calcFunc(a)),
          borderColor: cor,
          backgroundColor: corBg,
          tension: 0.3,
          fill: true
        }
      ]
    }
  }, [avaliacoesDoAtleta, activeTab])

  // Media por posicao (visao geral) baseada na tab ativa
  const mediaPorPosicao = useMemo(() => {
    const posicaoMap = new Map<string, number[]>()
    const calcFunc = activeTab === 'geral' ? calcularMediaGeral : activeTab === 'cbf' ? calcularMediaCBF : activeTab === 'ofe' ? calcularMediaOFE : calcularMediaDEF

    // Funcao para calcular benchmark combinado por posicao
    const calcBenchmarkPorPosicao = (posicao: string) => {
      if (activeTab === 'geral') {
        const cbf = calcularMediaBenchmarkCBF(benchmarksCBFPorPosicao[posicao] || defaultBenchmarkCBF)
        const ofe = calcularMediaBenchmarkOFE(benchmarksOFEPorPosicao[posicao] || defaultBenchmarkOFE)
        const def = calcularMediaBenchmarkDEF(benchmarksDEFPorPosicao[posicao] || defaultBenchmarkDEF)
        return (cbf + ofe + def) / 3
      } else if (activeTab === 'cbf') {
        return calcularMediaBenchmarkCBF(benchmarksCBFPorPosicao[posicao] || defaultBenchmarkCBF)
      } else if (activeTab === 'ofe') {
        return calcularMediaBenchmarkOFE(benchmarksOFEPorPosicao[posicao] || defaultBenchmarkOFE)
      } else {
        return calcularMediaBenchmarkDEF(benchmarksDEFPorPosicao[posicao] || defaultBenchmarkDEF)
      }
    }

    atletasComAvaliacao.forEach(({ atleta, avaliacao }) => {
      if (!atleta?.posicao) return
      const media = calcFunc(avaliacao)
      if (media === 0) return // Pular se nao tiver dados
      if (!posicaoMap.has(atleta.posicao)) {
        posicaoMap.set(atleta.posicao, [])
      }
      posicaoMap.get(atleta.posicao)!.push(media)
    })

    return Array.from(posicaoMap.entries()).map(([posicao, medias]) => ({
      posicao,
      media: medias.reduce((a, b) => a + b, 0) / medias.length,
      count: medias.length,
      benchmark: calcBenchmarkPorPosicao(posicao)
    })).sort((a, b) => b.media - a.media)
  }, [atletasComAvaliacao, activeTab])

  const barPosicaoData = useMemo(() => {
    const cor = activeTab === 'geral' ? 'rgba(59, 130, 246, 0.7)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 0.7)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
    const corBorder = activeTab === 'geral' ? 'rgba(59, 130, 246, 1)' : activeTab === 'cbf' ? 'rgba(245, 158, 11, 1)' : activeTab === 'ofe' ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'

    return {
      labels: mediaPorPosicao.map(p => p.posicao),
      datasets: [
        {
          label: 'Media dos Atletas',
          data: mediaPorPosicao.map(p => p.media),
          backgroundColor: cor,
          borderColor: corBorder,
          borderWidth: 1
        },
        {
          label: 'Benchmark',
          data: mediaPorPosicao.map(p => p.benchmark),
          backgroundColor: 'rgba(100, 116, 139, 0.4)',
          borderColor: 'rgba(148, 163, 184, 0.8)',
          borderWidth: 1
        }
      ]
    }
  }, [mediaPorPosicao, activeTab])

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, font: { size: 10 }, color: '#94a3b8', backdropColor: 'transparent' },
        pointLabels: { font: { size: 11, weight: 'bold' as const }, color: '#e2e8f0' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' }
      }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 15, color: '#e2e8f0', font: { weight: 'bold' as const } } }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      y: { ticks: { color: '#e2e8f0', font: { weight: 'bold' as const } }, grid: { display: false } }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, color: '#e2e8f0' } }
    }
  }

  const barVerticalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { ticks: { color: '#e2e8f0', font: { weight: 'bold' as const, size: 11 } }, grid: { display: false } }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, color: '#e2e8f0', font: { weight: 'bold' as const } } }
    }
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const handleExternoCBFChange = (key: keyof BenchmarkValuesCBF, value: number) => {
    setAtletaExterno(prev => ({
      ...prev,
      valoresCBF: { ...prev.valoresCBF, [key]: value }
    }))
  }

  const handleExternoOFEChange = (key: keyof BenchmarkValuesOFE, value: number) => {
    setAtletaExterno(prev => ({
      ...prev,
      valoresOFE: { ...prev.valoresOFE, [key]: value }
    }))
  }

  const handleExternoDEFChange = (key: keyof BenchmarkValuesDEF, value: number) => {
    setAtletaExterno(prev => ({
      ...prev,
      valoresDEF: { ...prev.valoresDEF, [key]: value }
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
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#f59e0b" stroke="#0f172a" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Nova Avaliacao
        </Link>
      </div>

      {/* Filtros e Selecao */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-4">
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

      {/* Tabs GERAL / CBF / OFE / DEF */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('geral')}
          style={activeTab === 'geral' ? { backgroundColor: '#3b82f6', color: '#ffffff' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all shadow-lg ${
            activeTab === 'geral'
              ? ''
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="hidden sm:inline">GERAL (20)</span>
          <span className="sm:hidden">GERAL</span>
        </button>
        <button
          onClick={() => setActiveTab('cbf')}
          style={activeTab === 'cbf' ? { backgroundColor: '#f59e0b', color: '#0f172a' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all shadow-lg ${
            activeTab === 'cbf'
              ? ''
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          <span className="text-lg">⚽</span>
          <span className="hidden sm:inline">CBF (8)</span>
          <span className="sm:hidden">CBF</span>
        </button>
        <button
          onClick={() => setActiveTab('ofe')}
          style={activeTab === 'ofe' ? { backgroundColor: '#22c55e', color: '#0f172a' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all shadow-lg ${
            activeTab === 'ofe'
              ? ''
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          <span className="text-lg">↗️</span>
          <span className="hidden sm:inline">OFE (6)</span>
          <span className="sm:hidden">OFE</span>
        </button>
        <button
          onClick={() => setActiveTab('def')}
          style={activeTab === 'def' ? { backgroundColor: '#ef4444', color: '#0f172a' } : {}}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all shadow-lg ${
            activeTab === 'def'
              ? ''
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          <span className="text-lg">🛡️</span>
          <span className="hidden sm:inline">DEF (6)</span>
          <span className="sm:hidden">DEF</span>
        </button>
      </div>

      {!atletaSelecionado ? (
        <>
          {/* Estado inicial - mostrar visao geral */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className={`w-5 h-5 ${activeTab === 'geral' ? 'text-blue-500' : activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`} />
              <h3 className="text-lg font-semibold text-slate-100">
                Comparativo por Posicao - {activeTab === 'geral' ? 'Visao Geral' : activeTab === 'cbf' ? 'Dimensoes CBF' : activeTab === 'ofe' ? 'Principios Ofensivos' : 'Principios Defensivos'}
              </h3>
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
                    <p className={`text-3xl font-bold ${activeTab === 'geral' ? 'text-blue-500' : activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`}>
                      {analiseDetalhada.mediaAtleta.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-400">Media {activeTab === 'geral' ? 'Geral' : activeTab.toUpperCase()}</p>
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

          {/* Pontos Fortes e A Desenvolver - Design Futurista Compacto */}
          {analiseDetalhada && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Pontos Fortes */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-slate-900/80 backdrop-blur-sm">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <span className="text-lg">💪</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-100 tracking-wide">PONTOS FORTES</h3>
                        <p className="text-xs text-emerald-400/70">Acima do benchmark</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xl font-black text-emerald-400">{analiseDetalhada.pontosFortes.length}</span>
                    </div>
                  </div>

                  {/* Grid de Chips */}
                  {analiseDetalhada.pontosFortes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analiseDetalhada.pontosFortes.map((p) => (
                        <div
                          key={p.key}
                          className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-default"
                        >
                          <span className="text-base">{p.icon}</span>
                          <span className="text-sm font-medium text-slate-200">{p.label}</span>
                          <div className="flex items-center gap-1 pl-1 border-l border-emerald-500/30">
                            <span className="text-sm font-bold text-emerald-400">{p.valor.toFixed(1)}</span>
                            <span className="text-xs text-emerald-500 font-semibold">+{p.diferenca.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6 text-emerald-400/50">
                      <span className="text-2xl mr-2 opacity-50">💪</span>
                      <p className="text-sm">Nenhuma dimensao acima</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pontos a Desenvolver */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/80 via-slate-900/90 to-slate-900/80 backdrop-blur-sm">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-100 tracking-wide">A DESENVOLVER</h3>
                        <p className="text-xs text-amber-400/70">Potencial de evolucao</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <span className="text-xl font-black text-amber-400">{analiseDetalhada.pontosADesenvolver.length}</span>
                    </div>
                  </div>

                  {/* Grid de Chips */}
                  {analiseDetalhada.pontosADesenvolver.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analiseDetalhada.pontosADesenvolver.map((p) => (
                        <div
                          key={p.key}
                          className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-amber-500/20 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all cursor-default"
                        >
                          <span className="text-base">{p.icon}</span>
                          <span className="text-sm font-medium text-slate-200">{p.label}</span>
                          <div className="flex items-center gap-1 pl-1 border-l border-amber-500/30">
                            <span className="text-sm font-bold text-amber-400">{p.valor.toFixed(1)}</span>
                            <span className="text-xs text-amber-500 font-semibold">{p.diferenca.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6 text-amber-400/50">
                      <TrendingUp className="w-6 h-6 mr-2 opacity-50" />
                      <p className="text-sm">Nenhuma dimensao abaixo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Graficos Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Radar Comparativo */}
            <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-5 h-5 ${activeTab === 'geral' ? 'text-blue-500' : activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-base font-semibold text-slate-100">
                  Radar {activeTab === 'geral' ? 'Completo' : activeTab === 'cbf' ? 'CBF' : activeTab === 'ofe' ? 'Ofensivo' : 'Defensivo'}
                </h3>
              </div>
              <div className={activeTab === 'geral' ? 'h-[320px]' : 'h-[280px]'}>
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* Barras Comparativas */}
            <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className={`w-5 h-5 ${activeTab === 'geral' ? 'text-blue-500' : activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-base font-semibold text-slate-100">
                  Comparativo {activeTab === 'geral' ? 'Completo' : activeTab === 'cbf' ? 'CBF' : activeTab === 'ofe' ? 'Ofensivo' : 'Defensivo'}
                </h3>
              </div>
              <div className={activeTab === 'geral' ? 'h-[300px] overflow-y-auto' : 'h-[260px]'}>
                <Bar data={barComparativoData} options={barVerticalOptions} />
              </div>
              <div className="flex justify-center gap-3 mt-2 pt-2 border-t border-slate-700/50 text-xs">
                <span className="flex items-center gap-1"><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#22c55e' }}></span> <span className="text-slate-400">Acima</span></span>
                <span className="flex items-center gap-1"><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></span> <span className="text-slate-400">Na media</span></span>
                <span className="flex items-center gap-1"><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#f97316' }}></span> <span className="text-slate-400">Abaixo</span></span>
              </div>
            </div>
          </div>

          {/* Evolucao e Tabela */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Grafico de Evolucao */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={`w-5 h-5 ${activeTab === 'geral' ? 'text-blue-500' : activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-lg font-semibold text-slate-100">
                  Evolucao {activeTab === 'geral' ? 'Geral' : activeTab === 'cbf' ? 'CBF' : activeTab === 'ofe' ? 'Ofensivo' : 'Defensivo'}
                </h3>
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
                <Star className={`w-5 h-5 ${activeTab === 'geral' ? 'text-blue-500' : activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-lg font-semibold text-slate-100">
                  Detalhamento {activeTab === 'geral' ? 'Completo' : activeTab === 'cbf' ? 'CBF' : activeTab === 'ofe' ? 'Ofensivo' : 'Defensivo'}
                </h3>
              </div>
              <div className={`overflow-x-auto ${activeTab === 'geral' ? 'max-h-[400px] overflow-y-auto' : ''}`}>
                <table className="w-full text-sm">
                  <thead className={activeTab === 'geral' ? 'sticky top-0 bg-slate-800' : ''}>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 font-medium text-slate-400">Dimensao</th>
                      <th className="text-center py-2 font-medium text-slate-400">Atleta</th>
                      <th className="text-center py-2 font-medium text-slate-400">Bench</th>
                      <th className="text-center py-2 font-medium text-slate-400">Dif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analiseDetalhada?.dimensoes.filter(d => activeTab === 'geral' ? d.valor > 0 : true).map(d => (
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

          {/* Historico de Observacoes das Avaliacoes */}
          {avaliacoesDoAtleta.length > 0 && (
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-100">Historico de Observacoes</h3>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                  {avaliacoesDoAtleta.filter(a => a.pontos_fortes || a.pontos_desenvolver || a.observacoes).length} com observacoes
                </span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {avaliacoesDoAtleta.slice().reverse().map((avaliacao, index) => {
                  const temObs = avaliacao.pontos_fortes || avaliacao.pontos_desenvolver || avaliacao.observacoes
                  if (!temObs) return null

                  const dataFormatada = new Date(avaliacao.data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')

                  return (
                    <div key={avaliacao.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-slate-200">Avaliacao {dataFormatada}</span>
                        <span className="text-xs bg-slate-600 text-slate-400 px-2 py-0.5 rounded">
                          #{avaliacoesDoAtleta.length - index}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {avaliacao.pontos_fortes && (
                          <div className="bg-green-900/20 rounded-lg p-3 border border-green-800/30">
                            <p className="text-xs font-medium text-green-400 mb-1 flex items-center gap-1">
                              <span>💪</span> Pontos Fortes
                            </p>
                            <p className="text-sm text-slate-300">{avaliacao.pontos_fortes}</p>
                          </div>
                        )}
                        {avaliacao.pontos_desenvolver && (
                          <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-800/30">
                            <p className="text-xs font-medium text-orange-400 mb-1 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Pontos a Desenvolver
                            </p>
                            <p className="text-sm text-slate-300">{avaliacao.pontos_desenvolver}</p>
                          </div>
                        )}
                        {avaliacao.observacoes && (
                          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                            <p className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                              <Star className="w-3 h-3" /> Observacoes Gerais
                            </p>
                            <p className="text-sm text-slate-300">{avaliacao.observacoes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Adicionar Atleta Externo para Comparacao */}
          {activeTab !== 'geral' && (
          <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className={`w-5 h-5 ${activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-lg font-semibold text-slate-100">Comparar com Atleta Externo</h3>
              </div>
              <button
                onClick={() => setMostrarAtletaExterno(!mostrarAtletaExterno)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  mostrarAtletaExterno
                    ? (activeTab === 'cbf' ? 'bg-amber-500' : activeTab === 'ofe' ? 'bg-green-500' : 'bg-red-500') + ' text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {mostrarAtletaExterno ? 'Ocultar' : 'Adicionar'}
              </button>
            </div>

            {mostrarAtletaExterno && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Insira os dados de um atleta de outra plataforma para comparar no radar ({activeTab.toUpperCase()})
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`}>Nome do Atleta</label>
                    <input
                      type="text"
                      value={atletaExterno.nome}
                      onChange={(e) => setAtletaExterno(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Jogador Referencia"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${activeTab === 'cbf' ? 'text-amber-500' : activeTab === 'ofe' ? 'text-green-500' : 'text-red-500'}`}>Posicao</label>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeTab === 'cbf' && dimensoesCBF.map((d) => (
                    <div key={d.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">{d.icon} {d.label}</label>
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={atletaExterno.valoresCBF[d.key as keyof BenchmarkValuesCBF]}
                        onChange={(e) => handleExternoCBFChange(d.key as keyof BenchmarkValuesCBF, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center"
                      />
                    </div>
                  ))}
                  {activeTab === 'ofe' && dimensoesOFE.map((d) => (
                    <div key={d.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">{d.icon} {d.label}</label>
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={atletaExterno.valoresOFE[d.key as keyof BenchmarkValuesOFE]}
                        onChange={(e) => handleExternoOFEChange(d.key as keyof BenchmarkValuesOFE, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-center"
                      />
                    </div>
                  ))}
                  {activeTab === 'def' && dimensoesDEF.map((d) => (
                    <div key={d.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">{d.icon} {d.label}</label>
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={atletaExterno.valoresDEF[d.key as keyof BenchmarkValuesDEF]}
                        onChange={(e) => handleExternoDEFChange(d.key as keyof BenchmarkValuesDEF, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-center"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setAtletaExterno({ nome: '', posicao: '', valoresCBF: { ...defaultBenchmarkCBF }, valoresOFE: { ...defaultBenchmarkOFE }, valoresDEF: { ...defaultBenchmarkDEF } })}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Limpar dados
                </button>
              </div>
            )}
          </div>
          )}
        </>
      )}
    </div>
  )
}
