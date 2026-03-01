'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, FileBarChart, Search, Calendar, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

type JogoData = {
  adversario: string
  data_jogo: string
  competicao: string
  fase: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

type Analise = {
  id: string
  jogo_id: string
  sistema_tatico: string | null
  created_at: string
  jogos: JogoData | JogoData[] | null
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
    if (!confirm('Tem certeza que deseja excluir esta análise?')) return

    setDeleting(id)
    const { error } = await supabase.from('analises_jogo').delete().eq('id', id)

    if (!error) {
      setAnalises(analises.filter(a => a.id !== id))
    }
    setDeleting(null)
  }

  const getJogo = (jogos: JogoData | JogoData[] | null | undefined): JogoData | null => {
    if (!jogos) return null
    if (Array.isArray(jogos)) return jogos[0] || null
    return jogos
  }

  const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined) => {
    if (!clubes) return ''
    if (Array.isArray(clubes)) return clubes[0]?.nome || ''
    return clubes.nome || ''
  }

  const filteredAnalises = analises.filter(a => {
    const jogo = getJogo(a.jogos)
    return jogo?.adversario?.toLowerCase().includes(search.toLowerCase()) ||
      getClubeName(jogo?.clubes).toLowerCase().includes(search.toLowerCase()) ||
      jogo?.competicao?.toLowerCase().includes(search.toLowerCase())
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Análises de Jogo</h1>
          <p className="text-slate-400 mt-1">Gerencie as análises tático-técnicas</p>
        </div>
        <Link
          href="/analises/nova"
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nova Análise
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-5 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Buscar Análises</p>
              <p className="text-xs text-slate-400">{filteredAnalises.length} análise{filteredAnalises.length !== 1 ? 's' : ''} encontrada{filteredAnalises.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite o adversário, clube ou competição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400">Carregando análises...</p>
        </div>
      ) : filteredAnalises.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <FileBarChart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhuma análise encontrada</p>
          <p className="text-sm text-slate-500">Crie uma nova análise para começar</p>
          <Link href="/analises/nova" className="text-amber-500 hover:text-amber-400 mt-3 inline-block">
            Criar primeira análise
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnalises.map((analise) => {
            const jogo = getJogo(analise.jogos)
            return (
              <div
                key={analise.id}
                className="rounded-xl p-4 flex items-center justify-between transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <FileBarChart className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {getClubeName(jogo?.clubes)} x {jogo?.adversario}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      {jogo && (
                        <>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(jogo.data_jogo)}
                          </span>
                          <span>{jogo.competicao}{jogo.fase && ` - ${jogo.fase}`}</span>
                          {analise.sistema_tatico && (
                            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                              {analise.sistema_tatico}
                            </span>
                          )}
                          {analise.prints_taticos && analise.prints_taticos.length > 0 && (
                            <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs">
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
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(analise.id)}
                    disabled={deleting === analise.id}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
