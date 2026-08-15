'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Shield, Users, Gamepad2, FileBarChart, Star, Calendar, Clock, ChevronRight,
  BarChart3, Target, Activity, Plus, TrendingUp, TrendingDown,
} from 'lucide-react'
import {
  PageHeader, StatCard, Card, CardHeader, CardTitle, Badge, EmptyState, InfoTip,
} from '@/components/app'

type BioAtleta = { id: string; nome: string; posicao: string | null; estagio: string; bio: number | null; crono: number | null }
const idadeCrono = (dob: string | null): number | null => {
  if (!dob) return null
  const d = new Date(dob), h = new Date()
  let i = h.getFullYear() - d.getFullYear()
  const m = h.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && h.getDate() < d.getDate())) i--
  return i >= 0 && i < 100 ? i : null
}

type Jogo = {
  id: string
  data_jogo: string
  adversario: string
  placar_clube: number | null
  placar_adversario: number | null
  competicao: string
  clubes: { nome: string } | { nome: string }[] | null
}

const getClubeName = (clubes: Jogo['clubes']): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
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
  atletas: { nome: string; posicao: string | null } | { nome: string; posicao: string | null }[] | null
}

const getAtleta = (atletas: Avaliacao['atletas']) => {
  if (!atletas) return null
  if (Array.isArray(atletas)) return atletas[0] || null
  return atletas
}

type Bucket = { label: string; count: number }
const mediaCBF8 = (av: Pick<Avaliacao, 'forca' | 'velocidade' | 'tecnica' | 'dinamica' | 'inteligencia' | 'um_contra_um' | 'atitude' | 'potencial'>) =>
  (av.forca + av.velocidade + av.tecnica + av.dinamica + av.inteligencia + av.um_contra_um + av.atitude + av.potencial) / 8

const DONUT_CORES = ['#f59e0b', '#38bdf8', '#22c55e', '#a78bfa', '#f472b6', '#64748b']

