// Benchmark por posição × categoria (idade): "nível esperado" para cada função e fase.
// Valores portados de dashboard-avaliacoes (mesma referência) — fonte única compartilhável.
// Base: CBF Academy, FIFA/UEFA, La Masia/Ajax + ajuste do analista.

export type DimKey =
  | 'forca' | 'velocidade' | 'tecnica' | 'dinamica' | 'inteligencia' | 'um_contra_um' | 'atitude' | 'potencial'
  | 'penetracao' | 'cobertura_ofensiva' | 'espaco_com_bola' | 'espaco_sem_bola' | 'mobilidade' | 'unidade_ofensiva'
  | 'contencao' | 'cobertura_defensiva' | 'equilibrio_recuperacao' | 'equilibrio_defensivo' | 'concentracao_def' | 'unidade_defensiva'

type Grupo = 'CBF' | 'OFE' | 'DEF'
export const DIMS_20: { key: DimKey; label: string; short: string; grupo: Grupo }[] = [
  { key: 'forca', label: 'Força', short: 'FOR', grupo: 'CBF' },
  { key: 'velocidade', label: 'Velocidade', short: 'VEL', grupo: 'CBF' },
  { key: 'tecnica', label: 'Técnica', short: 'TEC', grupo: 'CBF' },
  { key: 'dinamica', label: 'Dinâmica', short: 'DIN', grupo: 'CBF' },
  { key: 'inteligencia', label: 'Inteligência', short: 'INT', grupo: 'CBF' },
  { key: 'um_contra_um', label: '1 contra 1', short: '1x1', grupo: 'CBF' },
  { key: 'atitude', label: 'Atitude', short: 'ATI', grupo: 'CBF' },
  { key: 'potencial', label: 'Potencial', short: 'POT', grupo: 'CBF' },
  { key: 'penetracao', label: 'Penetração', short: 'PEN', grupo: 'OFE' },
  { key: 'cobertura_ofensiva', label: 'Cob. Ofensiva', short: 'COB', grupo: 'OFE' },
  { key: 'espaco_com_bola', label: 'Espaço c/ Bola', short: 'ECB', grupo: 'OFE' },
  { key: 'espaco_sem_bola', label: 'Espaço s/ Bola', short: 'ESB', grupo: 'OFE' },
  { key: 'mobilidade', label: 'Mobilidade', short: 'MOB', grupo: 'OFE' },
  { key: 'unidade_ofensiva', label: 'Unid. Ofensiva', short: 'UNI', grupo: 'OFE' },
  { key: 'contencao', label: 'Contenção', short: 'CON', grupo: 'DEF' },
  { key: 'cobertura_defensiva', label: 'Cob. Defensiva', short: 'CBD', grupo: 'DEF' },
  { key: 'equilibrio_recuperacao', label: 'Equil. Recuperação', short: 'EQR', grupo: 'DEF' },
  { key: 'equilibrio_defensivo', label: 'Equil. Defensivo', short: 'EQD', grupo: 'DEF' },
  { key: 'concentracao_def', label: 'Concentração', short: 'CNC', grupo: 'DEF' },
  { key: 'unidade_defensiva', label: 'Unid. Defensiva', short: 'UND', grupo: 'DEF' },
]

type V = Record<string, number>

