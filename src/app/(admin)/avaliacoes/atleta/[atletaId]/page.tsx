'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Star, Calendar, ArrowLeft, User, TrendingUp, Clock, Ruler, Scale, Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

type Atleta = {
  id: string
  nome: string
  posicao: string | null
  foto_url: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
}

type Avaliacao = {
  id: string
  data_avaliacao: string
  tipo: string
  contexto_treino: string | null
  minutos_jogados: number | null
  gols: number | null
  assistencias: number | null
  forca: number
  velocidade: number
  tecnica: number
  dinamica: number
  inteligencia: number
  um_contra_um: number
  atitude: number
  potencial: number
  // Princípios Ofensivos
  penetracao: number
  cobertura_ofensiva: number
  espaco_com_bola: number
  espaco_sem_bola: number
  mobilidade: number
  unidade_ofensiva: number
  // Princípios Defensivos
  contencao: number
  cobertura_defensiva: number
  equilibrio_recuperacao: number
  equilibrio_defensivo: number
  concentracao_def: number
  unidade_defensiva: number
  // Avaliação Física
  altura_avaliacao: number | null
  peso_avaliacao: number | null
  envergadura: number | null
  velocidade_10m: number | null
  velocidade_30m: number | null
  salto_vertical: number | null
  agilidade_teste: number | null
  yoyo_nivel: string | null
  yoyo_distancia: number | null
  idade_biologica: number | null
  estagio_phv: string | null
  sentar_alcancar: number | null
  jogos: {
    adversario: string
    data_jogo: string
  } | {
    adversario: string
    data_jogo: string
  }[] | null
}

const getJogo = (jogos: { adversario: string; data_jogo: string } | { adversario: string; data_jogo: string }[] | null | undefined) => {
  if (!jogos) return null
  if (Array.isArray(jogos)) return jogos[0] || null
  return jogos
}