export default function DashboardPage() {
  const [stats, setStats] = useState({ clubes: 0, atletas: 0, jogos: 0, analises: 0, avaliacoes: 0 })
  const [ultimosJogos, setUltimosJogos] = useState<Jogo[]>([])
  const [ultimasAvaliacoes, setUltimasAvaliacoes] = useState<Avaliacao[]>([])
  const [porCategoria, setPorCategoria] = useState<Bucket[]>([])
  const [porPosicao, setPorPosicao] = useState<Bucket[]>([])
  const [jogosStats, setJogosStats] = useState({ vitorias: 0, empates: 0, derrotas: 0, saldo: 0, aproveitamento: 0, comPlacar: 0 })
  const [mediaElenco, setMediaElenco] = useState(0)
  const [avalPorMes, setAvalPorMes] = useState<{ label: string; count: number }[]>([])
  const [avalMesAtual, setAvalMesAtual] = useState(0)
  const [avalMesAnterior, setAvalMesAnterior] = useState(0)
  const [bioAtletas, setBioAtletas] = useState<BioAtleta[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadBio = async () => {
      const [atsRes, fisRes] = await Promise.all([
        supabase.from('atletas').select('id, nome, posicao, data_nascimento'),
        supabase.from('avaliacoes_fisicas').select('atleta_id, data_avaliacao, idade_biologica, estagio_phv'),
      ])
      const ats = atsRes.data, fis = fisRes.data
      if (!ats || !fis) return
      const latest = new Map<string, { data_avaliacao: string; idade_biologica: number | null; estagio_phv: string | null }>()
      for (const f of fis) {
        if (!f.estagio_phv) continue
        const prev = latest.get(f.atleta_id)
        if (!prev || new Date(f.data_avaliacao) > new Date(prev.data_avaliacao)) latest.set(f.atleta_id, f)
      }
      const arr: BioAtleta[] = []
      for (const a of ats) {
        const f = latest.get(a.id)
        if (!f || !f.estagio_phv) continue
        arr.push({ id: a.id, nome: a.nome, posicao: a.posicao, estagio: f.estagio_phv, bio: f.idade_biologica, crono: idadeCrono(a.data_nascimento) })
      }
      setBioAtletas(arr)
    }
    loadBio()
  }, [supabase])

  useEffect(() => {
    const loadData = async () => {
      const [clubesRes, analisesRes, jogosAllRes, avalAllRes, jogosRecentes, avalRecentes, atletasData] =
        await Promise.all([
          supabase.from('clubes').select('id', { count: 'exact', head: true }),
          supabase.from('analises_jogo').select('id', { count: 'exact', head: true }),
          supabase.from('jogos').select('placar_clube, placar_adversario'),
          supabase.from('avaliacoes_atleta').select('data_avaliacao, forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial'),
          supabase.from('jogos').select('id, data_jogo, adversario, placar_clube, placar_adversario, competicao, clubes(nome)').order('data_jogo', { ascending: false }).limit(5),
          supabase.from('avaliacoes_atleta').select('id, data_avaliacao, forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial, atletas(nome, posicao)').order('created_at', { ascending: false }).limit(5),
          supabase.from('atletas').select('categoria, posicao'),
        ])

      const jogosAll = jogosAllRes.data || []
      const avalAll = avalAllRes.data || []

      setStats({
        clubes: clubesRes.count || 0,
        atletas: atletasData.data?.length || 0,
        jogos: jogosAll.length,
        analises: analisesRes.count || 0,
        avaliacoes: avalAll.length,
      })

      // Resultados reais (sobre TODOS os jogos com placar)
      let v = 0, e = 0, d = 0, saldo = 0, comPlacar = 0
      for (const j of jogosAll) {
        if (j.placar_clube === null || j.placar_adversario === null) continue
        comPlacar++
        saldo += j.placar_clube - j.placar_adversario
        if (j.placar_clube > j.placar_adversario) v++
        else if (j.placar_clube < j.placar_adversario) d++
        else e++
      }
      setJogosStats({ vitorias: v, empates: e, derrotas: d, saldo, comPlacar, aproveitamento: comPlacar ? Math.round(((v * 3 + e) / (comPlacar * 3)) * 100) : 0 })

      // Média do elenco real + avaliações por mês
      if (avalAll.length) {
        setMediaElenco(avalAll.reduce((s, a) => s + mediaCBF8(a), 0) / avalAll.length)
      }
      const agora = new Date()
      const meses: { label: string; count: number; y: number; m: number }[] = []
      for (let i = 5; i >= 0; i--) {
        const dt = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
        meses.push({ label: dt.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''), count: 0, y: dt.getFullYear(), m: dt.getMonth() })
      }
      for (const a of avalAll) {
        if (!a.data_avaliacao) continue
        const dt = new Date(a.data_avaliacao)
        const bucket = meses.find(mm => mm.y === dt.getFullYear() && mm.m === dt.getMonth())
        if (bucket) bucket.count++
      }
      setAvalPorMes(meses.map(mm => ({ label: mm.label, count: mm.count })))
      setAvalMesAtual(meses[5]?.count || 0)
      setAvalMesAnterior(meses[4]?.count || 0)

      if (jogosRecentes.data) setUltimosJogos(jogosRecentes.data)
      if (avalRecentes.data) setUltimasAvaliacoes(avalRecentes.data)

      if (atletasData.data) {
        const catMap: Record<string, number> = {}
        const posMap: Record<string, number> = {}
        atletasData.data.forEach((a) => {
          const cat = a.categoria || 'Sem categoria'
          const pos = a.posicao || 'Sem posicao'
          catMap[cat] = (catMap[cat] || 0) + 1
          posMap[pos] = (posMap[pos] || 0) + 1
        })
        setPorCategoria(Object.entries(catMap).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count))
        setPorPosicao(Object.entries(posMap).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count))
      }

      setLoading(false)
    }
    loadData()
  }, [supabase])

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const trendAval = avalMesAtual - avalMesAnterior

  return (
    <div>
      <PageHeader eyebrow="Visão geral" title="Dashboard" description="Resumo do sistema em tempo real" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Clubes" value={stats.clubes} icon={Shield} tone="info" href="/clubes" loading={loading} meta="cadastrados" />
        <StatCard label="Atletas" value={stats.atletas} icon={Users} tone="indigo" href="/atletas" loading={loading}
          meta={<><div>{porPosicao.length} posições</div><div>{porCategoria.length} categorias</div></>} />
        <StatCard label="Jogos" value={stats.jogos} icon={Gamepad2} tone="positive" href="/jogos" loading={loading}
          meta={
            <div className="space-y-0.5">
              <div className="text-positive font-semibold">{jogosStats.vitorias} V · {jogosStats.empates} E · {jogosStats.derrotas} D</div>
              <div className="text-soft">{jogosStats.aproveitamento}% · saldo {jogosStats.saldo > 0 ? '+' : ''}{jogosStats.saldo}</div>
            </div>
          } />
        <StatCard label="Análises" value={stats.analises} icon={FileBarChart} tone="caution" href="/analises" loading={loading} meta="de jogos" />
        <StatCard label="Avaliações" value={stats.avaliacoes} icon={Star} tone="violet" href="/avaliacoes" loading={loading}
          meta={
            <>
              <div className="flex items-center gap-1 justify-end"><Activity className="w-3 h-3" /><span className="font-semibold">{mediaElenco.toFixed(1).replace('.', ',')}</span> média</div>
              {trendAval !== 0 && (
                <div className={`flex items-center gap-1 justify-end mt-0.5 font-semibold ${trendAval > 0 ? 'text-positive' : 'text-negative'}`}>
                  {trendAval > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trendAval > 0 ? '+' : ''}{trendAval} no mês
                </div>
              )}
            </>
          } />
      </div>

      {/* Sparkline avaliações/mês */}
      <div className="mb-6 sm:mb-8">
        <SparklineCard data={avalPorMes} atual={avalMesAtual} anterior={avalMesAnterior} />
      </div>

      {/* Distribuições */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <DonutCard title="Atletas por categoria" icon={Target} buckets={porCategoria} />
        <DistribuicaoCard title="Atletas por posição" icon={BarChart3} buckets={porPosicao.slice(0, 8)} />
      </div>

      {/* Bio-banding — agrupamento por maturação */}
      {bioAtletas.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <BioBandingCard atletas={bioAtletas} />
        </div>
      )}

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card padding="none">
          <CardHeader className="p-4 sm:p-5 m-0 pb-3">
            <div className="flex items-center gap-2"><Gamepad2 className="w-4 h-4 text-positive" /><CardTitle>Últimos jogos</CardTitle></div>
            <Link href="/jogos" className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1">Ver todos <ChevronRight className="w-3.5 h-3.5" /></Link>
          </CardHeader>
          {ultimosJogos.length === 0 ? (
            <div className="p-5"><EmptyState icon={Gamepad2} title="Nenhum jogo cadastrado" description="Comece registrando o primeiro jogo." /></div>
          ) : (
            <ul className="divide-y divide-line">
              {ultimosJogos.map((jogo) => {
                const resultado = jogo.placar_clube !== null && jogo.placar_adversario !== null
                  ? jogo.placar_clube > jogo.placar_adversario ? 'positive' : jogo.placar_clube < jogo.placar_adversario ? 'negative' : 'neutral'
                  : 'neutral'
                return (
                  <li key={jogo.id}>
                    <Link href={`/jogos/${jogo.id}`} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-surface-2 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-positive/15 ring-1 ring-positive/30 flex items-center justify-center shrink-0"><Gamepad2 className="w-4 h-4 text-positive" /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-strong truncate">{getClubeName(jogo.clubes) || 'Clube'} <span className="text-faint">vs</span> {jogo.adversario}</p>
                          <p className="text-xs text-soft flex items-center gap-1.5 mt-0.5 truncate"><Calendar className="w-3 h-3 shrink-0" />{formatDate(jogo.data_jogo)}<span className="text-line-strong">•</span><span className="truncate">{jogo.competicao}</span></p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {jogo.placar_clube !== null && jogo.placar_adversario !== null ? (
                          <span className={'font-bold tabular-nums ' + (resultado === 'positive' ? 'text-positive' : resultado === 'negative' ? 'text-negative' : 'text-soft')}>{jogo.placar_clube} × {jogo.placar_adversario}</span>
                        ) : <span className="text-xs text-faint">Sem placar</span>}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card padding="none">
          <CardHeader className="p-4 sm:p-5 m-0 pb-3">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-brand" /><CardTitle>Últimas avaliações</CardTitle></div>
            <Link href="/avaliacoes" className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1">Ver todas <ChevronRight className="w-3.5 h-3.5" /></Link>
          </CardHeader>
          {ultimasAvaliacoes.length === 0 ? (
            <div className="p-5"><EmptyState icon={Star} title="Nenhuma avaliação cadastrada" description="Registre a primeira avaliação de um atleta." /></div>
          ) : (
            <ul className="divide-y divide-line">
              {ultimasAvaliacoes.map((av) => {
                const atleta = getAtleta(av.atletas)
                return (
                  <li key={av.id}>
                    <Link href={`/avaliacoes/${av.id}`} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-surface-2 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-brand/15 ring-1 ring-brand/30 flex items-center justify-center shrink-0"><Users className="w-4 h-4 text-brand" /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-strong truncate">{atleta?.nome || 'Atleta'}</p>
                          <p className="text-xs text-soft flex items-center gap-1.5 mt-0.5 truncate"><Clock className="w-3 h-3 shrink-0" />{formatDate(av.data_avaliacao)}{atleta?.posicao && (<><span className="text-line-strong">•</span><span className="truncate">{atleta.posicao}</span></>)}</p>
                        </div>
                      </div>
                      <Badge variant="brand" size="md"><Activity className="w-3 h-3" />{mediaCBF8(av).toFixed(1).replace('.', ',')}</Badge>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">Atalhos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <QuickAction href="/clubes/novo" label="Novo clube" icon={Shield} tone="info" />
          <QuickAction href="/atletas/novo" label="Novo atleta" icon={Users} tone="indigo" />
          <QuickAction href="/jogos/novo" label="Novo jogo" icon={Gamepad2} tone="positive" />
          <QuickAction href="/avaliacoes/nova" label="Nova avaliação" icon={Star} tone="violet" />
        </div>
      </div>
    </div>
  )
}

function SparklineCard({ data, atual, anterior }: { data: { label: string; count: number }[]; atual: number; anterior: number }) {
  const max = Math.max(1, ...data.map(d => d.count))
  const w = 100, h = 34
  const pts = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * w : 0
    const y = h - (d.count / max) * (h - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const trend = atual - anterior
  return (
    <Card padding="md">
      <CardHeader>
        <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand" /><CardTitle>Avaliações por mês</CardTitle></div>
        <span className={`text-xs font-semibold flex items-center gap-1 ${trend >= 0 ? 'text-positive' : 'text-negative'}`}>
          {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {trend > 0 ? '+' : ''}{trend} vs mês anterior
        </span>
      </CardHeader>
      {data.length === 0 ? (
        <p className="text-sm text-soft py-6 text-center">Sem dados</p>
      ) : (
        <div className="flex items-end gap-4">
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-16">
            <polyline fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" points={pts.join(' ')} />
            <polygon fill="rgba(245,158,11,.12)" points={`0,${h} ${pts.join(' ')} ${w},${h}`} />
          </svg>
        </div>
      )}
      <div className="flex justify-between mt-1 text-[10px] text-faint uppercase tracking-wide">
        {data.map((d, i) => <span key={i} className="tabular-nums">{d.label} <b className="text-soft">{d.count}</b></span>)}
      </div>
    </Card>
  )
}

function DonutCard({ title, icon: Icon, buckets }: { title: string; icon: React.ComponentType<{ className?: string }>; buckets: Bucket[] }) {
  const total = buckets.reduce((s, b) => s + b.count, 0)
  const top = buckets.slice(0, 6)
  let acc = 0
  const segments = top.map((b, i) => {
    const start = total ? (acc / total) * 100 : 0
    acc += b.count
    const end = total ? (acc / total) * 100 : 0
    return `${DONUT_CORES[i % DONUT_CORES.length]} ${start}% ${end}%`
  })
  return (
    <Card padding="md">
      <CardHeader>
        <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-brand" /><CardTitle>{title}</CardTitle></div>
        <span className="text-xs text-faint tabular-nums">{total}</span>
      </CardHeader>
      {total === 0 ? (
        <p className="text-sm text-soft py-6 text-center">Sem dados</p>
      ) : (
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full" style={{ background: `conic-gradient(${segments.join(', ')})` }} />
            <div className="absolute inset-[26px] rounded-full bg-surface flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-strong tabular-nums leading-none">{total}</span>
              <span className="text-[9px] text-faint uppercase">atletas</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {top.map((b, i) => (
              <div key={b.label} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: DONUT_CORES[i % DONUT_CORES.length] }} />
                <span className="text-soft truncate flex-1">{b.label}</span>
                <span className="text-strong font-semibold tabular-nums">{b.count}</span>
                <span className="text-faint tabular-nums w-9 text-right">{total ? Math.round((b.count / total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

function BioBandingCard({ atletas }: { atletas: BioAtleta[] }) {
  const grupos: { key: string; label: string; desc: string; cor: string }[] = [
    { key: 'pre', label: 'Pré-PHV', desc: 'antes do pico de crescimento', cor: '#22c55e' },
    { key: 'durante', label: 'Durante o pico (PHV)', desc: 'fase de estirão', cor: '#f59e0b' },
    { key: 'pos', label: 'Pós-PHV', desc: 'após o pico', cor: '#38bdf8' },
  ]
  return (
    <Card padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand" />
          <CardTitle>Bio-banding · agrupamento por maturação</CardTitle>
          <InfoTip text="Agrupa os atletas pela fase de maturação (PHV), não pela idade do documento. Comparar e treinar atletas na mesma fase é mais justo: um 'pré-PHV' pequeno hoje pode explodir no estirão. Padrão em centros de formação de ponta." />
        </div>
        <span className="text-xs text-faint tabular-nums">{atletas.length} com dados</span>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {grupos.map((g) => {
          const lista = atletas.filter(a => a.estagio === g.key).sort((a, b) => (b.bio ?? 0) - (a.bio ?? 0))
          return (
            <div key={g.key} className="rounded-xl bg-app border border-line p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: g.cor }} />
                <span className="text-sm font-semibold text-strong">{g.label}</span>
                <span className="text-xs text-faint tabular-nums ml-auto">{lista.length}</span>
              </div>
              <p className="text-[10px] text-faint mb-2">{g.desc}</p>
              {lista.length === 0 ? (
                <p className="text-xs text-soft py-2 text-center">—</p>
              ) : (
                <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {lista.map((a) => {
                    const diff = a.bio != null && a.crono != null ? a.bio - a.crono : null
                    return (
                      <li key={a.id} className="flex items-center gap-2 text-xs">
                        <span className="text-strong truncate flex-1">{a.nome}</span>
                        {a.posicao && <span className="text-faint hidden sm:inline truncate max-w-[70px]">{a.posicao}</span>}
                        <span className="text-soft tabular-nums shrink-0">
                          {a.bio != null ? `${a.bio.toFixed(1).replace('.', ',')}a` : '—'}
                          {diff != null && (
                            <span className={diff > 0.5 ? 'text-caution' : diff < -0.5 ? 'text-info' : 'text-faint'}> ({diff > 0 ? '+' : ''}{diff.toFixed(1).replace('.', ',')})</span>
                          )}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-faint mt-3">Idade biológica ao lado do nome; entre parênteses, a diferença para a idade real (+ precoce / − tardio).</p>
    </Card>
  )
}

function DistribuicaoCard({ title, icon: Icon, buckets }: { title: string; icon: React.ComponentType<{ className?: string }>; buckets: Bucket[] }) {
  const max = buckets.length > 0 ? Math.max(...buckets.map((b) => b.count)) : 1
  return (
    <Card padding="md">
      <CardHeader>
        <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-brand" /><CardTitle>{title}</CardTitle></div>
        <span className="text-xs text-faint tabular-nums">{buckets.length}</span>
      </CardHeader>
      {buckets.length === 0 ? (
        <p className="text-sm text-soft py-6 text-center">Sem dados</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {buckets.map((b) => {
            const pct = (b.count / max) * 100
            return (
              <div key={b.label} className="flex items-center gap-3">
                <span className="text-xs text-soft truncate w-24 shrink-0">{b.label}</span>
                <div className="flex-1 h-2 rounded-full bg-app overflow-hidden"><div className="h-full rounded-full bg-brand/80" style={{ width: `${pct}%` }} /></div>
                <span className="text-xs font-semibold text-strong tabular-nums w-8 text-right">{b.count}</span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

const quickActionTone = {
  info: 'text-info bg-info/15 ring-info/30',
  indigo: 'text-indigo-400 bg-indigo-500/15 ring-indigo-500/30',
  positive: 'text-positive bg-positive/15 ring-positive/30',
  violet: 'text-purple-400 bg-purple-500/15 ring-purple-500/30',
} as const

function QuickAction({ href, label, icon: Icon, tone }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; tone: keyof typeof quickActionTone }) {
  return (
    <Link href={href} className="group rounded-2xl bg-surface border border-line p-4 sm:p-5 transition-all duration-150 hover:bg-surface-2 hover:border-line-strong">
      <div className={'w-10 h-10 rounded-xl flex items-center justify-center ring-1 mb-3 ' + quickActionTone[tone]}><Icon className="w-5 h-5" /></div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">Adicionar</p>
      <p className="text-sm sm:text-base font-semibold text-strong flex items-center gap-1.5 mt-0.5">{label}<Plus className="w-3.5 h-3.5 text-faint group-hover:text-brand transition-colors" /></p>
    </Link>
  )
}
