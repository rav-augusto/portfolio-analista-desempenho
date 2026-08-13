// Eficiência por jogo (estilo StatsBomb/Opta), filtrada para base, a partir dos
// eventos coletados (migrações 007 e 010) e do contexto (009).
// Puro, sem React/Supabase. Foco em EFICIÊNCIA (%) e não volume.

export type AvaliacaoEventos = {
  minutos_jogados: number | null
  gols: number | null
  assistencias: number | null
  // 007
  finalizacoes_no_alvo: number | null
  finalizacoes_fora: number | null
  finalizacoes_bloqueadas: number | null
  passes_certos: number | null
  passes_errados: number | null
  passes_decisivos: number | null
  duelos_ganhos: number | null
  duelos_perdidos: number | null
  desarmes: number | null
  interceptacoes: number | null
  perdas_posse: number | null
  // 010
  dribles_tentados: number | null
  dribles_certos: number | null
  bolas_recuperadas: number | null
  toques_area: number | null
  // 009 (contexto)
  nivel_adversario: string | null
  importancia_jogo: string | null
  situacao_jogo: string | null
  gols_decisivos: number | null
  assistencias_decisivas: number | null
}

const soma = (avs: AvaliacaoEventos[], campo: keyof AvaliacaoEventos): number =>
  avs.reduce((acc, a) => acc + (typeof a[campo] === 'number' ? (a[campo] as number) : 0), 0)

export type Eficiencia = {
  temDados: boolean
  minutos: number
  jogos: number
  // finalização
  finalizacoes: number
  finalizacoesNoAlvo: number
  percNoAlvo: number | null
  conversao: number | null // gols / finalizações
  // passe
  passes: number
  precisaoPasse: number | null
  passesDecisivos: number
  // 1v1
  driblesTentados: number
  driblesCertos: number
  percDrible: number | null
  // duelos
  duelos: number
  percDuelo: number | null
  // defesa / recuperação
  desarmes: number
  interceptacoes: number
  bolasRecuperadas: number
  perdasPosse: number
  toquesArea: number
  // índices (ações por partida de 60')
  criacaoPorPartida: number | null // finalizações + passes decisivos + dribles certos
  recuperacaoPorPartida: number | null // desarmes + interceptações + bolas recuperadas + duelos ganhos
}

const MINUTOS_PARTIDA = 60

export function calcularEficiencia(avs: AvaliacaoEventos[]): Eficiencia {
  const jogosComMin = avs.filter(a => (a.minutos_jogados || 0) > 0)
  const minutos = soma(jogosComMin, 'minutos_jogados')
  const jogos = jogosComMin.length

  const finNoAlvo = soma(avs, 'finalizacoes_no_alvo')
  const finalizacoes = finNoAlvo + soma(avs, 'finalizacoes_fora') + soma(avs, 'finalizacoes_bloqueadas')
  const gols = soma(avs, 'gols')

  const pCertos = soma(avs, 'passes_certos')
  const passes = pCertos + soma(avs, 'passes_errados')
  const passesDecisivos = soma(avs, 'passes_decisivos')

  const drTent = soma(avs, 'dribles_tentados')
  const drCertos = soma(avs, 'dribles_certos')

  const dGanhos = soma(avs, 'duelos_ganhos')
  const duelos = dGanhos + soma(avs, 'duelos_perdidos')

  const desarmes = soma(avs, 'desarmes')
  const interceptacoes = soma(avs, 'interceptacoes')
  const bolasRecuperadas = soma(avs, 'bolas_recuperadas')

  const pct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : null)
  const porPartida = (total: number) => (minutos > 0 ? (total / minutos) * MINUTOS_PARTIDA : null)

  const temDados = finalizacoes + passes + drTent + duelos + desarmes + interceptacoes + bolasRecuperadas > 0

  return {
    temDados,
    minutos,
    jogos,
    finalizacoes,
    finalizacoesNoAlvo: finNoAlvo,
    percNoAlvo: pct(finNoAlvo, finalizacoes),
    conversao: pct(gols, finalizacoes),
    passes,
    precisaoPasse: pct(pCertos, passes),
    passesDecisivos,
    driblesTentados: drTent,
    driblesCertos: drCertos,
    percDrible: pct(drCertos, drTent),
    duelos,
    percDuelo: pct(dGanhos, duelos),
    desarmes,
    interceptacoes,
    bolasRecuperadas,
    perdasPosse: soma(avs, 'perdas_posse'),
    toquesArea: soma(avs, 'toques_area'),
    criacaoPorPartida: porPartida(finalizacoes + passesDecisivos + drCertos),
    recuperacaoPorPartida: porPartida(desarmes + interceptacoes + bolasRecuperadas + dGanhos),
  }
}

