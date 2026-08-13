'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Star, Calendar, ArrowLeft, User, TrendingUp, Clock, Ruler, Scale, Activity, ArrowUp, ArrowDown, Minus, Gauge, Target } from 'lucide-react'
import Link from 'next/link'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'
import { Radar, Line } from 'react-chartjs-2'
import { PageHeader, StatCard, Card, CardHeader, CardTitle, Badge, Button, Spinner, EmptyState, Modal } from '@/components/app'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale)

type Atleta = { id: string; nome: string; posicao: string | null; foto_url: string | null; clubes: { nome: string } | { nome: string }[] | null }
const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined): string =>
  !clubes ? '' : Array.isArray(clubes) ? clubes[0]?.nome || '' : clubes.nome || ''

type Avaliacao = {
  id: string; data_avaliacao: string; tipo: string; contexto_treino: string | null; minutos_jogados: number | null; gols: number | null; assistencias: number | null
  forca: number; velocidade: number; tecnica: number; dinamica: number; inteligencia: number; um_contra_um: number; atitude: number; potencial: number
  penetracao: number; cobertura_ofensiva: number; espaco_com_bola: number; espaco_sem_bola: number; mobilidade: number; unidade_ofensiva: number
  contencao: number; cobertura_defensiva: number; equilibrio_recuperacao: number; equilibrio_defensivo: number; concentracao_def: number; unidade_defensiva: number
  altura_avaliacao: number | null; peso_avaliacao: number | null; envergadura: number | null
  velocidade_10m: number | null; velocidade_30m: number | null; salto_vertical: number | null; agilidade_teste: number | null
  yoyo_nivel: string | null; yoyo_distancia: number | null; idade_biologica: number | null; estagio_phv: string | null; sentar_alcancar: number | null
  jogos: { adversario: string; data_jogo: string } | { adversario: string; data_jogo: string }[] | null
}
const getJogo = (jogos: Avaliacao['jogos']) => !jogos ? null : Array.isArray(jogos) ? jogos[0] || null : jogos

const CBF8 = ['forca', 'velocidade', 'tecnica', 'dinamica', 'inteligencia', 'um_contra_um', 'atitude', 'potencial'] as const
const dimensoesLabels = ['FOR', 'VEL', 'TEC', 'DIN', 'INT', '1v1', 'ATI', 'POT', 'PEN', 'COF', 'ECB', 'ESB', 'MOB', 'UOF', 'CON', 'CDF', 'ERE', 'EDF', 'CNC', 'UDF']
const dimensoesKeys: (keyof Avaliacao)[] = ['forca', 'velocidade', 'tecnica', 'dinamica', 'inteligencia', 'um_contra_um', 'atitude', 'potencial', 'penetracao', 'cobertura_ofensiva', 'espaco_com_bola', 'espaco_sem_bola', 'mobilidade', 'unidade_ofensiva', 'contencao', 'cobertura_defensiva', 'equilibrio_recuperacao', 'equilibrio_defensivo', 'concentracao_def', 'unidade_defensiva']

const mediaCBF = (av: Avaliacao) => CBF8.reduce((s, k) => s + (av[k] || 0), 0) / CBF8.length
const ringColor = (m: number) => m >= 4 ? '#22c55e' : m >= 3.5 ? '#84cc16' : m >= 2.5 ? '#f59e0b' : '#ef4444'

function MediaRing({ valor, size = 36 }: { valor: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (valor / 5) * 100))
  const inner = size - 10
  return (
    <div className="rounded-full grid place-items-center shrink-0" style={{ width: size, height: size, background: `conic-gradient(${ringColor(valor)} ${pct}%, #334155 0)` }}>
      <div className="rounded-full bg-surface grid place-items-center font-bold text-strong tabular-nums" style={{ width: inner, height: inner, fontSize: size > 40 ? 13 : 11 }}>{valor.toFixed(1).replace('.', ',')}</div>
    </div>
  )
}

