'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Printer, BarChart3, User } from 'lucide-react'
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'
import { PageHeader, Card, CardHeader, CardTitle, Badge, Button, Select, Spinner, EmptyState } from '@/components/app'

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
const C1 = '#f59e0b', C2 = '#38bdf8'

export default function CompararAtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [atleta1, setAtleta1] = useState<Atleta | null>(null)
  const [atleta2, setAtleta2] = useState<Atleta | null>(null)
  const [avaliacao1, setAvaliacao1] = useState<Avaliacao | null>(null)
  const [avaliacao2, setAvaliacao2] = useState<Avaliacao | null>(null)
  const [minutos1, setMinutos1] = useState({ total: 0, jogos: 0 })
  const [minutos2, setMinutos2] = useState({ total: 0, jogos: 0 })
  const [stats1, setStats1] = useState({ gols: 0, assistencias: 0 })
  const [stats2, setStats2] = useState({ gols: 0, assistencias: 0 })
  const [activeView, setActiveView] = useState<'cbf' | 'ofensivo' | 'defensivo' | 'todos'>('cbf')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadAtletas() }, [])

  const loadAtletas = async () => {
    const { data } = await supabase.from('atletas').select('*, clubes(nome, escudo_url)').order('nome')
    if (data) setAtletas(data)
    setLoading(false)
  }
  const loadAvaliacao = async (atletaId: string, setter: (a: Avaliacao | null) => void) => {
    const { data } = await supabase.from('avaliacoes_atleta').select('*').eq('atleta_id', atletaId).order('data_avaliacao', { ascending: false }).limit(1).single()
    setter(data)
  }
  const loadMinutos = async (atletaId: string, setter: (m: { total: number; jogos: number }) => void) => {
    const { data } = await supabase.from('avaliacoes_atleta').select('minutos_jogados').eq('atleta_id', atletaId).not('minutos_jogados', 'is', null)
    setter(data ? { total: data.reduce((a, av) => a + (av.minutos_jogados || 0), 0), jogos: data.length } : { total: 0, jogos: 0 })
  }
  const loadStats = async (atletaId: string, setter: (s: { gols: number; assistencias: number }) => void) => {
    const { data } = await supabase.from('avaliacoes_atleta').select('gols, assistencias').eq('atleta_id', atletaId)
    setter(data ? { gols: data.reduce((a, av) => a + (av.gols || 0), 0), assistencias: data.reduce((a, av) => a + (av.assistencias || 0), 0) } : { gols: 0, assistencias: 0 })
  }

  const selecionar = (id: string, n: 1 | 2) => {
    const atleta = atletas.find(a => a.id === id) || null
    const setA = n === 1 ? setAtleta1 : setAtleta2
    const setAv = n === 1 ? setAvaliacao1 : setAvaliacao2
    const setMin = n === 1 ? setMinutos1 : setMinutos2
    const setSt = n === 1 ? setStats1 : setStats2
    setA(atleta)
    if (atleta) { loadAvaliacao(atleta.id, setAv); loadMinutos(atleta.id, setMin); loadStats(atleta.id, setSt) }
    else { setAv(null); setMin({ total: 0, jogos: 0 }); setSt({ gols: 0, assistencias: 0 }) }
  }

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date(); const nasc = new Date(dataNasc)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const m = hoje.getMonth() - nasc.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
    return idade
  }
  const getMediaGeral = (av: Avaliacao | null) => {
    if (!av) return 0
    const cbf = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
    return cbf.reduce((a, b) => a + b, 0) / cbf.length
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const val = (av: Avaliacao | null, k: string) => (av ? (av as any)[k] || 0 : 0)

  const dimsAtivas = activeView === 'todos' ? [...dimensoesCBF, ...principiosOfensivos, ...principiosDefensivos]
    : activeView === 'ofensivo' ? principiosOfensivos : activeView === 'defensivo' ? principiosDefensivos : dimensoesCBF

  const radarData = {
    labels: dimsAtivas.map(d => d.label),
    datasets: [
      { label: atleta1?.nome || 'Atleta 1', data: dimsAtivas.map(d => val(avaliacao1, d.key)), backgroundColor: 'rgba(245,158,11,.28)', borderColor: C1, borderWidth: 2, pointBackgroundColor: C1 },
      { label: atleta2?.nome || 'Atleta 2', data: dimsAtivas.map(d => val(avaliacao2, d.key)), backgroundColor: 'rgba(56,189,248,.22)', borderColor: C2, borderWidth: 2, pointBackgroundColor: C2 },
    ],
  }
  const barData = {
    labels: dimsAtivas.map(d => d.fullLabel),
    datasets: [
      { label: atleta1?.nome || 'Atleta 1', data: dimsAtivas.map(d => val(avaliacao1, d.key)), backgroundColor: C1 },
      { label: atleta2?.nome || 'Atleta 2', data: dimsAtivas.map(d => val(avaliacao2, d.key)), backgroundColor: C2 },
    ],
  }
  const radarOptions = {
    scales: { r: { beginAtZero: true, max: 5, min: 0, ticks: { stepSize: 1, font: { size: 10 }, color: '#94a3b8', backdropColor: 'transparent' }, pointLabels: { font: { size: 11, weight: 'bold' as const }, color: '#e2e8f0' }, grid: { color: 'rgba(148,163,184,.3)' }, angleLines: { color: 'rgba(148,163,184,.3)' } } },
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } } }, maintainAspectRatio: true,
  }
  const barOptions = {
    indexAxis: 'y' as const, maintainAspectRatio: false,
    scales: { x: { beginAtZero: true, max: 5, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, y: { ticks: { color: '#e2e8f0' }, grid: { display: false } } },
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } } },
  }

  const views: { id: 'cbf' | 'ofensivo' | 'defensivo' | 'todos'; label: string }[] = [
    { id: 'cbf', label: 'Dimensões CBF' }, { id: 'ofensivo', label: 'Ofensivos' }, { id: 'defensivo', label: 'Defensivos' }, { id: 'todos', label: 'Todos' },
  ]

  const H2H = ({ label, a, b, decimals = 0 }: { label: string; a: number; b: number; decimals?: number }) => {
    const tot = a + b, pa = tot ? (a / tot) * 100 : 50
    const aWins = a > b, tie = a === b
    const fmt = (n: number) => decimals ? n.toFixed(decimals).replace('.', ',') : String(n)
    return (
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className={aWins && !tie ? 'font-semibold' : 'text-faint'} style={aWins && !tie ? { color: C1 } : undefined}>{fmt(a)}{aWins && !tie ? ' ◀' : ''}</span>
          <span className="text-faint uppercase tracking-wider text-[10px]">{label}</span>
          <span className={!aWins && !tie ? 'font-semibold' : 'text-faint'} style={!aWins && !tie ? { color: C2 } : undefined}>{!aWins && !tie ? '▶ ' : ''}{fmt(b)}</span>
        </div>
        <div className="h-2 rounded-full bg-app overflow-hidden flex">
          <div style={{ width: `${pa}%`, background: C1 }} /><div style={{ width: `${100 - pa}%`, background: C2 }} />
        </div>
      </div>
    )
  }

  const PlayerCard = ({ atleta, avaliacao, minutos, stats, cor }: { atleta: Atleta | null; avaliacao: Avaliacao | null; minutos: { total: number; jogos: number }; stats: { gols: number; assistencias: number }; cor: string }) => (
    <Card padding="none" className="overflow-hidden" style={{ borderColor: atleta ? `${cor}66` : undefined }}>
      {atleta ? (
        <>
          <div className="px-4 py-2" style={{ background: `${cor}22` }}>
            <p className="font-semibold text-sm truncate" style={{ color: cor }}>{atleta.nome}</p>
          </div>
          <div className="p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-app overflow-hidden grid place-items-center shrink-0">
                {atleta.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                ) : <Users className="w-7 h-7 text-faint" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {atleta.clubes?.escudo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={atleta.clubes.escudo_url} alt="" className="w-4 h-4 object-contain" />
                  )}
                  <span className="text-xs text-soft truncate">{atleta.clubes?.nome}</span>
                </div>
                <p className="text-sm font-medium text-strong">{atleta.posicao}</p>
                <p className="text-xs text-soft">{atleta.categoria}</p>
              </div>
              {avaliacao && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-faint uppercase">Média</p>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: cor }}>{getMediaGeral(avaliacao).toFixed(1).replace('.', ',')}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              {[['Idade', calcularIdade(atleta.data_nascimento)], ['Altura', atleta.altura || '—'], ['Peso', atleta.peso || '—'], ['Pé', atleta.pe_dominante?.charAt(0).toUpperCase() || '—']].map(([lab, v]) => (
                <div key={lab} className="bg-app rounded-lg py-2">
                  <p className="text-base font-bold text-strong tabular-nums">{v}</p>
                  <p className="text-[9px] text-faint uppercase tracking-wide">{lab}</p>
                </div>
              ))}
            </div>
            {(minutos.total > 0 || stats.gols > 0 || stats.assistencias > 0) && (
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-app rounded-lg py-2"><p className="text-base font-bold text-strong tabular-nums">{minutos.total}′</p><p className="text-[9px] text-faint">{minutos.jogos} jogos</p></div>
                <div className="bg-app rounded-lg py-2"><p className="text-base font-bold text-positive tabular-nums">{stats.gols}</p><p className="text-[9px] text-faint">Gols</p></div>
                <div className="bg-app rounded-lg py-2"><p className="text-base font-bold text-info tabular-nums">{stats.assistencias}</p><p className="text-[9px] text-faint">Assist.</p></div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-faint"><User className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">Selecione um atleta</p></div>
      )}
    </Card>
  )

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando..." /></div>

  return (
    <div>
      <PageHeader
        eyebrow="Comparar"
        title="Comparar atletas"
        description="Dois atletas lado a lado, com vantagem em cada métrica"
        actions={<Button variant="secondary" onClick={() => window.print()}><Printer className="w-4 h-4" /><span className="hidden sm:inline">Imprimir</span></Button>}
      />

      {/* Seletores */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C1 }}>Atleta 1</label>
          <Select value={atleta1?.id || ''} onChange={(e) => selecionar(e.target.value, 1)}>
            <option value="">Selecione um atleta</option>
            {atletas.map(a => <option key={a.id} value={a.id} disabled={a.id === atleta2?.id}>{a.nome} · {a.posicao} ({a.clubes?.nome})</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: C2 }}>Atleta 2</label>
          <Select value={atleta2?.id || ''} onChange={(e) => selecionar(e.target.value, 2)}>
            <option value="">Selecione um atleta</option>
            {atletas.map(a => <option key={a.id} value={a.id} disabled={a.id === atleta1?.id}>{a.nome} · {a.posicao} ({a.clubes?.nome})</option>)}
          </Select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <PlayerCard atleta={atleta1} avaliacao={avaliacao1} minutos={minutos1} stats={stats1} cor={C1} />
        <PlayerCard atleta={atleta2} avaliacao={avaliacao2} minutos={minutos2} stats={stats2} cor={C2} />
      </div>

      {(avaliacao1 || avaliacao2) && (
        <>
          {/* Head-to-head */}
          <Card padding="md" className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle>Comparativo direto</CardTitle>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: C1 }} />{atleta1?.nome.split(' ')[0] || 'A1'}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: C2 }} />{atleta2?.nome.split(' ')[0] || 'A2'}</span>
              </div>
            </CardHeader>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              <H2H label="Média geral" a={getMediaGeral(avaliacao1)} b={getMediaGeral(avaliacao2)} decimals={1} />
              <H2H label="Minutos" a={minutos1.total} b={minutos2.total} />
              <H2H label="Gols" a={stats1.gols} b={stats2.gols} />
              <H2H label="Assistências" a={stats1.assistencias} b={stats2.assistencias} />
            </div>
          </Card>

          {/* View chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {views.map(v => (
              <button key={v.id} onClick={() => setActiveView(v.id)}
                className={`px-3.5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeView === v.id ? 'bg-brand text-app' : 'bg-surface-2 text-soft hover:text-strong border border-line'}`}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card padding="lg"><CardTitle className="mb-4">Comparação radar</CardTitle><div className="aspect-square max-w-md mx-auto"><Radar data={radarData} options={radarOptions} /></div></Card>
            <Card padding="lg"><CardTitle className="mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-brand" />Comparação por dimensão</CardTitle><div style={{ height: activeView === 'todos' ? 460 : 300 }}><Bar data={barData} options={barOptions} /></div></Card>
          </div>

          {/* Tabela */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-line"><CardTitle>Tabela comparativa</CardTitle></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Dimensão</th>
                    <th className="text-center font-semibold uppercase tracking-wider text-[11px] px-3 py-3" style={{ color: C1 }}>{atleta1?.nome.split(' ')[0] || 'A1'}</th>
                    <th className="text-center font-semibold uppercase tracking-wider text-[11px] px-3 py-3" style={{ color: C2 }}>{atleta2?.nome.split(' ')[0] || 'A2'}</th>
                    <th className="text-center font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Dif.</th>
                  </tr>
                </thead>
                <tbody>
                  {dimsAtivas.map((dim) => {
                    const v1 = val(avaliacao1, dim.key), v2 = val(avaliacao2, dim.key), diff = v1 - v2
                    return (
                      <tr key={dim.key} className="border-b border-line/50 last:border-0">
                        <td className="px-4 py-2.5 text-soft">{dim.fullLabel}</td>
                        <td className="px-3 py-2.5 text-center font-bold tabular-nums" style={{ color: v1 >= v2 ? C1 : undefined }}>{v1.toFixed(1).replace('.', ',')}</td>
                        <td className="px-3 py-2.5 text-center font-bold tabular-nums" style={{ color: v2 > v1 ? C2 : undefined }}>{v2.toFixed(1).replace('.', ',')}</td>
                        <td className="px-4 py-2.5 text-center">
                          <Badge variant={diff > 0 ? 'caution' : diff < 0 ? 'info' : 'neutral'} size="sm">{diff > 0 ? '+' : ''}{diff.toFixed(1).replace('.', ',')}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {!atleta1 && !atleta2 && (
        <EmptyState icon={Users} title="Selecione dois atletas" description="Use os seletores acima para escolher os atletas e comparar lado a lado." />
      )}
    </div>
  )
}
