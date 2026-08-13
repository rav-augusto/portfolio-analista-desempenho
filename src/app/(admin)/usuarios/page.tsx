'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, UserCog, Search, Check, Ban, Shield, User, Users, Eye, EyeOff,
} from 'lucide-react'
import {
  PageHeader, Button, Input, Select, StatCard, Card, Badge, EmptyState, Spinner, Modal,
} from '@/components/app'

type Role = 'master' | 'analista' | 'atleta'
type Usuario = {
  id: string
  email: string
  nome: string
  role: Role
  atleta_id: string | null
  ativo: boolean
  created_at: string
  atleta?: { id: string; nome: string } | null
}
type Atleta = { id: string; nome: string }
type ModalData = { mode: 'create' | 'edit'; usuario?: Usuario }

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroRole, setFiltroRole] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [aExcluir, setAExcluir] = useState<Usuario | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [modal, setModal] = useState<ModalData | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formEmail, setFormEmail] = useState('')
  const [formNome, setFormNome] = useState('')
  const [formSenha, setFormSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [formRole, setFormRole] = useState<Role>('analista')
  const [formAtletaId, setFormAtletaId] = useState<string>('')
  const [formAtivo, setFormAtivo] = useState(true)

  const supabase = createClient()
  const { isMaster, isLoading: userLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!userLoading && !isMaster) router.push('/dashboard')
  }, [userLoading, isMaster, router])

  useEffect(() => {
    if (isMaster) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaster])

  const loadData = async () => {
    const [usuariosRes, atletasRes] = await Promise.all([
      supabase.from('usuarios').select('*, atleta:atletas(id, nome)').order('nome'),
      supabase.from('atletas').select('id, nome').order('nome'),
    ])
    if (usuariosRes.data) setUsuarios(usuariosRes.data)
    if (atletasRes.data) setAtletas(atletasRes.data)
    setLoading(false)
  }

  const handleOpenModal = (mode: 'create' | 'edit', usuario?: Usuario) => {
    setError(null); setFormSenha(''); setShowSenha(false)
    if (mode === 'create') {
      setFormEmail(''); setFormNome(''); setFormRole('analista'); setFormAtletaId(''); setFormAtivo(true)
    } else if (usuario) {
      setFormEmail(usuario.email); setFormNome(usuario.nome); setFormRole(usuario.role)
      setFormAtletaId(usuario.atleta_id || ''); setFormAtivo(usuario.ativo)
    }
    setModal({ mode, usuario })
  }
  const handleCloseModal = () => { setModal(null); setError(null) }

  const handleSave = async () => {
    if (!formEmail || !formNome) { setError('Email e nome são obrigatórios'); return }
    if (modal?.mode === 'create' && !formSenha) { setError('Senha é obrigatória para novo usuário'); return }
    if (modal?.mode === 'create' && formSenha.length < 6) { setError('Senha deve ter no mínimo 6 caracteres'); return }
    if (formRole === 'atleta' && !formAtletaId) { setError('Selecione um atleta para vincular'); return }

    setSaving(true); setError(null)
    try {
      if (modal?.mode === 'create') {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formEmail, nome: formNome, senha: formSenha, role: formRole,
            atleta_id: formRole === 'atleta' ? formAtletaId : null,
          }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Erro ao criar usuário')
        await loadData()
      } else if (modal?.mode === 'edit' && modal.usuario) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ nome: formNome, role: formRole, atleta_id: formRole === 'atleta' ? formAtletaId : null, ativo: formAtivo })
          .eq('id', modal.usuario.id)
        if (updateError) throw updateError
        setUsuarios(usuarios.map(u =>
          u.id === modal.usuario!.id
            ? { ...u, nome: formNome, role: formRole, atleta_id: formRole === 'atleta' ? formAtletaId : null, ativo: formAtivo }
            : u
        ))
      }
      handleCloseModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAtivo = async (usuario: Usuario) => {
    const { error } = await supabase.from('usuarios').update({ ativo: !usuario.ativo }).eq('id', usuario.id)
    if (!error) setUsuarios(usuarios.map(u => u.id === usuario.id ? { ...u, ativo: !u.ativo } : u))
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('usuarios').delete().eq('id', aExcluir.id)
    if (!error) setUsuarios(prev => prev.filter(u => u.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const roleIcon = (role: string) =>
    role === 'master' ? <Shield className="w-3.5 h-3.5" />
      : role === 'analista' ? <UserCog className="w-3.5 h-3.5" />
      : <User className="w-3.5 h-3.5" />
  const roleLabel = (role: string) => role === 'master' ? 'Master' : role === 'analista' ? 'Analista' : role === 'atleta' ? 'Atleta' : role
  const roleBadge = (role: string): 'brand' | 'info' | 'neutral' => role === 'master' ? 'brand' : role === 'analista' ? 'info' : 'neutral'

  const kpis = useMemo(() => ({
    total: usuarios.length,
    masters: usuarios.filter(u => u.role === 'master').length,
    analistas: usuarios.filter(u => u.role === 'analista').length,
    inativos: usuarios.filter(u => !u.ativo).length,
  }), [usuarios])

  const filteredUsuarios = useMemo(() => {
    const q = search.toLowerCase()
    return usuarios.filter(u => {
      const matchBusca = !q || u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = !filtroRole || u.role === filtroRole
      const matchStatus = !filtroStatus || (filtroStatus === 'ativo' ? u.ativo : !u.ativo)
      return matchBusca && matchRole && matchStatus
    })
  }, [usuarios, search, filtroRole, filtroStatus])

  if (userLoading || !isMaster) {
    return <div className="min-h-[400px] flex items-center justify-center"><Spinner size="lg" label="Verificando permissões..." /></div>
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        description={`${filteredUsuarios.length} de ${usuarios.length} usuário${usuarios.length !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => handleOpenModal('create')}><Plus className="w-4 h-4" /><span className="hidden sm:inline">Novo usuário</span><span className="sm:hidden">Novo</span></Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Usuários" value={loading ? '—' : kpis.total} icon={Users} tone="brand" />
        <StatCard label="Masters" value={loading ? '—' : kpis.masters} icon={Shield} tone="caution" />
        <StatCard label="Analistas" value={loading ? '—' : kpis.analistas} icon={UserCog} tone="info" />
        <StatCard label="Inativos" value={loading ? '—' : kpis.inativos} icon={Ban} tone={kpis.inativos > 0 ? 'negative' : 'positive'} />
      </div>

      {/* Toolbar */}
      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <Input placeholder="Buscar nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Select value={filtroRole} onChange={(e) => setFiltroRole(e.target.value)} className="sm:w-40">
              <option value="">Todos os papéis</option>
              <option value="master">Master</option>
              <option value="analista">Analista</option>
              <option value="atleta">Atleta</option>
            </Select>
            <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="sm:w-36">
              <option value="">Todos</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando usuários..." /></div>
      ) : filteredUsuarios.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum usuário encontrado" description="Ajuste os filtros ou cadastre um novo usuário." />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Nome</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3 hidden md:table-cell">E-mail</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3">Papel</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3 hidden lg:table-cell">Vínculo</th>
                  <th className="text-center font-semibold uppercase tracking-wider text-[11px] text-faint px-3 py-3">Status</th>
                  <th className="text-right font-semibold uppercase tracking-wider text-[11px] text-faint px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((u) => (
                  <tr key={u.id} className={`border-b border-line/50 last:border-0 hover:bg-surface-2/40 transition-colors ${!u.ativo ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-app border border-line flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-brand">{u.nome.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-strong truncate">{u.nome}</div>
                          <div className="text-[11px] text-faint truncate md:hidden">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-soft hidden md:table-cell truncate max-w-[200px]">{u.email}</td>
                    <td className="px-3 py-3"><Badge variant={roleBadge(u.role)} size="sm">{roleIcon(u.role)}{roleLabel(u.role)}</Badge></td>
                    <td className="px-3 py-3 text-soft hidden lg:table-cell truncate max-w-[160px]">{u.atleta?.nome || <span className="text-faint">—</span>}</td>
                    <td className="px-3 py-3 text-center">
                      {u.ativo ? <Badge variant="positive" size="sm">Ativo</Badge> : <Badge variant="negative" size="sm">Inativo</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggleAtivo(u)} className={`p-1.5 rounded-lg transition-colors ${u.ativo ? 'text-positive hover:bg-positive/10' : 'text-negative hover:bg-negative/10'}`} title={u.ativo ? 'Desativar' : 'Ativar'}>
                          {u.ativo ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleOpenModal('edit', u)} className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {u.role !== 'master' && (
                          <button onClick={() => setAExcluir(u)} className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal criar/editar */}
      <Modal
        isOpen={!!modal}
        onClose={handleCloseModal}
        title={modal?.mode === 'create' ? 'Novo usuário' : 'Editar usuário'}
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={handleCloseModal}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-negative/10 text-negative text-sm border border-negative/30">{error}</div>}
          <Input label="Nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} placeholder="Nome completo" />
          <Input label="E-mail" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} disabled={modal?.mode === 'edit'} placeholder="email@exemplo.com" hint={modal?.mode === 'edit' ? 'O e-mail não pode ser alterado' : undefined} />
          {modal?.mode === 'create' && (
            <Input
              label="Senha" type={showSenha ? 'text' : 'password'} value={formSenha}
              onChange={(e) => setFormSenha(e.target.value)} placeholder="Mínimo 6 caracteres"
              rightIcon={
                <button type="button" onClick={() => setShowSenha(!showSenha)} className="text-faint hover:text-strong transition-colors pointer-events-auto">
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          )}
          <Select label="Tipo de usuário" value={formRole} onChange={(e) => setFormRole(e.target.value as Role)}>
            <option value="analista">Analista</option>
            <option value="atleta">Atleta</option>
            <option value="master">Master</option>
          </Select>
          {formRole === 'atleta' && (
            <Select label="Vincular ao atleta" value={formAtletaId} onChange={(e) => setFormAtletaId(e.target.value)}>
              <option value="">Selecione um atleta...</option>
              {atletas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </Select>
          )}
          {modal?.mode === 'edit' && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-app border border-line">
              <span className="text-sm font-medium text-soft">Usuário ativo</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formAtivo} onChange={(e) => setFormAtivo(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-line rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal exclusão */}
      <Modal
        isOpen={!!aExcluir}
        onClose={() => setAExcluir(null)}
        title="Excluir usuário"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </>
        }
      >
        <p className="text-sm text-soft">Excluir <b className="text-strong">{aExcluir?.nome}</b>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  )
}
