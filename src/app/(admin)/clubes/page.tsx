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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100">Clubes</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie os clubes cadastrados</p>
        </div>
        <Link
          href="/clubes/novo"
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-500 text-slate-900 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Novo Clube</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-4 sm:p-5 shadow-sm mb-4 sm:mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base text-slate-100">Buscar Clubes</p>
              <p className="text-xs text-slate-400">{filteredClubes.length} clube{filteredClubes.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nome do clube ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
            />
          </div>
        </div>
      </div>

      {/* Lista de Clubes */}
      {loading ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400">Carregando clubes...</p>
        </div>
      ) : filteredClubes.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhum clube encontrado</p>
          <p className="text-sm text-slate-500">Tente ajustar sua busca ou cadastre um novo clube</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredClubes.map((clube) => (
            <div
              key={clube.id}
              className="rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                  {clube.escudo_url ? (
                    <img src={clube.escudo_url} alt={clube.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-slate-100 truncate">{clube.nome}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{clube.cidade} - {clube.estado}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                <Link
                  href={`/clubes/${clube.id}`}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(clube.id)}
                  disabled={deleting === clube.id}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
