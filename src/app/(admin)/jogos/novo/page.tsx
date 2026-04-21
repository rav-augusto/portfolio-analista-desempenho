'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

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

export default function NovoJogoPage() {
  const [clubes, setClubes] = useState<Clube[]>([])
  const [clubeId, setClubeId] = useState('')
  const [adversario, setAdversario] = useState('')
  const [dataJogo, setDataJogo] = useState('')
  const [local, setLocal] = useState('')
  const [competicao, setCompeticao] = useState('')
  const [fase, setFase] = useState('')
  const [categoria, setCategoria] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [placarClube, setPlacarClube] = useState('')
  const [placarAdversario, setPlacarAdversario] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { user: usuario } = useUser()

  useEffect(() => {
    const loadClubes = async () => {
      const { data } = await supabase.from('clubes').select('id, nome').order('nome')
      if (data) setClubes(data)
    }
    loadClubes()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('jogos').insert({
      clube_id: clubeId,
      adversario,
      data_jogo: dataJogo,
      local: local || null,
      competicao,
      fase: fase || null,
      categoria: categoria || null,
      video_url: videoUrl || null,
      placar_clube: placarClube ? parseInt(placarClube) : null,
      placar_adversario: placarAdversario ? parseInt(placarAdversario) : null,
      criado_por: usuario?.id || null
    })

    if (error) {
      setError('Erro ao salvar jogo')
      setLoading(false)
      return
    }

    router.push('/jogos')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/jogos"
          className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Novo Jogo</h1>
          <p className="text-slate-400 mt-1">Adicione um novo jogo</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Clube *
              </label>
              <select
                value={clubeId}
                onChange={(e) => setClubeId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="">Selecione um clube</option>
                {clubes.map((clube) => (
                  <option key={clube.id} value={clube.id}>{clube.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Categoria *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="">Selecione a categoria</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              Adversário *
            </label>
            <input
              type="text"
              value={adversario}
              onChange={(e) => setAdversario(e.target.value)}
              required
              placeholder="Nome do time adversário"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={dataJogo}
                onChange={(e) => setDataJogo(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Local
              </label>
              <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Ex: Estádio X"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Competição *
              </label>
              <input
                type="text"
                value={competicao}
                onChange={(e) => setCompeticao(e.target.value)}
                required
                placeholder="Ex: Campeonato Paranaense"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Fase
              </label>
              <input
                type="text"
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                placeholder="Ex: Final, Semi-final, Grupos"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              URL do Vídeo
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Placar Clube
              </label>
              <input
                type="number"
                min="0"
                value={placarClube}
                onChange={(e) => setPlacarClube(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Placar Adversário
              </label>
              <input
                type="number"
                min="0"
                value={placarAdversario}
                onChange={(e) => setPlacarAdversario(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 text-sm p-4 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link
              href="/jogos"
              className="px-6 py-2 text-slate-400 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
