// Perfil ponderado por posição: cada função pesa as 20 dimensões de forma diferente.
// Um atacante valoriza finalização/1v1; um zagueiro valoriza contenção/duelo.
// Gera a "aderência ao perfil" — o quanto o atleta atende ao que a posição exige.

export type DimKey =
  | 'forca' | 'velocidade' | 'tecnica' | 'dinamica' | 'inteligencia' | 'um_contra_um' | 'atitude' | 'potencial'
  | 'penetracao' | 'cobertura_ofensiva' | 'espaco_com_bola' | 'espaco_sem_bola' | 'mobilidade' | 'unidade_ofensiva'
  | 'contencao' | 'cobertura_defensiva' | 'equilibrio_recuperacao' | 'equilibrio_defensivo' | 'concentracao_def' | 'unidade_defensiva'

export const DIM_LABEL: Record<DimKey, string> = {
  forca: 'Força', velocidade: 'Velocidade', tecnica: 'Técnica', dinamica: 'Dinâmica',
  inteligencia: 'Inteligência', um_contra_um: '1 contra 1', atitude: 'Atitude', potencial: 'Potencial',
  penetracao: 'Penetração', cobertura_ofensiva: 'Cob. Ofensiva', espaco_com_bola: 'Espaço c/ Bola',
  espaco_sem_bola: 'Espaço s/ Bola', mobilidade: 'Mobilidade', unidade_ofensiva: 'Unid. Ofensiva',
  contencao: 'Contenção', cobertura_defensiva: 'Cob. Defensiva', equilibrio_recuperacao: 'Equil. Recuperação',
  equilibrio_defensivo: 'Equil. Defensivo', concentracao_def: 'Concentração', unidade_defensiva: 'Unid. Defensiva',
}

const DIMS = Object.keys(DIM_LABEL) as DimKey[]

type Arquetipo = 'GK' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'MEI_OFE' | 'PON' | 'ATA' | 'GERAL'

const LABEL_ARQ: Record<Arquetipo, string> = {
  GK: 'Goleiro', ZAG: 'Zagueiro', LAT: 'Lateral', VOL: 'Volante',
  MEI: 'Meio-campo', MEI_OFE: 'Meia atacante', PON: 'Ponta', ATA: 'Atacante', GERAL: 'Geral',
}

// Pesos (0.3 = pouco relevante, 3 = essencial). Base 1.0 para o que não for citado.
const PESOS: Record<Arquetipo, Partial<Record<DimKey, number>>> = {
  GK: { inteligencia: 2.5, concentracao_def: 2.5, atitude: 2, cobertura_defensiva: 2, equilibrio_defensivo: 1.8, tecnica: 1.8, um_contra_um: 1.5, forca: 1.5, contencao: 1.5, penetracao: 0.3, cobertura_ofensiva: 0.4, espaco_com_bola: 0.4, espaco_sem_bola: 0.3, mobilidade: 0.4, unidade_ofensiva: 0.5, dinamica: 0.7 },
  ZAG: { contencao: 3, cobertura_defensiva: 3, concentracao_def: 2.5, equilibrio_defensivo: 2.5, forca: 2.5, inteligencia: 2.3, um_contra_um: 2, unidade_defensiva: 2, atitude: 2, equilibrio_recuperacao: 1.8, tecnica: 1.6, velocidade: 1.6, espaco_com_bola: 1.3, penetracao: 0.4, mobilidade: 0.4, espaco_sem_bola: 0.6, unidade_ofensiva: 0.7, cobertura_ofensiva: 0.8 },
  LAT: { velocidade: 2.5, dinamica: 2.5, um_contra_um: 2.2, cobertura_ofensiva: 2.2, equilibrio_recuperacao: 2.2, penetracao: 2, contencao: 2, cobertura_defensiva: 2, tecnica: 2, espaco_sem_bola: 2, mobilidade: 1.8, concentracao_def: 1.8, atitude: 1.8, forca: 1.2 },
  VOL: { inteligencia: 3, contencao: 2.8, equilibrio_recuperacao: 2.8, cobertura_defensiva: 2.3, tecnica: 2.3, dinamica: 2.3, unidade_defensiva: 2, equilibrio_defensivo: 2, concentracao_def: 2, atitude: 2, unidade_ofensiva: 1.8, penetracao: 0.8, mobilidade: 0.8, espaco_sem_bola: 1 },
  MEI: { tecnica: 3, inteligencia: 3, dinamica: 2.5, espaco_com_bola: 2.5, cobertura_ofensiva: 2.2, unidade_ofensiva: 2.2, equilibrio_recuperacao: 2, um_contra_um: 2, penetracao: 1.8, atitude: 1.8, contencao: 1.5, mobilidade: 1.6 },
  MEI_OFE: { tecnica: 3, inteligencia: 2.8, um_contra_um: 2.6, espaco_com_bola: 2.6, penetracao: 2.5, espaco_sem_bola: 2.3, mobilidade: 2.3, unidade_ofensiva: 2, velocidade: 2, atitude: 1.8, contencao: 0.7, cobertura_defensiva: 0.7, equilibrio_defensivo: 0.8, concentracao_def: 0.9 },
  PON: { um_contra_um: 3, velocidade: 3, penetracao: 2.8, mobilidade: 2.6, espaco_sem_bola: 2.5, tecnica: 2.4, espaco_com_bola: 2.2, dinamica: 2, atitude: 1.8, forca: 1, contencao: 0.4, cobertura_defensiva: 0.5, equilibrio_defensivo: 0.5, concentracao_def: 0.7 },
  ATA: { penetracao: 3, espaco_sem_bola: 2.8, um_contra_um: 2.6, mobilidade: 2.6, velocidade: 2.3, forca: 2.2, tecnica: 2.2, atitude: 2, espaco_com_bola: 2, inteligencia: 2, cobertura_ofensiva: 1, contencao: 0.3, cobertura_defensiva: 0.4, equilibrio_defensivo: 0.4, equilibrio_recuperacao: 0.6, concentracao_def: 0.6 },
  GERAL: {},
}

