'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { User, Star, Calendar, Trophy, Clock, Target } from 'lucide-react'
import Link from 'next/link'
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

type Atleta = {
  id: string
  nome: string
  posicao: string | null
  posicao_secundaria: string | null
  categoria: string | null
  numero_camisa: number | null
  foto_url: string | null
  data_nascimento: string | null
  altura: number | null
  peso: number | null
  pe_dominante: string | null
  clubes: { nome: string; escudo_url: string | null } | null
}

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
}

const dimensoesCBF = [
  { key: 'forca', label: 'Forca' },
  { key: 'velocidade', label: 'Velocidade' },
  { key: 'tecnica', label: 'Tecnica' },
  { key: 'dinamica', label: 'Dinamica' },
  { key: 'inteligencia', label: 'Inteligencia' },
  { key: 'um_contra_um', label: '1v1' },
  { key: 'atitude', label: 'Atitude' },
  { key: 'potencial', label: 'Potencial' },
]

export default function PortalPage() {
  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState<Avaliacao | null>(null)
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0)
  const [totalMinutos, setTotalMinutos] = useState(0)
  const [totalGols, setTotalGols] = useState(0)
  const [totalAssistencias, setTotalAssistencias] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const { user: usuario, isLoading: userLoading } = useUser()

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
      .select('*, clubes(nome, escudo_url)')
      .eq('id', usuario.atleta_id)
      .single()

    if (atletaData) {
      setAtleta(atletaData)
    }

    // Load evaluations
    const { data: avaliacoes } = await supabase
      .from('avaliacoes_atleta')
      .select('*')
      .eq('atleta_id', usuario.atleta_id)
      .order('data_avaliacao', { ascending: false })

    if (avaliacoes && avaliacoes.length > 0) {
      setUltimaAvaliacao(avaliacoes[0])
      setTotalAvaliacoes(avaliacoes.length)

      // Calculate totals
      let minutos = 0, gols = 0, assists = 0
      avaliacoes.forEach(av => {
        minutos += av.minutos_jogados || 0
        gols += av.gols || 0
        assists += av.assistencias || 0
      })
      setTotalMinutos(minutos)
      setTotalGols(gols)
      setTotalAssistencias(assists)
    }

    setLoading(false)
  }

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date()
    const nascimento = new Date(dataNasc)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const m = hoje.getMonth() - nascimento.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  const calcularMediaGeral = (av: Avaliacao) => {
    const valores = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
    const soma = valores.reduce((a, b) => a + (b || 0), 0)
    return (soma / valores.length).toFixed(1)
  }

  const radarData = ultimaAvaliacao ? {
    labels: dimensoesCBF.map(d => d.label),
    datasets: [
      {
        label: 'Avaliacao Atual',
        data: dimensoesCBF.map(d => (ultimaAvaliacao as any)[d.key] || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(245, 158, 11, 1)',
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
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#94a3b8',
          backdropColor: 'transparent',
        },
        grid: {
          color: '#334155',
        },
        angleLines: {
          color: '#334155',
        },
        pointLabels: {
          color: '#e2e8f0',
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando seu perfil...</p>
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
        <h1 className="text-3xl font-bold text-slate-100">Meu Perfil</h1>
        <p className="text-slate-400 mt-1">Bem-vindo ao seu portal de atleta</p>
      </div>

      {/* Athlete Profile Card */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0f172a', border: '3px solid #f59e0b' }}>
            {atleta.foto_url ? (
              <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-500" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {atleta.numero_camisa && (
                <span className="text-2xl font-bold text-amber-500">#{atleta.numero_camisa}</span>
              )}
              <h2 className="text-2xl font-bold text-slate-100">{atleta.nome}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {atleta.posicao && (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg font-medium">
                  {atleta.posicao}
                </span>
              )}
              {atleta.categoria && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-medium">
                  {atleta.categoria}
                </span>
              )}
              {atleta.clubes && (
                <span className="text-slate-300">{atleta.clubes.nome}</span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {atleta.data_nascimento && (
                <div>
                  <p className="text-xs text-slate-500 uppercase">Idade</p>
                  <p className="text-slate-200 font-medium">{calcularIdade(atleta.data_nascimento)} anos</p>
                </div>
              )}
              {atleta.altura && (
                <div>
                  <p className="text-xs text-slate-500 uppercase">Altura</p>
                  <p className="text-slate-200 font-medium">{atleta.altura}m</p>
                </div>
              )}
              {atleta.peso && (
                <div>
                  <p className="text-xs text-slate-500 uppercase">Peso</p>
                  <p className="text-slate-200 font-medium">{atleta.peso}kg</p>
                </div>
              )}
              {atleta.pe_dominante && (
                <div>
                  <p className="text-xs text-slate-500 uppercase">Pe Dominante</p>
                  <p className="text-slate-200 font-medium capitalize">{atleta.pe_dominante}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{totalAvaliacoes}</p>
              <p className="text-xs text-slate-400">Avaliacoes</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{totalMinutos}</p>
              <p className="text-xs text-slate-400">Minutos</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{totalGols}</p>
              <p className="text-xs text-slate-400">Gols</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{totalAssistencias}</p>
              <p className="text-xs text-slate-400">Assistencias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Evaluation */}
      {ultimaAvaliacao ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">Ultima Avaliacao</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                {new Date(ultimaAvaliacao.data_avaliacao).toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div className="h-[300px]">
              {radarData && <Radar data={radarData} options={radarOptions} />}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-400">Media Geral</p>
              <p className="text-3xl font-bold text-amber-500">{calcularMediaGeral(ultimaAvaliacao)}</p>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-4">
            {ultimaAvaliacao.pontos_fortes && (
              <div className="rounded-xl p-5" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-green-400 uppercase mb-3">Pontos Fortes</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{ultimaAvaliacao.pontos_fortes}</p>
              </div>
            )}

            {ultimaAvaliacao.pontos_desenvolver && (
              <div className="rounded-xl p-5" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-amber-400 uppercase mb-3">Pontos a Desenvolver</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{ultimaAvaliacao.pontos_desenvolver}</p>
              </div>
            )}

            <Link
              href="/portal/evolucao"
              className="block rounded-xl p-5 text-center transition-colors hover:bg-slate-700/50"
              style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            >
              <p className="text-amber-500 font-semibold">Ver todas as avaliacoes</p>
              <p className="text-xs text-slate-400 mt-1">Acompanhe sua evolucao ao longo do tempo</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhuma avaliacao ainda</p>
          <p className="text-sm text-slate-500">Suas avaliacoes aparecerao aqui quando forem registradas</p>
        </div>
      )}
    </div>
  )
}