const cbfPorPosicao: Record<string, V> = {
  'Goleiro': { forca: 3.5, velocidade: 3.0, tecnica: 3.5, dinamica: 3.0, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 3.5 },
  'Lateral Direito': { forca: 3.5, velocidade: 4.0, tecnica: 3.5, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 3.5, atitude: 4.0, potencial: 3.5 },
  'Lateral Esquerdo': { forca: 3.5, velocidade: 4.0, tecnica: 3.5, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 3.5, atitude: 4.0, potencial: 3.5 },
  'Zagueiro': { forca: 4.0, velocidade: 3.5, tecnica: 3.0, dinamica: 3.5, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 3.5 },
  'Volante': { forca: 4.0, velocidade: 3.5, tecnica: 3.5, dinamica: 4.0, inteligencia: 4.0, um_contra_um: 3.5, atitude: 4.0, potencial: 3.5 },
  'Meio-Campo': { forca: 3.0, velocidade: 3.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 4.5, um_contra_um: 3.0, atitude: 3.5, potencial: 4.0 },
  'Meia Atacante': { forca: 3.0, velocidade: 3.5, tecnica: 4.5, dinamica: 4.0, inteligencia: 4.5, um_contra_um: 3.5, atitude: 3.5, potencial: 4.0 },
  'Ponta Direita': { forca: 3.0, velocidade: 4.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 4.0, atitude: 3.5, potencial: 4.0 },
  'Ponta Esquerda': { forca: 3.0, velocidade: 4.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 4.0, atitude: 3.5, potencial: 4.0 },
  'Centroavante': { forca: 4.0, velocidade: 3.5, tecnica: 3.5, dinamica: 3.5, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 4.0 },
  'Atacante': { forca: 3.5, velocidade: 4.0, tecnica: 4.0, dinamica: 4.0, inteligencia: 3.5, um_contra_um: 4.0, atitude: 3.5, potencial: 4.0 },
}
const ofePorPosicao: Record<string, V> = {
  'Goleiro': { penetracao: 2.0, cobertura_ofensiva: 2.5, espaco_com_bola: 3.0, espaco_sem_bola: 2.0, mobilidade: 2.0, unidade_ofensiva: 3.0 },
  'Lateral Direito': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 3.5, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 3.5 },
  'Lateral Esquerdo': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 3.5, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 3.5 },
  'Zagueiro': { penetracao: 2.5, cobertura_ofensiva: 3.0, espaco_com_bola: 3.0, espaco_sem_bola: 2.5, mobilidade: 2.5, unidade_ofensiva: 3.5 },
  'Volante': { penetracao: 3.0, cobertura_ofensiva: 4.0, espaco_com_bola: 3.5, espaco_sem_bola: 3.5, mobilidade: 3.0, unidade_ofensiva: 4.0 },
  'Meio-Campo': { penetracao: 3.5, cobertura_ofensiva: 4.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.0, mobilidade: 3.5, unidade_ofensiva: 4.5 },
  'Meia Atacante': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 4.5, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 4.0 },
  'Ponta Direita': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.5, mobilidade: 4.5, unidade_ofensiva: 3.5 },
  'Ponta Esquerda': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.5, mobilidade: 4.5, unidade_ofensiva: 3.5 },
  'Centroavante': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 3.5, espaco_sem_bola: 4.0, mobilidade: 4.5, unidade_ofensiva: 3.5 },
  'Atacante': { penetracao: 4.5, cobertura_ofensiva: 3.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.5, mobilidade: 4.5, unidade_ofensiva: 3.5 },
}
const defPorPosicao: Record<string, V> = {
  'Goleiro': { contencao: 4.0, cobertura_defensiva: 4.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 4.0, concentracao_def: 4.5, unidade_defensiva: 4.0 },
  'Lateral Direito': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 3.5 },
  'Lateral Esquerdo': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 3.5 },
  'Zagueiro': { contencao: 4.5, cobertura_defensiva: 4.5, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 4.5, concentracao_def: 4.5, unidade_defensiva: 4.5 },
  'Volante': { contencao: 4.0, cobertura_defensiva: 4.0, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 4.0, concentracao_def: 4.0, unidade_defensiva: 4.5 },
  'Meio-Campo': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 4.0 },
  'Meia Atacante': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.5 },
  'Ponta Direita': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'Ponta Esquerda': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'Centroavante': { contencao: 3.0, cobertura_defensiva: 2.5, equilibrio_recuperacao: 3.0, equilibrio_defensivo: 2.5, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'Atacante': { contencao: 3.0, cobertura_defensiva: 2.5, equilibrio_recuperacao: 3.0, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 },
}

