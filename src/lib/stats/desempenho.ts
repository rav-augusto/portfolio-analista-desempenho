// Cálculos de desempenho compartilhados entre o dashboard admin e o portal do atleta.
// Todas as funções são puras (sem dependência de React/Supabase) para facilitar reuso e testes.

// No futebol de base, uma partida completa tem 2 tempos de 30 min = 60 min (não 90').
export const MINUTOS_PARTIDA = 60

// Subconjunto mínimo de campos de avaliação que os cálculos ofensivos precisam.
export type AvaliacaoJogo = {
  data_avaliacao: string
  minutos_jogados: number | null
  gols: number | null
  assistencias: number | null
}

const isDecisivo = (a: AvaliacaoJogo) => (a.gols || 0) > 0 || (a.assistencias || 0) > 0

const ordenarPorData = <T extends { data_avaliacao: string }>(itens: T[]): T[] =>
  [...itens].sort((a, b) => new Date(a.data_avaliacao).getTime() - new Date(b.data_avaliacao).getTime())

export type EstatisticasJogo = {
  gols: number
  assistencias: number
  participacoes: number
  minutos: number
  jogos: number
  medias: {
    minutosPorJogo: number
    participacoesPorJogo: number
    golsPorPartida: number // normalizado para 60'
    participacoesPorPartida: number // normalizado para 60'
  }
  insights: {
    totalJogos: number
    jogosDecisivos: number
    percentDecisivo: number
    sequenciaAtual: number
    melhorSequencia: number
    minutosPorGol: number
    minutosPorParticipacao: number
  }
}

// Consolida gols, assistências, minutagem, médias e insights ofensivos.
export function calcularEstatisticasJogo(avaliacoes: AvaliacaoJogo[]): EstatisticasJogo {
  const gols = avaliacoes.reduce((acc, a) => acc + (a.gols || 0), 0)
  const assistencias = avaliacoes.reduce((acc, a) => acc + (a.assistencias || 0), 0)
  const participacoes = gols + assistencias

  const jogosComMinutos = avaliacoes.filter(a => (a.minutos_jogados || 0) > 0)
  const minutos = jogosComMinutos.reduce((acc, a) => acc + (a.minutos_jogados || 0), 0)
  const jogos = jogosComMinutos.length

  // Sequências (jogos consecutivos com participação em gol), em ordem cronológica.
  const jogosOrdenados = ordenarPorData(jogosComMinutos)
  let melhorSequencia = 0
  let corrente = 0
  for (const j of jogosOrdenados) {
    if (isDecisivo(j)) {
      corrente++
      if (corrente > melhorSequencia) melhorSequencia = corrente
    } else {
      corrente = 0
    }
  }
  let sequenciaAtual = 0
  for (let i = jogosOrdenados.length - 1; i >= 0; i--) {
    if (isDecisivo(jogosOrdenados[i])) sequenciaAtual++
    else break
  }

  const jogosDecisivos = jogosOrdenados.filter(isDecisivo).length

  return {
    gols,
    assistencias,
    participacoes,
    minutos,
    jogos,
    medias: {
      minutosPorJogo: jogos > 0 ? minutos / jogos : 0,
      participacoesPorJogo: jogos > 0 ? participacoes / jogos : 0,
      golsPorPartida: minutos > 0 ? (gols / minutos) * MINUTOS_PARTIDA : 0,
      participacoesPorPartida: minutos > 0 ? (participacoes / minutos) * MINUTOS_PARTIDA : 0,
    },
    insights: {
      totalJogos: jogos,
      jogosDecisivos,
      percentDecisivo: jogos > 0 ? (jogosDecisivos / jogos) * 100 : 0,
      sequenciaAtual,
      melhorSequencia,
      minutosPorGol: gols > 0 ? minutos / gols : 0,
      minutosPorParticipacao: participacoes > 0 ? minutos / participacoes : 0,
    },
  }
}

// Série acumulada de gols e participações ao longo dos jogos (para gráfico de trajetória).
export type SerieAcumulada = {
  labels: string[]
  golsAcumulados: number[]
  participacoesAcumuladas: number[]
}

export function calcularSerieAcumulada(avaliacoes: AvaliacaoJogo[]): SerieAcumulada | null {
  const jogos = ordenarPorData(
    avaliacoes.filter(a => (a.minutos_jogados || 0) > 0 || (a.gols || 0) > 0 || (a.assistencias || 0) > 0)
  )
  if (jogos.length === 0) return null

  let acumGols = 0
  let acumParticipacoes = 0
  const golsAcumulados: number[] = []
  const participacoesAcumuladas: number[] = []
  const labels: string[] = []

  for (const j of jogos) {
    acumGols += j.gols || 0
    acumParticipacoes += (j.gols || 0) + (j.assistencias || 0)
    golsAcumulados.push(acumGols)
    participacoesAcumuladas.push(acumParticipacoes)
    const date = new Date(j.data_avaliacao + 'T12:00:00')
    labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }))
  }

  return { labels, golsAcumulados, participacoesAcumuladas }
}

