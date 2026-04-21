'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Pencil,
  Trash2,
  UserCog,
  Search,
  X,
  Check,
  Ban,
  Shield,
  User,
  Users,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Link2
} from 'lucide-react'

type Usuario = {
  id: string
  email: string
  nome: string
  role: 'master' | 'analista' | 'atleta'
  atleta_id: string | null
  ativo: boolean
  created_at: string
  atleta?: {
    id: string
    nome: string
  } | null
}

type Atleta = {
  id: string
  nome: string
}

type ModalData = {
  mode: 'create' | 'edit'
  usuario?: Usuario
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalData | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formEmail, setFormEmail] = useState('')
  const [formNome, setFormNome] = useState('')
  const [formSenha, setFormSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [formRole, setFormRole] = useState<'master' | 'analista' | 'atleta'>('analista')
  const [formAtletaId, setFormAtletaId] = useState<string>('')
  const [formAtivo, setFormAtivo] = useState(true)

  const supabase = createClient()
  const { isMaster, isLoading: userLoading } = useUser()
  const router = useRouter()

  // Redirect non-master users
  useEffect(() => {
    if (!userLoading && !isMaster) {
      router.push('/dashboard')
    }
  }, [userLoading, isMaster, router])

  useEffect(() => {
    if (isMaster) {
      loadData()
    }
  }, [isMaster])

  const loadData = async () => {
    const [usuariosRes, atletasRes] = await Promise.all([
      supabase
        .from('usuarios')
        .select('*, atleta:atletas(id, nome)')
        .order('nome'),
      supabase
        .from('atletas')
        .select('id, nome')
        .order('nome')
    ])

    if (usuariosRes.data) setUsuarios(usuariosRes.data)
    if (atletasRes.data) setAtletas(atletasRes.data)
    setLoading(false)
  }

  const handleOpenModal = (mode: 'create' | 'edit', usuario?: Usuario) => {
    setError(null)
    setFormSenha('')
    setShowSenha(false)
    if (mode === 'create') {
      setFormEmail('')
      setFormNome('')
      setFormRole('analista')
      setFormAtletaId('')
      setFormAtivo(true)
    } else if (usuario) {
      setFormEmail(usuario.email)
      setFormNome(usuario.nome)
      setFormRole(usuario.role)
      setFormAtletaId(usuario.atleta_id || '')
      setFormAtivo(usuario.ativo)
    }
    setModal({ mode, usuario })
  }

  const handleCloseModal = () => {
    setModal(null)
    setError(null)
  }

  const handleSave = async () => {
    if (!formEmail || !formNome) {
      setError('Email e nome sao obrigatorios')
      return
    }

    if (modal?.mode === 'create' && !formSenha) {
      setError('Senha e obrigatoria para novo usuario')
      return
    }

    if (modal?.mode === 'create' && formSenha.length < 6) {
      setError('Senha deve ter no minimo 6 caracteres')
      return
    }

    if (formRole === 'atleta' && !formAtletaId) {
      setError('Selecione um atleta para vincular')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (modal?.mode === 'create') {
        // Create user via API (needs to create auth user first)
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formEmail,
            nome: formNome,
            senha: formSenha,
            role: formRole,
            atleta_id: formRole === 'atleta' ? formAtletaId : null
          })
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao criar usuario')
        }

        // Reload data
        await loadData()
      } else if (modal?.mode === 'edit' && modal.usuario) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            nome: formNome,
            role: formRole,
            atleta_id: formRole === 'atleta' ? formAtletaId : null,
            ativo: formAtivo
          })
          .eq('id', modal.usuario.id)

        if (updateError) throw updateError

        // Update local state
        setUsuarios(usuarios.map(u =>
          u.id === modal.usuario!.id
            ? { ...u, nome: formNome, role: formRole, atleta_id: formRole === 'atleta' ? formAtletaId : null, ativo: formAtivo }
            : u
        ))
      }

      handleCloseModal()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAtivo = async (usuario: Usuario) => {
    const { error } = await supabase
      .from('usuarios')
      .update({ ativo: !usuario.ativo })
      .eq('id', usuario.id)

    if (!error) {
      setUsuarios(usuarios.map(u =>
        u.id === usuario.id ? { ...u, ativo: !u.ativo } : u
      ))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuario? Esta acao nao pode ser desfeita.')) return

    setDeleting(id)
    const { error } = await supabase.from('usuarios').delete().eq('id', id)

    if (!error) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
    setDeleting(null)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'master': return <Shield className="w-4 h-4 text-amber-500" />
      case 'analista': return <UserCog className="w-4 h-4 text-blue-400" />
      case 'atleta': return <User className="w-4 h-4 text-green-400" />
      default: return <User className="w-4 h-4 text-slate-400" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'master': return 'Master'
      case 'analista': return 'Analista'
      case 'atleta': return 'Atleta'
      default: return role
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'master': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'analista': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'atleta': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  if (userLoading || !isMaster) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando permissoes...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Usuarios</h1>
          <p className="text-slate-400 mt-1">
            {filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? 's' : ''} encontrado{filteredUsuarios.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Novo Usuario
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-5 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Buscar Usuarios</p>
              <p className="text-xs text-slate-400">{filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite o nome, email ou role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
            />
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      {loading ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400">Carregando usuarios...</p>
        </div>
      ) : filteredUsuarios.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhum usuario encontrado</p>
          <p className="text-sm text-slate-500">Tente ajustar sua busca ou cadastre um novo usuario</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsuarios.map((usuario) => (
            <div
              key={usuario.id}
              className={`rounded-xl p-4 flex items-center justify-between transition-colors ${
                !usuario.ativo ? 'opacity-60' : ''
              }`}
              style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0f172a', border: '2px solid #475569' }}>
                  <span className="text-lg font-bold text-amber-500">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">{usuario.nome}</h3>
                    {!usuario.ativo && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-medium">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{usuario.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadgeClass(usuario.role)}`}>
                      {getRoleIcon(usuario.role)}
                      {getRoleLabel(usuario.role)}
                    </span>
                    {usuario.atleta && (
                      <span className="text-xs text-slate-500">
                        Vinculado a: {usuario.atleta.nome}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleAtivo(usuario)}
                  className={`p-2 rounded-lg transition-colors ${
                    usuario.ativo
                      ? 'text-green-400 hover:bg-green-500/10'
                      : 'text-red-400 hover:bg-red-500/10'
                  }`}
                  title={usuario.ativo ? 'Desativar' : 'Ativar'}
                >
                  {usuario.ativo ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleOpenModal('edit', usuario)}
                  className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {usuario.role !== 'master' && (
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    disabled={deleting === usuario.id}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            {/* Header */}
            <div className="relative p-6 pb-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {modal.mode === 'create' ? 'Novo Usuario' : 'Editar Usuario'}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {modal.mode === 'create' ? 'Preencha os dados para criar acesso' : 'Atualize as informacoes do usuario'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Tipo de Usuario - Cards visuais */}
              <div>
                <label className="block text-xs font-semibold text-amber-500 uppercase tracking-wide mb-3">Tipo de Usuario</label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Analista */}
                  <button
                    type="button"
                    onClick={() => setFormRole('analista')}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formRole === 'analista'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <UserCog className={`w-6 h-6 mx-auto mb-2 ${formRole === 'analista' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <p className={`text-sm font-semibold ${formRole === 'analista' ? 'text-blue-400' : 'text-slate-300'}`}>Analista</p>
                    <p className="text-[10px] text-slate-500 mt-1">Cria avaliacoes</p>
                  </button>

                  {/* Atleta */}
                  <button
                    type="button"
                    onClick={() => setFormRole('atleta')}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formRole === 'atleta'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${formRole === 'atleta' ? 'text-green-400' : 'text-slate-400'}`} />
                    <p className={`text-sm font-semibold ${formRole === 'atleta' ? 'text-green-400' : 'text-slate-300'}`}>Atleta</p>
                    <p className="text-[10px] text-slate-500 mt-1">Ve seus dados</p>
                  </button>

                  {/* Master */}
                  <button
                    type="button"
                    onClick={() => setFormRole('master')}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formRole === 'master'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <Shield className={`w-6 h-6 mx-auto mb-2 ${formRole === 'master' ? 'text-amber-400' : 'text-slate-400'}`} />
                    <p className={`text-sm font-semibold ${formRole === 'master' ? 'text-amber-400' : 'text-slate-300'}`}>Master</p>
                    <p className="text-[10px] text-slate-500 mt-1">Acesso total</p>
                  </button>
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Digite o nome completo"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    disabled={modal.mode === 'edit'}
                    placeholder="email@exemplo.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                  />
                </div>
              </div>

              {/* Senha (apenas na criacao) */}
              {modal.mode === 'create' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Senha</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showSenha ? 'text' : 'password'}
                      value={formSenha}
                      onChange={(e) => setFormSenha(e.target.value)}
                      placeholder="Minimo 6 caracteres"
                      className="w-full pl-11 pr-12 py-3 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                      style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenha(!showSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">O usuario usara esta senha para fazer login</p>
                </div>
              )}

              {/* Vincular Atleta (quando role = atleta) */}
              {formRole === 'atleta' && (
                <div>
                  <label className="block text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">
                    <Link2 className="w-3 h-3 inline mr-1" />
                    Vincular ao Atleta
                  </label>
                  <select
                    value={formAtletaId}
                    onChange={(e) => setFormAtletaId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                  >
                    <option value="">Selecione um atleta...</option>
                    {atletas.map(a => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1.5">Este usuario tera acesso ao portal do atleta selecionado</p>
                </div>
              )}

              {/* Status Ativo (apenas na edicao) */}
              {modal.mode === 'edit' && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formAtivo ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {formAtivo ? <Check className="w-5 h-5 text-green-400" /> : <Ban className="w-5 h-5 text-red-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Status do Usuario</p>
                        <p className="text-xs text-slate-500">{formAtivo ? 'Usuario pode fazer login' : 'Acesso bloqueado'}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formAtivo}
                        onChange={(e) => setFormAtivo(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 pt-2">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600 transition-all font-medium border border-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {modal.mode === 'create' ? 'Criar Usuario' : 'Salvar Alteracoes'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
