'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Plus, Pencil, Trash2, PenTool, ImageOff } from 'lucide-react'
import {
  PageHeader, Card, Button, EmptyState, Spinner, Modal,
} from '@/components/app'

type Anotacao = {
  id: string
  titulo: string | null
  imagem_anotada_url: string | null
  imagem_original_url: string
  criado_por: string | null
  created_at: string
  atletas: { nome: string } | { nome: string }[] | null
}

export default function AnotacoesPage() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([])
  const [loading, setLoading] = useState(true)
  const [aExcluir, setAExcluir] = useState<Anotacao | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()
  const { canCreate, canEdit, canDelete } = useUser()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('anotacoes_taticas')
      .select('id, titulo, imagem_anotada_url, imagem_original_url, criado_por, created_at, atletas(nome)')
      .order('created_at', { ascending: false })
    if (data) setAnotacoes(data as unknown as Anotacao[])
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('anotacoes_taticas').delete().eq('id', aExcluir.id)
    if (!error) setAnotacoes(prev => prev.filter(a => a.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const getAtleta = (a: Anotacao['atletas']) => (Array.isArray(a) ? a[0] : a)

  return (
    <div>
      <PageHeader
        eyebrow="Devolutiva"
        title="Anotações Táticas"
        description={`${anotacoes.length} anotação${anotacoes.length !== 1 ? 'ões' : ''}`}
        actions={canCreate && (
          <Link href="/anotacoes/nova"><Button><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nova anotação</span><span className="sm:hidden">Nova</span></Button></Link>
        )}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando anotações..." /></div>
      ) : anotacoes.length === 0 ? (
        <EmptyState
          icon={PenTool}
          title="Nenhuma anotação ainda"
          description="Desenhe em cima de um print de vídeo pra dar a devolutiva de um atleta."
          action={canCreate ? <Link href="/anotacoes/nova"><Button size="sm"><Plus className="w-4 h-4" />Nova anotação</Button></Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {anotacoes.map((a) => {
            const atleta = getAtleta(a.atletas)
            const imagem = a.imagem_anotada_url || a.imagem_original_url
            return (
              <Card key={a.id} padding="none" className="group flex flex-col overflow-hidden">
                <Link href={`/anotacoes/${a.id}`}>
                  <div className="aspect-video bg-app border-b border-line overflow-hidden grid place-items-center">
                    {imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagem} alt={a.titulo || ''} className="w-full h-full object-cover" />
                    ) : <ImageOff className="w-6 h-6 text-faint" />}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-strong truncate group-hover:text-brand transition-colors">{a.titulo || 'Sem título'}</p>
                    <p className="text-xs text-soft truncate mt-0.5">{atleta?.nome || 'Atleta'}</p>
                  </div>
                </Link>
                <div className="mt-auto flex items-center justify-end gap-1 border-t border-line/70 px-4 py-2.5">
                  {canEdit(a.criado_por) && (
                    <Link href={`/anotacoes/${a.id}`} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" aria-label="Editar"><Pencil className="w-4 h-4" /></Link>
                  )}
                  {canDelete(a.criado_por) && (
                    <button onClick={() => setAExcluir(a)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" aria-label="Excluir"><Trash2 className="w-4 h-4" /></button>
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
        title="Excluir anotação"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </>
        }
      >
        <p className="text-sm text-soft">Excluir <b className="text-strong">{aExcluir?.titulo || 'esta anotação'}</b>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
