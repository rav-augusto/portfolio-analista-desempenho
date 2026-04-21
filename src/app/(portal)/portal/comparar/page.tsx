'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Users, ChevronDown, User } from 'lucide-react'
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
  BarElement,
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
)

type Atleta = {
  id: string
  nome: string
  posicao: string
  categoria: string
  data_nascimento: string
  altura: number
  peso: number
  foto_url: string | null
  pe_dominante: string
  clubes: { nome: string; escudo_url: string | null } | null
}

type Avaliacao = {
  id: string
  data_avaliacao: string
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
}

const dimensoesCBF = [
  { key: 'forca', label: 'FOR', fullLabel: 'Forca' },
  { key: 'velocidade', label: 'VEL', fullLabel: 'Velocidade' },
  { key: 'tecnica', label: 'TEC', fullLabel: 'Tecnica' },
  { key: 'dinamica', label: 'DIN', fullLabel: 'Dinamica' },
  { key: 'inteligencia', label: 'INT', fullLabel: 'Inteligencia' },
  { key: 'um_contra_um', label: '1v1', fullLabel: '1 contra 1' },
  { key: 'atitude', label: 'ATI', fullLabel: 'Atitude' },
  { key: 'potencial', label: 'POT', fullLabel: 'Potencial' },
]

const principiosOfensivos = [
  { key: 'penetracao', label: 'PEN', fullLabel: 'Penetracao' },
  { key: 'cobertura_ofensiva', label: 'COF', fullLabel: 'Cob. Ofensiva' },
  { key: 'espaco_com_bola', label: 'ECB', fullLabel: 'Espaco c/ Bola' },
  { key: 'espaco_sem_bola', label: 'ESB', fullLabel: 'Espaco s/ Bola' },
  { key: 'mobilidade', label: 'MOB', fullLabel: 'Mobilidade' },
  { key: 'unidade_ofensiva', label: 'UOF', fullLabel: 'Unid. Ofensiva' },
]

const principiosDefensivos = [
  { key: 'contencao', label: 'CON', fullLabel: 'Contencao' },
  { key: 'cobertura_defensiva', label: 'CDF', fullLabel: 'Cob. Defensiva' },
  { key: 'equilibrio_recuperacao', label: 'ERE', fullLabel: 'Equil. Recup.' },
  { key: 'equilibrio_defensivo', label: 'EDF', fullLabel: 'Equil. Defensivo' },
  { key: 'concentracao_def', label: 'CNC', fullLabel: 'Concentracao' },
  { key: 'unidade_defensiva', label: 'UDF', fullLabel: 'Unid. Defensiva' },
]

