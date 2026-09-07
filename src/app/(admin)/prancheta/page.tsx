'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Plus, Pencil, Trash2, LayoutTemplate, Shield } from 'lucide-react'
import {
  PageHeader, Card, Button, EmptyState, Spinner, Modal,
} from '@/components/app'

type Prancheta = {
  id: string
  titulo: string | null
  imagem_url: string | null
  criado_por: string | null
  created_at: string
  clubes: { nome: string } | { nome: string }[] | null
}

export default function PranchetaListaPage() {
  const [pranchetas, setPranchetas] = useState<Prancheta[]>([])
  const [loading, setLoading] = useState(true)
  const [aExcluir, setAExcluir] = useState<Prancheta | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('pranchetas')
      .select('id, titulo, imagem_url, criado_por, created_at, clubes(nome)')
      .order('created_at', { ascending: false })
    if (data) setPranchetas(data as unknown as Prancheta[])
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('pranchetas').delete().eq('id', aExcluir.id)
    if (!error) setPranchetas(prev => prev.filter(p => p.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const getClube = (c: Prancheta['clubes']) => (Array.isArray(c) ? c[0] : c)

  return (
    <div>
      <PageHeader
        eyebrow="Esquema"
        title="Prancheta Tática"
        description={`${pranchetas.length} prancheta${pranchetas.length !== 1 ? 's' : ''}`}
        actions={canCreate && (
          <Link href="/prancheta/nova"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nova prancheta</span><span className="sm:hidden">Nova</span></Button></Link>
        )}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando pranchetas..." /></div>
      ) : pranchetas.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="Nenhuma prancheta ainda"
          description="Monte uma jogada, esquema ou exercício num campo em branco."
          action={canCreate ? <Link href="/prancheta/nova"><Button size="sm"><Plus className="w-4 h-4" />Nova prancheta</Button></Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {pranchetas.map((p) => {
            const clube = getClube(p.clubes)
            return (
              <Card key={p.id} padding="none" className="group flex flex-col overflow-hidden">
                <Link href={`/prancheta/${p.id}`}>
                  <div className="aspect-[4/3] bg-app border-b border-line overflow-hidden grid place-items-center">
                    {p.imagem_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagem_url} alt={p.titulo || ''} className="w-full h-full object-cover" />
                    ) : <LayoutTemplate className="w-6 h-6 text-faint" />}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-strong truncate group-hover:text-brand transition-colors">{p.titulo || 'Sem título'}</p>
                    {clube?.nome && (
                      <p className="text-xs text-soft truncate mt-0.5 flex items-center gap-1">
                        <Shield className="w-3 h-3 shrink-0" /> {clube.nome}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="mt-auto flex items-center justify-end gap-1 border-t border-line/70 px-4 py-2.5">
                  {canEdit(p.criado_por) && (
                    <Link href={`/prancheta/${p.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" aria-label="Editar"><Pencil className="w-4 h-4" /></Link>
                  )}
                  {canDelete(p.criado_por) && (
                    <button onClick={() => setAExcluir(p)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" aria-label="Excluir"><Trash2 className="w-4 h-4" /></button>
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
        title="Excluir prancheta"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </>
        }
      >
        <p className="text-sm text-soft">Excluir <b className="text-strong">{aExcluir?.titulo || 'esta prancheta'}</b>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
