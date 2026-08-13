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
  // Extras (deixam a análise em nível sênior)
  comparativo?: { label: string; atleta: number; media: number; percentVsMedia: number }[] | null
  finalizacao?: {
    peDireito: number; peEsquerdo: number; cabeca: number
    dentroArea: number; foraArea: number
    jogada: number; penalti: number; bolaParada: number; contraAtaque: number
    total: number
  } | null
  insights?: { sequenciaAtual: number; melhorSequencia: number; minutosPorGol: number } | null
  perfil?: { percentOfe: number; percentDef: number } | null
  evolucaoTecnica?: number | null
  eficiencia?: { titulo: string; valor: string; descricao: string }[] | null
  contexto?: { participacoes: number; participacoesAjustadas: number; fator: number } | null
}

const n = (v: number, casas = 2) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
const plur = (q: number, sing: string, plur: string) => (q === 1 ? sing : plur)

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

// Parecer técnico nível analista sênior, por REGRAS (sem IA, sem custo, instantâneo).
export function gerarAnaliseGratis(d: DadosAnaliseIA): string {
  const s: string[] = []
  const j = d.jogo
  const pos = (d.posicao ?? '').toLowerCase()
  const ehAtacante = /atacante|centroavante|ponta|extremo|segundo atacante|9\b/.test(pos)
  const ehDefensor = /zagueiro|lateral|goleiro|defensor/.test(pos)
  const precoce = !!d.maturacao?.classificacao.toLowerCase().includes('precoce')
  const tardio = !!d.maturacao?.classificacao.toLowerCase().includes('tardio')

  // ===== 1. PERFIL E ENQUADRAMENTO =====
  s.push('## Perfil e enquadramento')
  const ident = [d.posicao, d.idade != null ? `${d.idade} anos` : null, d.clube].filter(Boolean).join(' · ')
  s.push(`${d.nome}${ident ? ` — ${ident}.` : '.'}`)
  s.push(`Base de leitura: ${j.jogos} ${plur(j.jogos, 'jogo', 'jogos')} avaliados, ${j.minutos}' em campo (média de ${n(j.minutosPorJogo, 0)}' por jogo).`)
  if (d.maturacao) {
    const m = d.maturacao
    const idadeTxt = m.idadeBiologica != null && m.idadeCronologica != null
      ? ` (idade biológica estimada ${m.idadeBiologica} vs cronológica ${m.idadeCronologica})`
      : ''
    let frame: string
    if (precoce) {
      frame = 'Enquadramento de maturação (bio-banding): atleta ADIANTADO para a idade. É o ponto de partida obrigatório da leitura — parte do rendimento atual, sobretudo físico e em duelos, vem da vantagem de desenvolvimento, e não necessariamente de superioridade técnica. O teste real virá quando os pares o alcançarem fisicamente. Priorizar a evolução técnica e decisória sobre o domínio físico do momento.'
    } else if (tardio) {
      frame = 'Enquadramento de maturação (bio-banding): atleta ATRASADO para a idade (late developer). Leitura clássica de subestimação — compete em desvantagem física contra pares mais desenvolvidos, o que rebaixa números brutos e a percepção em duelos. O teto técnico tende a emergir no pós-PHV (estirão). Perfil de alto valor de retenção: exatamente o tipo que clube grande evita dispensar cedo.'
    } else {
      frame = 'Enquadramento de maturação: desenvolvimento alinhado à idade cronológica. Os números refletem de forma fiel o nível atual, sem distorção relevante de vantagem ou desvantagem física.'
    }
    s.push(`${frame}${idadeTxt} — estágio ${m.estagio.toLowerCase()}.`)
  } else {
    s.push('Enquadramento de maturação: **não informado**. Sem esse dado, a leitura fica incompleta na base — é o que separa "ele é bom hoje" de "ele tem potencial". Registrar altura, peso e altura sentado permite estimar o estágio PHV automaticamente.')
  }

  // ===== 2. PRODUÇÃO OFENSIVA =====
  s.push('## Produção ofensiva')
  s.push(`Volume: ${j.gols} ${plur(j.gols, 'gol', 'gols')} e ${j.assistencias} ${plur(j.assistencias, 'assistência', 'assistências')}, totalizando ${j.participacoes} ${plur(j.participacoes, 'participação direta', 'participações diretas')} em gol. Normalizado à partida completa (60'): ${n(j.golsPorPartida)} gol e ${n(j.participacoesPorPartida)} participação por partida.`)
  // Ritmo e regularidade
  const reg: string[] = []
  reg.push(`decisivo em ${n(j.percentDecisivo, 0)}% dos jogos`)
  if (d.insights && d.insights.minutosPorGol > 0) reg.push(`1 gol a cada ${n(d.insights.minutosPorGol, 0)}' em campo`)
  if (d.insights && d.insights.melhorSequencia > 0) reg.push(`melhor sequência de ${d.insights.melhorSequencia} ${plur(d.insights.melhorSequencia, 'jogo', 'jogos')} seguidos participando`)
  const leituraReg = j.percentDecisivo >= 50
    ? 'presença ofensiva constante — raramente some dos jogos.'
    : j.percentDecisivo >= 30
      ? 'regularidade média — decide com frequência intermediária.'
      : 'produção ainda oscilante — participa numa minoria dos jogos, o que sugere dependência de contexto/fase.'
  s.push(`Regularidade: ${reg.join('; ')}. Leitura: ${leituraReg}`)
  // Comparativo posicional (dado real, não inventado)
  if (d.comparativo && d.comparativo.length) {
    const partes = d.comparativo.map(c => `${c.label} ${c.percentVsMedia >= 0 ? '+' : ''}${Math.round(c.percentVsMedia)}%`).join(', ')
    const medio = d.comparativo.reduce((a, c) => a + c.percentVsMedia, 0) / d.comparativo.length
    const leituraCmp = medio >= 15 ? 'Produz claramente acima dos pares diretos — é o destaque ofensivo da posição no elenco.'
      : medio <= -15 ? 'Produz abaixo dos pares da posição — elevar o output é a prioridade competitiva.'
        : 'Produz em linha com a média dos pares da posição.'
    s.push(`Benchmark posicional (vs média da posição no elenco): ${partes}. ${leituraCmp}`)
  }
  // Perfil de finalização
  if (d.finalizacao && d.finalizacao.total > 0) {
    const f = d.finalizacao
    const perc = (x: number) => (f.total ? Math.round((x / f.total) * 100) : 0)
    const bilateral = Math.abs(f.peDireito - f.peEsquerdo) <= 1 && f.peDireito + f.peEsquerdo >= 2
    const pePred = f.peDireito >= f.peEsquerdo ? 'direito' : 'esquerdo'
    const fin: string[] = []
    fin.push(bilateral ? 'perfil bilateral — finaliza dos dois pés (traço raro e muito valorizado no mercado)' : `predomínio de pé ${pePred} (${perc(pePred === 'direito' ? f.peDireito : f.peEsquerdo)}% dos gols)`)
    if (f.cabeca > 0) fin.push(`${perc(f.cabeca)}% de cabeça${precoce ? ' — cautela: na base, gol de cabeça costuma refletir vantagem física de maturação' : ''}`)
    if (f.foraArea > 0) fin.push(`${perc(f.foraArea)}% de fora da área (finalizador de média/longa distância)`)
    if (f.penalti > 0) fin.push(`${f.penalti} de pênalti (descontar da produção de bola rolando)`)
    s.push(`Perfil de finalização: ${fin.join('; ')}.`)
  }

  // ===== EFICIÊNCIA TÉCNICA (padrão profissional) =====
  if (d.eficiencia && d.eficiencia.length) {
    s.push('## Eficiência técnica')
    s.push(d.eficiencia.map(m => `- **${m.titulo}: ${m.valor}** — ${m.descricao}`).join('\n'))
    if (d.contexto) {
      const c = d.contexto
      s.push(
        `Produção ajustada ao contexto: ${c.participacoesAjustadas} participações ponderadas (vs ${c.participacoes} brutas; fator médio ${c.fator}× por dificuldade do adversário, importância do jogo e situação de placar). ` +
          (c.fator >= 1.1 ? 'Produziu majoritariamente em contextos difíceis — mérito adicional, dado que rendeu quando o jogo exigiu mais.' : c.fator <= 0.9 ? 'Produção concentrada em contextos favoráveis — ponderar antes de superestimar o output bruto.' : 'Contexto médio equilibrado — sem distorção relevante para cima ou para baixo.')
      )
    }
  }

  // ===== 3. PERFIL FÍSICO E ATLÉTICO =====
  s.push('## Perfil físico e atlético')
  if (d.fisico.length === 0) {
    s.push('Sem avaliação física registrada — impossível ler a vertente atlética. Registrar velocidade, salto, resistência e maturação é prioridade para completar o scouting (use o menu Avaliação Física).')
  } else {
    s.push(`Testes atuais: ${d.fisico.map(f => `${f.label} ${n(f.ultimo, 2)} ${f.unidade}`).join('; ')}.`)
    const melhoraram = d.fisico.filter(f => f.evoluiu === true).map(f => f.label)
    const pioraram = d.fisico.filter(f => f.evoluiu === false).map(f => f.label)
    if (melhoraram.length || pioraram.length) {
      const traj: string[] = []
      if (melhoraram.length) traj.push(`evolução em ${melhoraram.join(', ')}`)
      if (pioraram.length) traj.push(`estagnação/queda em ${pioraram.join(', ')}`)
      const leituraTraj = melhoraram.length > pioraram.length ? 'tendência atlética positiva — o trabalho físico está surtindo efeito.'
        : pioraram.length > melhoraram.length ? 'sinais de estagnação — revisar carga e trabalho físico específico.'
          : 'trajetória física estável no período.'
      s.push(`Trajetória: ${traj.join('; ')}. Leitura: ${leituraTraj}`)
    }
    if (precoce) s.push('Ler os números físicos com cautela: sendo maturação adiantada, a superioridade atlética atual é esperada — não confundir com talento diferenciado.')
    else if (tardio) s.push('Dado o atraso maturacional, qualquer bom número físico atual é especialmente promissor: indica base atlética que ainda deve crescer com o estirão.')
  }

  // ===== 4. PERFIL TÉCNICO =====
  s.push('## Perfil técnico')
  if (d.medias) {
    const grupos = [
      { k: 'ofensivo', v: d.medias.ofe },
      { k: 'defensivo', v: d.medias.def },
      { k: 'fundamentos CBF', v: d.medias.cbf },
    ].filter(g => g.v > 0)
    if (grupos.length) {
      const forte = [...grupos].sort((a, b) => b.v - a.v)[0]
      const fraco = [...grupos].sort((a, b) => a.v - b.v)[0]
      s.push(`Média técnica geral ${n(d.medias.geral, 1)}/5. Bloco mais forte: ${forte.k} (${n(forte.v, 1)}). Mais frágil: ${fraco.k} (${n(fraco.v, 1)}) — é onde mora o próximo salto.`)
    }
  }
  if (d.perfil) {
    const p = d.perfil
    const perfilTxt = p.percentOfe > 55 ? 'perfil nitidamente ofensivo' : p.percentDef > 55 ? 'perfil nitidamente defensivo' : 'perfil equilibrado entre as fases'
    let extra = ''
    if (ehAtacante && p.percentDef >= 45) extra = ' Para um atacante, participação defensiva relevante é um plus tático valorizado no jogo moderno (pressão/primeira linha de marcação).'
    else if (ehDefensor && p.percentOfe >= 45) extra = ' Para um defensor, boa contribuição ofensiva agrega valor (saída de bola, apoio, bola parada).'
    s.push(`Distribuição de jogo: ${perfilTxt} (${Math.round(p.percentOfe)}% ofensivo / ${Math.round(p.percentDef)}% defensivo).${extra}`)
  }
  if (d.evolucaoTecnica != null) {
    const e = d.evolucaoTecnica
    s.push(e > 0.3 ? `Curva de evolução técnica ascendente: +${n(e, 1)} na média desde a 1ª avaliação. Na base, evoluir é mais importante do que já ser bom — este é o sinal mais valioso.`
      : e < -0.3 ? `Alerta de regressão: ${n(e, 1)} na média técnica desde a 1ª avaliação. Investigar causa (lesão, fase, mudança de nível/contexto, exigência maior).`
        : 'Média técnica estável entre a 1ª e a última avaliação — sem evolução ou regressão marcante no período avaliado.')
  }
  if (d.pontosFortes) s.push(`Pontos fortes (avaliador): ${d.pontosFortes}.`)
  if (d.pontosDesenvolver) s.push(`A desenvolver (avaliador): ${d.pontosDesenvolver}.`)

  // ===== 5. LEITURA GERAL E POTENCIAL =====
  s.push('## Leitura geral e potencial')
  const idaOk = d.ida?.disponivel
  const idpOk = d.idp?.disponivel
  if (idaOk || idpOk) {
    s.push([
      idaOk ? `IDA (desenvolvimento) ${d.ida!.valor}/100 — ${d.ida!.classificacao}` : null,
      idpOk ? `IDP (desempenho) ${d.idp!.valor}/100 — ${d.idp!.classificacao}` : null,
    ].filter(Boolean).join(' · ') + '.')
  }
  if (idaOk && idpOk) {
    const gap = d.ida!.valor - d.idp!.valor
    if (gap >= 15) s.push('Desenvolvimento à frente do desempenho: a base (técnica, física, trajetória) é melhor do que os números de jogo mostram hoje. Perfil "vai deslanchar" — o output tende a subir para acompanhar a base. Muito comum em maturação tardia.')
    else if (gap <= -15) s.push('Desempenho à frente do desenvolvimento: entrega números melhores do que a base sustentaria no longo prazo. Atenção ao teto — pode render por vantagem momentânea (física/maturação) mais do que por evolução consolidada.')
    else s.push('Desenvolvimento e desempenho alinhados: o que produz condiz com a base que tem. Leitura coerente, sem grandes distorções.')
  }

  // ===== 6. RISCOS =====
  s.push('## Riscos e limitações da leitura')
  const riscos: string[] = []
  if (j.jogos < 5) riscos.push(`amostra pequena (${j.jogos} ${plur(j.jogos, 'jogo', 'jogos')}) — números instáveis, tratar como tendência, não como conclusão`)
  if (precoce) riscos.push('maturação adiantada pode inflar a produção e o físico atuais')
  if (tardio) riscos.push('maturação atrasada pode estar rebaixando números que vão melhorar com o estirão')
  if (!d.maturacao) riscos.push('sem dado de maturação — a leitura de base fica incompleta')
  if (d.fisico.length === 0) riscos.push('sem testes físicos — vertente de desenvolvimento não avaliada')
  if (!d.comparativo || !d.comparativo.length) riscos.push('sem base de comparação posicional (poucos atletas na mesma posição)')
  s.push(riscos.length ? riscos.map(r => `- ${r}`).join('\n') : '- Sem ressalvas relevantes com os dados atuais.')

  // ===== 7. PLANO DE DESENVOLVIMENTO =====
  s.push('## Plano de desenvolvimento')
  const plano: string[] = []
  if (d.medias) {
    const grupos = [
      { k: 'ações ofensivas (mobilidade, finalização, tomada de decisão no último terço)', v: d.medias.ofe },
      { k: 'ações defensivas (marcação, cobertura, equilíbrio)', v: d.medias.def },
      { k: 'fundamentos individuais (técnica, 1x1, inteligência)', v: d.medias.cbf },
    ].filter(g => g.v > 0)
    if (grupos.length) {
      const fraco = [...grupos].sort((a, b) => a.v - b.v)[0]
      plano.push(`Prioridade técnica: ${fraco.k} — é a área de menor nota e o maior potencial de ganho.`)
    }
  }
  const fisPiora = d.fisico.filter(f => f.evoluiu === false).map(f => f.label)
  if (fisPiora.length) plano.push(`Atenção física: ${fisPiora.join(', ')} em queda — revisar treino específico.`)
  if (d.pontosDesenvolver) plano.push(`Reforçar o que o avaliador apontou: ${d.pontosDesenvolver}.`)
  if (j.percentDecisivo < 30 && ehAtacante) plano.push('Elevar a regularidade ofensiva: transformar presença em participação — mais volume de finalização e presença na área.')
  if (tardio) plano.push('Manter no radar e proteger o desenvolvimento: não comparar com os precoces; potencial deve emergir no pós-estirão.')
  if (precoce) plano.push('Exigir mais tecnicamente do que o físico entrega de graça, para não estacionar quando os pares alcançarem.')
  if (plano.length === 0) plano.push('Manter o plano atual e reavaliar após mais jogos e nova bateria de testes físicos.')
  s.push(plano.map(r => `- ${r}`).join('\n'))

  // ===== 8. VEREDITO =====
  s.push('## Veredito do analista')
  let veredito: string
  const idaVal = d.ida?.valor ?? 0
  if (tardio && (d.evolucaoTecnica ?? 0) >= 0) {
    veredito = 'RETER E INVESTIR. Perfil de potencial subvalorizado pelos números atuais — típico late developer com base em construção. Alto risco descartar cedo.'
  } else if (precoce && idpOk && (d.idp!.valor - idaVal) >= 15) {
    veredito = 'ACOMPANHAR COM CAUTELA. Rendimento possivelmente inflado pela maturação; reavaliar após o estirão dos pares antes de qualquer decisão definitiva.'
  } else if (idaVal >= 65 || (d.idp?.valor ?? 0) >= 65) {
    veredito = 'ATLETA DE DESTAQUE no grupo. Base e/ou produção acima da média — merece plano individualizado e exposição a desafios maiores.'
  } else if (j.jogos < 5 || (!d.maturacao && d.fisico.length === 0)) {
    veredito = 'DADOS INSUFICIENTES para veredito firme. Coletar mais jogos e a avaliação física/maturação antes de concluir.'
  } else {
    veredito = 'EM DESENVOLVIMENTO dentro do esperado. Seguir o plano acima e reavaliar no próximo ciclo.'
  }
  s.push(veredito)

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
