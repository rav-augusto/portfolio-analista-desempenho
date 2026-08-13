'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Plus, Star, Search, ChevronRight, User, Users, CalendarClock, Gauge } from 'lucide-react'
import Link from 'next/link'
import {
  PageHeader, Button, Input, Select, StatCard, Card, Badge, EmptyState, Spinner,
} from '@/components/app'

type AtletaComAvaliacoes = {
  id: string
  nome: string
  posicao: string | null
  foto_url: string | null
  clubes: { nome: string } | null
  total_avaliacoes: number
  ultima_avaliacao: string | null
  media_geral: number
}

// Anel de média (0–5) — cor por faixa
function MediaRing({ valor }: { valor: number }) {
  const pct = Math.max(0, Math.min(100, (valor / 5) * 100))
  const cor = valor >= 4 ? '#22c55e' : valor >= 3.5 ? '#84cc16' : valor >= 2.5 ? '#f59e0b' : '#ef4444'
  return (
    <div className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: `conic-gradient(${cor} ${pct}%, #334155 0)` }}>
      <div className="w-[26px] h-[26px] rounded-full bg-surface grid place-items-center text-[11px] font-bold text-strong tabular-nums">
        {valor.toFixed(1).replace('.', ',')}
      </div>
    </div>
  )
}

const DIAS_ATRASO = 45

