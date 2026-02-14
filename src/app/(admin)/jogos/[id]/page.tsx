'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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

export default function EditarJogoPage() {
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const [clubesRes, jogoRes] = await Promise.all([
        supabase.from('clubes').select('id, nome').order('nome'),
        supabase.from('jogos').select('*').eq('id', params.id).single()
      ])

      if (clubesRes.data) setClubes(clubesRes.data)

      if (jogoRes.error || !jogoRes.data) {
        router.push('/jogos')
        return
      }

      const jogo = jogoRes.data
      setClubeId(jogo.clube_id)
      setAdversario(jogo.adversario)
      setDataJogo(jogo.data_jogo)
      setLocal(jogo.local || '')
      setCompeticao(jogo.competicao)
      setFase(jogo.fase || '')
      setCategoria(jogo.categoria || '')
      setVideoUrl(jogo.video_url || '')
      setPlacarClube(jogo.placar_clube?.toString() || '')
      setPlacarAdversario(jogo.placar_adversario?.toString() || '')
      setLoading(false)
    }
    loadData()
  }, [params.id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase
      .from('jogos')
      .update({
        clube_id: clubeId,
        adversario,
        data_jogo: dataJogo,
        local: local || null,
        competicao,
        fase: fase || null,
        categoria: categoria || null,
        video_url: videoUrl || null,
        placar_clube: placarClube ? parseInt(placarClube) : null,
        placar_adversario: placarAdversario ? parseInt(placarAdversario) : null
      })
      .eq('id', params.id)

    if (error) {
      setError('Erro ao salvar jogo')
      setSaving(false)
      return
    }

    router.push('/jogos')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
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
          <h1 className="text-3xl font-bold text-slate-100">Editar Jogo</h1>
          <p className="text-slate-400 mt-1">Atualize as informacoes do jogo</p>
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
              Adversario *
            </label>
            <input
              type="text"
              value={adversario}
              onChange={(e) => setAdversario(e.target.value)}
              required
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
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Competicao *
              </label>
              <input
                type="text"
                value={competicao}
                onChange={(e) => setCompeticao(e.target.value)}
                required
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
              URL do Video
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
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Placar Adversario
              </label>
              <input
                type="number"
                min="0"
                value={placarAdversario}
                onChange={(e) => setPlacarAdversario(e.target.value)}
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
              disabled={saving}
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {saving ? (
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
