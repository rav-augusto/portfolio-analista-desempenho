// Cálculos de DESENVOLVIMENTO do atleta (vertente base): físico + maturação.
// Puro, sem React/Supabase. Usa dados que já são coletados na avaliação física.

// Campos físicos de uma avaliação (subconjunto usado aqui).
export type AvaliacaoFisica = {
  data_avaliacao: string
  altura_avaliacao: number | null
  peso_avaliacao: number | null
  envergadura: number | null
  velocidade_10m: number | null
  velocidade_30m: number | null
  salto_vertical: number | null
  agilidade_teste: number | null
  yoyo_distancia: number | null
  sentar_alcancar: number | null
  idade_biologica: number | null
  estagio_phv: string | null // 'pre' | 'durante' | 'pos'
}

// Direção: em testes de tempo (velocidade/agilidade), MENOR é melhor.
export type MelhorQuando = 'maior' | 'menor'

export type MetricaFisica = {
  key: keyof AvaliacaoFisica
  label: string
  unidade: string
  melhorQuando: MelhorQuando
  descricao: string
}

export const METRICAS_FISICAS: MetricaFisica[] = [
  { key: 'velocidade_10m', label: 'Velocidade 10m', unidade: 's', melhorQuando: 'menor', descricao: 'Explosão curta / arranque. Tempo menor é melhor.' },
  { key: 'velocidade_30m', label: 'Velocidade 30m', unidade: 's', melhorQuando: 'menor', descricao: 'Velocidade máxima. Tempo menor é melhor.' },
  { key: 'salto_vertical', label: 'Salto vertical', unidade: 'cm', melhorQuando: 'maior', descricao: 'Potência de membros inferiores. Mais alto é melhor.' },
  { key: 'agilidade_teste', label: 'Agilidade', unidade: 's', melhorQuando: 'menor', descricao: 'Mudança de direção. Tempo menor é melhor.' },
  { key: 'yoyo_distancia', label: 'Resistência (Yo-Yo)', unidade: 'm', melhorQuando: 'maior', descricao: 'Capacidade aeróbia intermitente. Mais distância é melhor.' },
  { key: 'sentar_alcancar', label: 'Flexibilidade', unidade: 'cm', melhorQuando: 'maior', descricao: 'Flexibilidade posterior. Mais alcance é melhor.' },
]

const ordenar = <T extends { data_avaliacao: string }>(itens: T[]): T[] =>
  [...itens].sort((a, b) => new Date(a.data_avaliacao).getTime() - new Date(b.data_avaliacao).getTime())

// IMC = peso / altura² (altura em metros).
export function calcularIMC(peso: number | null, altura: number | null): number | null {
  if (!peso || !altura || altura <= 0) return null
  return peso / (altura * altura)
}

// Série temporal de uma métrica física (só pontos preenchidos).
export type SerieFisica = { labels: string[]; valores: number[] }

export function serieFisica(avaliacoes: AvaliacaoFisica[], key: keyof AvaliacaoFisica): SerieFisica {
  const pts = ordenar(avaliacoes).filter(a => typeof a[key] === 'number' && a[key] !== null)
  return {
    labels: pts.map(a => {
      const d = new Date(a.data_avaliacao + 'T12:00:00')
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }),
    valores: pts.map(a => a[key] as number),
  }
}

// Série de IMC ao longo do tempo.
export function serieIMC(avaliacoes: AvaliacaoFisica[]): SerieFisica {
  const pts = ordenar(avaliacoes)
    .map(a => ({ data: a.data_avaliacao, imc: calcularIMC(a.peso_avaliacao, a.altura_avaliacao) }))
    .filter(p => p.imc !== null)
  return {
    labels: pts.map(p => {
      const d = new Date(p.data + 'T12:00:00')
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }),
    valores: pts.map(p => p.imc as number),
  }
}

// Resumo de evolução de cada métrica física: primeiro, último e se melhorou.
export type ResumoMetrica = {
  key: string
  label: string
  unidade: string
  descricao: string
  primeiro: number
  ultimo: number
  delta: number // último - primeiro
  melhorou: boolean | null // null quando não deu pra comparar (1 ponto só)
  temDados: boolean
}

