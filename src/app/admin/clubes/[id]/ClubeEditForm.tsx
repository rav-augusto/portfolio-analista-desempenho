'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { ArrowLeft, Save, Trash2, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'

interface Clube {
  id: string
  nome: string
  cidade: string | null
  estado: string | null
  categoria: string | null
  contato_nome: string | null
  contato_email: string | null
  contato_telefone: string | null
  ativo: boolean
}

interface Props {
  clube: Clube
}

export function ClubeEditForm({ clube }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nome: clube.nome || '',
    cidade: clube.cidade || '',
    estado: clube.estado || '',
    categoria: clube.categoria || '',
    contato_nome: clube.contato_nome || '',
    contato_email: clube.contato_email || '',
    contato_telefone: clube.contato_telefone || '',
    ativo: clube.ativo,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('clubes')
      .update(form)
      .eq('id', clube.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/clubes')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este clube? Esta acao nao pode ser desfeita.')) {
      return
    }

    setDeleting(true)

    const { error } = await supabase
      .from('clubes')
      .delete()
      .eq('id', clube.id)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }

    router.push('/admin/clubes')
    router.refresh()
  }

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const categorias = ['Sub-11', 'Sub-12', 'Sub-13', 'Sub-14', 'Sub-15', 'Sub-16', 'Sub-17', 'Sub-20', 'Profissional']

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/clubes"
          className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Clube</h1>
          <p className="text-gray-500 text-sm">Atualize as informacoes do clube</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Info Basica */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Informacoes Basicas</h2>
          </div>

          <div className="space-y-5">
            <Input
              label="Nome do Clube"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Cidade"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                >
                  <option value="">Selecione</option>
                  {estados.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              >
                <option value="">Selecione</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contato</h2>

          <div className="space-y-5">
            <Input
              label="Nome do Contato"
              name="contato_nome"
              value={form.contato_nome}
              onChange={handleChange}
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Email"
                name="contato_email"
                type="email"
                value={form.contato_email}
                onChange={handleChange}
              />
              <Input
                label="Telefone"
                name="contato_telefone"
                value={form.contato_telefone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Status</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id="ativo"
                name="ativo"
                checked={form.ativo}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </div>
            <span className="text-gray-700">Clube ativo</span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1" />
          <Link
            href="/admin/clubes"
            className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alteracoes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
