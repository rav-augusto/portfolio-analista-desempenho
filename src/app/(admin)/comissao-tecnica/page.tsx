'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { Plus, Pencil, Trash2, UsersRound, Search } from 'lucide-react'
import {
  PageHeader, Card, Badge, Button, Input, Select, EmptyState, Spinner, Modal,
} from '@/components/app'

type Membro = {
  id: string
  nome: string
  funcao: string
  foto_url: string | null
  telefone: string | null
  criado_por: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

type Clube = { id: string; nome: string }

const getClubeName = (clubes: Membro['clubes']): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
}

export default function ComissaoTecnicaPage() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroClube, setFiltroClube] = useState('')
  const [aExcluir, setAExcluir] = useState<Membro | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const [membrosRes, clubesRes] = await Promise.all([
      supabase.from('comissao_tecnica').select('id, nome, funcao, foto_url, telefone, criado_por, clubes(nome)').order('nome'),
      supabase.from('clubes').select('id, nome').order('nome'),
    ])
    if (membrosRes.data) setMembros(membrosRes.data)
    if (clubesRes.data) setClubes(clubesRes.data)
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('comissao_tecnica').delete().eq('id', aExcluir.id)
    if (!error) setMembros(prev => prev.filter(m => m.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const filtrados = useMemo(() => {
    const term = search.toLowerCase()
    return membros.filter(m => {
      const clubeName = getClubeName(m.clubes)
      const matchSearch = !term || m.nome.toLowerCase().includes(term) || m.funcao.toLowerCase().includes(term) || clubeName.toLowerCase().includes(term)
      if (!matchSearch) return false
      if (filtroClube && clubeName !== filtroClube) return false
      return true
    })
  }, [membros, search, filtroClube])

  return (
    <div>
      <PageHeader
        eyebrow="Bastidores"
        title="Comissão Técnica"
        description={`${filtrados.length} de ${membros.length} membro${membros.length !== 1 ? 's' : ''}`}
        actions={canCreate && (
          <Link href="/comissao-tecnica/novo"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Novo membro</span><span className="sm:hidden">Novo</span></Button></Link>
        )}
      />

      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <Input placeholder="Buscar nome, função ou clube..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          <Select value={filtroClube} onChange={(e) => setFiltroClube(e.target.value)}>
            <option value="">Todos os clubes</option>
            {clubes.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando comissão técnica..." /></div>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Nenhum membro cadastrado"
          description="Cadastre o treinador, auxiliares e demais membros do departamento."
          action={canCreate ? <Link href="/comissao-tecnica/novo"><Button size="sm"><Plus className="w-4 h-4" />Novo membro</Button></Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtrados.map((membro) => (
            <Card key={membro.id} padding="none" className="group flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 rounded-full bg-app border border-line overflow-hidden grid place-items-center shrink-0">
                  {membro.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={membro.foto_url} alt={membro.nome} className="w-full h-full object-cover" />
                  ) : <UsersRound className="w-6 h-6 text-faint" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-strong truncate">{membro.nome}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Badge variant="info" size="sm">{membro.funcao}</Badge>
                    {getClubeName(membro.clubes) && <span className="text-[11px] text-brand truncate">{getClubeName(membro.clubes)}</span>}
                  </div>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-end gap-1 border-t border-line/70 px-4 py-2.5">
                {canEdit(membro.criado_por) && (
                  <Link href={`/comissao-tecnica/${membro.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" aria-label="Editar"><Pencil className="w-4 h-4" /></Link>
                )}
                {canDelete(membro.criado_por) && (
                  <button onClick={() => setAExcluir(membro)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" aria-label="Excluir"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!aExcluir}
        onClose={() => setAExcluir(null)}
        title="Excluir membro"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </>
        }
      >
        <p className="text-sm text-soft">Excluir <b className="text-strong">{aExcluir?.nome}</b>? Ele será removido de qualquer escalação em que aparece.</p>
      </Modal>
    </div>
  )
}
