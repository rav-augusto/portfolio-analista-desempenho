'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, FileBarChart, Search, Calendar, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

type Analise = {
  id: string
  jogo_id: string
  sistema_tatico: string | null
  created_at: string
  jogos: {
    adversario: string
    data_jogo: string
    competicao: string
    fase: string | null
    clubes: { nome: string } | null
  } | null
  prints_taticos: { id: string }[]
}

export default function AnalisesPage() {
  const [analises, setAnalises] = useState<Analise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadAnalises()
  }, [])

  const loadAnalises = async () => {
    const { data, error } = await supabase
      .from('analises_jogo')
      .select('id, jogo_id, sistema_tatico, created_at, jogos(adversario, data_jogo, competicao, fase, clubes(nome)), prints_taticos(id)')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAnalises(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta analise?')) return

    setDeleting(id)
    const { error } = await supabase.from('analises_jogo').delete().eq('id', id)

    if (!error) {
      setAnalises(analises.filter(a => a.id !== id))
    }
    setDeleting(null)
  }

  const filteredAnalises = analises.filter(a =>
    a.jogos?.adversario.toLowerCase().includes(search.toLowerCase()) ||
    a.jogos?.clubes?.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.jogos?.competicao.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analises de Jogo</h1>
          <p className="text-slate-400 mt-1">Gerencie as analises tatico-tecnicas</p>
        </div>
        <Link
          href="/analises/nova"
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Analise
        </Link>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar analises..."
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
        ) : filteredAnalises.length === 0 ? (
          <div className="p-8 text-center">
            <FileBarChart className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Nenhuma analise encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredAnalises.map((analise) => (
              <div key={analise.id} className="p-4 flex items-center justify-between hover:bg-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileBarChart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {analise.jogos?.clubes?.nome} x {analise.jogos?.adversario}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      {analise.jogos && (
                        <>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(analise.jogos.data_jogo)}
                          </span>
                          <span>{analise.jogos.competicao}{analise.jogos.fase && ` - ${analise.jogos.fase}`}</span>
                          {analise.sistema_tatico && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                              {analise.sistema_tatico}
                            </span>
                          )}
                          {analise.prints_taticos && analise.prints_taticos.length > 0 && (
                            <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                              <ImageIcon className="w-3 h-3" />
                              {analise.prints_taticos.length}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/analises/${analise.id}`}
                    className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(analise.id)}
                    disabled={deleting === analise.id}
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
