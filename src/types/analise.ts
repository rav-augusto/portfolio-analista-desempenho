export type Jogo = {
  id: string
  adversario: string
  data_jogo: string
  competicao: string
  fase: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

export type Print = {
  id: string
  imagem_url: string
  descricao: string | null
  momento: string | null
  tempo_jogo: string | null
}

export type AnaliseState = {
  // Organizacao Ofensiva
  sistema_tatico: string
  saida_bola_tipo: string
  participacao_gk_nivel: string
  lado_preferencial: string
  qualidade_criacao: number
  posse_bola: number
  finalizacoes_total: number
  finalizacoes_gol: number
  finalizacoes_fora: number
  finalizacoes_bloqueadas: number
  finalizacoes_dentro_area: number
  finalizacoes_fora_area: number
  grandes_chances: number
  grandes_chances_perdidas: number
  cruzamentos_total: number
  cruzamentos_certos: number
  passes_total: number
  passes_certos: number
  passes_terco_final: number
  passes_progressivos: number
  conducoes_progressivas: number
  entradas_area: number
  org_ofensiva_obs: string

  // Organizacao Defensiva
  bloco_defensivo: string
  marcacao_tipo: string
  pressao_intensidade: number
  linha_defensiva_altura: string
  compactacao_bloco: number
  duelos_defensivos_pct: number
  recuperacoes_bola: number
  recuperacoes_terco_ofensivo: number
  interceptacoes: number
  desarmes: number
  desarmes_certos: number
  duelos_total: number
  duelos_ganhos: number
  duelos_aereos_total: number
  duelos_aereos_ganhos: number
  faltas_cometidas: number
  cartoes_amarelos: number
  cartoes_vermelhos: number
  org_defensiva_obs: string

  // Transicao Ofensiva
  primeira_acao_tipo: string
  trans_ofensiva_velocidade: number
  trans_ofensiva_efetividade: number
  trans_ofensiva_jogadores: number
  contra_ataques: number
  contra_ataques_finalizados: number
  gols_contra_ataque: number
  acoes_pos_perda: number
  acoes_pos_perda_sucesso: number
  contra_ataques_sofridos: number
  gols_sofridos_contra_ataque: number
  trans_ofensiva_obs: string

  // Transicao Defensiva
  reacao_perda_tipo: string
  trans_defensiva_velocidade: number
  tempo_reacao_segundos: number
  trans_defensiva_obs: string

  // Bolas Paradas Ofensivas
  escanteios_total: number
  escanteios_perigosos: number
  escanteio_tipo_cobranca: string
  escanteios_curto: number
  escanteios_longo: number
  faltas_area: number
  faltas_diretas: number
  faltas_cruzadas: number
  penaltis_favor: number
  penaltis_convertidos: number
  laterais_total: number
  laterais_ofensivos: number
  gols_bola_parada: number
  bp_ofensiva_obs: string

  // Bolas Paradas Defensivas
  bp_def_marcacao_tipo: string
  bp_def_solidez: number
  gols_sofridos_bp: number
  escanteios_contra: number
  faltas_contra_area: number
  penaltis_contra: number
  penaltis_defendidos: number
  bp_defensiva_obs: string

  // Goleiro
  defesas_total: number
  defesas_dificeis: number
  saidas_gol: number
  passes_gk_total: number
  passes_gk_certos: number

  // Posse e Territorio
  posse_terco_defensivo: number
  posse_terco_medio: number
  posse_terco_ofensivo: number
  campo_ofensivo_pct: number

  // Intensidade (GPS)
  distancia_total: number
  sprints: number
  alta_intensidade_metros: number

  // Eficiencia
  xg_favor: number
  xg_contra: number
  ppda: number

  // Geral
  nota_geral: number
  indice_ofensivo: number
  indice_defensivo: number
  conclusoes: string
  recomendacoes_treino: string
  pontos_fortes: string
  pontos_fracos: string
  jogadores_destaque: string

  // Adversario
  adv_finalizacoes_total: number
  adv_finalizacoes_gol: number
  adv_finalizacoes_fora: number
  adv_finalizacoes_bloqueadas: number
  adv_passes_total: number
  adv_passes_certos: number
  adv_faltas_cometidas: number
  adv_cartoes_amarelos: number
  adv_cartoes_vermelhos: number
  adv_escanteios: number
  adv_impedimentos: number
  adv_posse_bola: number
  impedimentos: number
}

export type AnaliseAction =
  | { type: 'SET_FIELD'; field: keyof AnaliseState; value: string | number }
  | { type: 'LOAD_DATA'; data: Partial<AnaliseState> }
  | { type: 'RESET' }

export const initialAnaliseState: AnaliseState = {
  // Organizacao Ofensiva
  sistema_tatico: '',
  saida_bola_tipo: '',
  participacao_gk_nivel: '',
  lado_preferencial: '',
  qualidade_criacao: 0,
  posse_bola: 0,
  finalizacoes_total: 0,
  finalizacoes_gol: 0,
  finalizacoes_fora: 0,
  finalizacoes_bloqueadas: 0,
  finalizacoes_dentro_area: 0,
  finalizacoes_fora_area: 0,
  grandes_chances: 0,
  grandes_chances_perdidas: 0,
  cruzamentos_total: 0,
  cruzamentos_certos: 0,
  passes_total: 0,
  passes_certos: 0,
  passes_terco_final: 0,
  passes_progressivos: 0,
  conducoes_progressivas: 0,
  entradas_area: 0,
  org_ofensiva_obs: '',

  // Organizacao Defensiva
  bloco_defensivo: '',
  marcacao_tipo: '',
  pressao_intensidade: 0,
  linha_defensiva_altura: '',
  compactacao_bloco: 0,
  duelos_defensivos_pct: 0,
  recuperacoes_bola: 0,
  recuperacoes_terco_ofensivo: 0,
  interceptacoes: 0,
  desarmes: 0,
  desarmes_certos: 0,
  duelos_total: 0,
  duelos_ganhos: 0,
  duelos_aereos_total: 0,
  duelos_aereos_ganhos: 0,
  faltas_cometidas: 0,
  cartoes_amarelos: 0,
  cartoes_vermelhos: 0,
  org_defensiva_obs: '',

  // Transicao Ofensiva
  primeira_acao_tipo: '',
  trans_ofensiva_velocidade: 0,
  trans_ofensiva_efetividade: 0,
  trans_ofensiva_jogadores: 0,
  contra_ataques: 0,
  contra_ataques_finalizados: 0,
  gols_contra_ataque: 0,
  acoes_pos_perda: 0,
  acoes_pos_perda_sucesso: 0,
  contra_ataques_sofridos: 0,
  gols_sofridos_contra_ataque: 0,
  trans_ofensiva_obs: '',

  // Transicao Defensiva
  reacao_perda_tipo: '',
  trans_defensiva_velocidade: 0,
  tempo_reacao_segundos: 0,
  trans_defensiva_obs: '',

  // Bolas Paradas Ofensivas
  escanteios_total: 0,
  escanteios_perigosos: 0,
  escanteio_tipo_cobranca: '',
  escanteios_curto: 0,
  escanteios_longo: 0,
  faltas_area: 0,
  faltas_diretas: 0,
  faltas_cruzadas: 0,
  penaltis_favor: 0,
  penaltis_convertidos: 0,
  laterais_total: 0,
  laterais_ofensivos: 0,
  gols_bola_parada: 0,
  bp_ofensiva_obs: '',

  // Bolas Paradas Defensivas
  bp_def_marcacao_tipo: '',
  bp_def_solidez: 0,
  gols_sofridos_bp: 0,
  escanteios_contra: 0,
  faltas_contra_area: 0,
  penaltis_contra: 0,
  penaltis_defendidos: 0,
  bp_defensiva_obs: '',

  // Goleiro
  defesas_total: 0,
  defesas_dificeis: 0,
  saidas_gol: 0,
  passes_gk_total: 0,
  passes_gk_certos: 0,

  // Posse e Territorio
  posse_terco_defensivo: 0,
  posse_terco_medio: 0,
  posse_terco_ofensivo: 0,
  campo_ofensivo_pct: 0,

  // Intensidade (GPS)
  distancia_total: 0,
  sprints: 0,
  alta_intensidade_metros: 0,

  // Eficiencia
  xg_favor: 0,
  xg_contra: 0,
  ppda: 0,

  // Geral
  nota_geral: 0,
  indice_ofensivo: 0,
  indice_defensivo: 0,
  conclusoes: '',
  recomendacoes_treino: '',
  pontos_fortes: '',
  pontos_fracos: '',
  jogadores_destaque: '',

  // Adversario
  adv_finalizacoes_total: 0,
  adv_finalizacoes_gol: 0,
  adv_finalizacoes_fora: 0,
  adv_finalizacoes_bloqueadas: 0,
  adv_passes_total: 0,
  adv_passes_certos: 0,
  adv_faltas_cometidas: 0,
  adv_cartoes_amarelos: 0,
  adv_cartoes_vermelhos: 0,
  adv_escanteios: 0,
  adv_impedimentos: 0,
  adv_posse_bola: 0,
  impedimentos: 0,
}

export function analiseReducer(state: AnaliseState, action: AnaliseAction): AnaliseState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'LOAD_DATA':
      return { ...state, ...action.data }
    case 'RESET':
      return initialAnaliseState
    default:
      return state
  }
}
