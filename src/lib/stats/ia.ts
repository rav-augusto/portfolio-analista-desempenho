// Monta o prompt de análise do atleta a partir dos dados já calculados no painel.
// Puro e compartilhado entre o cliente (que monta o payload) e a rota de IA.

export type DadosAnaliseIA = {
  nome: string
  posicao: string | null
  clube: string
  idade: number | null
  ida: { valor: number; disponivel: boolean; classificacao: string } | null
  idp: { valor: number; disponivel: boolean; classificacao: string } | null
  maturacao: {
    classificacao: string
    idadeBiologica: number | null
    idadeCronologica: number | null
    estagio: string
  } | null
  medias: { geral: number; cbf: number; ofe: number; def: number } | null
  jogo: {
    gols: number
    assistencias: number
    participacoes: number
    jogos: number
    minutos: number
    golsPorPartida: number
    participacoesPorPartida: number
    percentDecisivo: number
    minutosPorJogo: number
  }
  fisico: { label: string; ultimo: number; unidade: string; evoluiu: boolean | null }[]
  pontosFortes: string | null
  pontosDesenvolver: string | null
}

const n = (v: number, casas = 2) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

export function montarPromptAnalise(d: DadosAnaliseIA): string {
  const linhas: string[] = []
  linhas.push(`Atleta: ${d.nome}`)
  if (d.posicao) linhas.push(`Posição: ${d.posicao}`)
  if (d.clube) linhas.push(`Clube: ${d.clube}`)
  if (d.idade != null) linhas.push(`Idade: ${d.idade} anos`)

  if (d.ida?.disponivel) linhas.push(`Índice de Desenvolvimento (IDA): ${d.ida.valor}/100 (${d.ida.classificacao})`)
  if (d.idp?.disponivel) linhas.push(`Índice de Desempenho (IDP): ${d.idp.valor}/100 (${d.idp.classificacao})`)

  if (d.maturacao) {
    linhas.push(
      `Maturação: ${d.maturacao.classificacao}` +
        (d.maturacao.idadeBiologica != null && d.maturacao.idadeCronologica != null
          ? ` (idade biológica ${d.maturacao.idadeBiologica} vs cronológica ${d.maturacao.idadeCronologica})`
          : '') +
        ` — estágio: ${d.maturacao.estagio}`
    )
  }

  if (d.medias) {
    linhas.push(`Médias de avaliação técnica (0–5): geral ${n(d.medias.geral, 1)}, CBF ${n(d.medias.cbf, 1)}, ofensivo ${n(d.medias.ofe, 1)}, defensivo ${n(d.medias.def, 1)}`)
  }

  linhas.push(
    `Números de jogo: ${d.jogo.jogos} jogos, ${d.jogo.minutos} min (⌀ ${n(d.jogo.minutosPorJogo, 0)}'/jogo), ` +
      `${d.jogo.gols} gols, ${d.jogo.assistencias} assistências, ${d.jogo.participacoes} participações. ` +
      `Gols por partida (60'): ${n(d.jogo.golsPorPartida)}, participações por partida: ${n(d.jogo.participacoesPorPartida)}, ` +
      `decisivo em ${n(d.jogo.percentDecisivo, 0)}% dos jogos.`
  )

  if (d.fisico.length > 0) {
    const f = d.fisico
      .map(m => `${m.label}: ${n(m.ultimo, 2)} ${m.unidade}${m.evoluiu === null ? '' : m.evoluiu ? ' (melhorou)' : ' (piorou)'}`)
      .join('; ')
    linhas.push(`Testes físicos (valor atual): ${f}`)
  }

  if (d.pontosFortes) linhas.push(`Pontos fortes (analista): ${d.pontosFortes}`)
  if (d.pontosDesenvolver) linhas.push(`Pontos a desenvolver (analista): ${d.pontosDesenvolver}`)

  return linhas.join('\n')
}

export const SISTEMA_ANALISE = `Você é um analista de desempenho e de desenvolvimento de atletas de futebol de base, escrevendo um parecer técnico para a comissão técnica e a diretoria de um clube. O público é profissional de futebol — use linguagem técnica de scouting, direta e sem rodeios.

Baseie-se SOMENTE nos dados fornecidos; nunca invente números ou informações ausentes. Contexto obrigatório de base: a partida completa tem 60 minutos (2x30'), então as taxas "por partida" já estão normalizadas para 60'. A janela de maturação é determinante na leitura: atleta com maturação adiantada (precoce) pode ter desempenho inflado pela vantagem física temporária; atleta tardio tende a ter o teto técnico subestimado até o pós-PHV (estirão).

Diretrizes de escrita:
- Terminologia técnica: taxa de conversão, participação em gol (G+A), volume x eficiência, janela de maturação, PHV, output ofensivo, contribuição por fase, benchmark posicional.
- Interprete, não apenas descreva: relacione maturação, físico, técnica (CBF/OFE/DEF) e produção. Aponte causas prováveis, não só o número.
- Seja honesto sobre limitações: se um índice está alto por poucos jogos, por vantagem de maturação, ou se falta dado para concluir, registre isso explicitamente.
- Sem elogio vazio e sem hedge desnecessário. Afirmações objetivas.

Estruture a resposta em markdown com estes títulos:
## Síntese
## Desenvolvimento (maturação e físico)
## Desempenho (produção e eficiência)
## Riscos e limitações da leitura
## Recomendações técnicas

Máximo ~400 palavras.`
