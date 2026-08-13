'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Plus, Pencil, Trash2, Play, Trophy, MapPin, Search, Percent, Sigma, Film, X } from 'lucide-react'
import Link from 'next/link'
import {
  PageHeader,
  Button,
  Input,
  Select,
  StatCard,
  Card,
  Badge,
  EmptyState,
  Spinner,
  Modal,
} from '@/components/app'

type Jogo = {
  id: string
  clube_id: string
  adversario: string
  data_jogo: string
  local: string | null
  competicao: string
  fase: string | null
  categoria: string | null
  placar_clube: number | null
  placar_adversario: number | null
  video_url: string | null
  criado_por: string | null
  clubes: { id: string; nome: string } | null
}

type Clube = { id: string; nome: string }

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [aExcluir, setAExcluir] = useState<Jogo | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [filtroClube, setFiltroClube] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroCompeticao, setFiltroCompeticao] = useState('')
  const [filtroPeriodo, setFiltroPeriodo] = useState('')
  const [search, setSearch] = useState('')

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const [jogosRes, clubesRes] = await Promise.all([
      supabase.from('jogos').select('*, criado_por, clubes(id, nome)').order('data_jogo', { ascending: false }),
      supabase.from('clubes').select('id, nome').order('nome'),
    ])
    if (jogosRes.data) setJogos(jogosRes.data)
    if (clubesRes.data) setClubes(clubesRes.data)
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('jogos').delete().eq('id', aExcluir.id)
    if (!error) setJogos(prev => prev.filter(j => j.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const categoriasUsadas = useMemo(() => [...new Set(jogos.map(j => j.categoria).filter(Boolean))] as string[], [jogos])
  const competicoes = useMemo(() => [...new Set(jogos.map(j => j.competicao).filter(Boolean))], [jogos])

  const filteredJogos = useMemo(() => {
    const diasMap: Record<string, number> = { '7dias': 7, '30dias': 30, '90dias': 90 }
    let limite: Date | null = null
    if (filtroPeriodo && diasMap[filtroPeriodo]) {
      limite = new Date()
      limite.setDate(limite.getDate() - diasMap[filtroPeriodo])
    }
    return jogos.filter(j => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        j.adversario.toLowerCase().includes(q) ||
        j.clubes?.nome.toLowerCase().includes(q) ||
        j.competicao.toLowerCase().includes(q) ||
        j.local?.toLowerCase().includes(q)
      if (!matchSearch) return false
      if (filtroClube && j.clube_id !== filtroClube) return false
      if (filtroCategoria && j.categoria !== filtroCategoria) return false
      if (filtroCompeticao && j.competicao !== filtroCompeticao) return false
      if (limite && new Date(j.data_jogo + 'T12:00:00') < limite) return false
      return true
    })
  }, [jogos, search, filtroClube, filtroCategoria, filtroCompeticao, filtroPeriodo])

  // KPIs sobre TODOS os jogos (não os 5 primeiros)
  const kpis = useMemo(() => {
    const comPlacar = jogos.filter(j => j.placar_clube !== null && j.placar_adversario !== null)
    let v = 0, e = 0, d = 0, saldo = 0
    for (const j of comPlacar) {
      const pc = j.placar_clube!, pa = j.placar_adversario!
      saldo += pc - pa
      if (pc > pa) v++
      else if (pc < pa) d++
      else e++
    }
    const total = comPlacar.length
    const aproveitamento = total ? Math.round(((v * 3 + e) / (total * 3)) * 100) : 0
    const comVideo = jogos.length ? Math.round((jogos.filter(j => j.video_url).length / jogos.length) * 100) : 0
    return { v, e, d, saldo, total, aproveitamento, comVideo }
  }, [jogos])

  const formatDate = (dateStr: string) => new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR')

  const getResultado = (pc: number | null, pa: number | null) => {
    if (pc === null || pa === null) return null
    if (pc > pa) return 'vitoria'
    if (pc < pa) return 'derrota'
    return 'empate'
  }

  const limparFiltros = () => {
    setFiltroClube(''); setFiltroCategoria(''); setFiltroCompeticao(''); setFiltroPeriodo('')
  }
  const filtrosAtivos = filtroClube || filtroCategoria || filtroCompeticao || filtroPeriodo

  const seloResultado = (r: string | null) => {
    if (r === 'vitoria') return <Badge variant="positive" size="sm">V</Badge>
    if (r === 'derrota') return <Badge variant="negative" size="sm">D</Badge>
    if (r === 'empate') return <Badge variant="caution" size="sm">E</Badge>
    return <Badge variant="neutral" size="sm">—</Badge>
  }

  return (
    <div>
      <PageHeader
        eyebrow="Jogos"
        title="Registro de jogos"
        description={`${filteredJogos.length} de ${jogos.length} jogo${jogos.length !== 1 ? 's' : ''}`}
        actions={
          canCreate && (
            <Link href="/jogos/novo">
              <Button>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo jogo</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </Link>
          )
        }
      />

      {/* KPIs de resultado */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Aproveitamento" value={loading ? '—' : `${kpis.aproveitamento}%`} icon={Percent} tone="brand" meta={`${kpis.total} com placar`} />
        <StatCard label="V · E · D" value={loading ? '—' : `${kpis.v}·${kpis.e}·${kpis.d}`} icon={Trophy} tone="positive" />
        <StatCard label="Saldo de gols" value={loading ? '—' : (kpis.saldo > 0 ? `+${kpis.saldo}` : kpis.saldo)} icon={Sigma} tone={kpis.saldo >= 0 ? 'info' : 'negative'} />
        <StatCard label="Com vídeo" value={loading ? '—' : `${kpis.comVideo}%`} icon={Film} tone="violet" />
      </div>

      {/* Toolbar: busca + filtros */}
      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <Input
            placeholder="Buscar adversário, clube, competição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <Select value={filtroClube} onChange={(e) => setFiltroClube(e.target.value)}>
              <option value="">Todos os clubes</option>
              {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas as categorias</option>
              {categoriasUsadas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <Select value={filtroCompeticao} onChange={(e) => setFiltroCompeticao(e.target.value)}>
              <option value="">Todas as competições</option>
              {competicoes.map(comp => <option key={comp} value={comp}>{comp}</option>)}
            </Select>
            <Select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
              <option value="">Todo o período</option>
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
            </Select>
          </div>
          {filtrosAtivos && (
            <button onClick={limparFiltros} className="self-start text-xs text-brand hover:text-brand-hover flex items-center gap-1">
              <X className="w-3 h-3" /> Limpar filtros
            </button>
          )}
        </div>
      </Card>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando jogos..." /></div>
      ) : filteredJogos.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Nenhum jogo encontrado"
          description="Ajuste os filtros ou registre um novo jogo."
          action={filtrosAtivos ? <Button size="sm" variant="outline" onClick={limparFiltros}>Limpar filtros</Button> : undefined}
        />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Partida</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3 hidden md:table-cell">Competição</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3 hidden sm:table-cell">Data</th>
                  <th className="text-center font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3">Placar</th>
                  <th className="text-right font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredJogos.map((jogo) => {
                  const resultado = getResultado(jogo.placar_clube, jogo.placar_adversario)
                  const temPlacar = jogo.placar_clube !== null && jogo.placar_adversario !== null
                  return (
                    <tr key={jogo.id} className="border-b border-line/50 last:border-0 hover:bg-surface-2/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {seloResultado(resultado)}
                          <div className="min-w-0">
                            <div className="font-semibold text-strong truncate">
                              {jogo.clubes?.nome || 'Clube'} <span className="text-faint font-normal">×</span> {jogo.adversario}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 md:hidden">
                              {jogo.categoria && <span className="text-[11px] text-soft">{jogo.categoria}</span>}
                              <span className="text-[11px] text-faint">{formatDate(jogo.data_jogo)}</span>
                            </div>
                          </div>
                          {jogo.categoria && <Badge variant="neutral" size="sm" className="hidden md:inline-flex">{jogo.categoria}</Badge>}
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-soft">
                          <Trophy className="w-3.5 h-3.5 text-faint shrink-0" />
                          <span className="truncate max-w-[160px]">{jogo.competicao}</span>
                        </div>
                        {jogo.local && (
                          <div className="flex items-center gap-1.5 text-xs text-faint mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" /><span className="truncate max-w-[160px]">{jogo.local}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-soft whitespace-nowrap hidden sm:table-cell">{formatDate(jogo.data_jogo)}</td>
                      <td className="px-3 py-3 text-center">
                        {temPlacar ? (
                          <span className="font-bold text-strong tabular-nums text-base">{jogo.placar_clube}<span className="text-faint font-normal px-1">×</span>{jogo.placar_adversario}</span>
                        ) : (
                          <span className="text-xs text-faint">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {jogo.video_url && (
                            <a
                              href={jogo.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-info hover:bg-info/10 rounded-lg transition-colors"
                              title="Assistir vídeo"
                            >
                              <Play className="w-4 h-4" />
                            </a>
                          )}
                          {canEdit(jogo.criado_por) && (
                            <Link href={`/jogos/${jogo.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" title="Editar">
                              <Pencil className="w-4 h-4" />
                            </Link>
                          )}
                          {canDelete(jogo.criado_por) && (
                            <button onClick={() => setAExcluir(jogo)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" title="Excluir">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal exclusão */}
      <Modal
        isOpen={!!aExcluir}
        onClose={() => setAExcluir(null)}
        title="Excluir jogo"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-soft">
          Excluir <b className="text-strong">{aExcluir?.clubes?.nome} × {aExcluir?.adversario}</b>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