const cbfPorCategoria: Record<string, V> = {
  'U11': { forca: 2.0, velocidade: 2.5, tecnica: 3.0, dinamica: 3.5, inteligencia: 2.5, um_contra_um: 2.5, atitude: 3.5, potencial: 3.0 },
  'U12': { forca: 2.5, velocidade: 3.0, tecnica: 3.5, dinamica: 3.5, inteligencia: 3.0, um_contra_um: 3.0, atitude: 3.5, potencial: 3.5 },
  'U13': { forca: 2.5, velocidade: 3.0, tecnica: 3.5, dinamica: 3.5, inteligencia: 3.5, um_contra_um: 3.0, atitude: 3.5, potencial: 3.5 },
  'U14': { forca: 3.0, velocidade: 3.5, tecnica: 4.0, dinamica: 3.5, inteligencia: 3.5, um_contra_um: 3.5, atitude: 3.5, potencial: 4.0 },
  'U15': { forca: 3.5, velocidade: 3.5, tecnica: 4.0, dinamica: 4.0, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 4.0 },
  'U16': { forca: 3.5, velocidade: 4.0, tecnica: 4.0, dinamica: 4.0, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 4.0 },
  'U17': { forca: 4.0, velocidade: 4.0, tecnica: 4.5, dinamica: 4.0, inteligencia: 4.0, um_contra_um: 4.0, atitude: 4.0, potencial: 4.5 },
}
const ofePorCategoria: Record<string, V> = {
  'U11': { penetracao: 2.5, cobertura_ofensiva: 2.0, espaco_com_bola: 3.0, espaco_sem_bola: 2.0, mobilidade: 3.0, unidade_ofensiva: 2.0 },
  'U12': { penetracao: 3.0, cobertura_ofensiva: 2.5, espaco_com_bola: 3.0, espaco_sem_bola: 2.5, mobilidade: 3.0, unidade_ofensiva: 2.5 },
  'U13': { penetracao: 3.0, cobertura_ofensiva: 3.0, espaco_com_bola: 3.0, espaco_sem_bola: 3.0, mobilidade: 3.5, unidade_ofensiva: 3.0 },
  'U14': { penetracao: 3.5, cobertura_ofensiva: 3.0, espaco_com_bola: 3.5, espaco_sem_bola: 3.0, mobilidade: 3.5, unidade_ofensiva: 3.0 },
  'U15': { penetracao: 3.5, cobertura_ofensiva: 3.5, espaco_com_bola: 3.5, espaco_sem_bola: 3.5, mobilidade: 4.0, unidade_ofensiva: 3.5 },
  'U16': { penetracao: 4.0, cobertura_ofensiva: 3.5, espaco_com_bola: 4.0, espaco_sem_bola: 3.5, mobilidade: 4.0, unidade_ofensiva: 4.0 },
  'U17': { penetracao: 4.0, cobertura_ofensiva: 4.0, espaco_com_bola: 4.0, espaco_sem_bola: 4.0, mobilidade: 4.0, unidade_ofensiva: 4.0 },
}
const defPorCategoria: Record<string, V> = {
  'U11': { contencao: 2.5, cobertura_defensiva: 2.0, equilibrio_recuperacao: 2.0, equilibrio_defensivo: 2.0, concentracao_def: 2.5, unidade_defensiva: 2.0 },
  'U12': { contencao: 2.5, cobertura_defensiva: 2.5, equilibrio_recuperacao: 2.5, equilibrio_defensivo: 2.5, concentracao_def: 3.0, unidade_defensiva: 2.5 },
  'U13': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.0, equilibrio_defensivo: 3.0, concentracao_def: 3.0, unidade_defensiva: 3.0 },
  'U14': { contencao: 3.0, cobertura_defensiva: 3.0, equilibrio_recuperacao: 3.0, equilibrio_defensivo: 3.0, concentracao_def: 3.5, unidade_defensiva: 3.0 },
  'U15': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 3.5, concentracao_def: 3.5, unidade_defensiva: 3.5 },
  'U16': { contencao: 3.5, cobertura_defensiva: 3.5, equilibrio_recuperacao: 3.5, equilibrio_defensivo: 4.0, concentracao_def: 4.0, unidade_defensiva: 4.0 },
  'U17': { contencao: 4.0, cobertura_defensiva: 4.0, equilibrio_recuperacao: 4.0, equilibrio_defensivo: 4.0, concentracao_def: 4.0, unidade_defensiva: 4.0 },
}

