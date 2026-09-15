// Curva esperada CONTINUA por idade — resolve o degrau de aniversario da tabela por
// categoria (U11..U17). Interpola linearmente entre categorias pela idade decimal:
// eh a "curva do pediatra, so que do futebol".
//
// Puro (sem React/Supabase). Usa os benchmarks existentes em ./benchmark.ts;
// nao inventa valores novos.

import { DIMS_20, obterBenchmark, type DimKey } from './benchmark'

// Idade ancora de cada categoria (fim do ciclo, em anos):
// U11 -> 10, U12 -> 11, ..., U17 -> 16. Ex.: um atleta com 12,5 anos (idade decimal)
// esta no meio do caminho entre a ancora do U13 e do U14.
const ANCORAS: { categoria: string; idade: number }[] = [
  { categoria: 'U11', idade: 10 },
  { categoria: 'U12', idade: 11 },
  { categoria: 'U13', idade: 12 },
  { categoria: 'U14', idade: 13 },
  { categoria: 'U15', idade: 14 },
  { categoria: 'U16', idade: 15 },
  { categoria: 'U17', idade: 16 },
]

// Categoria "abaixo do U11": os valores para 5-10 anos ainda nao foram definidos
// pelo analista. Enquanto isso, a curva devolve "sem referencia" abaixo do U11
// e o boletim mostra apenas a evolucao contra o proprio historico.
const IDADE_MINIMA_COM_CURVA = 10 // ancora do U11
const IDADE_MAXIMA_COM_CURVA = 16 // ancora do U17

// Idade decimal (em anos, com 1 casa) numa data especifica.
export function idadeDecimalEm(dataNascimento: string | null, dataRef: string = hojeISO()): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento + 'T12:00:00').getTime()
  const ref = new Date(dataRef + 'T12:00:00').getTime()
  if (isNaN(nasc) || isNaN(ref) || ref < nasc) return null
  const anos = (ref - nasc) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.round(anos * 10) / 10
}

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10)
}

// Interpola linearmente o benchmark por dimensao entre duas ancoras.
// Fora do intervalo [10, 16], grampeia na ancora mais proxima (nao extrapola).
export function benchmarkNaIdade(
  posicao: string | null,
  idadeDecimal: number
): Record<DimKey, number> | null {
  if (idadeDecimal < IDADE_MINIMA_COM_CURVA) return null

  const idade = Math.min(idadeDecimal, IDADE_MAXIMA_COM_CURVA)

  // Acha as duas ancoras que cercam a idade.
  let baixo = ANCORAS[0]
  let alto = ANCORAS[ANCORAS.length - 1]
  for (let i = 0; i < ANCORAS.length - 1; i++) {
    if (idade >= ANCORAS[i].idade && idade <= ANCORAS[i + 1].idade) {
      baixo = ANCORAS[i]
      alto = ANCORAS[i + 1]
      break
    }
  }

  const bBaixo = obterBenchmark(posicao, baixo.categoria)
  const bAlto = obterBenchmark(posicao, alto.categoria)

  if (baixo.idade === alto.idade) return bBaixo
  const t = (idade - baixo.idade) / (alto.idade - baixo.idade)

  const out: Partial<Record<DimKey, number>> = {}
  for (const d of DIMS_20) {
    const v = bBaixo[d.key] + t * (bAlto[d.key] - bBaixo[d.key])
    out[d.key] = Math.round(v * 100) / 100
  }
  return out as Record<DimKey, number>
}

// Ponto de uma avaliacao no tempo (o suficiente para calcular ritmo).
export type PontoAvaliacao = {
  data_avaliacao: string
  valores: Partial<Record<DimKey, number>>
}

export type RitmoStatus = 'acima' | 'acompanhando' | 'abaixo_fechando' | 'atencao' | 'sem_dados'

export type RitmoDimensao = {
  key: DimKey
  label: string
  short: string
  valorAtual: number
  esperadoAtual: number
  diferencaAtual: number
  // Diferenca da 1a avaliacao vs curva daquele momento — para saber se
  // a distancia esta fechando ou aumentando.
  diferencaInicial: number | null
  inclinacaoAtleta: number | null // pontos por ano
  inclinacaoCurva: number | null
  status: RitmoStatus
  descricao: string
}

