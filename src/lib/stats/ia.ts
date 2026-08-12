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

// Gera um parecer técnico por REGRAS (sem IA, sem custo, instantâneo).
// Mesma estrutura da análise por IA, montada a partir dos números.
export function gerarAnaliseGratis(d: DadosAnaliseIA): string {
  const s: string[] = []
  const j = d.jogo

  // ---- Síntese ----
  s.push('## Síntese')
  const idPartes: string[] = []
  if (d.posicao) idPartes.push(d.posicao)
  if (d.idade != null) idPartes.push(`${d.idade} anos`)
  const ident = idPartes.length ? ` (${idPartes.join(', ')})` : ''
  s.push(`${d.nome}${ident}. Amostra de ${j.jogos} ${j.jogos === 1 ? 'jogo' : 'jogos'} com ${j.minutos}' registrados (⌀ ${n(j.minutosPorJogo, 0)}'/jogo).`)
  const idaTxt = d.ida?.disponivel ? `IDA ${d.ida.valor}/100 (${d.ida.classificacao})` : null
  const idpTxt = d.idp?.disponivel ? `IDP ${d.idp.valor}/100 (${d.idp.classificacao})` : null
  if (idaTxt || idpTxt) s.push([idaTxt, idpTxt].filter(Boolean).join(' · ') + '.')

  // ---- Desenvolvimento ----
  s.push('## Desenvolvimento (maturação e físico)')
  if (d.maturacao) {
    const m = d.maturacao
    let leitura = ''
    if (m.classificacao.toLowerCase().includes('precoce')) {
      leitura = 'Parte do desempenho atual pode vir da vantagem física, não só da qualidade técnica — comparar com pares de maturação semelhante.'
    } else if (m.classificacao.toLowerCase().includes('tardio')) {
      leitura = 'Perfil de late bloomer: desvantagem física temporária tende a mascarar o teto técnico, que se destaca mais no pós-PHV. Não descartar por resultado físico atual.'
    } else {
      leitura = 'Desenvolvimento físico alinhado à idade — o desempenho reflete bem o nível atual.'
    }
    const idadeTxt = m.idadeBiologica != null && m.idadeCronologica != null ? ` (biológica ${m.idadeBiologica} vs cronológica ${m.idadeCronologica})` : ''
    s.push(`Maturação: ${m.classificacao}${idadeTxt}; estágio ${m.estagio}. ${leitura}`)
  } else {
    s.push('Maturação não informada — registre idade biológica e estágio PHV para contextualizar o desempenho físico.')
  }
  if (d.fisico.length > 0) {
    const melhoraram = d.fisico.filter(f => f.evoluiu === true).map(f => f.label)
    const pioraram = d.fisico.filter(f => f.evoluiu === false).map(f => f.label)
    const partes: string[] = []
    if (melhoraram.length) partes.push(`evolução em ${melhoraram.join(', ')}`)
    if (pioraram.length) partes.push(`queda em ${pioraram.join(', ')}`)
    s.push(partes.length ? `Testes físicos: ${partes.join('; ')}.` : 'Testes físicos sem base comparativa suficiente (poucas medições).')
  }

  // ---- Desempenho ----
  s.push('## Desempenho (produção e eficiência)')
  s.push(
    `${j.gols} gols e ${j.assistencias} assistências (${j.participacoes} participações em gol). ` +
      `Normalizado à partida de 60': ${n(j.golsPorPartida)} gol/partida e ${n(j.participacoesPorPartida)} participação/partida. ` +
      `Foi decisivo em ${n(j.percentDecisivo, 0)}% dos jogos.`
  )
  if (d.medias) {
    const grupos = [
      { k: 'Ofensivo', v: d.medias.ofe },
      { k: 'Defensivo', v: d.medias.def },
      { k: 'CBF (base)', v: d.medias.cbf },
    ].filter(g => g.v > 0)
    if (grupos.length) {
      const forte = [...grupos].sort((a, b) => b.v - a.v)[0]
      const fraco = [...grupos].sort((a, b) => a.v - b.v)[0]
      s.push(`Perfil técnico: mais forte em ${forte.k} (${n(forte.v, 1)}/5), mais frágil em ${fraco.k} (${n(fraco.v, 1)}/5).`)
    }
  }

  // ---- Riscos e limitações ----
  s.push('## Riscos e limitações da leitura')
  const riscos: string[] = []
  if (j.jogos < 5) riscos.push(`amostra pequena (${j.jogos} jogos) — números ainda instáveis, tratar como tendência`)
  if (d.maturacao?.classificacao.toLowerCase().includes('precoce')) riscos.push('maturação precoce pode inflar a produção atual')
  if (!d.ida?.disponivel && !d.idp?.disponivel) riscos.push('índices ainda indisponíveis (faltam dados/jogos)')
  if (d.fisico.length === 0) riscos.push('sem testes físicos registrados — vertente de desenvolvimento incompleta')
  s.push(riscos.length ? riscos.map(r => `- ${r}`).join('\n') : '- Sem ressalvas relevantes na base de dados atual.')

  // ---- Recomendações ----
  s.push('## Recomendações técnicas')
  const recs: string[] = []
  if (d.pontosDesenvolver) recs.push(`Priorizar o que o analista já apontou a desenvolver: ${d.pontosDesenvolver}.`)
  if (d.medias) {
    const grupos = [
      { k: 'ações ofensivas', v: d.medias.ofe },
      { k: 'ações defensivas', v: d.medias.def },
      { k: 'fundamentos CBF', v: d.medias.cbf },
    ].filter(g => g.v > 0)
    if (grupos.length) {
      const fraco = [...grupos].sort((a, b) => a.v - b.v)[0]
      recs.push(`Trabalho técnico direcionado para ${fraco.k} (área de menor nota).`)
    }
  }
  const fisPiora = d.fisico.filter(f => f.evoluiu === false).map(f => f.label)
  if (fisPiora.length) recs.push(`Atenção física a: ${fisPiora.join(', ')} (em queda).`)
  if (d.maturacao?.classificacao.toLowerCase().includes('tardio')) recs.push('Paciência com o físico: manter o atleta no radar; potencial tende a emergir após o estirão.')
  if (recs.length === 0) recs.push('Manter o plano atual e reavaliar após mais jogos e testes físicos.')
  s.push(recs.map(r => `- ${r}`).join('\n'))

  return s.join('\n\n')
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
