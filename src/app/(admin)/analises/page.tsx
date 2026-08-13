'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Plus, Pencil, Trash2, FileBarChart, Search, Calendar, Image as ImageIcon, LayoutDashboard, Trophy, LayoutGrid } from 'lucide-react'
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

type JogoData = {
  adversario: string
  data_jogo: string
  competicao: string
  fase: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

type Analise = {
  id: string
  jogo_id: string
  sistema_tatico: string | null
  created_at: string
  criado_por: string | null
  jogos: JogoData | JogoData[] | null
  prints_taticos: { id: string }[]
}

export default function AnalisesPage() {
  const [analises, setAnalises] = useState<Analise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroCompeticao, setFiltroCompeticao] = useState('')
  const [ordem, setOrdem] = useState<'recentes' | 'antigas'>('recentes')
  const [aExcluir, setAExcluir] = useState<Analise | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadAnalises()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAnalises = async () => {
    const { data, error } = await supabase
      .from('analises_jogo')
      .select('id, jogo_id, sistema_tatico, created_at, criado_por, jogos(adversario, data_jogo, competicao, fase, clubes(nome)), prints_taticos(id)')
      .order('created_at', { ascending: false })
    if (!error && data) setAnalises(data)
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('analises_jogo').delete().eq('id', aExcluir.id)
    if (!error) setAnalises(prev => prev.filter(a => a.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const getJogo = (jogos: JogoData | JogoData[] | null | undefined): JogoData | null =>
    !jogos ? null : Array.isArray(jogos) ? jogos[0] || null : jogos
  const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined) =>
    !clubes ? '' : Array.isArray(clubes) ? clubes[0]?.nome || '' : clubes.nome || ''

  const competicoes = useMemo(
    () => [...new Set(analises.map(a => getJogo(a.jogos)?.competicao).filter(Boolean))] as string[],
    [analises]
  )

  const kpis = useMemo(() => {
    const totalPrints = analises.reduce((s, a) => s + (a.prints_taticos?.length || 0), 0)
    const contagem: Record<string, number> = {}
    for (const a of analises) if (a.sistema_tatico) contagem[a.sistema_tatico] = (contagem[a.sistema_tatico] || 0) + 1
    const formacaoTop = Object.entries(contagem).sort((x, y) => y[1] - x[1])[0]?.[0] || '—'
    return { total: analises.length, competicoes: competicoes.length, totalPrints, formacaoTop }
  }, [analises, competicoes])

  const filteredAnalises = useMemo(() => {
    const q = search.toLowerCase()
    const arr = analises.filter(a => {
      const jogo = getJogo(a.jogos)
      const matchBusca = !q ||
        jogo?.adversario?.toLowerCase().includes(q) ||
        getClubeName(jogo?.clubes).toLowerCase().includes(q) ||
        jogo?.competicao?.toLowerCase().includes(q)
      const matchComp = !filtroCompeticao || jogo?.competicao === filtroCompeticao
      return matchBusca && matchComp
    })
    return arr.sort((a, b) => {
      const da = new Date(a.created_at).getTime(), db = new Date(b.created_at).getTime()
      return ordem === 'recentes' ? db - da : da - db
    })
  }, [analises, search, filtroCompeticao, ordem])

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR')

  return (
    <div>
      <PageHeader
        eyebrow="Análises"
        title="Análises de jogo"
        description="Estudos tático-técnicos das partidas"
        actions={
          canCreate && (
            <Link href="/analises/nova">
              <Button>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova análise</span>
                <span className="sm:hidden">Nova</span>
              </Button>
            </Link>
          )
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Análises" value={loading ? '—' : kpis.total} icon={FileBarChart} tone="brand" />
        <StatCard label="Competições" value={loading ? '—' : kpis.competicoes} icon={Trophy} tone="info" />
        <StatCard label="Prints táticos" value={loading ? '—' : kpis.totalPrints} icon={ImageIcon} tone="violet" />
        <StatCard label="Formação top" value={loading ? '—' : kpis.formacaoTop} icon={LayoutGrid} tone="positive" />
      </div>

      {/* Toolbar */}
      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar adversário, clube ou competição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Select value={filtroCompeticao} onChange={(e) => setFiltroCompeticao(e.target.value)} className="sm:w-48">
              <option value="">Todas as competições</option>
              {competicoes.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={ordem} onChange={(e) => setOrdem(e.target.value as 'recentes' | 'antigas')} className="sm:w-36">
              <option value="recentes">Mais recentes</option>
              <option value="antigas">Mais antigas</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando análises..." /></div>
      ) : filteredAnalises.length === 0 ? (
        <EmptyState
          icon={FileBarChart}
          title="Nenhuma análise encontrada"
          description="Crie uma nova análise tático-técnica para começar."
          action={canCreate ? <Link href="/analises/nova"><Button size="sm"><Plus className="w-4 h-4" />Nova análise</Button></Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredAnalises.map((analise) => {
            const jogo = getJogo(analise.jogos)
            return (
              <Card key={analise.id} padding="none" className="group flex flex-col overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {jogo?.competicao ? <Badge variant="brand" size="sm">{jogo.competicao}</Badge> : <span />}
                    {analise.prints_taticos?.length > 0 && (
                      <Badge variant="neutral" size="sm"><ImageIcon className="w-3 h-3" />{analise.prints_taticos.length} prints</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-strong truncate">
                    {getClubeName(jogo?.clubes)} <span className="text-faint font-normal">×</span> {jogo?.adversario || '—'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-soft">
                    {jogo && (
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(jogo.data_jogo)}</span>
                    )}
                    {analise.sistema_tatico && (
                      <span className="flex items-center gap-1 text-brand font-medium"><LayoutGrid className="w-3 h-3" />{analise.sistema_tatico}</span>
                    )}
                    {jogo?.fase && <span className="text-faint">{jogo.fase}</span>}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-end gap-1 border-t border-line/70 px-3 py-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Link href={`/analises/${analise.id}/dashboard`} className="p-1.5 text-faint hover:text-info hover:bg-info/10 rounded-lg transition-colors" title="Dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                  {canEdit(analise.criado_por) && (
                    <Link href={`/analises/${analise.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </Link>
                  )}
                  {canDelete(analise.criado_por) && (
                    <button onClick={() => setAExcluir(analise)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={!!aExcluir}
        onClose={() => setAExcluir(null)}
        title="Excluir análise"
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
        <p className="text-sm text-soft">Excluir esta análise? Os prints e dados vinculados serão removidos. Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
