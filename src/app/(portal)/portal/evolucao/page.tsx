'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Star, TrendingUp, ArrowUp, ArrowDown, Minus, Gauge, Baby, Activity } from 'lucide-react'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'
import { Radar, Line } from 'react-chartjs-2'
import { PageHeader, StatCard, Card, CardHeader, CardTitle, Badge, Select, Spinner, EmptyState } from '@/components/app'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale)

type Avaliacao = {
  id: string; data_avaliacao: string; tipo: string; minutos_jogados: number | null; gols: number | null; assistencias: number | null
  forca: number; velocidade: number; tecnica: number; dinamica: number; inteligencia: number; um_contra_um: number; atitude: number; potencial: number
  penetracao: number | null; cobertura_ofensiva: number | null; espaco_com_bola: number | null; espaco_sem_bola: number | null; mobilidade: number | null; unidade_ofensiva: number | null
  contencao: number | null; cobertura_defensiva: number | null; equilibrio_recuperacao: number | null; equilibrio_defensivo: number | null; concentracao_def: number | null; unidade_defensiva: number | null
  pontos_fortes: string | null; pontos_desenvolver: string | null
  jogos: { adversario: string; data_jogo: string } | null
  altura_avaliacao: number | null; peso_avaliacao: number | null; envergadura: number | null
  velocidade_10m: number | null; velocidade_30m: number | null; salto_vertical: number | null; agilidade_teste: number | null
  yoyo_nivel: string | null; yoyo_distancia: number | null; idade_biologica: number | null; estagio_phv: string | null; sentar_alcancar: number | null
}

const dimensoesCBF = [
  { key: 'forca', label: 'Força' }, { key: 'velocidade', label: 'Velocidade' }, { key: 'tecnica', label: 'Técnica' }, { key: 'dinamica', label: 'Dinâmica' },
  { key: 'inteligencia', label: 'Inteligência' }, { key: 'um_contra_um', label: '1v1' }, { key: 'atitude', label: 'Atitude' }, { key: 'potencial', label: 'Potencial' },
]
const faseLabel = (f: string | null) => f === 'pre' ? 'Pré-PHV' : f === 'durante' ? 'Durante' : f === 'pos' ? 'Pós-PHV' : '—'
const mediaGeral = (av: Avaliacao) => {
  const v = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
  return v.reduce((a, b) => a + (b || 0), 0) / v.length
}

