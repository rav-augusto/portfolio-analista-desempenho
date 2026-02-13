'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, ChevronDown, Printer, BarChart3 } from 'lucide-react'
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

export default function CompararAtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [atleta1, setAtleta1] = useState<Atleta | null>(null)
  const [atleta2, setAtleta2] = useState<Atleta | null>(null)
  const [avaliacao1, setAvaliacao1] = useState<Avaliacao | null>(null)
  const [avaliacao2, setAvaliacao2] = useState<Avaliacao | null>(null)
  const [activeView, setActiveView] = useState<'cbf' | 'ofensivo' | 'defensivo' | 'todos'>('cbf')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAtletas()
  }, [])

  const loadAtletas = async () => {
    const { data } = await supabase
      .from('atletas')
      .select('*, clubes(nome, escudo_url)')
      .order('nome')
    if (data) setAtletas(data)
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

  const handleSelectAtleta1 = (id: string) => {
    const atleta = atletas.find(a => a.id === id)
    setAtleta1(atleta || null)
    if (atleta) loadAvaliacao(atleta.id, setAvaliacao1)
    else setAvaliacao1(null)
  }

  const handleSelectAtleta2 = (id: string) => {
    const atleta = atletas.find(a => a.id === id)
    setAtleta2(atleta || null)
    if (atleta) loadAvaliacao(atleta.id, setAvaliacao2)
    else setAvaliacao2(null)
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
    let labels: string[] = []
    let data1: number[] = []
    let data2: number[] = []

    if (activeView === 'cbf' || activeView === 'todos') {
      labels = [...labels, ...dimensoesCBF.map(d => d.label)]
      data1 = [...data1, ...dimensoesCBF.map(d => avaliacao1 ? (avaliacao1 as any)[d.key] || 0 : 0)]
      data2 = [...data2, ...dimensoesCBF.map(d => avaliacao2 ? (avaliacao2 as any)[d.key] || 0 : 0)]
    }
    if (activeView === 'ofensivo' || activeView === 'todos') {
      labels = [...labels, ...principiosOfensivos.map(d => d.label)]
      data1 = [...data1, ...principiosOfensivos.map(d => avaliacao1 ? (avaliacao1 as any)[d.key] || 0 : 0)]
      data2 = [...data2, ...principiosOfensivos.map(d => avaliacao2 ? (avaliacao2 as any)[d.key] || 0 : 0)]
    }
    if (activeView === 'defensivo' || activeView === 'todos') {
      labels = [...labels, ...principiosDefensivos.map(d => d.label)]
      data1 = [...data1, ...principiosDefensivos.map(d => avaliacao1 ? (avaliacao1 as any)[d.key] || 0 : 0)]
      data2 = [...data2, ...principiosDefensivos.map(d => avaliacao2 ? (avaliacao2 as any)[d.key] || 0 : 0)]
    }

    return {
      labels,
      datasets: [
        {
          label: atleta1?.nome || 'Atleta 1',
          data: data1,
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        },
        {
          label: atleta2?.nome || 'Atleta 2',
          data: data2,
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        },
      ],
    }
  }

  const getBarData = () => {
    const allDimensions = activeView === 'todos'
      ? [...dimensoesCBF, ...principiosOfensivos, ...principiosDefensivos]
      : activeView === 'cbf'
        ? dimensoesCBF
        : activeView === 'ofensivo'
          ? principiosOfensivos
          : principiosDefensivos

    return {
      labels: allDimensions.map(d => d.fullLabel),
      datasets: [
        {
          label: atleta1?.nome || 'Atleta 1',
          data: allDimensions.map(d => avaliacao1 ? (avaliacao1 as any)[d.key] || 0 : 0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
        {
          label: atleta2?.nome || 'Atleta 2',
          data: allDimensions.map(d => avaliacao2 ? (avaliacao2 as any)[d.key] || 0 : 0),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
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
        ticks: { stepSize: 1, font: { size: 10 }, color: '#94a3b8' },
        pointLabels: { font: { size: 11, weight: 'bold' as const }, color: '#e2e8f0' },
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
    indexAxis: 'y' as const,
    scales: {
      x: { beginAtZero: true, max: 5, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } },
      y: { ticks: { color: '#e2e8f0' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } },
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } },
    },
    maintainAspectRatio: false,
  }

  const renderAtletaCard = (atleta: Atleta | null, avaliacao: Avaliacao | null, color: string) => (
    <div className={`bg-slate-800 rounded-xl border-2 ${color === 'blue' ? 'border-blue-700' : 'border-red-700'} overflow-hidden`}>
      {atleta ? (
        <>
          <div className={`${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'} px-4 py-2`}>
            <p className="text-white font-semibold text-sm truncate">{atleta.nome}</p>
          </div>
          <div className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                {atleta.foto_url ? (
                  <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Users className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {atleta.clubes?.escudo_url && (
                    <img src={atleta.clubes.escudo_url} alt="" className="w-5 h-5 object-contain" />
                  )}
                  <span className="text-xs text-slate-400 truncate">{atleta.clubes?.nome}</span>
                </div>
                <p className="text-sm font-medium text-slate-100">{atleta.posicao}</p>
                <p className="text-xs text-slate-400">{atleta.categoria}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="bg-slate-700 rounded-lg p-2">
                <p className="text-lg font-bold text-slate-100">{calcularIdade(atleta.data_nascimento)}</p>
                <p className="text-[10px] text-slate-400 uppercase">Idade</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-2">
                <p className="text-lg font-bold text-slate-100">{atleta.altura || '-'}</p>
                <p className="text-[10px] text-slate-400 uppercase">Altura</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-2">
                <p className="text-lg font-bold text-slate-100">{atleta.peso || '-'}</p>
                <p className="text-[10px] text-slate-400 uppercase">Peso</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-2">
                <p className="text-lg font-bold text-slate-100">{atleta.pe_dominante?.charAt(0) || '-'}</p>
                <p className="text-[10px] text-slate-400 uppercase">Pe</p>
              </div>
            </div>

            {avaliacao && (
              <div className={`mt-4 p-3 rounded-lg ${color === 'blue' ? 'bg-blue-900/30' : 'bg-red-900/30'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Media Geral (CBF)</span>
                  <span className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
                    {getMediaGeral(avaliacao)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Selecione um atleta</p>
        </div>
      )}
    </div>
  )

  const renderStatsTable = () => {
    if (!avaliacao1 && !avaliacao2) return null

    const allDimensions = activeView === 'todos'
      ? [...dimensoesCBF, ...principiosOfensivos, ...principiosDefensivos]
      : activeView === 'cbf'
        ? dimensoesCBF
        : activeView === 'ofensivo'
          ? principiosOfensivos
          : principiosDefensivos

    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700">
                <th className="px-3 py-2 text-left font-medium text-slate-400">Dimensao</th>
                <th className="px-3 py-2 text-center font-medium text-blue-400">{atleta1?.nome || 'Atleta 1'}</th>
                <th className="px-3 py-2 text-center font-medium text-slate-500">vs</th>
                <th className="px-3 py-2 text-center font-medium text-red-400">{atleta2?.nome || 'Atleta 2'}</th>
                <th className="px-3 py-2 text-center font-medium text-slate-400">Diff</th>
              </tr>
            </thead>
            <tbody>
              {allDimensions.map((dim, i) => {
                const val1 = avaliacao1 ? (avaliacao1 as any)[dim.key] || 0 : 0
                const val2 = avaliacao2 ? (avaliacao2 as any)[dim.key] || 0 : 0
                const diff = val1 - val2
                return (
                  <tr key={dim.key} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-700/50'}>
                    <td className="px-3 py-2 font-medium text-slate-300">{dim.fullLabel}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-bold ${val1 > val2 ? 'text-blue-400' : 'text-slate-400'}`}>{val1.toFixed(1)}</span>
                    </td>
                    <td className="px-3 py-2 text-center text-slate-600">-</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-bold ${val2 > val1 ? 'text-red-400' : 'text-slate-400'}`}>{val2.toFixed(1)}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        diff > 0 ? 'bg-blue-900/50 text-blue-300' : diff < 0 ? 'bg-red-900/50 text-red-300' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Comparar Atletas</h1>
          <p className="text-slate-400 mt-1">Compare o desempenho de dois atletas lado a lado</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimir
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-amber-500 mb-2">Atleta 1</label>
          <select
            onChange={(e) => handleSelectAtleta1(e.target.value)}
            className="w-full px-4 py-2 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-700 text-slate-200"
          >
            <option value="">Selecione um atleta</option>
            {atletas.map((a) => (
              <option key={a.id} value={a.id} disabled={a.id === atleta2?.id}>
                {a.nome} - {a.posicao} ({a.clubes?.nome})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-500 mb-2">Atleta 2</label>
          <select
            onChange={(e) => handleSelectAtleta2(e.target.value)}
            className="w-full px-4 py-2 border border-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-slate-700 text-slate-200"
          >
            <option value="">Selecione um atleta</option>
            {atletas.map((a) => (
              <option key={a.id} value={a.id} disabled={a.id === atleta1?.id}>
                {a.nome} - {a.posicao} ({a.clubes?.nome})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {renderAtletaCard(atleta1, avaliacao1, 'blue')}
        {renderAtletaCard(atleta2, avaliacao2, 'red')}
      </div>

      {/* View Tabs */}
      {(atleta1 || atleta2) && (
        <div className="flex gap-2 mb-6">
          {[
            { id: 'cbf', label: 'Dimensoes CBF' },
            { id: 'ofensivo', label: 'Principios Ofensivos' },
            { id: 'defensivo', label: 'Principios Defensivos' },
            { id: 'todos', label: 'Todos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Charts & Stats */}
      {(avaliacao1 || avaliacao2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Comparacao Radar</h3>
            <div className="aspect-square max-w-md mx-auto">
              <Radar data={getRadarData()} options={radarOptions} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Comparacao por Dimensao
            </h3>
            <div style={{ height: activeView === 'todos' ? '500px' : '300px' }}>
              <Bar data={getBarData()} options={barOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Stats Table */}
      {(avaliacao1 || avaliacao2) && (
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Tabela Comparativa</h3>
          {renderStatsTable()}
        </div>
      )}

      {/* Empty State */}
      {!atleta1 && !atleta2 && (
        <div className="bg-slate-700 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">Selecione dois atletas para comparar</h3>
          <p className="text-slate-500">Use os seletores acima para escolher os atletas</p>
        </div>
      )}
    </div>
  )
}
