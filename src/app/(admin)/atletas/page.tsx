'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Search,
  Filter,
  X,
  Star,
} from 'lucide-react'
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Input,
  Select,
  EmptyState,
  Spinner,
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

type Clube = { id: string; nome: string }

export default function AtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const [filtroClube, setFiltroClube] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroPosicao, setFiltroPosicao] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [atletasRes, clubesRes] = await Promise.all([
      supabase
        .from('atletas')
        .select(
          'id, nome, posicao, categoria, numero_camisa, foto_url, data_nascimento, criado_por, clubes(nome)'
        )
        .order('nome'),
      supabase.from('clubes').select('id, nome').order('nome'),
    ])
    if (atletasRes.data) setAtletas(atletasRes.data)
    if (clubesRes.data) setClubes(clubesRes.data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este atleta?')) return
    setDeleting(id)
    const { error } = await supabase.from('atletas').delete().eq('id', id)
    if (!error) setAtletas(atletas.filter((a) => a.id !== id))
    setDeleting(null)
  }

  const categorias = [...new Set(atletas.map((a) => a.categoria).filter(Boolean))] as string[]
  const posicoes = [...new Set(atletas.map((a) => a.posicao).filter(Boolean))] as string[]

  const filteredAtletas = atletas.filter((a) => {
    const clubeName = getClubeName(a.clubes)
    const term = search.toLowerCase()
    const matchSearch =
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

  const limparFiltros = () => {
    setFiltroClube('')
    setFiltroCategoria('')
    setFiltroPosicao('')
  }

  const filtrosAtivos = filtroClube || filtroCategoria || filtroPosicao
  const totalFiltrosAtivos = [filtroClube, filtroCategoria, filtroPosicao].filter(
    Boolean
  ).length

  return (
    <div>
      <PageHeader
        eyebrow="Plantel"
        title="Atletas"
        description={`${filteredAtletas.length} atleta${
          filteredAtletas.length !== 1 ? 's' : ''
        } encontrado${filteredAtletas.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button
              variant={showFilters || filtrosAtivos ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setShowFilters((s) => !s)}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              {filtrosAtivos ? (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-app/30 text-[10px] font-bold">
                  {totalFiltrosAtivos}
                </span>
              ) : null}
            </Button>
            {canCreate && (
              <Link href="/atletas/novo">
                <Button variant="primary" size="md">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Novo atleta</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </Link>
            )}
          </>
        }
      />

      <div className="mb-4 sm:mb-5">
        <Input
          placeholder="Buscar por nome, posicao, categoria ou clube..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {showFilters && (
        <Card padding="md" className="mb-4 sm:mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">
              Filtrar por
            </p>
            {filtrosAtivos && (
              <button
                type="button"
                onClick={limparFiltros}
                className="text-xs text-brand hover:text-brand-hover inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Limpar
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Clube"
              value={filtroClube}
              onChange={(e) => setFiltroClube(e.target.value)}
            >
              <option value="">Todos os clubes</option>
              {clubes.map((c) => (
                <option key={c.id} value={c.nome}>
                  {c.nome}
                </option>
              ))}
            </Select>
            <Select
              label="Categoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
            <Select
              label="Posicao"
              value={filtroPosicao}
              onChange={(e) => setFiltroPosicao(e.target.value)}
            >
              <option value="">Todas as posicoes</option>
              {posicoes.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </Select>
          </div>
        </Card>
      )}

      {loading ? (
        <Card padding="lg">
          <div className="flex justify-center py-6">
            <Spinner size="md" label="Carregando atletas..." />
          </div>
        </Card>
      ) : filteredAtletas.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum atleta encontrado"
          description={
            filtrosAtivos
              ? 'Tente ajustar sua busca ou os filtros aplicados.'
              : 'Cadastre o primeiro atleta para comecar.'
          }
          action={
            filtrosAtivos ? (
              <Button variant="ghost" size="sm" onClick={limparFiltros}>
                <X className="w-4 h-4" /> Limpar filtros
              </Button>
            ) : canCreate ? (
              <Link href="/atletas/novo">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" /> Novo atleta
                </Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {filteredAtletas.map((atleta) => (
            <li
              key={atleta.id}
              className="rounded-2xl bg-surface border border-line p-3 sm:p-4 transition-colors hover:border-line-strong flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-app border border-line overflow-hidden flex items-center justify-center shrink-0">
                  {atleta.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={atleta.foto_url}
                      alt={atleta.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5 text-faint" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-semibold text-strong truncate">
                    {atleta.numero_camisa != null && (
                      <span className="text-brand tabular-nums mr-1.5">
                        #{atleta.numero_camisa}
                      </span>
                    )}
                    {atleta.nome}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-soft">
                    {atleta.posicao && <span className="truncate">{atleta.posicao}</span>}
                    {atleta.categoria && (
                      <Badge variant="info" size="sm">
                        {atleta.categoria}
                      </Badge>
                    )}
                    {getClubeName(atleta.clubes) && (
                      <span className="text-brand truncate">
                        {getClubeName(atleta.clubes)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 justify-end shrink-0">
                <Link href={`/avaliacoes/atleta/${atleta.id}`}>
                  <Button variant="secondary" size="sm">
                    <Star className="w-3.5 h-3.5 text-brand" />
                    <span className="hidden sm:inline">Avaliacoes</span>
                    <span className="sm:hidden">Aval.</span>
                  </Button>
                </Link>
                {canEdit(atleta.criado_por) && (
                  <Link href={`/atletas/${atleta.id}`}>
                    <Button variant="ghost" size="icon" aria-label="Editar">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {canDelete(atleta.criado_por) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Excluir"
                    onClick={() => handleDelete(atleta.id)}
                    disabled={deleting === atleta.id}
                    className="hover:text-negative hover:bg-negative/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
