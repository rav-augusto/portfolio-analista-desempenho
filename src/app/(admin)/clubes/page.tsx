'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Shield, Search } from 'lucide-react'
import Link from 'next/link'

type Clube = {
  id: string
  nome: string
  cidade: string
  estado: string
  escudo_url: string | null
  created_at: string
}

export default function ClubesPage() {
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadClubes()
  }, [])

  const loadClubes = async () => {
    const { data, error } = await supabase
      .from('clubes')
      .select('*')
      .order('nome')

    if (!error && data) {
      setClubes(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este clube?')) return

    setDeleting(id)
    const { error } = await supabase.from('clubes').delete().eq('id', id)

    if (!error) {
      setClubes(clubes.filter(c => c.id !== id))
    }
    setDeleting(null)
  }

  const filteredClubes = clubes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cidade.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Clubes</h1>
          <p className="text-slate-400 mt-1">Gerencie os clubes cadastrados</p>
        </div>
        <Link
          href="/clubes/novo"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Clube
        </Link>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar clubes..."
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
        ) : filteredClubes.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Nenhum clube encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredClubes.map((clube) => (
              <div key={clube.id} className="p-4 flex items-center justify-between hover:bg-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                    {clube.escudo_url ? (
                      <img src={clube.escudo_url} alt={clube.nome} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{clube.nome}</h3>
                    <p className="text-sm text-slate-400">{clube.cidade} - {clube.estado}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/clubes/${clube.id}`}
                    className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(clube.id)}
                    disabled={deleting === clube.id}
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