export default function CompararPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [meuAtleta, setMeuAtleta] = useState<Atleta | null>(null)
  const [outroAtleta, setOutroAtleta] = useState<Atleta | null>(null)
  const [minhaAvaliacao, setMinhaAvaliacao] = useState<Avaliacao | null>(null)
  const [outraAvaliacao, setOutraAvaliacao] = useState<Avaliacao | null>(null)
  const [meusMinutos, setMeusMinutos] = useState<{ total: number; jogos: number }>({ total: 0, jogos: 0 })
  const [outrosMinutos, setOutrosMinutos] = useState<{ total: number; jogos: number }>({ total: 0, jogos: 0 })
  const [meusStats, setMeusStats] = useState<{ gols: number; assistencias: number }>({ gols: 0, assistencias: 0 })
  const [outrosStats, setOutrosStats] = useState<{ gols: number; assistencias: number }>({ gols: 0, assistencias: 0 })
  const [activeView, setActiveView] = useState<'cbf' | 'ofensivo' | 'defensivo'>('cbf')
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

    // Load all athletes for comparison
    const { data: allAtletas } = await supabase
      .from('atletas')
      .select('*, clubes(nome, escudo_url)')
      .order('nome')

    if (allAtletas) {
      setAtletas(allAtletas)
      const meu = allAtletas.find(a => a.id === usuario.atleta_id)
      if (meu) {
        setMeuAtleta(meu)
        loadAvaliacao(meu.id, setMinhaAvaliacao)
        loadMinutos(meu.id, setMeusMinutos)
        loadStats(meu.id, setMeusStats)
      }
    }
    setLoading(false)
  }

  const loadAvaliacao = async (atletaId: string, setter: (a: Avaliacao | null) => void) => {
    const { data } = await supabase
      .from('avaliacoes_atleta')
      .select('*')
      .eq('atleta_id', atletaId)
      .order('data_avaliacao', { ascending: false })
      .limit(1)
      .single()
    setter(data)
  }

  const loadMinutos = async (atletaId: string, setter: (m: { total: number; jogos: number }) => void) => {
    const { data } = await supabase
      .from('avaliacoes_atleta')
      .select('minutos_jogados')
      .eq('atleta_id', atletaId)
      .not('minutos_jogados', 'is', null)

    if (data) {
      const total = data.reduce((acc, av) => acc + (av.minutos_jogados || 0), 0)
      setter({ total, jogos: data.length })
    }
  }

  const loadStats = async (atletaId: string, setter: (s: { gols: number; assistencias: number }) => void) => {
    const { data } = await supabase
      .from('avaliacoes_atleta')
      .select('gols, assistencias')
      .eq('atleta_id', atletaId)

    if (data) {
      const gols = data.reduce((acc, av) => acc + (av.gols || 0), 0)
      const assistencias = data.reduce((acc, av) => acc + (av.assistencias || 0), 0)
      setter({ gols, assistencias })
    }
  }

  const handleSelectOutro = (id: string) => {
    const atleta = atletas.find(a => a.id === id)
    setOutroAtleta(atleta || null)
    if (atleta) {
      loadAvaliacao(atleta.id, setOutraAvaliacao)
      loadMinutos(atleta.id, setOutrosMinutos)
      loadStats(atleta.id, setOutrosStats)
    } else {
      setOutraAvaliacao(null)
      setOutrosMinutos({ total: 0, jogos: 0 })
      setOutrosStats({ gols: 0, assistencias: 0 })
    }
  }

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date()
    const nasc = new Date(dataNasc)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const m = hoje.getMonth() - nasc.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
    return idade
  }

  const getMediaGeral = (av: Avaliacao | null) => {
    if (!av) return 0
    const cbfValues = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
    return (cbfValues.reduce((a, b) => a + b, 0) / cbfValues.length).toFixed(1)
  }

  const getRadarData = () => {
    let dimensions = dimensoesCBF
    if (activeView === 'ofensivo') dimensions = principiosOfensivos
    if (activeView === 'defensivo') dimensions = principiosDefensivos

    return {
      labels: dimensions.map(d => d.label),
      datasets: [
        {
          label: meuAtleta?.nome || 'Voce',
          data: dimensions.map(d => minhaAvaliacao ? (minhaAvaliacao as any)[d.key] || 0 : 0),
          backgroundColor: 'rgba(245, 158, 11, 0.3)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        },
        {
          label: outroAtleta?.nome || 'Outro Atleta',
          data: dimensions.map(d => outraAvaliacao ? (outraAvaliacao as any)[d.key] || 0 : 0),
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        },
      ],
    }
  }

  const getBarData = () => {
    let dimensions = dimensoesCBF
    if (activeView === 'ofensivo') dimensions = principiosOfensivos
    if (activeView === 'defensivo') dimensions = principiosDefensivos

    return {
      labels: dimensions.map(d => d.fullLabel),
      datasets: [
        {
          label: meuAtleta?.nome || 'Voce',
          data: dimensions.map(d => minhaAvaliacao ? (minhaAvaliacao as any)[d.key] || 0 : 0),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
        },
        {
          label: outroAtleta?.nome || 'Outro Atleta',
          data: dimensions.map(d => outraAvaliacao ? (outraAvaliacao as any)[d.key] || 0 : 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
      ],
    }
  }

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 0,
        ticks: { stepSize: 1, font: { size: 10 }, color: '#94a3b8', backdropColor: 'transparent' },
        pointLabels: { font: { size: 11 }, color: '#e2e8f0' },
        grid: { color: 'rgba(148, 163, 184, 0.3)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.3)' },
      },
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } },
    },
    maintainAspectRatio: true,
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: { max: 5, min: 0, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#e2e8f0' }, grid: { display: false } },
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } },
    },
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Comparar Atletas</h1>
        <p className="text-slate-400 mt-1">Compare seu desempenho com outros atletas da base</p>
      </div>

      {/* Athlete Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* My Athlete (Fixed) */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '2px solid #f59e0b' }}>
          <p className="text-xs text-amber-500 uppercase font-semibold mb-2">Voce</p>
          {meuAtleta ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0f172a', border: '2px solid #f59e0b' }}>
                {meuAtleta.foto_url ? (
                  <img src={meuAtleta.foto_url} alt={meuAtleta.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-100">{meuAtleta.nome}</p>
                <p className="text-sm text-slate-400">{meuAtleta.posicao} - {meuAtleta.categoria}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Carregando...</p>
          )}
        </div>

        {/* Other Athlete (Selectable) */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <p className="text-xs text-blue-400 uppercase font-semibold mb-2">Comparar com</p>
          <select
            onChange={(e) => handleSelectOutro(e.target.value)}
            value={outroAtleta?.id || ''}
            className="w-full px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
          >
            <option value="">Selecione um atleta...</option>
            {atletas
              .filter(a => a.id !== usuario?.atleta_id)
              .map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome} - {a.posicao} ({a.categoria})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Comparison Content */}
      {outroAtleta ? (
        <>
          {/* Stats Comparison */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <p className="text-xs text-slate-400 uppercase mb-2">Media Geral</p>
              <div className="flex justify-center gap-4">
                <div>
                  <p className="text-xl font-bold text-amber-500">{getMediaGeral(minhaAvaliacao)}</p>
                  <p className="text-xs text-slate-500">Voce</p>
                </div>
                <div className="border-l border-slate-700"></div>
                <div>
                  <p className="text-xl font-bold text-blue-400">{getMediaGeral(outraAvaliacao)}</p>
                  <p className="text-xs text-slate-500">{outroAtleta.nome.split(' ')[0]}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <p className="text-xs text-slate-400 uppercase mb-2">Minutos</p>
              <div className="flex justify-center gap-4">
                <div>
                  <p className="text-xl font-bold text-amber-500">{meusMinutos.total}</p>
                </div>
                <div className="border-l border-slate-700"></div>
                <div>
                  <p className="text-xl font-bold text-blue-400">{outrosMinutos.total}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <p className="text-xs text-slate-400 uppercase mb-2">Gols</p>
              <div className="flex justify-center gap-4">
                <div>
                  <p className="text-xl font-bold text-amber-500">{meusStats.gols}</p>
                </div>
                <div className="border-l border-slate-700"></div>
                <div>
                  <p className="text-xl font-bold text-blue-400">{outrosStats.gols}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <p className="text-xs text-slate-400 uppercase mb-2">Assistencias</p>
              <div className="flex justify-center gap-4">
                <div>
                  <p className="text-xl font-bold text-amber-500">{meusStats.assistencias}</p>
                </div>
                <div className="border-l border-slate-700"></div>
                <div>
                  <p className="text-xl font-bold text-blue-400">{outrosStats.assistencias}</p>
                </div>
              </div>
            </div>
          </div>

          {/* View Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { key: 'cbf', label: '8 Dimensoes CBF' },
              { key: 'ofensivo', label: 'Principios Ofensivos' },
              { key: 'defensivo', label: 'Principios Defensivos' },
            ].map(view => (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeView === view.key
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <h3 className="text-lg font-bold text-slate-100 mb-4">Radar Comparativo</h3>
              <div className="aspect-square max-h-[400px]">
                <Radar data={getRadarData()} options={radarOptions} />
              </div>
            </div>

            {/* Bar */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
              <h3 className="text-lg font-bold text-slate-100 mb-4">Comparativo por Dimensao</h3>
              <div className="h-[400px]">
                <Bar data={getBarData()} options={barOptions} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Selecione um atleta para comparar</p>
          <p className="text-sm text-slate-500">Escolha um atleta no seletor acima para ver a comparacao</p>
        </div>
      )}
    </div>
  )
}
