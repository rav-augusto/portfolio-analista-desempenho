'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { User, Star, Calendar, Trophy, Clock, Target, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { PageHeader, StatCard, Card, CardHeader, CardTitle, Badge, Button, Spinner, EmptyState } from '@/components/app'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

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
  forca: number; velocidade: number; tecnica: number; dinamica: number
  inteligencia: number; um_contra_um: number; atitude: number; potencial: number
  penetracao: number | null; cobertura_ofensiva: number | null; espaco_com_bola: number | null
  espaco_sem_bola: number | null; mobilidade: number | null; unidade_ofensiva: number | null
  contencao: number | null; cobertura_defensiva: number | null; equilibrio_recuperacao: number | null
  equilibrio_defensivo: number | null; concentracao_def: number | null; unidade_defensiva: number | null
  pontos_fortes: string | null
  pontos_desenvolver: string | null
}

const dimensoesCBF = [
  { key: 'forca', label: 'Força' },
  { key: 'velocidade', label: 'Velocidade' },
  { key: 'tecnica', label: 'Técnica' },
  { key: 'dinamica', label: 'Dinâmica' },
  { key: 'inteligencia', label: 'Inteligência' },
  { key: 'um_contra_um', label: '1v1' },
  { key: 'atitude', label: 'Atitude' },
  { key: 'potencial', label: 'Potencial' },
]

const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null)
const mediaGrupos = (av: Avaliacao) => {
  const cbf = mean([av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial])
  const ofe = mean([av.penetracao, av.cobertura_ofensiva, av.espaco_com_bola, av.espaco_sem_bola, av.mobilidade, av.unidade_ofensiva].filter((x): x is number => x != null))
  const def = mean([av.contencao, av.cobertura_defensiva, av.equilibrio_recuperacao, av.equilibrio_defensivo, av.concentracao_def, av.unidade_defensiva].filter((x): x is number => x != null))
  const grupos = [cbf, ofe, def].filter((x): x is number => x != null)
  const geral = grupos.length ? grupos.reduce((a, b) => a + b, 0) / grupos.length : 0
  return { cbf, ofe, def, geral }
}
const fmt1 = (n: number | null) => (n == null ? '—' : n.toFixed(1).replace('.', ','))