// Converte a posição (texto livre) num arquétipo.
export function arquetipoDaPosicao(posicao: string | null | undefined): Arquetipo {
  const p = (posicao || '').toLowerCase()
  if (!p) return 'GERAL'
  if (p.includes('gole')) return 'GK'
  if (p.includes('lateral') || p.includes('ala')) return 'LAT'
  if (p.includes('zag')) return 'ZAG'
  if (p.includes('volan')) return 'VOL'
  if (p.includes('ponta') || p.includes('extrem')) return 'PON'
  if (p.includes('meia') && p.includes('ataca')) return 'MEI_OFE'
  if (p.includes('meia') || p.includes('meio') || p.includes('mei')) return 'MEI'
  if (p.includes('centroavante') || p.includes('atacante') || p.includes('ataca')) return 'ATA'
  return 'GERAL'
}

const pesoDe = (arq: Arquetipo, k: DimKey) => PESOS[arq][k] ?? 1

export type AderenciaPosicao = {
  disponivel: boolean
  grupo: Arquetipo
  grupoLabel: string
  posicao: string
  nota: number // 0–5 (ponderada)
  notaFlat: number // 0–5 (média simples, p/ comparar)
  classificacao: string
  // Exigências da posição: dimensões mais importantes p/ a função, com a nota do atleta.
  requisitos: { chave: DimKey; label: string; valor: number; peso: number }[]
}

export function classificarAderencia(nota: number): string {
  if (nota >= 4.2) return 'Excelente'
  if (nota >= 3.5) return 'Muito bom'
  if (nota >= 3) return 'Bom'
  if (nota >= 2.5) return 'Regular'
  return 'Abaixo'
}

// valores: nota (1–5) de cada dimensão. Zeros/ausentes são ignorados.
export function calcularAderenciaPosicao(
  valores: Partial<Record<DimKey, number>>,
  posicao: string | null | undefined
): AderenciaPosicao {
  const grupo = arquetipoDaPosicao(posicao)
  const presentes = DIMS.filter((k) => typeof valores[k] === 'number' && (valores[k] as number) > 0)
  if (presentes.length === 0) {
    return { disponivel: false, grupo, grupoLabel: LABEL_ARQ[grupo], posicao: posicao || '—', nota: 0, notaFlat: 0, classificacao: '—', requisitos: [] }
  }
  let somaPond = 0, somaPesos = 0, somaFlat = 0
  for (const k of presentes) {
    const v = valores[k] as number
    const w = pesoDe(grupo, k)
    somaPond += v * w
    somaPesos += w
    somaFlat += v
  }
  const nota = somaPesos ? somaPond / somaPesos : 0
  const notaFlat = somaFlat / presentes.length
  const requisitos = DIMS
    .map((k) => ({ chave: k, label: DIM_LABEL[k], valor: valores[k] ?? 0, peso: pesoDe(grupo, k) }))
    .filter((r) => r.valor > 0) // não mostrar exigência com nota 0 (dimensão não avaliada)
    .sort((a, b) => b.peso - a.peso)
    .slice(0, 6)
  return {
    disponivel: true,
    grupo,
    grupoLabel: LABEL_ARQ[grupo],
    posicao: posicao || '—',
    nota: Math.round(nota * 100) / 100,
    notaFlat: Math.round(notaFlat * 100) / 100,
    classificacao: classificarAderencia(nota),
    requisitos,
  }
}