// Métricas de eficiência como frases (para painel e análise).
export type MetricaEficiencia = { chave: string; titulo: string; valor: string; descricao: string }

const nf = (v: number, casas = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

export function explicarEficiencia(e: Eficiencia): MetricaEficiencia[] {
  const out: MetricaEficiencia[] = []
  if (e.precisaoPasse != null) out.push({ chave: 'passe', titulo: 'Precisão de passe', valor: `${nf(e.precisaoPasse)}%`, descricao: `Completou ${nf(e.precisaoPasse)}% dos ${e.passes} passes tentados.` })
  if (e.percNoAlvo != null) out.push({ chave: 'alvo', titulo: 'Finalização no alvo', valor: `${nf(e.percNoAlvo)}%`, descricao: `${nf(e.percNoAlvo)}% das ${e.finalizacoes} finalizações foram no alvo${e.conversao != null ? ` — converteu ${nf(e.conversao)}% em gol` : ''}.` })
  if (e.percDrible != null) out.push({ chave: 'drible', titulo: '1 contra 1 (dribles)', valor: `${nf(e.percDrible)}%`, descricao: `Levou a melhor em ${nf(e.percDrible)}% dos ${e.driblesTentados} duelos individuais.` })
  if (e.percDuelo != null) out.push({ chave: 'duelo', titulo: 'Duelos ganhos', valor: `${nf(e.percDuelo)}%`, descricao: `Venceu ${nf(e.percDuelo)}% dos ${e.duelos} duelos disputados.` })
  if (e.criacaoPorPartida != null) out.push({ chave: 'criacao', titulo: 'Criação por partida', valor: nf(e.criacaoPorPartida, 1), descricao: `Ações de perigo (finalizações + passes decisivos + dribles certos) a cada partida completa (60').` })
  if (e.recuperacaoPorPartida != null) out.push({ chave: 'recuperacao', titulo: 'Recuperação por partida', valor: nf(e.recuperacaoPorPartida, 1), descricao: `Ações defensivas (desarmes + interceptações + recuperações + duelos ganhos) a cada 60'.` })
  return out
}

// ---- Produção ajustada ao contexto (009) — peso OBJETIVO, sem narrativa ----
// Cada participação em gol pesa mais conforme a dificuldade/importância do contexto.
export type ContextoProducao = {
  disponivel: boolean
  participacoes: number
  participacoesAjustadas: number
  fator: number // média dos pesos aplicados (1.0 = contexto neutro)
  jogosComContexto: number
}

const pesoNivel = (n: string | null) => (n === 'forte' ? 1.3 : n === 'fraco' ? 0.8 : 1.0)
const pesoImportancia = (i: string | null) => (i === 'decisao' ? 1.3 : i === 'amistoso' ? 0.8 : 1.0)
const pesoSituacao = (s: string | null) => (s === 'perdendo' ? 1.2 : s === 'empatando' ? 1.1 : 0.9)

export function calcularContextoProducao(avs: AvaliacaoEventos[]): ContextoProducao {
  let participacoes = 0
  let ajustadas = 0
  let somaPesos = 0
  let jogosComContexto = 0

  for (const a of avs) {
    const part = (a.gols || 0) + (a.assistencias || 0)
    participacoes += part
    const temContexto = !!(a.nivel_adversario || a.importancia_jogo || a.situacao_jogo)
    const peso = pesoNivel(a.nivel_adversario) * pesoImportancia(a.importancia_jogo) * pesoSituacao(a.situacao_jogo)
    if (temContexto) {
      jogosComContexto++
      somaPesos += peso
    }
    ajustadas += part * (temContexto ? peso : 1)
  }

  return {
    disponivel: jogosComContexto > 0,
    participacoes,
    participacoesAjustadas: Math.round(ajustadas * 10) / 10,
    fator: jogosComContexto > 0 ? Math.round((somaPesos / jogosComContexto) * 100) / 100 : 1,
    jogosComContexto,
  }
}
