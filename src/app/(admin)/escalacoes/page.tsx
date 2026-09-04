'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Plus, Pencil, Trash2, Shield, Swords, LayoutGrid } from 'lucide-react'
import {
  PageHeader, Card, Badge, Button, EmptyState, Spinner, Modal,
} from '@/components/app'

type Escalacao = {
  id: string
  adversario: string | null
  formacao: string
  treinador: string | null
  criado_por: string | null
  created_at: string
  clubes: { nome: string; escudo_url: string | null } | null
}

export default function EscalacoesPage() {
  const [escalacoes, setEscalacoes] = useState<Escalacao[]>([])
  const [loading, setLoading] = useState(true)
  const [aExcluir, setAExcluir] = useState<Escalacao | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('escalacoes')
      .select('id, adversario, formacao, treinador, criado_por, created_at, clubes(nome, escudo_url)')
      .order('created_at', { ascending: false })
    if (data) setEscalacoes(data as unknown as Escalacao[])
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('escalacoes').delete().eq('id', aExcluir.id)
    if (!error) setEscalacoes(prev => prev.filter(e => e.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const getClube = (c: Escalacao['clubes']) => (Array.isArray(c) ? c[0] : c)

  return (
    <div>
      <PageHeader
        eyebrow="Time em campo"
        title="Escalações"
        description={`${escalacoes.length} escalação${escalacoes.length !== 1 ? 'ões' : ''} montada${escalacoes.length !== 1 ? 's' : ''}`}
        actions={canCreate && (
          <Link href="/escalacoes/nova"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nova escalação</span><span className="sm:hidden">Nova</span></Button></Link>
        )}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando escalações..." /></div>
      ) : escalacoes.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Nenhuma escalação ainda"
          description="Monte a primeira escalação arrastando os atletas para o campo."
          action={canCreate ? <Link href="/escalacoes/nova"><Button size="sm"><Plus className="w-4 h-4" />Nova escalação</Button></Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {escalacoes.map((esc) => {
            const clube = getClube(esc.clubes)
            return (
              <Card key={esc.id} padding="none" className="group flex flex-col overflow-hidden">
                <Link href={`/escalacoes/${esc.id}`} className="flex items-start gap-3 p-4">
                  <div className="w-11 h-11 rounded-xl bg-app border border-line overflow-hidden grid place-items-center shrink-0">
                    {clube?.escudo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={clube.escudo_url} alt={clube.nome} className="w-full h-full object-contain p-1" />
                    ) : <Shield className="w-5 h-5 text-faint" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-strong truncate group-hover:text-brand transition-colors">{clube?.nome || 'Escalação'}</p>
                    {esc.adversario && (
                      <p className="text-xs text-soft truncate mt-0.5 flex items-center gap-1">
                        <Swords className="w-3 h-3 shrink-0" /> {esc.adversario}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge variant="brand" size="sm">{esc.formacao}</Badge>
                    </div>
                  </div>
                </Link>
                <div className="mt-auto flex items-center justify-between border-t border-line/70 px-4 py-2.5">
                  <span className="text-xs text-faint">{esc.treinador || 'Sem treinador definido'}</span>
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {canEdit(esc.criado_por) && (
                      <Link href={`/escalacoes/${esc.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" aria-label="Editar"><Pencil className="w-4 h-4" /></Link>
                    )}
                    {canDelete(esc.criado_por) && (
                      <button onClick={() => setAExcluir(esc)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" aria-label="Excluir"><Trash2 className="w-4 h-4" /></button>
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
        title="Excluir escalação"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </>
        }
      >
        <p className="text-sm text-soft">Excluir <b className="text-strong">{getClube(aExcluir?.clubes ?? null)?.nome || 'esta escalação'}{aExcluir?.adversario ? ` × ${aExcluir.adversario}` : ''}</b>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