export default function AvaliacoesAtletaPage() {
  const params = useParams()
  const atletaId = params.atletaId as string
  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [atletaId])

  const loadData = async () => {
    // Carregar atleta
    const { data: atletaData } = await supabase
      .from('atletas')
      .select('id, nome, posicao, foto_url, clubes(nome)')
      .eq('id', atletaId)
      .single()

    if (atletaData) {
      setAtleta(atletaData)
    }

    // Carregar avaliações do atleta
    const { data: avaliacoesData } = await supabase
      .from('avaliacoes_atleta')
      .select(`
        id, data_avaliacao, tipo, contexto_treino, minutos_jogados, gols, assistencias,
        forca, velocidade, tecnica, dinamica, inteligencia, um_contra_um, atitude, potencial,
        penetracao, cobertura_ofensiva, espaco_com_bola, espaco_sem_bola, mobilidade, unidade_ofensiva,
        contencao, cobertura_defensiva, equilibrio_recuperacao, equilibrio_defensivo, concentracao_def, unidade_defensiva,
        altura_avaliacao, peso_avaliacao, envergadura, velocidade_10m, velocidade_30m,
        salto_vertical, agilidade_teste, yoyo_nivel, yoyo_distancia, idade_biologica, estagio_phv, sentar_alcancar,
        jogos(adversario, data_jogo)
      `)
      .eq('atleta_id', atletaId)
      .order('data_avaliacao', { ascending: false })

    if (avaliacoesData) {
      setAvaliacoes(avaliacoesData)
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return

    setDeleting(id)
    const { error } = await supabase.from('avaliacoes_atleta').delete().eq('id', id)

    if (!error) {
      setAvaliacoes(avaliacoes.filter(a => a.id !== id))
    }
    setDeleting(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'jogo': 'Jogo',
      'treino': 'Treino',
      'geral': 'Geral'
    }
    return tipos[tipo] || tipo
  }

  const getTipoColor = (tipo: string) => {
    const cores: Record<string, string> = {
      'jogo': 'bg-blue-500/20 text-blue-400',
      'treino': 'bg-green-500/20 text-green-400',
      'geral': 'bg-purple-500/20 text-purple-400'
    }
    return cores[tipo] || 'bg-slate-500/20 text-slate-400'
  }

  const calcularMedia = (av: Avaliacao) => {
    const valores = [av.forca, av.velocidade, av.tecnica, av.dinamica, av.inteligencia, av.um_contra_um, av.atitude, av.potencial]
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1)
  }

  const getMediaColor = (media: number) => {
    if (media < 2) return 'text-red-400'
    if (media < 3) return 'text-orange-400'
    if (media < 4) return 'text-amber-400'
    return 'text-green-400'
  }

  // Calcular média geral do atleta (média de todas as avaliações)
  const calcularMediaGeralAtleta = () => {
    if (avaliacoes.length === 0) return '0.0'
    const somaMedias = avaliacoes.reduce((acc, av) => {
      return acc + parseFloat(calcularMedia(av))
    }, 0)
    return (somaMedias / avaliacoes.length).toFixed(1)
  }

  const mediaGeralAtleta = parseFloat(calcularMediaGeralAtleta())

  // Calcular total de minutos jogados, gols e assistencias
  const totalMinutosJogados = avaliacoes.reduce((acc, av) => acc + (av.minutos_jogados || 0), 0)
  const jogosComMinutos = avaliacoes.filter(av => av.minutos_jogados && av.minutos_jogados > 0).length
  const totalGols = avaliacoes.reduce((acc, av) => acc + (av.gols || 0), 0)
  const totalAssistencias = avaliacoes.reduce((acc, av) => acc + (av.assistencias || 0), 0)

  // Calcular média de cada dimensão de todas as avaliações
  const calcularMediaDimensao = (campo: keyof Avaliacao) => {
    if (avaliacoes.length === 0) return 0
    const soma = avaliacoes.reduce((acc, av) => acc + (Number(av[campo]) || 0), 0)
    return soma / avaliacoes.length
  }

  // Labels curtos para o gráfico
  const dimensoesLabels = ['FOR', 'VEL', 'TEC', 'DIN', 'INT', '1v1', 'ATI', 'POT', 'PEN', 'COF', 'ECB', 'ESB', 'MOB', 'UOF', 'CON', 'CDF', 'ERE', 'EDF', 'CNC', 'UDF']

  // Dados do gráfico radar completo
  const getRadarDataCompleto = () => ({
    labels: dimensoesLabels,
    datasets: [{
      data: [
        calcularMediaDimensao('forca'),
        calcularMediaDimensao('velocidade'),
        calcularMediaDimensao('tecnica'),
        calcularMediaDimensao('dinamica'),
        calcularMediaDimensao('inteligencia'),
        calcularMediaDimensao('um_contra_um'),
        calcularMediaDimensao('atitude'),
        calcularMediaDimensao('potencial'),
        calcularMediaDimensao('penetracao'),
        calcularMediaDimensao('cobertura_ofensiva'),
        calcularMediaDimensao('espaco_com_bola'),
        calcularMediaDimensao('espaco_sem_bola'),
        calcularMediaDimensao('mobilidade'),
        calcularMediaDimensao('unidade_ofensiva'),
        calcularMediaDimensao('contencao'),
        calcularMediaDimensao('cobertura_defensiva'),
        calcularMediaDimensao('equilibrio_recuperacao'),
        calcularMediaDimensao('equilibrio_defensivo'),
        calcularMediaDimensao('concentracao_def'),
        calcularMediaDimensao('unidade_defensiva'),
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointRadius: 2,
    }],
  })

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 0,
        ticks: { display: false },
        pointLabels: {
          display: true,
          font: { size: 7, weight: 'bold' as const },
          color: '#94a3b8'
        },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: true,
  }

  return (
    <div>
      {/* Header com info do atleta */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/avaliacoes"
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {atleta && (
          <div className="flex items-center gap-4 flex-1">
            {atleta.foto_url ? (
              <img
                src={atleta.foto_url}
                alt={atleta.nome}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/50"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600">
                <User className="w-8 h-8 text-slate-500" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{atleta.nome}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                {atleta.posicao && <span>{atleta.posicao}</span>}
                {getClubeName(atleta.clubes) && (
                  <span className="text-amber-500">{getClubeName(atleta.clubes)}</span>
                )}
                <span className="text-slate-500">|</span>
                <span>{avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Média Geral do Atleta com Gráfico */}
        {avaliacoes.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
            <div style={{ width: '100px', height: '100px' }}>
              <Radar data={getRadarDataCompleto()} options={radarOptions} />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${getMediaColor(mediaGeralAtleta)}`}>
                {mediaGeralAtleta.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wide">Média Geral</span>
            </div>
          </div>
        )}

        {/* Estatísticas de Jogo */}
        <div className="flex items-center gap-2">
          {/* Total de Minutos Jogados */}
          {totalMinutosJogados > 0 && (
            <div className="flex flex-col items-center justify-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-2xl font-black text-amber-500">{totalMinutosJogados}&apos;</span>
              </div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wide">{jogosComMinutos} jogo{jogosComMinutos !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Total de Gols */}
          {totalGols > 0 && (
            <div className="flex flex-col items-center justify-center bg-slate-800 border border-green-700/50 rounded-xl px-4 py-2">
              <span className="text-2xl font-black text-green-500">{totalGols}</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wide">Gols</span>
            </div>
          )}

          {/* Total de Assistências */}
          {totalAssistencias > 0 && (
            <div className="flex flex-col items-center justify-center bg-slate-800 border border-blue-700/50 rounded-xl px-4 py-2">
              <span className="text-2xl font-black text-blue-500">{totalAssistencias}</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wide">Assists</span>
            </div>
          )}
        </div>

        <Link
          href={`/avaliacoes/nova?atleta=${atletaId}`}
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nova Avaliação
        </Link>
      </div>

      {/* Evolução Física */}
      {!loading && avaliacoes.some(av => av.altura_avaliacao || av.peso_avaliacao || av.velocidade_10m || av.salto_vertical) && (() => {
        // Ordenar por data para evolução (mais antiga primeiro)
        const avaliacoesOrdenadas = [...avaliacoes].reverse()
        const temDadosFisicos = avaliacoesOrdenadas.some(av => av.altura_avaliacao || av.peso_avaliacao || av.envergadura)
        const temTestesFisicos = avaliacoesOrdenadas.some(av => av.velocidade_10m || av.velocidade_30m || av.salto_vertical || av.agilidade_teste)
        const temResistencia = avaliacoesOrdenadas.some(av => av.yoyo_distancia || av.sentar_alcancar)

        const getVariacao = (valores: (number | null)[], menorMelhor = false) => {
          const validos = valores.filter((v): v is number => v !== null)
          if (validos.length < 2) return null
          const primeira = validos[0]
          const ultima = validos[validos.length - 1]
          const diff = ultima - primeira
          const positivo = menorMelhor ? diff < 0 : diff > 0
          return { primeira, ultima, diff, positivo }
        }

        return (
          <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Evolucao Fisica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dados Antropométricos */}
              {temDadosFisicos && (
                <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                  <h4 className="text-xs font-semibold text-blue-400 mb-3 uppercase flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Antropometria
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const alturas = avaliacoesOrdenadas.map(av => av.altura_avaliacao).filter((v): v is number => v !== null)
                      if (alturas.length === 0) return null
                      const ultima = alturas[alturas.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.altura_avaliacao))
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Altura</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(2)}m</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-slate-400'}`}>
                                {v.positivo ? <ArrowUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                {v.diff > 0 ? '+' : ''}{(v.diff * 100).toFixed(0)}cm
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const pesos = avaliacoesOrdenadas.map(av => av.peso_avaliacao).filter((v): v is number => v !== null)
                      if (pesos.length === 0) return null
                      const ultima = pesos[pesos.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.peso_avaliacao))
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Peso</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(1)}kg</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.diff > 0 ? 'text-green-400' : 'text-amber-400'}`}>
                                {v.diff > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {v.diff > 0 ? '+' : ''}{v.diff.toFixed(1)}kg
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const envs = avaliacoesOrdenadas.map(av => av.envergadura).filter((v): v is number => v !== null)
                      if (envs.length === 0) return null
                      const ultima = envs[envs.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.envergadura))
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Envergadura</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(2)}m</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-slate-400'}`}>
                                {v.positivo ? <ArrowUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                {v.diff > 0 ? '+' : ''}{(v.diff * 100).toFixed(0)}cm
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Testes Físicos */}
              {temTestesFisicos && (
                <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                  <h4 className="text-xs font-semibold text-amber-400 mb-3 uppercase flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Testes Fisicos
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const vals = avaliacoesOrdenadas.map(av => av.velocidade_10m).filter((v): v is number => v !== null)
                      if (vals.length === 0) return null
                      const ultima = vals[vals.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.velocidade_10m), true)
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">10m</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(2)}s</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-red-400'}`}>
                                {v.positivo ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                                {v.diff.toFixed(2)}s
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const vals = avaliacoesOrdenadas.map(av => av.velocidade_30m).filter((v): v is number => v !== null)
                      if (vals.length === 0) return null
                      const ultima = vals[vals.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.velocidade_30m), true)
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">30m</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(2)}s</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-red-400'}`}>
                                {v.positivo ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                                {v.diff.toFixed(2)}s
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const vals = avaliacoesOrdenadas.map(av => av.salto_vertical).filter((v): v is number => v !== null)
                      if (vals.length === 0) return null
                      const ultima = vals[vals.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.salto_vertical))
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Salto</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(0)}cm</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-red-400'}`}>
                                {v.positivo ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {v.diff > 0 ? '+' : ''}{v.diff.toFixed(0)}cm
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const vals = avaliacoesOrdenadas.map(av => av.agilidade_teste).filter((v): v is number => v !== null)
                      if (vals.length === 0) return null
                      const ultima = vals[vals.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.agilidade_teste), true)
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Agilidade</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(2)}s</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-red-400'}`}>
                                {v.positivo ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                                {v.diff.toFixed(2)}s
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Resistência e Flexibilidade */}
              {temResistencia && (
                <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                  <h4 className="text-xs font-semibold text-purple-400 mb-3 uppercase flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Resist. e Flex.
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const vals = avaliacoesOrdenadas.map(av => av.yoyo_distancia).filter((v): v is number => v !== null)
                      if (vals.length === 0) return null
                      const ultima = vals[vals.length - 1]
                      const ultimoNivel = avaliacoesOrdenadas.filter(av => av.yoyo_nivel).pop()?.yoyo_nivel
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.yoyo_distancia))
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Yo-Yo</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima}m</span>
                            {ultimoNivel && <span className="text-xs text-purple-400">Nv {ultimoNivel}</span>}
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-red-400'}`}>
                                {v.positivo ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {v.diff > 0 ? '+' : ''}{v.diff}m
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const vals = avaliacoesOrdenadas.map(av => av.sentar_alcancar).filter((v): v is number => v !== null)
                      if (vals.length === 0) return null
                      const ultima = vals[vals.length - 1]
                      const v = getVariacao(avaliacoesOrdenadas.map(av => av.sentar_alcancar))
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Flexibilidade</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{ultima.toFixed(0)}cm</span>
                            {v && v.diff !== 0 && (
                              <span className={`text-xs flex items-center gap-0.5 ${v.positivo ? 'text-green-400' : 'text-red-400'}`}>
                                {v.positivo ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {v.diff > 0 ? '+' : ''}{v.diff.toFixed(0)}cm
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* Lista de Avaliações */}
      {loading ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400">Carregando avaliações...</p>
        </div>
      ) : avaliacoes.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">Nenhuma avaliação encontrada para este atleta</p>
          <p className="text-sm text-slate-500">Crie uma nova avaliação para começar</p>
          <Link href={`/avaliacoes/nova?atleta=${atletaId}`} className="text-amber-500 hover:text-amber-400 mt-3 inline-block">
            Criar primeira avaliação
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {avaliacoes.map((avaliacao) => {
            const media = parseFloat(calcularMedia(avaliacao))
            return (
              <div
                key={avaliacao.id}
                className="rounded-xl p-4 flex items-center justify-between transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              >
                <div className="flex items-center gap-4">
                  {/* Média */}
                  <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <span className={`text-xl font-bold ${getMediaColor(media)}`}>{media}</span>
                    <span className="text-[8px] text-slate-500 uppercase">média</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTipoColor(avaliacao.tipo)}`}>
                        {getTipoLabel(avaliacao.tipo)}
                      </span>
                      {getJogo(avaliacao.jogos) && (
                        <span className="text-slate-300 text-sm">vs {getJogo(avaliacao.jogos)?.adversario}</span>
                      )}
                      {avaliacao.contexto_treino && (
                        <span className="text-slate-400 text-sm">• {avaliacao.contexto_treino}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(avaliacao.data_avaliacao)}</span>
                      </div>
                      {avaliacao.minutos_jogados && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Clock className="w-3 h-3" />
                          <span>{avaliacao.minutos_jogados}&apos;</span>
                        </div>
                      )}
                      {avaliacao.gols && avaliacao.gols > 0 && (
                        <span className="text-green-500 font-medium">{avaliacao.gols} gol{avaliacao.gols > 1 ? 's' : ''}</span>
                      )}
                      {avaliacao.assistencias && avaliacao.assistencias > 0 && (
                        <span className="text-blue-500 font-medium">{avaliacao.assistencias} assist{avaliacao.assistencias > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/avaliacoes/${avaliacao.id}`}
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(avaliacao.id)}
                    disabled={deleting === avaliacao.id}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Excluir"
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
