'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react'
import Link from 'next/link'

type Atleta = {
  id: string
  nome: string
  posicao: string | null
  categoria: string | null
  numero_camisa: number | null
  foto_url: string | null
  data_nascimento: string | null
  clubes: { nome: string } | null
}

export default function AtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadAtletas()
  }, [])

  const loadAtletas = async () => {
    const { data, error } = await supabase
      .from('atletas')
      .select('id, nome, posicao, categoria, numero_camisa, foto_url, data_nascimento, clubes(nome)')
      .order('nome')

    if (!error && data) {
      setAtletas(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este atleta?')) return

    setDeleting(id)
    const { error } = await supabase.from('atletas').delete().eq('id', id)

    if (!error) {
      setAtletas(atletas.filter(a => a.id !== id))
    }
    setDeleting(null)
  }

  const filteredAtletas = atletas.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.posicao?.toLowerCase().includes(search.toLowerCase()) ||
    a.categoria?.toLowerCase().includes(search.toLowerCase()) ||
    a.clubes?.nome.toLowerCase().includes(search.toLowerCase())
  )

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date()
    const nascimento = new Date(dataNasc)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const m = hoje.getMonth() - nascimento.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Atletas</h1>
          <p className="text-slate-400 mt-1">Gerencie os atletas cadastrados</p>
        </div>
        <Link
          href="/atletas/novo"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Atleta
        </Link>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar atletas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Carregando...</div>
        ) : filteredAtletas.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Nenhum atleta encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredAtletas.map((atleta) => (
              <div key={atleta.id} className="p-4 flex items-center justify-between hover:bg-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                    {atleta.foto_url ? (
                      <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {atleta.numero_camisa && <span className="text-amber-500">#{atleta.numero_camisa}</span>} {atleta.nome}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      {atleta.posicao && <span>{atleta.posicao}</span>}
                      {atleta.categoria && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{atleta.categoria}</span>}
                      {atleta.data_nascimento && <span>{calcularIdade(atleta.data_nascimento)} anos</span>}
                      {atleta.clubes && <span className="text-amber-500">{atleta.clubes.nome}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/atletas/${atleta.id}`}
                    className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(atleta.id)}
                    disabled={deleting === atleta.id}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
