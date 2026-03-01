'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Calendar, Play, Filter, X, Trophy, MapPin, Search } from 'lucide-react'
import Link from 'next/link'

type Jogo = {
  id: string
  clube_id: string
  adversario: string
  data_jogo: string
  local: string | null
  competicao: string
  fase: string | null
  categoria: string | null
  placar_clube: number | null
  placar_adversario: number | null
  video_url: string | null
  clubes: {
    id: string
    nome: string
  } | null
}

type Clube = {
  id: string
  nome: string
}

const categorias = [
  'Sub-9',
  'Sub-10',
  'Sub-11',
  'Sub-12',
  'Sub-13',
  'Sub-14',
  'Sub-15',
  'Sub-16',
  'Sub-17',
  'Sub-20',
  'Profissional'
]

export default function JogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Filtros
  const [filtroClube, setFiltroClube] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroCompeticao, setFiltroCompeticao] = useState('')
  const [filtroPeriodo, setFiltroPeriodo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [jogosRes, clubesRes] = await Promise.all([
      supabase
        .from('jogos')
        .select('*, clubes(id, nome)')
        .order('data_jogo', { ascending: false }),
      supabase
        .from('clubes')
        .select('id, nome')
        .order('nome')
    ])

    if (jogosRes.data) setJogos(jogosRes.data)
    if (clubesRes.data) setClubes(clubesRes.data)
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

  // Extrair listas únicas para filtros
  const categoriasUsadas = [...new Set(jogos.map(j => j.categoria).filter(Boolean))]
  const competicoes = [...new Set(jogos.map(j => j.competicao).filter(Boolean))]

  // Filtrar jogos
  const filteredJogos = jogos.filter(j => {
    // Busca por texto
    const matchSearch = !search ||
      j.adversario.toLowerCase().includes(search.toLowerCase()) ||
      j.clubes?.nome.toLowerCase().includes(search.toLowerCase()) ||
      j.competicao.toLowerCase().includes(search.toLowerCase()) ||
      j.local?.toLowerCase().includes(search.toLowerCase())

    if (!matchSearch) return false
    if (filtroClube && j.clube_id !== filtroClube) return false
    if (filtroCategoria && j.categoria !== filtroCategoria) return false
    if (filtroCompeticao && j.competicao !== filtroCompeticao) return false
    if (filtroPeriodo) {
      const dataJogo = new Date(j.data_jogo)
      const hoje = new Date()
      if (filtroPeriodo === '7dias') {
        const limite = new Date(hoje.setDate(hoje.getDate() - 7))
        if (dataJogo < limite) return false
      } else if (filtroPeriodo === '30dias') {
        const limite = new Date(hoje.setDate(hoje.getDate() - 30))
        if (dataJogo < limite) return false
      } else if (filtroPeriodo === '90dias') {
        const limite = new Date(hoje.setDate(hoje.getDate() - 90))
        if (dataJogo < limite) return false
      }
    }
    return true
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('pt-BR')
  }

  const getResultado = (placarClube: number | null, placarAdversario: number | null) => {
    if (placarClube === null || placarAdversario === null) return null
    if (placarClube > placarAdversario) return 'vitoria'
    if (placarClube < placarAdversario) return 'derrota'
    return 'empate'
  }

  const getResultadoStyle = (resultado: string | null) => {
    if (resultado === 'vitoria') return 'bg-green-500/20 border-green-500/50 text-green-400'
    if (resultado === 'derrota') return 'bg-red-500/20 border-red-500/50 text-red-400'
    if (resultado === 'empate') return 'bg-amber-500/20 border-amber-500/50 text-amber-400'
    return 'bg-slate-700 border-slate-600 text-slate-400'
  }

  const limparFiltros = () => {
    setFiltroClube('')
    setFiltroCategoria('')
    setFiltroCompeticao('')
    setFiltroPeriodo('')
  }

  const filtrosAtivos = filtroClube || filtroCategoria || filtroCompeticao || filtroPeriodo

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Jogos</h1>
          <p className="text-slate-400 mt-1">
            {filteredJogos.length} jogo{filteredJogos.length !== 1 ? 's' : ''} encontrado{filteredJogos.length !== 1 ? 's' : ''}
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
            href="/jogos/novo"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Jogo
          </Link>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="rounded-2xl p-4 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Clube</label>
              <select
                value={filtroClube}
                onChange={(e) => setFiltroClube(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todos os clubes</option>
                {clubes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
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
                {categoriasUsadas.map(cat => (
                  <option key={cat} value={cat!}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Competição</label>
              <select
                value={filtroCompeticao}
                onChange={(e) => setFiltroCompeticao(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todas as competições</option>
                {competicoes.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Período</label>
              <select
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todo o período</option>
                <option value="7dias">Últimos 7 dias</option>
                <option value="30dias">Últimos 30 dias</option>
                <option value="90dias">Últimos 90 dias</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="rounded-2xl p-5 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Buscar Jogos</p>
              <p className="text-xs text-slate-400">{filteredJogos.length} jogo{filteredJogos.length !== 1 ? 's' : ''} encontrado{filteredJogos.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite o adversário, clube, competição ou local..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
            />
          </div>
        </div>
      </div>

      {/* Lista de Jogos */}
      {loading ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400">Carregando jogos...</p>
        </div>
      ) : filteredJogos.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhum jogo encontrado</p>
          <p className="text-sm text-slate-500">Tente ajustar sua busca ou cadastre um novo jogo</p>
          {filtrosAtivos && (
            <button
              onClick={limparFiltros}
              className="text-amber-500 hover:text-amber-400 mt-3 text-sm"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJogos.map((jogo) => {
            const resultado = getResultado(jogo.placar_clube, jogo.placar_adversario)
            return (
              <div
                key={jogo.id}
                className="rounded-xl p-4 flex items-center gap-4 transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              >
                {/* Info do jogo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                      <span>{jogo.clubes?.nome || 'Clube'}</span>
                      <span className="text-slate-500 font-normal">vs</span>
                      <span>{jogo.adversario}</span>
                    </h3>
                    {jogo.categoria && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
                        {jogo.categoria}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(jogo.data_jogo)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      {jogo.competicao}
                      {jogo.fase && <span className="text-slate-500">• {jogo.fase}</span>}
                    </span>
                    {jogo.local && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {jogo.local}
                      </span>
                    )}
                  </div>
                </div>

                {/* Placar */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  {jogo.placar_clube !== null && jogo.placar_adversario !== null ? (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getResultadoStyle(resultado)}`}>
                      <span className="text-2xl font-black">{jogo.placar_clube}</span>
                      <span className="text-lg opacity-50">x</span>
                      <span className="text-2xl font-black">{jogo.placar_adversario}</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-500 text-sm">
                      Sem placar
                    </div>
                  )}

                  {/* Botão vídeo */}
                  {jogo.video_url && (
                    <a
                      href={jogo.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: '#dc2626', color: '#f1f5f9' }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                    >
                      <Play className="w-4 h-4" />
                      Vídeo
                    </a>
                  )}

                  {/* Ações */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/jogos/${jogo.id}`}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(jogo.id)}
                      disabled={deleting === jogo.id}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