// Compara a inclinacao do atleta com a inclinacao da curva.
// Estados:
// - 'acima':            valor >= curva (diferenca >= +0,3)
// - 'acompanhando':     dentro de +/-0,3 da curva
// - 'abaixo_fechando':  abaixo da curva mas subindo MAIS rapido que ela
// - 'atencao':          abaixo da curva e a distancia esta aumentando (ou parado)
// - 'sem_dados':        1 ponto so ou sem curva na faixa etaria
export function classificarRitmo(
  key: DimKey,
  pontos: PontoAvaliacao[],
  dataNascimento: string,
  posicao: string | null
): RitmoDimensao | null {
  const dim = DIMS_20.find(d => d.key === key)
  if (!dim) return null

  const preenchidos = pontos
    .filter(p => typeof p.valores[key] === 'number')
    .map(p => ({
      data: p.data_avaliacao,
      idade: idadeDecimalEm(dataNascimento, p.data_avaliacao),
      valor: p.valores[key] as number,
    }))
    .filter(p => p.idade != null)
    .sort((a, b) => a.data.localeCompare(b.data))

  if (preenchidos.length === 0) return null

  const primeiro = preenchidos[0]
  const ultimo = preenchidos[preenchidos.length - 1]

  const curvaUltimo = benchmarkNaIdade(posicao, ultimo.idade as number)
  if (!curvaUltimo) {
    // Abaixo de U11: sem curva. Devolve so o valor atual, sem status.
    return {
      key,
      label: dim.label,
      short: dim.short,
      valorAtual: ultimo.valor,
      esperadoAtual: 0,
      diferencaAtual: 0,
      diferencaInicial: null,
      inclinacaoAtleta: null,
      inclinacaoCurva: null,
      status: 'sem_dados',
      descricao: 'Sem curva de referencia para essa idade — mostrando so o valor.',
    }
  }

  const esperadoAtual = curvaUltimo[key]
  const diferencaAtual = Math.round((ultimo.valor - esperadoAtual) * 100) / 100

  if (preenchidos.length < 2) {
    const status: RitmoStatus = diferencaAtual >= 0.3 ? 'acima' : diferencaAtual >= -0.3 ? 'acompanhando' : 'atencao'
    return {
      key,
      label: dim.label,
      short: dim.short,
      valorAtual: ultimo.valor,
      esperadoAtual,
      diferencaAtual,
      diferencaInicial: null,
      inclinacaoAtleta: null,
      inclinacaoCurva: null,
      status,
      descricao: descricaoRitmo(status, diferencaAtual, null, null),
    }
  }

  // Duas ou mais avaliacoes: calcula inclinacoes.
  const dtAnos = (ultimo.idade as number) - (primeiro.idade as number)
  const inclinacaoAtleta = dtAnos > 0 ? (ultimo.valor - primeiro.valor) / dtAnos : 0

  const curvaPrimeiro = benchmarkNaIdade(posicao, primeiro.idade as number)
  const diferencaInicial =
    curvaPrimeiro ? Math.round((primeiro.valor - curvaPrimeiro[key]) * 100) / 100 : null
  const inclinacaoCurva =
    curvaPrimeiro && dtAnos > 0 ? (curvaUltimo[key] - curvaPrimeiro[key]) / dtAnos : null

  let status: RitmoStatus
  if (diferencaAtual >= 0.3) status = 'acima'
  else if (diferencaAtual >= -0.3) status = 'acompanhando'
  else {
    // Abaixo da curva: distancia fechando ou aumentando?
    if (
      diferencaInicial != null &&
      diferencaAtual > diferencaInicial &&
      inclinacaoCurva != null &&
      inclinacaoAtleta > inclinacaoCurva
    ) {
      status = 'abaixo_fechando'
    } else {
      status = 'atencao'
    }
  }

  return {
    key,
    label: dim.label,
    short: dim.short,
    valorAtual: ultimo.valor,
    esperadoAtual: Math.round(esperadoAtual * 100) / 100,
    diferencaAtual,
    diferencaInicial,
    inclinacaoAtleta: Math.round(inclinacaoAtleta * 100) / 100,
    inclinacaoCurva: inclinacaoCurva == null ? null : Math.round(inclinacaoCurva * 100) / 100,
    status,
    descricao: descricaoRitmo(status, diferencaAtual, diferencaInicial, inclinacaoAtleta),
  }
}

