'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Shield,
  Users,
  Gamepad2,
  FileBarChart,
  Star,
  Calendar,
  Clock,
  ChevronRight,
  BarChart3,
  Target,
  Activity,
  Plus,
} from 'lucide-react'
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  EmptyState,
} from '@/components/app'

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
  atletas:
    | { nome: string; posicao: string | null }
    | { nome: string; posicao: string | null }[]
    | null
}

const getAtleta = (atletas: Avaliacao['atletas']) => {
  if (!atletas) return null
  if (Array.isArray(atletas)) return atletas[0] || null
  return atletas
}

type Bucket = { label: string; count: number }

export default function DashboardPage() {
  const [stats, setStats] = useState({
    clubes: 0,
    atletas: 0,
    jogos: 0,
    analises: 0,
    avaliacoes: 0,
  })
  const [ultimosJogos, setUltimosJogos] = useState<Jogo[]>([])
  const [ultimasAvaliacoes, setUltimasAvaliacoes] = useState<Avaliacao[]>([])
  const [porCategoria, setPorCategoria] = useState<Bucket[]>([])
  const [porPosicao, setPorPosicao] = useState<Bucket[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const [clubesRes, atletasRes, jogosRes, analisesRes, avaliacoesRes] =
        await Promise.all([
          supabase.from('clubes').select('id', { count: 'exact', head: true }),
          supabase.from('atletas').select('id', { count: 'exact', head: true }),
          supabase.from('jogos').select('id', { count: 'exact', head: true }),
          supabase
            .from('analises_jogo')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('avaliacoes_atleta')
            .select('id', { count: 'exact', head: true }),
        ])

      setStats({
        clubes: clubesRes.count || 0,
        atletas: atletasRes.count || 0,
        jogos: jogosRes.count || 0,
        analises: analisesRes.count || 0,
        avaliacoes: avaliacoesRes.count || 0,
      })

      const { data: jogosData } = await supabase
        .from('jogos')
        .select(
          'id, data_jogo, adversario, placar_clube, placar_adversario, competicao, clubes(nome)'
        )
        .order('data_jogo', { ascending: false })
        .limit(5)
      if (jogosData) setUltimosJogos(jogosData)

      const { data: avaliacoesData } = await supabase
        .from('avaliacoes_atleta')
        .select(
          'id, data_avaliacao, forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial, atletas(nome, posicao)'
        )
        .order('created_at', { ascending: false })
        .limit(5)
      if (avaliacoesData) setUltimasAvaliacoes(avaliacoesData)

      const { data: atletasData } = await supabase
        .from('atletas')
        .select('categoria, posicao')

      if (atletasData) {
        const catMap: Record<string, number> = {}
        const posMap: Record<string, number> = {}
        atletasData.forEach((a) => {
          const cat = a.categoria || 'Sem categoria'
          const pos = a.posicao || 'Sem posicao'
          catMap[cat] = (catMap[cat] || 0) + 1
          posMap[pos] = (posMap[pos] || 0) + 1
        })
        setPorCategoria(
          Object.entries(catMap)
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count)
        )
        setPorPosicao(
          Object.entries(posMap)
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count)
        )
      }

      setLoading(false)
    }
    loadData()
  }, [supabase])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const calcularMedia = (av: Avaliacao) => {
    const soma =
      av.forca +
      av.velocidade +
      av.tecnica +
      av.dinamica +
      av.inteligencia +
      av.um_contra_um +
      av.atitude +
      av.potencial
    return (soma / 8).toFixed(1)
  }

  const jogosStats = ultimosJogos.reduce(
    (acc, jogo) => {
      if (jogo.placar_clube !== null && jogo.placar_adversario !== null) {
        if (jogo.placar_clube > jogo.placar_adversario) acc.vitorias++
        else if (jogo.placar_clube < jogo.placar_adversario) acc.derrotas++
        else acc.empates++
      }
      return acc
    },
    { vitorias: 0, derrotas: 0, empates: 0 }
  )

  const mediaGeral =
    ultimasAvaliacoes.length > 0
      ? (
          ultimasAvaliacoes.reduce(
            (acc, av) => acc + parseFloat(calcularMedia(av)),
            0
          ) / ultimasAvaliacoes.length
        ).toFixed(1)
      : '0.0'

  return (
    <div>
      <PageHeader
        eyebrow="Visao geral"
        title="Dashboard"
        description="Resumo do sistema em tempo real"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          label="Clubes"
          value={stats.clubes}
          icon={Shield}
          tone="info"
          href="/clubes"
          loading={loading}
          meta="cadastrados"
        />
        <StatCard
          label="Atletas"
          value={stats.atletas}
          icon={Users}
          tone="indigo"
          href="/atletas"
          loading={loading}
          meta={
            <>
              <div>{porPosicao.length} posicoes</div>
              <div>{porCategoria.length} categorias</div>
            </>
          }
        />
        <StatCard
          label="Jogos"
          value={stats.jogos}
          icon={Gamepad2}
          tone="positive"
          href="/jogos"
          loading={loading}
          meta={
            <div className="space-y-0.5">
              <div className="text-positive font-semibold">{jogosStats.vitorias} V</div>
              <div className="text-caution font-semibold">{jogosStats.empates} E</div>
              <div className="text-negative font-semibold">{jogosStats.derrotas} D</div>
            </div>
          }
        />
        <StatCard
          label="Analises"
          value={stats.analises}
          icon={FileBarChart}
          tone="caution"
          href="/analises"
          loading={loading}
          meta="de jogos"
        />
        <StatCard
          label="Avaliacoes"
          value={stats.avaliacoes}
          icon={Star}
          tone="violet"
          href="/avaliacoes"
          loading={loading}
          meta={
            <>
              <div>de atletas</div>
              {parseFloat(mediaGeral) > 0 && (
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <Activity className="w-3 h-3" />
                  <span className="font-semibold">{mediaGeral}</span>
                </div>
              )}
            </>
          }
        />
      </div>

      {/* Distribuicoes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <DistribuicaoCard
          title="Atletas por categoria"
          icon={Target}
          buckets={porCategoria}
        />
        <DistribuicaoCard
          title="Atletas por posicao"
          icon={BarChart3}
          buckets={porPosicao.slice(0, 8)}
        />
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card padding="none">
          <CardHeader className="p-4 sm:p-5 m-0 pb-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-positive" />
              <CardTitle>Ultimos jogos</CardTitle>
            </div>
            <Link
              href="/jogos"
              className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          {ultimosJogos.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Gamepad2}
                title="Nenhum jogo cadastrado"
                description="Comece registrando o primeiro jogo."
              />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {ultimosJogos.map((jogo) => {
                const resultado =
                  jogo.placar_clube !== null && jogo.placar_adversario !== null
                    ? jogo.placar_clube > jogo.placar_adversario
                      ? 'positive'
                      : jogo.placar_clube < jogo.placar_adversario
                      ? 'negative'
                      : 'neutral'
                    : 'neutral'
                return (
                  <li key={jogo.id}>
                    <Link
                      href={`/jogos/${jogo.id}`}
                      className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-positive/15 ring-1 ring-positive/30 flex items-center justify-center shrink-0">
                          <Gamepad2 className="w-4 h-4 text-positive" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-strong truncate">
                            {getClubeName(jogo.clubes) || 'Clube'}{' '}
                            <span className="text-faint">vs</span>{' '}
                            {jogo.adversario}
                          </p>
                          <p className="text-xs text-soft flex items-center gap-1.5 mt-0.5 truncate">
                            <Calendar className="w-3 h-3 shrink-0" />
                            {formatDate(jogo.data_jogo)}
                            <span className="text-line-strong">•</span>
                            <span className="truncate">{jogo.competicao}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {jogo.placar_clube !== null &&
                        jogo.placar_adversario !== null ? (
                          <span
                            className={
                              'font-bold tabular-nums ' +
                              (resultado === 'positive'
                                ? 'text-positive'
                                : resultado === 'negative'
                                ? 'text-negative'
                                : 'text-soft')
                            }
                          >
                            {jogo.placar_clube} × {jogo.placar_adversario}
                          </span>
                        ) : (
                          <span className="text-xs text-faint">Sem placar</span>
                        )}
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
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-brand" />
              <CardTitle>Ultimas avaliacoes</CardTitle>
            </div>
            <Link
              href="/avaliacoes"
              className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          {ultimasAvaliacoes.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Star}
                title="Nenhuma avaliacao cadastrada"
                description="Registre a primeira avaliacao de um atleta."
              />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {ultimasAvaliacoes.map((av) => {
                const atleta = getAtleta(av.atletas)
                return (
                  <li key={av.id}>
                    <Link
                      href={`/avaliacoes/${av.id}`}
                      className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-brand/15 ring-1 ring-brand/30 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-brand" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-strong truncate">
                            {atleta?.nome || 'Atleta'}
                          </p>
                          <p className="text-xs text-soft flex items-center gap-1.5 mt-0.5 truncate">
                            <Clock className="w-3 h-3 shrink-0" />
                            {formatDate(av.data_avaliacao)}
                            {atleta?.posicao && (
                              <>
                                <span className="text-line-strong">•</span>
                                <span className="truncate">{atleta.posicao}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant="brand" size="md">
                        <Activity className="w-3 h-3" />
                        {calcularMedia(av)}
                      </Badge>
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
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint mb-3">
          Atalhos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <QuickAction
            href="/clubes/novo"
            label="Novo clube"
            icon={Shield}
            tone="info"
          />
          <QuickAction
            href="/atletas/novo"
            label="Novo atleta"
            icon={Users}
            tone="indigo"
          />
          <QuickAction
            href="/jogos/novo"
            label="Novo jogo"
            icon={Gamepad2}
            tone="positive"
          />
          <QuickAction
            href="/avaliacoes/nova"
            label="Nova avaliacao"
            icon={Star}
            tone="violet"
          />
        </div>
      </div>
    </div>
  )
}

function DistribuicaoCard({
  title,
  icon: Icon,
  buckets,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  buckets: Bucket[]
}) {
  const max = buckets.length > 0 ? Math.max(...buckets.map((b) => b.count)) : 1
  return (
    <Card padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand" />
          <CardTitle>{title}</CardTitle>
        </div>
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
                <span className="text-xs text-soft truncate w-24 shrink-0">
                  {b.label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-app overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand/80"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-strong tabular-nums w-8 text-right">
                  {b.count}
                </span>
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

function QuickAction({
  href,
  label,
  icon: Icon,
  tone,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  tone: keyof typeof quickActionTone
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-surface border border-line p-4 sm:p-5 transition-all duration-150 hover:bg-surface-2 hover:border-line-strong"
    >
      <div
        className={
          'w-10 h-10 rounded-xl flex items-center justify-center ring-1 mb-3 ' +
          quickActionTone[tone]
        }
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
        Adicionar
      </p>
      <p className="text-sm sm:text-base font-semibold text-strong flex items-center gap-1.5 mt-0.5">
        {label}
        <Plus className="w-3.5 h-3.5 text-faint group-hover:text-brand transition-colors" />
      </p>
    </Link>
  )
}