export function resumoFisico(avaliacoes: AvaliacaoFisica[]): ResumoMetrica[] {
  return METRICAS_FISICAS.map(m => {
    const serie = serieFisica(avaliacoes, m.key)
    const n = serie.valores.length
    if (n === 0) {
      return { key: m.key as string, label: m.label, unidade: m.unidade, descricao: m.descricao, primeiro: 0, ultimo: 0, delta: 0, melhorou: null, temDados: false }
    }
    const primeiro = serie.valores[0]
    const ultimo = serie.valores[n - 1]
    const delta = ultimo - primeiro
    const melhorou = n < 2 ? null : m.melhorQuando === 'maior' ? delta > 0 : delta < 0
    return { key: m.key as string, label: m.label, unidade: m.unidade, descricao: m.descricao, primeiro, ultimo, delta, melhorou, temDados: true }
  }).filter(r => r.temDados)
}

// ---- Maturação (o diferencial da base) ----

export type PerfilMaturacao = {
  idadeBiologica: number | null
  idadeCronologica: number | null
  diferenca: number | null // biológica - cronológica
  classificacao: 'precoce' | 'no_tempo' | 'tardio' | 'sem_dados'
  classificacaoLabel: string
  estagioPHV: string | null
  estagioPHVLabel: string
  descricao: string
}

const estagioLabel = (e: string | null): string => {
  if (e === 'pre') return 'Antes do estirão (pré-PHV)'
  if (e === 'durante') return 'Em pleno estirão (durante o PHV)'
  if (e === 'pos') return 'Depois do estirão (pós-PHV)'
  return 'Não informado'
}

// Interpreta maturação comparando idade biológica x cronológica + estágio PHV.
// Retorna classificação + uma frase de leitura para o analista.
export function interpretarMaturacao(
  idadeBiologica: number | null,
  idadeCronologica: number | null,
  estagioPHV: string | null
): PerfilMaturacao {
  const estagioPHVLabel = estagioLabel(estagioPHV)

  if (idadeBiologica == null || idadeCronologica == null) {
    return {
      idadeBiologica,
      idadeCronologica,
      diferenca: null,
      classificacao: 'sem_dados',
      classificacaoLabel: 'Maturação não informada',
      estagioPHV,
      estagioPHVLabel,
      descricao: estagioPHV
        ? `Estágio de crescimento: ${estagioPHVLabel.toLowerCase()}. Informe a idade biológica para uma leitura completa.`
        : 'Registre idade biológica e estágio PHV na avaliação física para liberar a análise de maturação.',
    }
  }

  const diferenca = idadeBiologica - idadeCronologica
  let classificacao: PerfilMaturacao['classificacao']
  let classificacaoLabel: string
  let leitura: string

  if (diferenca >= 1) {
    classificacao = 'precoce'
    classificacaoLabel = 'Maturação adiantada (precoce)'
    leitura =
      'Está fisicamente à frente da idade. Cuidado: parte do desempenho atual pode vir da vantagem física, não só da qualidade técnica. Compare com atletas de maturação parecida.'
  } else if (diferenca <= -1) {
    classificacao = 'tardio'
    classificacaoLabel = 'Maturação atrasada (tardio)'
    leitura =
      'Está fisicamente atrás da idade — pode estar em desvantagem temporária contra os mais desenvolvidos. É o perfil clássico de "late bloomer": o potencial técnico tende a se destacar mais depois do estirão. Não descartar por resultado físico agora.'
  } else {
    classificacao = 'no_tempo'
    classificacaoLabel = 'Maturação no tempo (dentro do esperado)'
    leitura = 'Desenvolvimento físico alinhado à idade — o desempenho reflete bem o nível atual do atleta.'
  }

  return {
    idadeBiologica,
    idadeCronologica,
    diferenca,
    classificacao,
    classificacaoLabel,
    estagioPHV,
    estagioPHVLabel,
    descricao: `${leitura} Estágio de crescimento: ${estagioPHVLabel.toLowerCase()}.`,
  }
}

// Idade cronológica (em anos, com 1 casa) numa data de referência.
export function idadeCronologicaEm(dataNascimento: string | null, dataRef: string): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento + 'T12:00:00').getTime()
  const ref = new Date(dataRef + 'T12:00:00').getTime()
  if (isNaN(nasc) || isNaN(ref) || ref < nasc) return null
  const anos = (ref - nasc) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.round(anos * 10) / 10
}
