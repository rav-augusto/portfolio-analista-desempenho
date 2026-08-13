'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Users, User } from 'lucide-react'
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'
import { PageHeader, Card, CardHeader, CardTitle, Badge, Select, Spinner, EmptyState } from '@/components/app'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type Atleta = {
  id: string; nome: string; posicao: string; categoria: string; data_nascimento: string
  altura: number; peso: number; foto_url: string | null; pe_dominante: string
  clubes: { nome: string; escudo_url: string | null } | null
}
type Avaliacao = {
  id: string; data_avaliacao: string; minutos_jogados: number | null; gols: number | null; assistencias: number | null
  forca: number; velocidade: number; tecnica: number; dinamica: number; inteligencia: number; um_contra_um: number; atitude: number; potencial: number
  penetracao: number | null; cobertura_ofensiva: number | null; espaco_com_bola: number | null; espaco_sem_bola: number | null; mobilidade: number | null; unidade_ofensiva: number | null
  contencao: number | null; cobertura_defensiva: number | null; equilibrio_recuperacao: number | null; equilibrio_defensivo: number | null; concentracao_def: number | null; unidade_defensiva: number | null
}

const dimensoesCBF = [
  { key: 'forca', label: 'FOR', fullLabel: 'Força' }, { key: 'velocidade', label: 'VEL', fullLabel: 'Velocidade' },
  { key: 'tecnica', label: 'TEC', fullLabel: 'Técnica' }, { key: 'dinamica', label: 'DIN', fullLabel: 'Dinâmica' },
  { key: 'inteligencia', label: 'INT', fullLabel: 'Inteligência' }, { key: 'um_contra_um', label: '1v1', fullLabel: '1 contra 1' },
  { key: 'atitude', label: 'ATI', fullLabel: 'Atitude' }, { key: 'potencial', label: 'POT', fullLabel: 'Potencial' },
]
const principiosOfensivos = [
  { key: 'penetracao', label: 'PEN', fullLabel: 'Penetração' }, { key: 'cobertura_ofensiva', label: 'COF', fullLabel: 'Cob. Ofensiva' },
  { key: 'espaco_com_bola', label: 'ECB', fullLabel: 'Espaço c/ Bola' }, { key: 'espaco_sem_bola', label: 'ESB', fullLabel: 'Espaço s/ Bola' },
  { key: 'mobilidade', label: 'MOB', fullLabel: 'Mobilidade' }, { key: 'unidade_ofensiva', label: 'UOF', fullLabel: 'Unid. Ofensiva' },
]
const principiosDefensivos = [
  { key: 'contencao', label: 'CON', fullLabel: 'Contenção' }, { key: 'cobertura_defensiva', label: 'CDF', fullLabel: 'Cob. Defensiva' },
  { key: 'equilibrio_recuperacao', label: 'ERE', fullLabel: 'Equil. Recup.' }, { key: 'equilibrio_defensivo', label: 'EDF', fullLabel: 'Equil. Defensivo' },
  { key: 'concentracao_def', label: 'CNC', fullLabel: 'Concentração' }, { key: 'unidade_defensiva', label: 'UDF', fullLabel: 'Unid. Defensiva' },
]
const AMBER = '#f59e0b', INFO = '#38bdf8'

function H2H({ label, you, other, decimals = 0 }: { label: string; you: number; other: number; decimals?: number }) {
  const tot = you + other
  const pa = tot ? (you / tot) * 100 : 50
  const youWins = you > other, tie = you === other
  const fmt = (n: number) => decimals ? n.toFixed(decimals).replace('.', ',') : String(n)
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className={youWins && !tie ? 'text-brand font-semibold' : 'text-faint'}>{fmt(you)} · você{youWins && !tie ? ' ◀' : ''}</span>
        <span className="text-faint uppercase tracking-wider text-[10px]">{label}</span>
        <span className={!youWins && !tie ? 'text-info font-semibold' : 'text-faint'}>{!youWins && !tie ? '▶ ' : ''}{fmt(other)}</span>
      </div>
      <div className="h-2 rounded-full bg-app overflow-hidden flex">
        <div style={{ width: `${pa}%`, background: AMBER }} />
        <div style={{ width: `${100 - pa}%`, background: INFO }} />
      </div>
    </div>
  )
}

