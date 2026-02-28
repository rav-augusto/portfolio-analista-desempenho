'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Users, Search, Filter, X } from 'lucide-react'
import Link from 'next/link'

type Atleta = {
  id: string
  nome: string
  posicao: string | null
  categoria: string | null
  numero_camisa: number | null
  foto_url: string | null
  data_nascimento: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
}

type Clube = {
  id: string
  nome: string
}

export default function AtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  // Filtros
  const [filtroClube, setFiltroClube] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroPosicao, setFiltroPosicao] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [atletasRes, clubesRes] = await Promise.all([
      supabase
        .from('atletas')
        .select('id, nome, posicao, categoria, numero_camisa, foto_url, data_nascimento, clubes(nome)')
        .order('nome'),
      supabase
        .from('clubes')
        .select('id, nome')
        .order('nome')
    ])

    if (atletasRes.data) setAtletas(atletasRes.data)
    if (clubesRes.data) setClubes(clubesRes.data)
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

  // Extrair listas únicas para filtros
  const categorias = [...new Set(atletas.map(a => a.categoria).filter(Boolean))]
  const posicoes = [...new Set(atletas.map(a => a.posicao).filter(Boolean))]

  const filteredAtletas = atletas.filter(a => {
    const clubeName = getClubeName(a.clubes)
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.posicao?.toLowerCase().includes(search.toLowerCase()) ||
      a.categoria?.toLowerCase().includes(search.toLowerCase()) ||
      clubeName.toLowerCase().includes(search.toLowerCase())

    if (!matchSearch) return false
    if (filtroClube && clubeName !== filtroClube) return false
    if (filtroCategoria && a.categoria !== filtroCategoria) return false
    if (filtroPosicao && a.posicao !== filtroPosicao) return false

    return true
  })

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

  const limparFiltros = () => {
    setFiltroClube('')
    setFiltroCategoria('')
    setFiltroPosicao('')
  }

  const filtrosAtivos = filtroClube || filtroCategoria || filtroPosicao

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Atletas</h1>
          <p className="text-slate-400 mt-1">
            {filteredAtletas.length} atleta{filteredAtletas.length !== 1 ? 's' : ''} encontrado{filteredAtletas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              showFilters || filtrosAtivos
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {filtrosAtivos && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
          <Link
            href="/atletas/novo"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Atleta
          </Link>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">Filtrar por</h3>
            {filtrosAtivos && (
              <button
                onClick={limparFiltros}
                className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Limpar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Clube</label>
              <select
                value={filtroClube}
                onChange={(e) => setFiltroClube(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todos os clubes</option>
                {clubes.map(c => (
                  <option key={c.id} value={c.nome}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat!}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Posicao</label>
              <select
                value={filtroPosicao}
                onChange={(e) => setFiltroPosicao(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todas as posicoes</option>
                {posicoes.map(pos => (
                  <option key={pos} value={pos!}>{pos}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

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
            {filtrosAtivos && (
              <button
                onClick={limparFiltros}
                className="text-amber-500 hover:text-amber-400 mt-2 text-sm"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredAtletas.map((atleta) => (
              <div key={atleta.id} className="p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-600">
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
                      {atleta.categoria && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {atleta.categoria}
                        </span>
                      )}
                      {getClubeName(atleta.clubes) && <span className="text-amber-500">{getClubeName(atleta.clubes)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/avaliacoes/atleta/${atleta.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Avaliacoes
                  </Link>
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