// Card genérico de evolução (substitui os IIFEs repetidos)
function Evo({ label, nums, fmt, deltaFmt, better = 'up', sub }: {
  label: string; nums: (number | null)[]; fmt: (v: number) => string; deltaFmt: (d: number) => string; better?: 'up' | 'down' | 'neutral'; sub?: string
}) {
  const vals = nums.filter((v): v is number => v != null)
  if (!vals.length) return null
  const last = vals[vals.length - 1], d = vals.length > 1 ? last - vals[0] : 0
  const good = better === 'neutral' || d === 0 ? null : better === 'down' ? d < 0 : d > 0
  const cls = good === null ? 'text-faint' : good ? 'text-positive' : 'text-negative'
  return (
    <Card padding="md" className="text-center">
      <p className="text-[11px] text-faint uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-strong tabular-nums">{fmt(last)}</p>
      {sub && <p className="text-[11px] text-brand mt-0.5">{sub}</p>}
      {vals.length > 1 && (
        <div className={`flex items-center justify-center gap-1 mt-1 text-sm ${cls}`}>
          {d === 0 ? <Minus className="w-4 h-4" /> : (better === 'down' ? d < 0 : d > 0) ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="tabular-nums">{deltaFmt(d)}</span>
        </div>
      )}
    </Card>
  )
}

export default function EvolucaoPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDimensao, setSelectedDimensao] = useState<string>('all')
  const [filtroTipo, setFiltroTipo] = useState('')

  const supabase = createClient()
  const { user: usuario, isLoading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && usuario?.atleta_id) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, usuario])

  const loadData = async () => {
    if (!usuario?.atleta_id) return
    const { data } = await supabase
      .from('avaliacoes_atleta')
      .select(`*, jogos(adversario, data_jogo), altura_avaliacao, peso_avaliacao, envergadura, velocidade_10m, velocidade_30m, salto_vertical, agilidade_teste, yoyo_nivel, yoyo_distancia, idade_biologica, estagio_phv, sentar_alcancar`)
      .eq('atleta_id', usuario.atleta_id)
      .order('data_avaliacao', { ascending: true })
    if (data) setAvaliacoes(data)
    setLoading(false)
  }

  const variacaoIcon = (v: number) => v > 0 ? <ArrowUp className="w-4 h-4" /> : v < 0 ? <ArrowDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />
  const variacaoClass = (v: number) => v > 0 ? 'text-positive' : v < 0 ? 'text-negative' : 'text-faint'

  const serie = (key: keyof Avaliacao) => avaliacoes.map(av => av[key] as number | null)

  const kpis = useMemo(() => {
    if (!avaliacoes.length) return null
    const medias = avaliacoes.map(mediaGeral)
    const trendTotal = medias.length > 1 ? medias[medias.length - 1] - medias[0] : 0
    const idadeBio = [...avaliacoes].reverse().find(a => a.idade_biologica != null)?.idade_biologica ?? null
    const fase = [...avaliacoes].reverse().find(a => a.estagio_phv)?.estagio_phv ?? null
    return { mediaAtual: medias[medias.length - 1], trendTotal, idadeBio, fase }
  }, [avaliacoes])

  const evolutionData = {
    labels: avaliacoes.map(av => new Date(av.data_avaliacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
    datasets: selectedDimensao === 'all'
      ? [{ label: 'Média geral', data: avaliacoes.map(mediaGeral), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.12)', fill: true, tension: 0.4 }]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : [{ label: dimensoesCBF.find(d => d.key === selectedDimensao)?.label || '', data: avaliacoes.map(av => (av as any)[selectedDimensao] || 0), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.12)', fill: true, tension: 0.4 }],
  }
  const evolutionOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { y: { min: 0, max: 5, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } },
    plugins: { legend: { display: false } },
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radarData = avaliacoes.length >= 2 ? {
    labels: dimensoesCBF.map(d => d.label),
    datasets: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { label: 'Primeira', data: dimensoesCBF.map(d => (avaliacoes[0] as any)[d.key] || 0), backgroundColor: 'rgba(100,116,139,.3)', borderColor: 'rgba(100,116,139,1)', borderWidth: 2 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { label: 'Última', data: dimensoesCBF.map(d => (avaliacoes[avaliacoes.length - 1] as any)[d.key] || 0), backgroundColor: 'rgba(245,158,11,.3)', borderColor: 'rgba(245,158,11,1)', borderWidth: 2 },
    ],
  } : null
  const radarOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, color: '#94a3b8', backdropColor: 'transparent' }, grid: { color: '#334155' }, angleLines: { color: '#334155' }, pointLabels: { color: '#e2e8f0', font: { size: 11 } } } },
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#e2e8f0' } } },
  }

  const tipos = useMemo(() => [...new Set(avaliacoes.map(a => a.tipo).filter(Boolean))], [avaliacoes])
  const historico = useMemo(() => {
    const arr = filtroTipo ? avaliacoes.filter(a => a.tipo === filtroTipo) : avaliacoes
    return [...arr].reverse()
  }, [avaliacoes, filtroTipo])

  if (loading || userLoading) return <div className="min-h-[400px] flex items-center justify-center"><Spinner size="lg" label="Carregando evolução..." /></div>

  const temFisico = avaliacoes.some(av => av.altura_avaliacao || av.peso_avaliacao || av.velocidade_10m || av.salto_vertical || av.yoyo_distancia || av.sentar_alcancar)

  return (
    <div>
      <PageHeader eyebrow="Portal do atleta" title="Minha evolução" description="Acompanhe o seu desenvolvimento ao longo do tempo" />

      {avaliacoes.length === 0 ? (
        <EmptyState icon={TrendingUp} title="Nenhuma avaliação ainda" description="As suas avaliações aparecerão aqui assim que forem registradas." />
      ) : (
        <>
          {/* KPIs com maturação em destaque */}
          {kpis && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <StatCard label="Média atual" value={kpis.mediaAtual.toFixed(1).replace('.', ',')} icon={Gauge} tone="brand"
                meta={kpis.trendTotal !== 0 ? <span className={kpis.trendTotal > 0 ? 'text-positive font-semibold' : 'text-negative font-semibold'}>{kpis.trendTotal > 0 ? '+' : ''}{kpis.trendTotal.toFixed(1).replace('.', ',')} no total</span> : undefined} />
              <StatCard label="Idade biológica" value={kpis.idadeBio != null ? kpis.idadeBio.toFixed(1).replace('.', ',') : '—'} icon={Baby} tone="info" meta="maturação" />
              <StatCard label="Fase PHV" value={faseLabel(kpis.fase)} icon={Activity} tone="positive" meta="pico de crescimento" />
              <StatCard label="Avaliações" value={avaliacoes.length} icon={Star} tone="violet" />
            </div>
          )}

          {/* Gráfico de evolução */}
          <Card padding="lg" className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle>Evolução ao longo do tempo</CardTitle>
              <div className="w-44"><Select value={selectedDimensao} onChange={(e) => setSelectedDimensao(e.target.value)}>
                <option value="all">Média geral</option>
                {dimensoesCBF.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
              </Select></div>
            </CardHeader>
            <div className="h-[280px]"><Line data={evolutionData} options={evolutionOptions} /></div>
          </Card>

          {/* Radar primeira vs última */}
          {avaliacoes.length >= 2 && radarData && (
            <Card padding="lg" className="mb-4 sm:mb-6">
              <CardTitle className="mb-4">Comparativo: primeira vs última</CardTitle>
              <div className="h-[330px]"><Radar data={radarData} options={radarOptions} /></div>
            </Card>
          )}

          {/* Evolução por dimensão */}
          {avaliacoes.length >= 2 && (
            <Card padding="lg" className="mb-4 sm:mb-6">
              <CardTitle className="mb-4">Evolução por dimensão</CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dimensoesCBF.map(dim => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const primeira = (avaliacoes[0] as any)[dim.key] || 0
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const ultima = (avaliacoes[avaliacoes.length - 1] as any)[dim.key] || 0
                  const v = ultima - primeira
                  return (
                    <div key={dim.key} className="rounded-xl p-4 text-center bg-app border border-line">
                      <p className="text-[11px] text-faint uppercase tracking-wider mb-1">{dim.label}</p>
                      <p className="text-2xl font-bold text-strong tabular-nums">{ultima.toFixed(1).replace('.', ',')}</p>
                      <div className={`flex items-center justify-center gap-1 mt-1 text-sm ${variacaoClass(v)}`}>{variacaoIcon(v)}<span className="tabular-nums">{v > 0 ? '+' : ''}{v.toFixed(1).replace('.', ',')}</span></div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Evolução física */}
          {temFisico && (
            <Card padding="lg" className="mb-4 sm:mb-6">
              <CardTitle className="mb-4">Evolução física</CardTitle>
              {(avaliacoes.some(a => a.altura_avaliacao || a.peso_avaliacao || a.envergadura)) && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-info uppercase tracking-wider mb-3">Antropométricos</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Evo label="Altura" nums={serie('altura_avaliacao')} fmt={(v) => `${v.toFixed(2)}m`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${(d * 100).toFixed(0)}cm`} better="up" />
                    <Evo label="Peso" nums={serie('peso_avaliacao')} fmt={(v) => `${v.toFixed(1)}kg`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(1)}kg`} better="neutral" />
                    <Evo label="Envergadura" nums={serie('envergadura')} fmt={(v) => `${v.toFixed(2)}m`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${(d * 100).toFixed(0)}cm`} better="up" />
                    <Evo label="IMC" nums={avaliacoes.map(a => a.altura_avaliacao && a.peso_avaliacao ? a.peso_avaliacao / (a.altura_avaliacao ** 2) : null)} fmt={(v) => v.toFixed(1)} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(1)}`} better="neutral" />
                  </div>
                </div>
              )}
              {(avaliacoes.some(a => a.velocidade_10m || a.velocidade_30m || a.salto_vertical || a.agilidade_teste)) && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-positive uppercase tracking-wider mb-3">Testes físicos</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Evo label="Sprint 10m" nums={serie('velocidade_10m')} fmt={(v) => `${v.toFixed(2)}s`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(2)}s`} better="down" />
                    <Evo label="Sprint 30m" nums={serie('velocidade_30m')} fmt={(v) => `${v.toFixed(2)}s`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(2)}s`} better="down" />
                    <Evo label="Salto vertical" nums={serie('salto_vertical')} fmt={(v) => `${v.toFixed(0)}cm`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(0)}cm`} better="up" />
                    <Evo label="Agilidade" nums={serie('agilidade_teste')} fmt={(v) => `${v.toFixed(2)}s`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(2)}s`} better="down" />
                  </div>
                </div>
              )}
              {(avaliacoes.some(a => a.yoyo_distancia || a.sentar_alcancar)) && (
                <div>
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Resistência e flexibilidade</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Evo label="Yo-Yo Test" nums={serie('yoyo_distancia')} fmt={(v) => `${v}m`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d}m`} better="up" sub={[...avaliacoes].reverse().find(a => a.yoyo_nivel)?.yoyo_nivel ? `Nível ${[...avaliacoes].reverse().find(a => a.yoyo_nivel)!.yoyo_nivel}` : undefined} />
                    <Evo label="Flexibilidade" nums={serie('sentar_alcancar')} fmt={(v) => `${v.toFixed(0)}cm`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(0)}cm`} better="up" />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Histórico */}
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Histórico de avaliações</CardTitle>
              {tipos.length > 1 && (
                <div className="w-40"><Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                  <option value="">Todos os tipos</option>
                  {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                </Select></div>
              )}
            </CardHeader>
            <div className="space-y-2.5">
              {historico.map((av) => {
                const media = mediaGeral(av)
                const idxOriginal = avaliacoes.findIndex(a => a.id === av.id)
                const anterior = idxOriginal > 0 ? avaliacoes[idxOriginal - 1] : null
                const variacao = anterior ? media - mediaGeral(anterior) : 0
                return (
                  <div key={av.id} className="rounded-xl p-4 flex items-center justify-between bg-app border border-line">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-brand/15 ring-1 ring-brand/30 grid place-items-center shrink-0"><Star className="w-5 h-5 text-brand" /></div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-strong">{new Date(av.data_avaliacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          <Badge variant="neutral" size="sm">{av.tipo}</Badge>
                        </div>
                        {av.jogos && <p className="text-sm text-soft truncate">vs {av.jogos.adversario}</p>}
                        <div className="flex gap-3 mt-0.5 text-xs text-faint">
                          {av.minutos_jogados ? <span>{av.minutos_jogados} min</span> : null}
                          {av.gols ? <span>{av.gols} gol(s)</span> : null}
                          {av.assistencias ? <span>{av.assistencias} assist.</span> : null}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-brand tabular-nums">{media.toFixed(1).replace('.', ',')}</p>
                      {anterior && <div className={`flex items-center justify-end gap-1 text-sm ${variacaoClass(variacao)}`}>{variacaoIcon(variacao)}<span className="tabular-nums">{variacao > 0 ? '+' : ''}{variacao.toFixed(1).replace('.', ',')}</span></div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