// Projeção para uma temporada de N jogos com base no ritmo atual (por jogo).
export type ProjecaoTemporada = {
  jogos: number
  gols: number
  assistencias: number
  participacoes: number
}

export function projetarTemporada(stats: EstatisticasJogo, nJogos: number): ProjecaoTemporada {
  const jogos = stats.jogos
  const golsPorJogo = jogos > 0 ? stats.gols / jogos : 0
  const assistPorJogo = jogos > 0 ? stats.assistencias / jogos : 0
  return {
    jogos: nJogos,
    gols: golsPorJogo * nJogos,
    assistencias: assistPorJogo * nJogos,
    participacoes: (golsPorJogo + assistPorJogo) * nJogos,
  }
}

// ---- Comparativo por posição ----

// Linha "achatada" de avaliação com a posição do atleta (vinda do join no Supabase).
export type AvaliacaoComPosicao = {
  atleta_id: string
  minutos_jogados: number | null
  gols: number | null
  assistencias: number | null
  posicao: string | null
}

export type MediaPosicao = {
  posicao: string
  atletas: number
  golsPorPartida: number
  participacoesPorPartida: number
  minutosPorJogo: number
}

// Média das taxas ofensivas por posição (cada atleta pesa igual, independente do nº de jogos).
export function calcularMediasPorPosicao(linhas: AvaliacaoComPosicao[]): Map<string, MediaPosicao> {
  // Agrupa por posição -> por atleta, somando totais.
  const porPosicao = new Map<string, Map<string, { gols: number; assist: number; minutos: number; jogos: number }>>()

  for (const l of linhas) {
    const posicao = (l.posicao || '').trim()
    if (!posicao) continue
    if (!porPosicao.has(posicao)) porPosicao.set(posicao, new Map())
    const atletas = porPosicao.get(posicao)!
    if (!atletas.has(l.atleta_id)) atletas.set(l.atleta_id, { gols: 0, assist: 0, minutos: 0, jogos: 0 })
    const acc = atletas.get(l.atleta_id)!
    acc.gols += l.gols || 0
    acc.assist += l.assistencias || 0
    if ((l.minutos_jogados || 0) > 0) {
      acc.minutos += l.minutos_jogados || 0
      acc.jogos += 1
    }
  }

  const resultado = new Map<string, MediaPosicao>()
  for (const [posicao, atletas] of porPosicao) {
    const taxasGol: number[] = []
    const taxasPart: number[] = []
    const minsJogo: number[] = []
    for (const acc of atletas.values()) {
      if (acc.minutos > 0) {
        taxasGol.push((acc.gols / acc.minutos) * MINUTOS_PARTIDA)
        taxasPart.push(((acc.gols + acc.assist) / acc.minutos) * MINUTOS_PARTIDA)
        minsJogo.push(acc.minutos / acc.jogos)
      }
    }
    const media = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
    resultado.set(posicao, {
      posicao,
      atletas: atletas.size,
      golsPorPartida: media(taxasGol),
      participacoesPorPartida: media(taxasPart),
      minutosPorJogo: media(minsJogo),
    })
  }
  return resultado
}

export type ComparativoPosicao = {
  posicao: string
  atletasNaPosicao: number
  metricas: {
    label: string
    atleta: number
    media: number
    // diferença percentual vs média da posição (positivo = acima)
    percentVsMedia: number
  }[]
}

// Compara as taxas do atleta com a média da posição dele.
export function calcularComparativoPosicao(
  stats: EstatisticasJogo,
  posicao: string | null,
  mediasPorPosicao: Map<string, MediaPosicao>
): ComparativoPosicao | null {
  const pos = (posicao || '').trim()
  if (!pos) return null
  const media = mediasPorPosicao.get(pos)
  if (!media || media.atletas < 2) return null // precisa de pelo menos 2 atletas p/ comparar

  const diff = (atleta: number, ref: number) => (ref > 0 ? ((atleta - ref) / ref) * 100 : 0)

  return {
    posicao: pos,
    atletasNaPosicao: media.atletas,
    metricas: [
      {
        label: 'Gols/partida',
        atleta: stats.medias.golsPorPartida,
        media: media.golsPorPartida,
        percentVsMedia: diff(stats.medias.golsPorPartida, media.golsPorPartida),
      },
      {
        label: 'G+A/partida',
        atleta: stats.medias.participacoesPorPartida,
        media: media.participacoesPorPartida,
        percentVsMedia: diff(stats.medias.participacoesPorPartida, media.participacoesPorPartida),
      },
      {
        label: 'Min/jogo',
        atleta: stats.medias.minutosPorJogo,
        media: media.minutosPorJogo,
        percentVsMedia: diff(stats.medias.minutosPorJogo, media.minutosPorJogo),
      },
    ],
  }
}
