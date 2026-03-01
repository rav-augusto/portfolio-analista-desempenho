'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Star, Search, ChevronRight, User, StarHalf } from 'lucide-react'
import Link from 'next/link'

type AtletaComAvaliacoes = {
  id: string
  nome: string
  posicao: string | null
  foto_url: string | null
  clubes: { nome: string } | null
  total_avaliacoes: number
  ultima_avaliacao: string | null
  media_geral: number
}

export default function AvaliacoesPage() {
  const [atletas, setAtletas] = useState<AtletaComAvaliacoes[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadAtletas()
  }, [])

  const loadAtletas = async () => {
    // Buscar atletas que têm avaliações com todas as notas (CBF + Ofensivos + Defensivos)
    const { data: avaliacoes, error } = await supabase
      .from('avaliacoes_atleta')
      .select(`
        atleta_id, data_avaliacao,
        forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial,
        penetracao, cobertura_ofensiva, espaco_com_bola, espaco_sem_bola, mobilidade, unidade_ofensiva,
        contencao, cobertura_defensiva, equilibrio_recuperacao, equilibrio_defensivo, concentracao_def, unidade_defensiva,
        atletas(id, nome, posicao, foto_url, clubes(nome))
      `)
      .order('data_avaliacao', { ascending: false })

    if (!error && avaliacoes) {
      // Agrupar por atleta
      const atletasMap = new Map<string, AtletaComAvaliacoes & { somaMedias: number }>()

      avaliacoes.forEach((av: any) => {
        if (av.atletas) {
          const atletaId = av.atletas.id

          // Média CBF (8 dimensões)
          const mediaCBF = (av.forca + av.velocidade + av.tecnica + av.dinamica + av.inteligencia + av.um_contra_um + av.atitude + av.potencial) / 8

          // Média Ofensivos (6 dimensões)
          const mediaOFE = (av.penetracao + av.cobertura_ofensiva + av.espaco_com_bola + av.espaco_sem_bola + av.mobilidade + av.unidade_ofensiva) / 6

          // Média Defensivos (6 dimensões)
          const mediaDEF = (av.contencao + av.cobertura_defensiva + av.equilibrio_recuperacao + av.equilibrio_defensivo + av.concentracao_def + av.unidade_defensiva) / 6

          // Média geral desta avaliação (média das 3 médias)
          const mediaAv = (mediaCBF + mediaOFE + mediaDEF) / 3

          if (!atletasMap.has(atletaId)) {
            atletasMap.set(atletaId, {
              id: atletaId,
              nome: av.atletas.nome,
              posicao: av.atletas.posicao,
              foto_url: av.atletas.foto_url,
              clubes: av.atletas.clubes,
              total_avaliacoes: 1,
              ultima_avaliacao: av.data_avaliacao,
              media_geral: 0,
              somaMedias: mediaAv
            })
          } else {
            const atleta = atletasMap.get(atletaId)!
            atleta.total_avaliacoes++
            atleta.somaMedias += mediaAv
          }
        }
      })

      // Calcular média geral de cada atleta
      const atletasArray = Array.from(atletasMap.values()).map(atleta => ({
        ...atleta,
        media_geral: atleta.somaMedias / atleta.total_avaliacoes
      }))

      setAtletas(atletasArray)
    }
    setLoading(false)
  }

  const filteredAtletas = atletas.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.clubes?.nome.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  // Renderizar estrelas baseado na média (0-5)
  const renderStars = (media: number) => {
    const stars = []
    const fullStars = Math.floor(media)
    const hasHalf = media - fullStars >= 0.3 && media - fullStars < 0.8
    const almostFull = media - fullStars >= 0.8

    for (let i = 0; i < 5; i++) {
      if (i < fullStars || (i === fullStars && almostFull)) {
        // Estrela cheia - preenchida de laranja
        stars.push(
          <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      } else if (i === fullStars && hasHalf) {
        // Meia estrela
        stars.push(
          <svg key={i} className="w-5 h-5" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#f59e0b"/>
                <stop offset="50%" stopColor="#475569"/>
              </linearGradient>
            </defs>
            <path fill={`url(#half-${i})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      } else {
        // Estrela vazia - preenchida de cinza
        stars.push(
          <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="#475569" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      }
    }
    return stars
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Avaliações de Atletas</h1>
          <p className="text-slate-400 mt-1">Selecione um atleta para ver suas avaliações</p>
        </div>
        <Link
          href="/avaliacoes/nova"
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nova Avaliação
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
              <p className="font-semibold text-slate-100">Buscar Atletas</p>
              <p className="text-xs text-slate-400">{filteredAtletas.length} atleta{filteredAtletas.length !== 1 ? 's' : ''} com avaliações</p>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite o nome do atleta ou clube..."
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
          <p className="text-slate-400">Carregando avaliações...</p>
        </div>
      ) : filteredAtletas.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhum atleta com avaliações encontrado</p>
          <p className="text-sm text-slate-500">Tente ajustar sua busca ou crie uma nova avaliação</p>
          <Link href="/avaliacoes/nova" className="text-amber-500 hover:text-amber-400 mt-3 inline-block">
            Criar primeira avaliação
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAtletas.map((atleta) => (
            <Link
              key={atleta.id}
              href={`/avaliacoes/atleta/${atleta.id}`}
              className="rounded-xl p-4 flex items-center justify-between transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            >
              {/* Foto e nome */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0f172a', border: '2px solid #475569' }}>
                  {atleta.foto_url ? (
                    <img
                      src={atleta.foto_url}
                      alt={atleta.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{atleta.nome}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    {atleta.posicao && <span>{atleta.posicao}</span>}
                    {atleta.clubes && (
                      <span className="text-amber-500">{atleta.clubes.nome}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Estrelas e quantidade de avaliações */}
              <div className="flex items-center gap-6">
                {/* Estrelas da média */}
                <div
                  className="flex items-center gap-0.5 cursor-pointer"
                  title={`Média Geral: ${atleta.media_geral.toFixed(1)}`}
                >
                  {renderStars(atleta.media_geral)}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-amber-500">{atleta.total_avaliacoes}</span>
                    <span className="text-sm text-slate-400">{atleta.total_avaliacoes === 1 ? 'avaliação' : 'avaliações'}</span>
                  </div>
                  <p className="text-xs text-slate-500">Última: {formatDate(atleta.ultima_avaliacao)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