function FisRow({ label, nums, fmt, deltaFmt, better = 'up', sub }: { label: string; nums: (number | null)[]; fmt: (v: number) => string; deltaFmt: (d: number) => string; better?: 'up' | 'down' | 'neutral'; sub?: string }) {
  const vals = nums.filter((v): v is number => v != null)
  if (!vals.length) return null
  const last = vals[vals.length - 1], d = vals.length > 1 ? last - vals[0] : 0
  const good = better === 'neutral' || d === 0 ? null : better === 'down' ? d < 0 : d > 0
  const cls = good === null ? 'text-faint' : good ? 'text-positive' : 'text-negative'
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-soft">{label}</span>
      <div className="flex items-center gap-2">
        {sub && <span className="text-[11px] text-purple-400">{sub}</span>}
        <span className="text-base font-bold text-strong tabular-nums">{fmt(last)}</span>
        {vals.length > 1 && d !== 0 && (
          <span className={`text-xs flex items-center gap-0.5 ${cls}`}>{(better === 'down' ? d < 0 : d > 0) ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{deltaFmt(d)}</span>
        )}
      </div>
    </div>
  )
}

export default function AvaliacoesAtletaPage() {
  const params = useParams()
  const atletaId = params.atletaId as string
  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [aExcluir, setAExcluir] = useState<Avaliacao | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadData() }, [atletaId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    const { data: atletaData } = await supabase.from('atletas').select('id, nome, posicao, foto_url, clubes(nome)').eq('id', atletaId).single()
    if (atletaData) setAtleta(atletaData)
    const { data: avaliacoesData } = await supabase
      .from('avaliacoes_atleta')
      .select(`id, data_avaliacao, tipo, contexto_treino, minutos_jogados, gols, assistencias, forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial, penetracao, cobertura_ofensiva, espaco_com_bola, espaco_sem_bola, mobilidade, unidade_ofensiva, contencao, cobertura_defensiva, equilibrio_recuperacao, equilibrio_defensivo, concentracao_def, unidade_defensiva, altura_avaliacao, peso_avaliacao, envergadura, velocidade_10m, velocidade_30m, salto_vertical, agilidade_teste, yoyo_nivel, yoyo_distancia, idade_biologica, estagio_phv, sentar_alcancar, jogos(adversario, data_jogo)`)
      .eq('atleta_id', atletaId)
      .order('data_avaliacao', { ascending: false })
    if (avaliacoesData) setAvaliacoes(avaliacoesData)
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('avaliacoes_atleta').delete().eq('id', aExcluir.id)
    if (!error) setAvaliacoes(prev => prev.filter(a => a.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR')
  const tipoLabel = (t: string) => ({ jogo: 'Jogo', treino: 'Treino', geral: 'Geral' } as Record<string, string>)[t] || t

  const cron = useMemo(() => [...avaliacoes].reverse(), [avaliacoes])
  const serie = (key: keyof Avaliacao) => cron.map(av => av[key] as number | null)

  const resumo = useMemo(() => {
    if (!avaliacoes.length) return null
    const medias = avaliacoes.map(mediaCBF)
    const geral = medias.reduce((a, b) => a + b, 0) / medias.length
    const cronMedias = cron.map(mediaCBF)
    const trend = cronMedias.length > 1 ? cronMedias[cronMedias.length - 1] - cronMedias[0] : 0
    return {
      geral, trend,
      minutos: avaliacoes.reduce((s, av) => s + (av.minutos_jogados || 0), 0),
      jogosComMin: avaliacoes.filter(av => av.minutos_jogados && av.minutos_jogados > 0).length,
      gols: avaliacoes.reduce((s, av) => s + (av.gols || 0), 0),
      assist: avaliacoes.reduce((s, av) => s + (av.assistencias || 0), 0),
    }
  }, [avaliacoes, cron])

  const mediaDimensao = (campo: keyof Avaliacao) => avaliacoes.length ? avaliacoes.reduce((s, av) => s + (Number(av[campo]) || 0), 0) / avaliacoes.length : 0

  const radarData = {
    labels: dimensoesLabels,
    datasets: [{ data: dimensoesKeys.map(k => mediaDimensao(k)), backgroundColor: 'rgba(245,158,11,.25)', borderColor: '#f59e0b', borderWidth: 2, pointBackgroundColor: '#f59e0b', pointBorderColor: '#fff', pointRadius: 2.5 }],
  }
  const radarOptions = {
    scales: { r: { beginAtZero: true, max: 5, min: 0, ticks: { display: false }, pointLabels: { font: { size: 9, weight: 'bold' as const }, color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,.2)' }, angleLines: { color: 'rgba(148,163,184,.2)' } } },
    plugins: { legend: { display: false } }, maintainAspectRatio: true,
  }
  const lineData = {
    labels: cron.map(av => new Date(av.data_avaliacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
    datasets: [{ label: 'Média', data: cron.map(mediaCBF), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.12)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#f59e0b' }],
  }
  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { y: { min: 0, max: 5, ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } },
    plugins: { legend: { display: false } },
  }

  const temFisico = avaliacoes.some(av => av.altura_avaliacao || av.peso_avaliacao || av.velocidade_10m || av.salto_vertical || av.yoyo_distancia || av.sentar_alcancar)

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando avaliações..." /></div>

  return (
    <div>
      {/* Header responsivo */}
      <div className="flex items-start gap-3 mb-5">
        <Link href="/avaliacoes" className="w-9 h-9 grid place-items-center text-faint hover:text-brand hover:bg-surface-2 rounded-lg transition-colors shrink-0"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {atleta?.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={atleta.foto_url} alt={atleta.nome} className="w-14 h-14 rounded-full object-cover border-2 border-brand/50 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-surface-2 border-2 border-line grid place-items-center shrink-0"><User className="w-7 h-7 text-faint" /></div>
              )}
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-strong truncate">{atleta?.nome}</h1>
                <div className="flex items-center gap-2 text-sm text-soft flex-wrap">
                  {atleta?.posicao && <span>{atleta.posicao}</span>}
                  {getClubeName(atleta?.clubes) && <span className="text-brand">{getClubeName(atleta?.clubes)}</span>}
                  <span className="text-faint">· {avaliacoes.length} avaliaç{avaliacoes.length !== 1 ? 'ões' : 'ão'}</span>
                </div>
              </div>
            </div>
            <Link href={`/avaliacoes/nova?atleta=${atletaId}`} className="shrink-0"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nova avaliação</span><span className="sm:hidden">Nova</span></Button></Link>
          </div>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <EmptyState icon={Star} title="Nenhuma avaliação para este atleta" description="Crie a primeira avaliação para começar a acompanhar a evolução."
          action={<Link href={`/avaliacoes/nova?atleta=${atletaId}`}><Button size="sm"><Plus className="w-4 h-4" />Nova avaliação</Button></Link>} />
      ) : (
        <>
          {/* KPIs */}
          {resumo && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <StatCard label="Média geral" value={resumo.geral.toFixed(1).replace('.', ',')} icon={Gauge} tone="brand"
                meta={resumo.trend !== 0 ? <span className={resumo.trend > 0 ? 'text-positive font-semibold' : 'text-negative font-semibold'}>{resumo.trend > 0 ? '+' : ''}{resumo.trend.toFixed(1).replace('.', ',')} no total</span> : undefined} />
              <StatCard label="Minutos" value={resumo.minutos} icon={Clock} tone="info" meta={`${resumo.jogosComMin} jogo${resumo.jogosComMin !== 1 ? 's' : ''}`} />
              <StatCard label="Gols" value={resumo.gols} icon={Star} tone="positive" />
              <StatCard label="Assistências" value={resumo.assist} icon={Target} tone="violet" />
            </div>
          )}

          {/* Radar médio + tendência */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card padding="lg">
              <CardTitle className="mb-3">Perfil médio (20 dimensões)</CardTitle>
              <div className="max-w-[320px] mx-auto"><Radar data={radarData} options={radarOptions} /></div>
            </Card>
            <Card padding="lg">
              <CardHeader><CardTitle>Tendência da média</CardTitle><span className="flex items-center gap-1 text-xs text-soft"><TrendingUp className="w-3.5 h-3.5" />{cron.length} avaliações</span></CardHeader>
              {cron.length > 1 ? <div className="h-[280px]"><Line data={lineData} options={lineOptions} /></div> : <p className="text-sm text-soft text-center py-16">Ainda não há avaliações suficientes para traçar a tendência.</p>}
            </Card>
          </div>

          {/* Evolução física */}
          {temFisico && (
            <Card padding="lg" className="mb-4 sm:mb-6">
              <CardTitle className="mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-positive" />Evolução física</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cron.some(a => a.altura_avaliacao || a.peso_avaliacao || a.envergadura) && (
                  <div className="rounded-xl p-4 bg-app border border-line">
                    <h4 className="text-xs font-semibold text-info mb-3 uppercase tracking-wider flex items-center gap-2"><Ruler className="w-4 h-4" />Antropometria</h4>
                    <div className="space-y-2">
                      <FisRow label="Altura" nums={serie('altura_avaliacao')} fmt={(v) => `${v.toFixed(2)}m`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${(d * 100).toFixed(0)}cm`} better="up" />
                      <FisRow label="Peso" nums={serie('peso_avaliacao')} fmt={(v) => `${v.toFixed(1)}kg`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(1)}kg`} better="neutral" />
                      <FisRow label="Envergadura" nums={serie('envergadura')} fmt={(v) => `${v.toFixed(2)}m`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${(d * 100).toFixed(0)}cm`} better="up" />
                    </div>
                  </div>
                )}
                {cron.some(a => a.velocidade_10m || a.velocidade_30m || a.salto_vertical || a.agilidade_teste) && (
                  <div className="rounded-xl p-4 bg-app border border-line">
                    <h4 className="text-xs font-semibold text-brand mb-3 uppercase tracking-wider flex items-center gap-2"><TrendingUp className="w-4 h-4" />Testes físicos</h4>
                    <div className="space-y-2">
                      <FisRow label="10m" nums={serie('velocidade_10m')} fmt={(v) => `${v.toFixed(2)}s`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(2)}s`} better="down" />
                      <FisRow label="30m" nums={serie('velocidade_30m')} fmt={(v) => `${v.toFixed(2)}s`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(2)}s`} better="down" />
                      <FisRow label="Salto" nums={serie('salto_vertical')} fmt={(v) => `${v.toFixed(0)}cm`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(0)}cm`} better="up" />
                      <FisRow label="Agilidade" nums={serie('agilidade_teste')} fmt={(v) => `${v.toFixed(2)}s`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(2)}s`} better="down" />
                    </div>
                  </div>
                )}
                {cron.some(a => a.yoyo_distancia || a.sentar_alcancar) && (
                  <div className="rounded-xl p-4 bg-app border border-line">
                    <h4 className="text-xs font-semibold text-purple-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Scale className="w-4 h-4" />Resist. e flex.</h4>
                    <div className="space-y-2">
                      <FisRow label="Yo-Yo" nums={serie('yoyo_distancia')} fmt={(v) => `${v}m`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d}m`} better="up" sub={[...cron].reverse().find(a => a.yoyo_nivel)?.yoyo_nivel ? `Nv ${[...cron].reverse().find(a => a.yoyo_nivel)!.yoyo_nivel}` : undefined} />
                      <FisRow label="Flexibilidade" nums={serie('sentar_alcancar')} fmt={(v) => `${v.toFixed(0)}cm`} deltaFmt={(d) => `${d > 0 ? '+' : ''}${d.toFixed(0)}cm`} better="up" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Lista de avaliações */}
          <div className="space-y-2.5">
            {avaliacoes.map((av) => {
              const media = mediaCBF(av)
              const jogo = getJogo(av.jogos)
              return (
                <Card key={av.id} padding="none" className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <MediaRing valor={media} size={48} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={av.tipo === 'jogo' ? 'info' : av.tipo === 'treino' ? 'positive' : 'neutral'} size="sm">{tipoLabel(av.tipo)}</Badge>
                        {jogo && <span className="text-sm text-strong truncate">vs {jogo.adversario}</span>}
                        {av.contexto_treino && <span className="text-sm text-soft truncate">· {av.contexto_treino}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-soft flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(av.data_avaliacao)}</span>
                        {av.minutos_jogados ? <span className="flex items-center gap-1 text-brand"><Clock className="w-3 h-3" />{av.minutos_jogados}′</span> : null}
                        {av.gols ? <span className="text-positive font-medium">{av.gols} gol{av.gols > 1 ? 's' : ''}</span> : null}
                        {av.assistencias ? <span className="text-info font-medium">{av.assistencias} assist.</span> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/avaliacoes/${av.id}`} className="p-2 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" title="Editar"><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => setAExcluir(av)} className="p-2 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      <Modal isOpen={!!aExcluir} onClose={() => setAExcluir(null)} title="Excluir avaliação" size="sm"
        footer={<><Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button><Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button></>}>
        <p className="text-sm text-soft">Excluir a avaliação de <b className="text-strong">{aExcluir ? formatDate(aExcluir.data_avaliacao) : ''}</b>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
