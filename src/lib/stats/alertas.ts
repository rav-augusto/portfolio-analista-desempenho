// Alertas automáticos: transforma os dados do atleta em "pontos de atenção" acionáveis.
// O sistema aponta sozinho o que o analista deveria olhar — sem precisar garimpar.

export type Severidade = 'alta' | 'media' | 'info' | 'positiva'
export type Alerta = { severidade: Severidade; texto: string }

type Entrada = {
  diasDesdeUltima: number | null
  benchmark: { acima: number; dentro: number; abaixo: number; diferencaMedia: number } | null
  fisico: { label: string; melhorou: boolean | null }[]
  maturacao: string | null // 'precoce' | 'tardio' | 'no_ritmo' | 'sem_dados'
}

const ordem: Record<Severidade, number> = { alta: 0, media: 1, info: 2, positiva: 3 }
const fmt1 = (n: number) => Math.abs(n).toFixed(1).replace('.', ',')

export function gerarAlertas(e: Entrada): Alerta[] {
  const out: Alerta[] = []

  // Avaliação desatualizada
  if (e.diasDesdeUltima != null && e.diasDesdeUltima > 45) {
    out.push({ severidade: 'media', texto: `Última avaliação há ${e.diasDesdeUltima} dias — os dados podem estar desatualizados.` })
  }

  // Nível vs esperado para a idade/posição
  if (e.benchmark) {
    const b = e.benchmark
    if (b.abaixo >= 4) out.push({ severidade: 'alta', texto: `Abaixo do esperado para a idade/posição em ${b.abaixo} dimensões — priorizar no plano de desenvolvimento.` })
    else if (b.abaixo >= 2) out.push({ severidade: 'media', texto: `Abaixo do esperado em ${b.abaixo} dimensões para a idade/posição.` })
    if (b.diferencaMedia <= -0.3) out.push({ severidade: 'media', texto: `Média geral ${fmt1(b.diferencaMedia)} abaixo do nível esperado para a idade.` })
    if (b.acima >= 5) out.push({ severidade: 'positiva', texto: `Destaque: acima do esperado para a idade em ${b.acima} dimensões.` })
    else if (b.diferencaMedia >= 0.4) out.push({ severidade: 'positiva', texto: `Acima do nível esperado para a idade (+${fmt1(b.diferencaMedia)} na média).` })
  }

  // Físico em queda
  const piorou = e.fisico.filter(f => f.melhorou === false).map(f => f.label)
  if (piorou.length > 0) {
    out.push({ severidade: 'media', texto: `Queda em teste(s) físico(s): ${piorou.join(', ')} — revisar treino específico.` })
  }

  // Maturação (leitura, não alarme)
  if (e.maturacao === 'precoce') {
    out.push({ severidade: 'info', texto: 'Maturação precoce: parte da vantagem atual pode ser física/temporária — reavaliar no pós-PHV.' })
  } else if (e.maturacao === 'tardio') {
    out.push({ severidade: 'info', texto: 'Maturação tardia: ainda em desenvolvimento físico — não descartar por diferença de porte hoje.' })
  }

  return out.sort((a, b) => ordem[a.severidade] - ordem[b.severidade])
}
