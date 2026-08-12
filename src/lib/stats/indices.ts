// Índices compostos (0-100) — TRANSPARENTES: sempre expõem as partes e os pesos.
// Filosofia: só pontua o que é medível de fato; se falta dado, o componente sai e os
// pesos são renormalizados. Nada de peso mágico escondido.

export type ComponenteIndice = {
  label: string
  score: number // 0-100
  peso: number // peso relativo (renormalizado entre os disponíveis)
  disponivel: boolean
  detalhe: string
}

export type Indice = {
  valor: number // 0-100 (arredondado)
  disponivel: boolean
  componentes: ComponenteIndice[]
}

const clamp = (n: number) => Math.max(0, Math.min(100, n))

function combinar(componentes: ComponenteIndice[]): Indice {
  const disp = componentes.filter(c => c.disponivel)
  if (disp.length === 0) return { valor: 0, disponivel: false, componentes }
  const somaPesos = disp.reduce((a, c) => a + c.peso, 0)
  const valor = disp.reduce((a, c) => a + c.score * (c.peso / somaPesos), 0)
  return { valor: Math.round(valor), disponivel: true, componentes }
}

// Classificação textual do índice (faixas).
export function classificarIndice(valor: number): string {
  if (valor >= 80) return 'Excelente'
  if (valor >= 65) return 'Bom'
  if (valor >= 50) return 'Regular'
  if (valor >= 35) return 'Em desenvolvimento'
  return 'Inicial'
}

// ---- IDA: Índice de Desenvolvimento do Atleta ----
// Componentes: nível técnico atual + trajetória técnica + evolução física.
// Maturação NÃO entra como nota (não faz sentido penalizar um tardio) — fica como contexto.
export function calcularIDA(input: {
  mediaGeralTecnica: number // 0-5 (avaliação atual)
  evolucaoTecnica: number | null // variação da média (última - primeira), escala 0-5; null se <2 aval
  percentFisicoMelhorou: number | null // 0-100 (% dos testes físicos que melhoraram); null se sem dados
}): Indice {
  const tecnicoAtual = clamp(input.mediaGeralTecnica * 20)
  const evol = input.evolucaoTecnica == null ? null : clamp(50 + input.evolucaoTecnica * 25)
  return combinar([
    {
      label: 'Nível técnico atual',
      score: tecnicoAtual,
      peso: 40,
      disponivel: input.mediaGeralTecnica > 0,
      detalhe: `Média geral ${input.mediaGeralTecnica.toFixed(1)}/5`,
    },
    {
      label: 'Evolução técnica',
      score: evol ?? 0,
      peso: 35,
      disponivel: evol != null,
      detalhe:
        input.evolucaoTecnica == null
          ? 'Necessário 2+ avaliações'
          : `${input.evolucaoTecnica >= 0 ? '+' : ''}${input.evolucaoTecnica.toFixed(1)} na média desde a 1ª avaliação`,
    },
    {
      label: 'Evolução física',
      score: input.percentFisicoMelhorou ?? 0,
      peso: 25,
      disponivel: input.percentFisicoMelhorou != null,
      detalhe:
        input.percentFisicoMelhorou == null
          ? 'Sem testes físicos comparáveis'
          : `${Math.round(input.percentFisicoMelhorou)}% dos testes físicos melhoraram`,
    },
  ])
}

// ---- IDP: Índice de Desempenho ----
// Componentes: produção vs média da posição + regularidade decisiva.
export function calcularIDP(input: {
  percentDecisivo: number // 0-100
  producaoVsPosicao: number | null // média dos % vs posição (gols/partida e G+A/partida); null sem benchmark
  temJogos: boolean
}): Indice {
  const producao = input.producaoVsPosicao == null ? null : clamp(50 + input.producaoVsPosicao * 0.5)
  return combinar([
    {
      label: 'Produção vs posição',
      score: producao ?? 0,
      peso: 60,
      disponivel: producao != null,
      detalhe:
        input.producaoVsPosicao == null
          ? 'Precisa de +1 atleta na mesma posição'
          : `${input.producaoVsPosicao >= 0 ? '+' : ''}${Math.round(input.producaoVsPosicao)}% vs média da posição`,
    },
    {
      label: 'Regularidade decisiva',
      score: clamp(input.percentDecisivo),
      peso: 40,
      disponivel: input.temJogos,
      detalhe: `Decisivo em ${Math.round(input.percentDecisivo)}% dos jogos`,
    },
  ])
}