// Categoria (U11–U17) a partir da data de nascimento; usa o campo categoria se vier preenchido.
export function calcularCategoria(dataNascimento: string | null, categoriaField?: string | null): string {
  if (categoriaField && /^U\d{2}$/.test(categoriaField)) return categoriaField
  if (!dataNascimento) return 'U17'
  const hoje = new Date()
  const nasc = new Date(dataNascimento + 'T12:00:00')
  const idade = hoje.getFullYear() - nasc.getFullYear()
  if (idade <= 10) return 'U11'
  if (idade === 11) return 'U12'
  if (idade === 12) return 'U13'
  if (idade === 13) return 'U14'
  if (idade === 14) return 'U15'
  if (idade === 15) return 'U16'
  return 'U17'
}

// Combina categoria (nível esperado da fase) com posição (o que a função exige).
function combinar(cat: V, pos: V | null): V {
  if (!pos) return cat
  const out: V = {}
  for (const k of Object.keys(cat)) {
    const proporcao = pos[k] / 4.5
    out[k] = Math.min(5, Number((cat[k] * proporcao * 1.1).toFixed(1)))
  }
  return out
}

export function obterBenchmark(posicao: string | null, categoria: string): Record<DimKey, number> {
  const cbf = combinar(cbfPorCategoria[categoria] || cbfPorCategoria['U17'], posicao ? cbfPorPosicao[posicao] : null)
  const ofe = combinar(ofePorCategoria[categoria] || ofePorCategoria['U17'], posicao ? ofePorPosicao[posicao] : null)
  const def = combinar(defPorCategoria[categoria] || defPorCategoria['U17'], posicao ? defPorPosicao[posicao] : null)
  return { ...cbf, ...ofe, ...def } as Record<DimKey, number>
}

export type StatusBench = 'acima' | 'dentro' | 'abaixo'
export type ComparacaoBenchmark = {
  disponivel: boolean
  categoria: string
  posicao: string
  dimensoes: { key: DimKey; label: string; short: string; grupo: Grupo; valor: number; benchmark: number; diferenca: number; status: StatusBench }[]
  grupos: Record<Grupo, { atleta: number; benchmark: number }>
  mediaAtleta: number
  mediaBenchmark: number
  diferencaMedia: number
  acima: number
  dentro: number
  abaixo: number
}

const media = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)

export function compararComBenchmark(
  valores: Partial<Record<DimKey, number>>,
  posicao: string | null,
  dataNascimento: string | null,
  categoriaField?: string | null
): ComparacaoBenchmark {
  const categoria = calcularCategoria(dataNascimento, categoriaField)
  const bench = obterBenchmark(posicao, categoria)
  const dims = DIMS_20.map(d => {
    const valor = Number(valores[d.key]) || 0
    const benchmark = bench[d.key]
    const diferenca = valor - benchmark
    const status: StatusBench = diferenca >= 0.5 ? 'acima' : diferenca <= -0.5 ? 'abaixo' : 'dentro'
    return { ...d, valor, benchmark, diferenca, status }
  }).filter(d => d.valor > 0)

  const porGrupo = (g: Grupo) => {
    const arr = dims.filter(d => d.grupo === g)
    return { atleta: media(arr.map(d => d.valor)), benchmark: media(arr.map(d => d.benchmark)) }
  }
  const mediaAtleta = media(dims.map(d => d.valor))
  const mediaBenchmark = media(dims.map(d => d.benchmark))
  return {
    disponivel: dims.length > 0,
    categoria,
    posicao: posicao || '—',
    dimensoes: dims,
    grupos: { CBF: porGrupo('CBF'), OFE: porGrupo('OFE'), DEF: porGrupo('DEF') },
    mediaAtleta,
    mediaBenchmark,
    diferencaMedia: mediaAtleta - mediaBenchmark,
    acima: dims.filter(d => d.status === 'acima').length,
    dentro: dims.filter(d => d.status === 'dentro').length,
    abaixo: dims.filter(d => d.status === 'abaixo').length,
  }
}