export default function PortalPage() {
  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState<Avaliacao | null>(null)
  const [anteriorAvaliacao, setAnteriorAvaliacao] = useState<Avaliacao | null>(null)
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0)
  const [totalMinutos, setTotalMinutos] = useState(0)
  const [totalGols, setTotalGols] = useState(0)
  const [totalAssistencias, setTotalAssistencias] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const { user: usuario, isLoading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && usuario?.atleta_id) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, usuario])

  const loadData = async () => {
    if (!usuario?.atleta_id) return
    const { data: atletaData } = await supabase.from('atletas').select('*, clubes(nome, escudo_url)').eq('id', usuario.atleta_id).single()
    if (atletaData) setAtleta(atletaData)

    const { data: avaliacoes } = await supabase.from('avaliacoes_atleta').select('*').eq('atleta_id', usuario.atleta_id).order('data_avaliacao', { ascending: false })
    if (avaliacoes && avaliacoes.length > 0) {
      setUltimaAvaliacao(avaliacoes[0])
      setAnteriorAvaliacao(avaliacoes[1] || null)
      setTotalAvaliacoes(avaliacoes.length)
      let minutos = 0, gols = 0, assists = 0
      avaliacoes.forEach(av => { minutos += av.minutos_jogados || 0; gols += av.gols || 0; assists += av.assistencias || 0 })
      setTotalMinutos(minutos); setTotalGols(gols); setTotalAssistencias(assists)
    }
    setLoading(false)
  }

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date(); const n = new Date(dataNasc)
    let idade = hoje.getFullYear() - n.getFullYear()
    const m = hoje.getMonth() - n.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < n.getDate())) idade--
    return idade
  }

  const grupos = useMemo(() => (ultimaAvaliacao ? mediaGrupos(ultimaAvaliacao) : null), [ultimaAvaliacao])
  const trend = useMemo(() => {
    if (!ultimaAvaliacao || !anteriorAvaliacao) return null
    return mediaGrupos(ultimaAvaliacao).geral - mediaGrupos(anteriorAvaliacao).geral
  }, [ultimaAvaliacao, anteriorAvaliacao])

  const radarData = ultimaAvaliacao ? {
    labels: dimensoesCBF.map(d => d.label),
    datasets: [{
      label: 'Avaliação atual',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: dimensoesCBF.map(d => (ultimaAvaliacao as any)[d.key] || 0),
      backgroundColor: 'rgba(245, 158, 11, 0.28)',
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(245, 158, 11, 1)',
      pointBorderColor: '#fff',
    }],
  } : null

  const radarOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { min: 0, max: 5, beginAtZero: true, ticks: { stepSize: 1, color: '#94a3b8', backdropColor: 'transparent' }, grid: { color: '#334155' }, angleLines: { color: '#334155' }, pointLabels: { color: '#e2e8f0', font: { size: 12 } } } },
    plugins: { legend: { display: false } },
  }

  if (loading || userLoading) return <div className="min-h-[400px] flex items-center justify-center"><Spinner size="lg" label="Carregando seu perfil..." /></div>

  if (!atleta) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <EmptyState icon={User} title="Perfil não encontrado" description="Entre em contato com o seu analista para vincular o seu perfil." />
    </div>
  )

  return (
    <div>
      <PageHeader eyebrow="Portal do atleta" title="Meu perfil" description={`${totalAvaliacoes} avaliaç${totalAvaliacoes === 1 ? 'ão' : 'ões'} registrada${totalAvaliacoes === 1 ? '' : 's'}`} />

      {/* Perfil */}
      <Card padding="lg" className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-app border-[3px] border-brand grid place-items-center shrink-0">
            {atleta.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
            ) : <User className="w-10 h-10 text-faint" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              {atleta.numero_camisa && <span className="text-2xl font-bold text-brand tabular-nums">#{atleta.numero_camisa}</span>}
              <h2 className="text-xl sm:text-2xl font-bold text-strong">{atleta.nome}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {atleta.posicao && <Badge variant="brand">{atleta.posicao}</Badge>}
              {atleta.categoria && <Badge variant="info">{atleta.categoria}</Badge>}
              {atleta.clubes && <span className="text-sm text-soft">{atleta.clubes.nome}</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {atleta.data_nascimento && <div><p className="text-[11px] text-faint uppercase tracking-wider">Idade</p><p className="text-strong font-semibold">{calcularIdade(atleta.data_nascimento)} anos</p></div>}
              {atleta.altura && <div><p className="text-[11px] text-faint uppercase tracking-wider">Altura</p><p className="text-strong font-semibold">{atleta.altura}m</p></div>}
              {atleta.peso && <div><p className="text-[11px] text-faint uppercase tracking-wider">Peso</p><p className="text-strong font-semibold">{atleta.peso}kg</p></div>}
              {atleta.pe_dominante && <div><p className="text-[11px] text-faint uppercase tracking-wider">Pé dominante</p><p className="text-strong font-semibold capitalize">{atleta.pe_dominante}</p></div>}
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs unificados */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Média geral" value={grupos ? fmt1(grupos.geral) : '—'} icon={Star} tone="brand"
          meta={trend != null && trend !== 0 ? (
            <span className={`flex items-center gap-1 justify-end font-semibold ${trend > 0 ? 'text-positive' : 'text-negative'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{trend > 0 ? '+' : ''}{trend.toFixed(1).replace('.', ',')}
            </span>
          ) : undefined} />
        <StatCard label="Minutos" value={totalMinutos} icon={Clock} tone="brand" />
        <StatCard label="Gols" value={totalGols} icon={Trophy} tone="brand" />
        <StatCard label="Assistências" value={totalAssistencias} icon={Target} tone="brand" />
      </div>

      {/* Última avaliação */}
      {ultimaAvaliacao && grupos ? (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Última avaliação</CardTitle>
              <span className="flex items-center gap-1.5 text-sm text-soft"><Calendar className="w-4 h-4" />{new Date(ultimaAvaliacao.data_avaliacao).toLocaleDateString('pt-BR')}</span>
            </CardHeader>
            <div className="h-[280px]">{radarData && <Radar data={radarData} options={radarOptions} />}</div>
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-line/70 text-center">
              <div><p className="text-[10px] text-faint uppercase tracking-wider">Geral</p><p className="text-lg font-bold text-brand tabular-nums">{fmt1(grupos.geral)}</p></div>
              <div><p className="text-[10px] text-faint uppercase tracking-wider">CBF</p><p className="text-lg font-bold text-strong tabular-nums">{fmt1(grupos.cbf)}</p></div>
              <div><p className="text-[10px] text-faint uppercase tracking-wider">Ofensivo</p><p className="text-lg font-bold text-strong tabular-nums">{fmt1(grupos.ofe)}</p></div>
              <div><p className="text-[10px] text-faint uppercase tracking-wider">Defensivo</p><p className="text-lg font-bold text-strong tabular-nums">{fmt1(grupos.def)}</p></div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {ultimaAvaliacao.pontos_fortes && (
              <Card padding="md" className="border-l-4 border-l-positive">
                <p className="text-xs font-semibold text-positive uppercase tracking-wider mb-2">Pontos fortes</p>
                <p className="text-sm text-soft leading-relaxed">{ultimaAvaliacao.pontos_fortes}</p>
              </Card>
            )}
            {ultimaAvaliacao.pontos_desenvolver && (
              <Card padding="md" className="border-l-4 border-l-brand">
                <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">Pontos a desenvolver</p>
                <p className="text-sm text-soft leading-relaxed">{ultimaAvaliacao.pontos_desenvolver}</p>
              </Card>
            )}
            <Link href="/portal/evolucao" className="mt-auto">
              <Button variant="secondary" fullWidth>Ver a minha evolução completa <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState icon={Star} title="Nenhuma avaliação ainda" description="As suas avaliações aparecerão aqui assim que forem registradas pelo analista." />
      )}
    </div>
  )
}
