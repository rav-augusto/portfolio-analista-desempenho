// Percentis: onde o atleta está em relação aos pares (mesma posição).
// Padrão de plataformas de scout ("top X% dos meias").

export type MetricaPercentil = {
  chave: string
  label: string
  valor: number
  percentil: number
  n: number // tamanho da população comparada
}

// Percentil de `valor` dentro de `populacao` (0–100).
// Usa a média entre "abaixo" e "igual" para não penalizar empates.
export function percentilDe(valor: number, populacao: number[]): number {
  const pop = populacao.filter((v) => typeof v === 'number' && !Number.isNaN(v))
  if (pop.length === 0) return 50
  let abaixo = 0
  let iguais = 0
  for (const v of pop) {
    if (v < valor) abaixo++
    else if (v === valor) iguais++
  }
  return Math.round(((abaixo + 0.5 * iguais) / pop.length) * 100)
}

export function classificarPercentil(p: number): string {
  if (p >= 90) return 'Elite'
  if (p >= 75) return 'Muito acima'
  if (p >= 60) return 'Acima da média'
  if (p >= 40) return 'Na média'
  if (p >= 25) return 'Abaixo da média'
  return 'Muito abaixo'
}

// Cor por faixa de percentil (hex, tema claro — usado no PDF).
export function corPercentil(p: number): string {
  if (p >= 75) return '#16a34a'
  if (p >= 50) return '#d97706'
  if (p >= 25) return '#ea580c'
  return '#dc2626'
}