export default function AvaliacoesPage() {
  const [atletas, setAtletas] = useState<AtletaComAvaliacoes[]>([])
  const [avaliacoesNoMes, setAvaliacoesNoMes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroPosicao, setFiltroPosicao] = useState('')
  const [ordem, setOrdem] = useState<'media' | 'nome' | 'recentes'>('media')
  const supabase = createClient()
  const { canCreate } = useUser()

  useEffect(() => {
    loadAtletas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAtletas = async () => {
    const { data: avaliacoes, error } = await supabase
      .from('avaliacoes_atleta')
      .select(`
        atleta_id, data_avaliacao,
        forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial,
        penetracao, cobertura_ofensiva, espaco_com_bola, espaco_sem_bola, mobilidade, unidade_ofensiva,
        contencao, cobertura_defensiva, equilibrio_recuperacao, equilibrio_defensivo, concentracao_def, unidade_defensiva,
        atletas(id, nome, posicao, foto_url, clubes(nome))
      `)
      .order('data_avaliacao', { ascending: false })

    if (!error && avaliacoes) {
      const atletasMap = new Map<string, AtletaComAvaliacoes & { somaMedias: number }>()
      const agora = new Date()
      let noMes = 0

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      avaliacoes.forEach((av: any) => {
        if (!av.atletas) return
        const atletaId = av.atletas.id
        const mediaCBF = (av.forca + av.velocidade + av.tecnica + av.dinamica + av.inteligencia + av.um_contra_um + av.atitude + av.potencial) / 8
        const mediaOFE = (av.penetracao + av.cobertura_ofensiva + av.espaco_com_bola + av.espaco_sem_bola + av.mobilidade + av.unidade_ofensiva) / 6
        const mediaDEF = (av.contencao + av.cobertura_defensiva + av.equilibrio_recuperacao + av.equilibrio_defensivo + av.concentracao_def + av.unidade_defensiva) / 6
        const mediaAv = (mediaCBF + mediaOFE + mediaDEF) / 3

        if (av.data_avaliacao) {
          const d = new Date(av.data_avaliacao)
          if (d.getFullYear() === agora.getFullYear() && d.getMonth() === agora.getMonth()) noMes++
        }

        if (!atletasMap.has(atletaId)) {
          atletasMap.set(atletaId, {
            id: atletaId, nome: av.atletas.nome, posicao: av.atletas.posicao, foto_url: av.atletas.foto_url,
            clubes: av.atletas.clubes, total_avaliacoes: 1, ultima_avaliacao: av.data_avaliacao,
            media_geral: 0, somaMedias: mediaAv,
          })
        } else {
          const atleta = atletasMap.get(atletaId)!
          atleta.total_avaliacoes++
          atleta.somaMedias += mediaAv
        }
      })

      setAtletas(Array.from(atletasMap.values()).map(a => ({ ...a, media_geral: a.somaMedias / a.total_avaliacoes })))
      setAvaliacoesNoMes(noMes)
    }
    setLoading(false)
  }

  const posicoes = useMemo(() => [...new Set(atletas.map(a => a.posicao).filter(Boolean))] as string[], [atletas])

  const diasDesde = (dateStr: string | null) => {
    if (!dateStr) return Infinity
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  }

  const kpis = useMemo(() => {
    const mediaElenco = atletas.length ? atletas.reduce((s, a) => s + a.media_geral, 0) / atletas.length : 0
    const atrasados = atletas.filter(a => diasDesde(a.ultima_avaliacao) > DIAS_ATRASO).length
    return { avaliados: atletas.length, mediaElenco, atrasados }
  }, [atletas])

  const filteredAtletas = useMemo(() => {
    const q = search.toLowerCase()
    const arr = atletas.filter(a => {
      const matchBusca = !q || a.nome.toLowerCase().includes(q) || a.clubes?.nome.toLowerCase().includes(q)
      const matchPos = !filtroPosicao || a.posicao === filtroPosicao
      return matchBusca && matchPos
    })
    return arr.sort((a, b) => {
      if (ordem === 'nome') return a.nome.localeCompare(b.nome)
      if (ordem === 'recentes') return diasDesde(a.ultima_avaliacao) - diasDesde(b.ultima_avaliacao)
      return b.media_geral - a.media_geral
    })
  }, [atletas, search, filtroPosicao, ordem])

  const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '—'

  return (
    <div>
      <PageHeader
        eyebrow="Avaliações"
        title="Avaliações de atletas"
        description="Selecione um atleta para ver o histórico completo"
        actions={canCreate && <Link href="/avaliacoes/nova"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nova avaliação</span><span className="sm:hidden">Nova</span></Button></Link>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Atletas avaliados" value={loading ? '—' : kpis.avaliados} icon={Users} tone="brand" />
        <StatCard label="Média do elenco" value={loading ? '—' : kpis.mediaElenco.toFixed(1).replace('.', ',')} icon={Gauge} tone="info" />
        <StatCard label="Avaliações no mês" value={loading ? '—' : avaliacoesNoMes} icon={Star} tone="positive" />
        <StatCard label={`Atrasados (+${DIAS_ATRASO}d)`} value={loading ? '—' : kpis.atrasados} icon={CalendarClock} tone={kpis.atrasados > 0 ? 'negative' : 'positive'} />
      </div>

      {/* Toolbar */}
      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <Input placeholder="Buscar atleta ou clube..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Select value={filtroPosicao} onChange={(e) => setFiltroPosicao(e.target.value)} className="sm:w-40">
              <option value="">Todas as posições</option>
              {posicoes.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Select value={ordem} onChange={(e) => setOrdem(e.target.value as 'media' | 'nome' | 'recentes')} className="sm:w-40">
              <option value="media">Maior média</option>
              <option value="recentes">Mais recentes</option>
              <option value="nome">Nome (A–Z)</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando avaliações..." /></div>
      ) : filteredAtletas.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Nenhum atleta com avaliações"
          description="Ajuste os filtros ou crie a primeira avaliação."
          action={canCreate ? <Link href="/avaliacoes/nova"><Button size="sm"><Plus className="w-4 h-4" />Nova avaliação</Button></Link> : undefined}
        />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Atleta</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3 hidden sm:table-cell">Posição</th>
                  <th className="text-right font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3">Aval.</th>
                  <th className="text-right font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3 hidden sm:table-cell">Última</th>
                  <th className="text-center font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3">Média</th>
                  <th className="w-8 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredAtletas.map((atleta) => {
                  const atrasado = diasDesde(atleta.ultima_avaliacao) > DIAS_ATRASO
                  return (
                    <tr key={atleta.id} className="border-b border-line/50 last:border-0 hover:bg-surface-2/40 transition-colors group">
                      <td className="px-4 py-3">
                        <Link href={`/avaliacoes/atleta/${atleta.id}`} className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-app border border-line grid place-items-center shrink-0">
                            {atleta.foto_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                            ) : <User className="w-4 h-4 text-faint" />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-strong truncate group-hover:text-brand transition-colors">{atleta.nome}</div>
                            <div className="text-[11px] text-soft truncate sm:hidden">{atleta.posicao || '—'} · {atleta.clubes?.nome}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-soft hidden sm:table-cell">{atleta.posicao || '—'}</td>
                      <td className="px-3 py-3 text-right font-semibold text-strong tabular-nums">{atleta.total_avaliacoes}</td>
                      <td className="px-3 py-3 text-right hidden sm:table-cell">
                        {atrasado ? <Badge variant="negative" size="sm">{formatDate(atleta.ultima_avaliacao)}</Badge> : <span className="text-soft whitespace-nowrap">{formatDate(atleta.ultima_avaliacao)}</span>}
                      </td>
                      <td className="px-3 py-3"><div className="flex justify-center"><MediaRing valor={atleta.media_geral} /></div></td>
                      <td className="px-3 py-3">
                        <Link href={`/avaliacoes/atleta/${atleta.id}`} className="block text-faint group-hover:text-brand transition-colors"><ChevronRight className="w-4 h-4" /></Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