export default function CompararPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [meuAtleta, setMeuAtleta] = useState<Atleta | null>(null)
  const [outroAtleta, setOutroAtleta] = useState<Atleta | null>(null)
  const [minhaAvaliacao, setMinhaAvaliacao] = useState<Avaliacao | null>(null)
  const [outraAvaliacao, setOutraAvaliacao] = useState<Avaliacao | null>(null)
  const [meusMinutos, setMeusMinutos] = useState({ total: 0, jogos: 0 })
  const [outrosMinutos, setOutrosMinutos] = useState({ total: 0, jogos: 0 })
  const [meusStats, setMeusStats] = useState({ gols: 0, assistencias: 0 })
  const [outrosStats, setOutrosStats] = useState({ gols: 0, assistencias: 0 })
  const [activeView, setActiveView] = useState<'cbf' | 'ofensivo' | 'defensivo'>('cbf')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const { user: usuario, isLoading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && usuario?.atleta_id) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, usuario])

  const loadData = async () => {
    if (!usuario?.atleta_id) return
    const { data: allAtletas } = await supabase.from('atletas').select('*, clubes(nome, escudo_url)').order('nome')
    if (allAtletas) {
      setAtletas(allAtletas)
      const meu = allAtletas.find(a => a.id === usuario.atleta_id)
      if (meu) {
        setMeuAtleta(meu)
        loadAvaliacao(meu.id, setMinhaAvaliacao); loadMinutos(meu.id, setMeusMinutos); loadStats(meu.id, setMeusStats)
      }
    }
    setLoading(false)
  }

  const loadAvaliacao = async (atletaId: string, setter: (a: Avaliacao | null) => void) => {
    const { data } = await supabase.from('avaliacoes_atleta').select('*').eq('atleta_id', atletaId).order('data_avaliacao', { ascending: false }).limit(1).single()
    setter(data)
  }
  const loadMinutos = async (atletaId: string, setter: (m: { total: number; jogos: number }) => void) => {
    const { data } = await supabase.from('avaliacoes_atleta').select('minutos_jogados').eq('atleta_id', atletaId).not('minutos_jogados', 'is', null)
    if (data) setter({ total: data.reduce((acc, av) => acc + (av.minutos_jogados || 0), 0), jogos: data.length })
  }
  const loadStats = async (atletaId: string, setter: (s: { gols: number; assistencias: number }) => void) => {
    const { data } = await supabase.from('avaliacoes_atleta').select('gols, assistencias').eq('atleta_id', atletaId)
    if (data) setter({ gols: data.reduce((a, av) => a + (av.gols || 0), 0), assistencias: data.reduce((a, av) => a + (av.assistencias || 0), 0) })
  }

  const handleSelectOutro = (id: string) => {
    const atleta = atletas.find(a => a.id === id)
    setOutroAtleta(atleta || null)
    if (atleta) {
      loadAvaliacao(atleta.id, setOutraAvaliacao); loadMinutos(atleta.id, setOutrosMinutos); loadStats(atleta.id, setOutrosStats)
    } else {
      setOutraAvaliacao(null); setOutrosMinutos({ total: 0, jogos: 0 }); setOutrosStats({ gols: 0, assistencias: 0 })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMediaGeral = (av: Avaliacao | null) => {
    if (!av) return 0
    const cbf = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
    return cbf.reduce((a, b) => a + b, 0) / cbf.length
  }

  const dims = activeView === 'ofensivo' ? principiosOfensivos : activeView === 'defensivo' ? principiosDefensivos : dimensoesCBF
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const val = (av: Avaliacao | null, k: string) => (av ? (av as any)[k] || 0 : 0)

  const radarData = {
    labels: dims.map(d => d.label),
    datasets: [
      { label: meuAtleta?.nome || 'Você', data: dims.map(d => val(minhaAvaliacao, d.key)), backgroundColor: 'rgba(245,158,11,.28)', borderColor: AMBER, borderWidth: 2, pointBackgroundColor: AMBER },
      { label: outroAtleta?.nome || 'Outro', data: dims.map(d => val(outraAvaliacao, d.key)), backgroundColor: 'rgba(56,189,248,.22)', borderColor: INFO, borderWidth: 2, pointBackgroundColor: INFO },
    ],
  }
  const barData = {
    labels: dims.map(d => d.fullLabel),
    datasets: [
      { label: meuAtleta?.nome || 'Você', data: dims.map(d => val(minhaAvaliacao, d.key)), backgroundColor: AMBER },
      { label: outroAtleta?.nome || 'Outro', data: dims.map(d => val(outraAvaliacao, d.key)), backgroundColor: INFO },
    ],
  }
  const radarOptions = {
    scales: { r: { beginAtZero: true, max: 5, min: 0, ticks: { stepSize: 1, font: { size: 10 }, color: '#94a3b8', backdropColor: 'transparent' }, pointLabels: { font: { size: 11 }, color: '#e2e8f0' }, grid: { color: 'rgba(148,163,184,.3)' }, angleLines: { color: 'rgba(148,163,184,.3)' } } },
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } } }, maintainAspectRatio: true,
  }
  const barOptions = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const,
    scales: { x: { max: 5, min: 0, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#e2e8f0' }, grid: { display: false } } },
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } } },
  }

  if (loading || userLoading) return <div className="min-h-[400px] flex items-center justify-center"><Spinner size="lg" label="Carregando..." /></div>

  const views: { key: 'cbf' | 'ofensivo' | 'defensivo'; label: string }[] = [
    { key: 'cbf', label: '8 dimensões CBF' }, { key: 'ofensivo', label: 'Princípios ofensivos' }, { key: 'defensivo', label: 'Princípios defensivos' },
  ]

  const PerfilCard = ({ atleta, lado }: { atleta: Atleta | null; lado: 'voce' | 'outro' }) => (
    <Card padding="md" className={lado === 'voce' ? 'border-brand/50' : ''}>
      <p className={`text-[11px] uppercase font-semibold tracking-wider mb-2 ${lado === 'voce' ? 'text-brand' : 'text-info'}`}>{lado === 'voce' ? 'Você' : 'Comparar com'}</p>
      {atleta ? (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-app border-2 grid place-items-center shrink-0" style={{ borderColor: lado === 'voce' ? AMBER : INFO }}>
            {atleta.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
            ) : <User className="w-6 h-6 text-faint" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-strong truncate">{atleta.nome}</p>
            <p className="text-xs text-soft truncate">{atleta.posicao} · {atleta.categoria}</p>
          </div>
        </div>
      ) : (
        <Select value="" onChange={(e) => handleSelectOutro(e.target.value)}>
          <option value="">Selecione um atleta...</option>
          {atletas.filter(a => a.id !== usuario?.atleta_id).map(a => <option key={a.id} value={a.id}>{a.nome} · {a.posicao} ({a.categoria})</option>)}
        </Select>
      )}
      {lado === 'outro' && atleta && (
        <button onClick={() => handleSelectOutro('')} className="mt-2 text-xs text-faint hover:text-strong transition-colors">Trocar atleta</button>
      )}
    </Card>
  )

  return (
    <div>
      <PageHeader eyebrow="Portal do atleta" title="Comparar atletas" description="Compare o seu desempenho com outros atletas da base" />

      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <PerfilCard atleta={meuAtleta} lado="voce" />
        <PerfilCard atleta={outroAtleta} lado="outro" />
      </div>

      {outroAtleta ? (
        <>
          {/* Comparativo direto */}
          <Card padding="md" className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle>Comparativo direto</CardTitle>
              <div className="flex items-center gap-2 text-[11px]"><span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: AMBER }} />Você</span><span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: INFO }} />{outroAtleta.nome.split(' ')[0]}</span></div>
            </CardHeader>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              <H2H label="Média geral" you={getMediaGeral(minhaAvaliacao)} other={getMediaGeral(outraAvaliacao)} decimals={1} />
              <H2H label="Minutos" you={meusMinutos.total} other={outrosMinutos.total} />
              <H2H label="Gols" you={meusStats.gols} other={outrosStats.gols} />
              <H2H label="Assistências" you={meusStats.assistencias} other={outrosStats.assistencias} />
            </div>
          </Card>

          {/* View chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {views.map(view => (
              <button key={view.key} onClick={() => setActiveView(view.key)}
                className={`px-3.5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeView === view.key ? 'bg-brand text-app' : 'bg-surface-2 text-soft hover:text-strong border border-line'}`}>
                {view.label}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card padding="lg"><CardTitle className="mb-4">Radar comparativo</CardTitle><div className="aspect-square max-h-[380px] mx-auto"><Radar data={radarData} options={radarOptions} /></div></Card>
            <Card padding="lg"><CardTitle className="mb-4">Comparativo por dimensão</CardTitle><div className="h-[380px]"><Bar data={barData} options={barOptions} /></div></Card>
          </div>
        </>
      ) : (
        <EmptyState icon={Users} title="Selecione um atleta para comparar" description="Escolha um atleta no seletor acima para ver o comparativo direto e os gráficos." />
      )}
    </div>
  )
}
