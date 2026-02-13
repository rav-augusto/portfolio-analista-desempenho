'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Gamepad2, Search, Calendar, Play } from 'lucide-react'
import Link from 'next/link'

type Jogo = {
  id: string
  clube_id: string
  adversario: string
  data_jogo: string
  local: string
  competicao: string
  fase: string | null
  placar_clube: number | null
  placar_adversario: number | null
  video_url: string | null
  clubes: { nome: string } | null
}

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadJogos()
  }, [])

  const loadJogos = async () => {
    const { data, error } = await supabase
      .from('jogos')
      .select('*, clubes(nome)')
      .order('data_jogo', { ascending: false })

    if (!error && data) {
      setJogos(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) return

    setDeleting(id)
    const { error } = await supabase.from('jogos').delete().eq('id', id)

    if (!error) {
      setJogos(jogos.filter(j => j.id !== id))
    }
    setDeleting(null)
  }

  const filteredJogos = jogos.filter(j =>
    j.adversario.toLowerCase().includes(search.toLowerCase()) ||
    j.competicao.toLowerCase().includes(search.toLowerCase()) ||
    j.clubes?.nome.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    // Adiciona T12:00:00 para evitar problema de fuso horario
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Jogos</h1>
          <p className="text-slate-400 mt-1">Gerencie os jogos cadastrados</p>
        </div>
        <Link
          href="/jogos/novo"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Jogo
        </Link>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar jogos..."
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
        ) : filteredJogos.length === 0 ? (
          <div className="p-8 text-center">
            <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Nenhum jogo encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredJogos.map((jogo) => (
              <div key={jogo.id} className="p-4 flex items-center justify-between hover:bg-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {jogo.clubes?.nome || 'Clube'} x {jogo.adversario}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(jogo.data_jogo)}
                      </span>
                      <span>{jogo.competicao}{jogo.fase && ` - ${jogo.fase}`}</span>
                      {jogo.placar_clube !== null && jogo.placar_adversario !== null && (
                        <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px' }}>
                          Placar: {jogo.placar_clube} x {jogo.placar_adversario}
                        </span>
                      )}
                      {jogo.video_url && (
                        <a
                          href={jogo.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ▶ Assistir
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/jogos/${jogo.id}`}
                    className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(jogo.id)}
                    disabled={deleting === jogo.id}
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