// Frase curta em portugues (linguagem de pai, sem jargao).
function descricaoRitmo(
  status: RitmoStatus,
  difAtual: number,
  difInicial: number | null,
  incl: number | null
): string {
  switch (status) {
    case 'acima':
      return `Esta acima do esperado para a idade (+${difAtual.toFixed(1)}).`
    case 'acompanhando':
      return 'Esta acompanhando o esperado para a idade.'
    case 'abaixo_fechando':
      return difInicial != null
        ? `Ainda abaixo do esperado, mas fechando a diferenca (${difInicial.toFixed(1)} → ${difAtual.toFixed(1)}).`
        : 'Ainda abaixo do esperado, mas evoluindo mais rapido que a curva.'
    case 'atencao':
      return incl != null && incl <= 0
        ? 'Abaixo do esperado e sem melhora entre as avaliacoes — merece atencao.'
        : `Abaixo do esperado para a idade (${difAtual.toFixed(1)}).`
    case 'sem_dados':
      return 'Sem curva de referencia para essa idade.'
  }
}

// "Onde precisa chegar": alvo para a proxima avaliacao (default: daqui a 3 meses).
export type ProximoObjetivo = {
  idadeAlvo: number
  dataAlvo: string
  esperado: Record<DimKey, number> | null
  distanciasPositivas: { key: DimKey; label: string; delta: number }[] // o que precisa melhorar mais ate la
}

export function calcularProximoObjetivo(
  posicao: string | null,
  dataNascimento: string,
  valoresAtuais: Partial<Record<DimKey, number>>,
  mesesAFrente = 3
): ProximoObjetivo | null {
  const hoje = hojeISO()
  const dataAlvo = adicionarMeses(hoje, mesesAFrente)
  const idadeAlvo = idadeDecimalEm(dataNascimento, dataAlvo)
  if (idadeAlvo == null) return null

  const esperado = benchmarkNaIdade(posicao, idadeAlvo)
  if (!esperado) return null

  const distancias = DIMS_20
    .map(d => {
      const atual = valoresAtuais[d.key]
      if (typeof atual !== 'number') return null
      const delta = esperado[d.key] - atual
      return delta > 0.2 ? { key: d.key, label: d.label, delta: Math.round(delta * 100) / 100 } : null
    })
    .filter((x): x is { key: DimKey; label: string; delta: number } => x != null)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 5)

  return { idadeAlvo, dataAlvo, esperado, distanciasPositivas: distancias }
}

function adicionarMeses(dataISO: string, meses: number): string {
  const d = new Date(dataISO + 'T12:00:00')
  d.setMonth(d.getMonth() + meses)
  return d.toISOString().slice(0, 10)
}

// Serie completa "atleta vs curva" para o grafico de UMA dimensao ao longo das avaliacoes.
export type SerieCurva = {
  labels: string[] // data (dd/mm)
  atleta: (number | null)[]
  esperado: (number | null)[]
}

export function serieAtletaVsCurva(
  key: DimKey,
  pontos: PontoAvaliacao[],
  dataNascimento: string,
  posicao: string | null
): SerieCurva {
  const ord = [...pontos].sort((a, b) => a.data_avaliacao.localeCompare(b.data_avaliacao))
  const labels: string[] = []
  const atleta: (number | null)[] = []
  const esperado: (number | null)[] = []

  for (const p of ord) {
    const idade = idadeDecimalEm(dataNascimento, p.data_avaliacao)
    if (idade == null) continue
    const d = new Date(p.data_avaliacao + 'T12:00:00')
    labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
    const v = p.valores[key]
    atleta.push(typeof v === 'number' ? v : null)
    const curva = benchmarkNaIdade(posicao, idade)
    esperado.push(curva ? curva[key] : null)
  }

  return { labels, atleta, esperado }
}
