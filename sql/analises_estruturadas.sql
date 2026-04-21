-- =====================================================
-- MIGRAÇÃO: Campos Estruturados para Análises de Jogo
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- =====================================================

-- Primeiro, alterar campos de observação existentes para TEXT
ALTER TABLE analises_jogo
  ALTER COLUMN org_ofensiva_obs TYPE TEXT,
  ALTER COLUMN org_defensiva_obs TYPE TEXT,
  ALTER COLUMN trans_ofensiva_obs TYPE TEXT,
  ALTER COLUMN trans_defensiva_obs TYPE TEXT,
  ALTER COLUMN conclusoes TYPE TEXT,
  ALTER COLUMN recomendacoes_treino TYPE TEXT,
  ALTER COLUMN escanteio_movimentacoes TYPE TEXT,
  ALTER COLUMN faltas_caracteristicas TYPE TEXT,
  ALTER COLUMN bp_vulnerabilidades TYPE TEXT;

-- =====================================================
-- ORGANIZAÇÃO OFENSIVA - Campos Estruturados
-- =====================================================

-- Saída de Bola (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS saida_bola_tipo VARCHAR(20);
-- Valores: 'curta', 'longa', 'mista'

-- Participação do Goleiro (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS participacao_gk_nivel VARCHAR(20);
-- Valores: 'alta', 'media', 'baixa'

-- Lado Preferencial de Criação (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS lado_preferencial VARCHAR(20);
-- Valores: 'central', 'direita', 'esquerda', 'equilibrado'

-- Qualidade de Criação (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS qualidade_criacao INTEGER DEFAULT 0;

-- Posse de Bola Estimada (%)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS posse_bola INTEGER DEFAULT 0;

-- =====================================================
-- ORGANIZAÇÃO DEFENSIVA - Campos Estruturados
-- =====================================================

-- Tipo de Marcação (select) - já pode existir como texto, vamos padronizar
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS marcacao_tipo VARCHAR(20);
-- Valores: 'individual', 'zona', 'mista'

-- Intensidade da Pressão (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS pressao_intensidade INTEGER DEFAULT 0;

-- Altura da Linha Defensiva (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS linha_defensiva_altura VARCHAR(20);
-- Valores: 'alta', 'media', 'baixa'

-- Compactação do Bloco (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS compactacao_bloco INTEGER DEFAULT 0;

-- Duelos Defensivos Ganhos (%)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS duelos_defensivos_pct INTEGER DEFAULT 0;

-- =====================================================
-- TRANSIÇÃO OFENSIVA - Campos Estruturados
-- =====================================================

-- Primeira Ação (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS primeira_acao_tipo VARCHAR(30);
-- Valores: 'bola_longa', 'conducao', 'passe_curto', 'diagonal'

-- Velocidade da Transição (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS trans_ofensiva_velocidade INTEGER DEFAULT 0;

-- Efetividade da Transição (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS trans_ofensiva_efetividade INTEGER DEFAULT 0;

-- Jogadores Envolvidos (número médio)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS trans_ofensiva_jogadores INTEGER DEFAULT 0;

-- =====================================================
-- TRANSIÇÃO DEFENSIVA - Campos Estruturados
-- =====================================================

-- Reação à Perda (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS reacao_perda_tipo VARCHAR(30);
-- Valores: 'pressao_imediata', 'recuo_organizado', 'mista'

-- Velocidade de Recomposição (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS trans_defensiva_velocidade INTEGER DEFAULT 0;

-- Tempo Médio de Reação (segundos)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS tempo_reacao_segundos INTEGER DEFAULT 0;

-- =====================================================
-- BOLAS PARADAS OFENSIVAS - Campos Estruturados
-- =====================================================

-- Escanteios Cobrados (número)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS escanteios_total INTEGER DEFAULT 0;

-- Escanteios Perigosos (número)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS escanteios_perigosos INTEGER DEFAULT 0;

-- Tipo de Cobrança Preferencial (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS escanteio_tipo_cobranca VARCHAR(20);
-- Valores: 'fechado', 'aberto', 'rasteiro', 'curto'

-- Faltas na Área (número)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS faltas_area INTEGER DEFAULT 0;

-- Gols de Bola Parada
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS gols_bola_parada INTEGER DEFAULT 0;

-- =====================================================
-- BOLAS PARADAS DEFENSIVAS - Campos Estruturados
-- =====================================================

-- Marcação em BP (select)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS bp_def_marcacao_tipo VARCHAR(20);
-- Valores: 'individual', 'zona', 'mista'

-- Solidez Defensiva BP (escala 1-5)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS bp_def_solidez INTEGER DEFAULT 0;

-- Gols Sofridos de BP
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS gols_sofridos_bp INTEGER DEFAULT 0;

-- =====================================================
-- MÉTRICAS GERAIS
-- =====================================================

-- Nota Geral do Jogo (escala 1-10)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS nota_geral DECIMAL(3,1) DEFAULT 0;

-- Índice Ofensivo (calculado, escala 1-10)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS indice_ofensivo DECIMAL(3,1) DEFAULT 0;

-- Índice Defensivo (calculado, escala 1-10)
ALTER TABLE analises_jogo
  ADD COLUMN IF NOT EXISTS indice_defensivo DECIMAL(3,1) DEFAULT 0;

-- =====================================================
-- REMOVER CAMPOS ANTIGOS DE TEXTO (opcional)
-- Descomente se quiser remover após migrar os dados
-- =====================================================

-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS saida_bola;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS participacao_goleiro;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS linhas_passe;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS amplitude;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS criacao_central;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS criacao_direita;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS criacao_esquerda;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS tipo_marcacao;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS pressao;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS coberturas;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS linha_defensiva;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS vulnerabilidades;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS primeira_acao;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS velocidade_transicao;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS reacao_perda;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS tempo_reacao;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS escanteio_cobrador;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS escanteio_tipo;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS escanteio_def_marcacao;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS escanteio_def_posicao_gk;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS escanteio_def_primeiro_pau;
-- ALTER TABLE analises_jogo DROP COLUMN IF EXISTS escanteio_def_segundo_pau;

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
