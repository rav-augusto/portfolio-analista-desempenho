'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Users, Search, Star, Cake, LayoutGrid, ShieldAlert } from 'lucide-react'
import {
  PageHeader, StatCard, Card, Badge, Button, Input, Select, EmptyState, Spinner, Modal,
} from '@/components/app'

type Atleta = {
  id: string
  nome: string
  posicao: string | null
  categoria: string | null
  numero_camisa: number | null
  foto_url: string | null
  data_nascimento: string | null
  criado_por: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

const getClubeName = (clubes: Atleta['clubes']): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
}

const calcularIdade = (dob: string | null): number | null => {
  if (!dob) return null
  const d = new Date(dob)
  const hoje = new Date()
  let idade = hoje.getFullYear() - d.getFullYear()
  const m = hoje.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) idade--
  return idade >= 0 && idade < 100 ? idade : null
}

type Clube = { id: string; nome: string }

export default function AtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [avaliadosSet, setAvaliadosSet] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [aExcluir, setAExcluir] = useState<Atleta | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [filtroClube, setFiltroClube] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroPosicao, setFiltroPosicao] = useState('')

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const [atletasRes, clubesRes, avalRes] = await Promise.all([
      supabase.from('atletas').select('id, nome, posicao, categoria, numero_camisa, foto_url, data_nascimento, criado_por, clubes(nome)').order('nome'),
      supabase.from('clubes').select('id, nome').order('nome'),
      supabase.from('avaliacoes_atleta').select('atleta_id'),
    ])
    if (atletasRes.data) setAtletas(atletasRes.data)
    if (clubesRes.data) setClubes(clubesRes.data)
    if (avalRes.data) setAvaliadosSet(new Set(avalRes.data.map(a => a.atleta_id).filter(Boolean)))
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('atletas').delete().eq('id', aExcluir.id)
    if (!error) setAtletas(prev => prev.filter(a => a.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const categorias = useMemo(() => [...new Set(atletas.map(a => a.categoria).filter(Boolean))] as string[], [atletas])
  const posicoes = useMemo(() => [...new Set(atletas.map(a => a.posicao).filter(Boolean))] as string[], [atletas])

  const kpis = useMemo(() => {
    const idades = atletas.map(a => calcularIdade(a.data_nascimento)).filter((x): x is number => x !== null)
    const idadeMedia = idades.length ? idades.reduce((s, i) => s + i, 0) / idades.length : 0
    const semAval = atletas.filter(a => !avaliadosSet.has(a.id)).length
    return { total: atletas.length, idadeMedia, categorias: categorias.length, semAval }
  }, [atletas, avaliadosSet, categorias])

  const filteredAtletas = useMemo(() => {
    const term = search.toLowerCase()
    return atletas.filter(a => {
      const clubeName = getClubeName(a.clubes)
      const matchSearch = !term ||
        a.nome.toLowerCase().includes(term) ||
        a.posicao?.toLowerCase().includes(term) ||
        a.categoria?.toLowerCase().includes(term) ||
        clubeName.toLowerCase().includes(term)
      if (!matchSearch) return false
      if (filtroClube && clubeName !== filtroClube) return false
      if (filtroCategoria && a.categoria !== filtroCategoria) return false
      if (filtroPosicao && a.posicao !== filtroPosicao) return false
      return true
    })
  }, [atletas, search, filtroClube, filtroCategoria, filtroPosicao])

  return (
    <div>
      <PageHeader
        eyebrow="Plantel"
        title="Atletas"
        description={`${filteredAtletas.length} de ${atletas.length} atleta${atletas.length !== 1 ? 's' : ''}`}
        actions={canCreate && (
          <Link href="/atletas/novo"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Novo atleta</span><span className="sm:hidden">Novo</span></Button></Link>
        )}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="No plantel" value={loading ? '—' : kpis.total} icon={Users} tone="brand" />
        <StatCard label="Idade média" value={loading ? '—' : kpis.idadeMedia ? kpis.idadeMedia.toFixed(1).replace('.', ',') : '—'} icon={Cake} tone="info" />
        <StatCard label="Categorias" value={loading ? '—' : kpis.categorias} icon={LayoutGrid} tone="positive" />
        <StatCard label="Sem avaliação" value={loading ? '—' : kpis.semAval} icon={ShieldAlert} tone={kpis.semAval > 0 ? 'caution' : 'positive'} />
      </div>

      {/* Toolbar */}
      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <Input placeholder="Buscar nome, posição, categoria ou clube..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Select value={filtroClube} onChange={(e) => setFiltroClube(e.target.value)}>
              <option value="">Todos os clubes</option>
              {clubes.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
            </Select>
            <Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas as categorias</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <Select value={filtroPosicao} onChange={(e) => setFiltroPosicao(e.target.value)}>
              <option value="">Todas as posições</option>
              {posicoes.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </Select>
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando atletas..." /></div>
      ) : filteredAtletas.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum atleta encontrado"
          description="Ajuste a busca/filtros ou cadastre o primeiro atleta."
          action={canCreate ? <Link href="/atletas/novo"><Button size="sm"><Plus className="w-4 h-4" />Novo atleta</Button></Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredAtletas.map((atleta) => {
            const idade = calcularIdade(atleta.data_nascimento)
            const semAval = !avaliadosSet.has(atleta.id)
            return (
              <Card key={atleta.id} padding="none" className="group flex flex-col overflow-hidden">
                <Link href={`/avaliacoes/atleta/${atleta.id}`} className="flex items-center gap-3 p-4">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-app border border-line overflow-hidden grid place-items-center">
                      {atleta.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                      ) : <Users className="w-6 h-6 text-faint" />}
                    </div>
                    {atleta.numero_camisa != null && (
                      <span className="absolute -bottom-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-brand text-app text-[10px] font-bold grid place-items-center tabular-nums border-2 border-surface">{atleta.numero_camisa}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-strong truncate group-hover:text-brand transition-colors">{atleta.nome}</p>
                    <p className="text-xs text-soft truncate mt-0.5">{atleta.posicao || 'Sem posição'}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {atleta.categoria && <Badge variant="info" size="sm">{atleta.categoria}</Badge>}
                      {getClubeName(atleta.clubes) && <span className="text-[11px] text-brand truncate">{getClubeName(atleta.clubes)}</span>}
                    </div>
                  </div>
                </Link>
                <div className="mt-auto flex items-center justify-between border-t border-line/70 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-soft">
                    {idade != null ? <span className="flex items-center gap-1"><Cake className="w-3.5 h-3.5 text-info" /><b className="text-strong tabular-nums">{idade}</b> anos</span> : <span className="text-faint">Idade —</span>}
                    {semAval && <Badge variant="caution" size="sm">sem aval.</Badge>}
                  </div>
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Link href={`/avaliacoes/atleta/${atleta.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" aria-label="Avaliações"><Star className="w-4 h-4" /></Link>
                    {canEdit(atleta.criado_por) && (
                      <Link href={`/atletas/${atleta.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" aria-label="Editar"><Pencil className="w-4 h-4" /></Link>
                    )}
                    {canDelete(atleta.criado_por) && (
                      <button onClick={() => setAExcluir(atleta)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" aria-label="Excluir"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={!!aExcluir}
        onClose={() => setAExcluir(null)}
        title="Excluir atleta"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </>
        }
      >
        <p className="text-sm text-soft">Excluir <b className="text-strong">{aExcluir?.nome}</b>? As avaliações vinculadas podem ser afetadas. Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
