// Faixas etarias da avaliacao rapida (modulo Escolinha).
// Decisao do analista em 2026-09-15: dimensoes MUDAM por faixa etaria.
// Menino de 7 anos nao mede as mesmas coisas que menino de 13 — avaliar
// tatica no pequeno e' bobagem; foco e' motor + relacao com bola + comportamento.
//
// Este arquivo e' a FONTE UNICA das dimensoes por faixa: mudar aqui muda
// a tela de avaliacao rapida e (no futuro) o boletim. Nao inventar
// dimensao/faixa fora daqui.

export type FaixaKey = 'descoberta' | 'aprendizado' | 'aperfeicoamento' | 'formacao'

export type DimensaoFaixa = {
  key: string
  label: string
  descricao: string
}

export type Faixa = {
  key: FaixaKey
  label: string
  idadeMin: number
  idadeMax: number // inclusive; usar 999 para "sem teto"
  cor: string // hex, tema claro; usado no cabecalho/badge
  descricao: string
  dimensoes: DimensaoFaixa[]
}

export const FAIXAS: Faixa[] = [
  {
    key: 'descoberta',
    label: 'Descoberta',
    idadeMin: 5,
    idadeMax: 7,
    cor: '#10b981', // emerald
    descricao: 'Ainda aprendendo A JOGAR. Foco: motor, relacao com bola, comportamento.',
    dimensoes: [
      { key: 'coordenacao_motora', label: 'Coordenação motora', descricao: 'Corre, freia, muda de direção sem cair.' },
      { key: 'relacao_bola', label: 'Relação com a bola', descricao: 'Não foge, mantém perto do pé, tenta dominar.' },
      { key: 'chute_basico', label: 'Chute', descricao: 'Bate na bola com direção, alcance mínimo.' },
      { key: 'participacao', label: 'Participação', descricao: 'Entra no jogo, tenta a bola, não fica de fora.' },
      { key: 'comportamento', label: 'Comportamento', descricao: 'Ouve o professor, respeita regras, não desiste.' },
    ],
  },
  {
    key: 'aprendizado',
    label: 'Aprendizado',
    idadeMin: 8,
    idadeMax: 10,
    cor: '#f59e0b', // amber
    descricao: 'Ja tem tecnica de verdade e jogo coletivo basico. La Masia/Coerver focam pesado aqui em domínio e conducao.',
    dimensoes: [
      { key: 'dominio', label: 'Domínio de bola', descricao: 'Recebe e controla, primeiro toque.' },
      { key: 'passe_curto', label: 'Passe curto', descricao: 'Acerta o companheiro parado ou em movimento.' },
      { key: 'conducao', label: 'Condução', descricao: 'Leva a bola em espaço aberto, muda direção.' },
      { key: 'chute_gol', label: 'Chute ao gol', descricao: 'Direção acima de força.' },
      { key: 'atencao_jogo', label: 'Atenção no jogo', descricao: 'Levanta a cabeça, vê o colega, vê o espaço.' },
      { key: 'atitude_basica', label: 'Atitude', descricao: 'Esforço, entrega, participação.' },
    ],
  },
  {
    key: 'aperfeicoamento',
    label: 'Aperfeiçoamento',
    idadeMin: 11,
    idadeMax: 13,
    cor: '#0891b2', // cyan
    descricao: 'Entra jogo de posicao, tatica basica, decisao em velocidade.',
    dimensoes: [
      { key: 'dominio_orientado', label: 'Domínio orientado', descricao: 'Primeiro toque direcionado ao próximo passo.' },
      { key: 'passe', label: 'Passe', descricao: 'Curto e médio, com peso e direção.' },
      { key: 'finalizacao', label: 'Finalização', descricao: 'Força + precisão.' },
      { key: 'um_x_um', label: '1 contra 1', descricao: 'Drible ofensivo / marcação defensiva.' },
      { key: 'inteligencia_jogo', label: 'Inteligência de jogo', descricao: 'Escolha entre driblar, passar, chutar.' },
      { key: 'movimentacao_sem_bola', label: 'Movimentação sem bola', descricao: 'Busca espaço, faz linha de passe.' },
      { key: 'velocidade_com_bola', label: 'Velocidade', descricao: 'Com e sem bola.' },
      { key: 'atitude_coletiva', label: 'Atitude', descricao: 'Concentração, jogo coletivo, entrega.' },
    ],
  },
  {
    key: 'formacao',
    label: 'Formação',
    idadeMin: 14,
    idadeMax: 999,
    cor: '#d97706', // amber-strong
    descricao: 'Modelo profissional. As 8 dimensoes CBF do sistema completo.',
    dimensoes: [
      { key: 'forca', label: 'Força', descricao: 'Força fisica e mental nos duelos.' },
      { key: 'velocidade', label: 'Velocidade', descricao: 'Explosao, aceleracao, arranque.' },
      { key: 'tecnica', label: 'Técnica', descricao: 'Domínio, passe, chute, condução.' },
      { key: 'dinamica', label: 'Dinâmica', descricao: 'Ritmo de jogo, intensidade.' },
      { key: 'inteligencia', label: 'Inteligência', descricao: 'Leitura de jogo, escolhas.' },
      { key: 'um_contra_um', label: '1 contra 1', descricao: 'Encara, dribla, ganha duelos.' },
      { key: 'atitude', label: 'Atitude', descricao: 'Entrega, foco, esforço.' },
      { key: 'potencial', label: 'Potencial', descricao: 'Margem de evolucao percebida.' },
    ],
  },
]

// Descobre a faixa a partir da idade (em anos, inteiro). Fora do intervalo, grampeia nas pontas.
export function faixaPorIdade(idadeAnos: number | null): Faixa {
  if (idadeAnos == null) return FAIXAS[FAIXAS.length - 1] // sem data -> Formacao (padrao antigo)
  const f = FAIXAS.find(x => idadeAnos >= x.idadeMin && idadeAnos <= x.idadeMax)
  if (f) return f
  if (idadeAnos < FAIXAS[0].idadeMin) return FAIXAS[0]
  return FAIXAS[FAIXAS.length - 1]
}

// Idade em anos (inteiro) numa data de referencia. Usa hoje por padrao.
export function idadeAnosEm(dataNascimento: string | null, dataRef?: string): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento + 'T12:00:00')
  const ref = dataRef ? new Date(dataRef + 'T12:00:00') : new Date()
  if (isNaN(nasc.getTime()) || isNaN(ref.getTime())) return null
  let idade = ref.getFullYear() - nasc.getFullYear()
  const m = ref.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && ref.getDate() < nasc.getDate())) idade--
  return idade
}

// Escala 1-5, mesma em todas as faixas.
export const ESCALA: { valor: number; label: string }[] = [
  { valor: 1, label: 'Muito abaixo do esperado' },
  { valor: 2, label: 'Abaixo do esperado' },
  { valor: 3, label: 'Dentro do esperado' },
  { valor: 4, label: 'Acima do esperado' },
  { valor: 5, label: 'Destaque, muito acima' },
]
