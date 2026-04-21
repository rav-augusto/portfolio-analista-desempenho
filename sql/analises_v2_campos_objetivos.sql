-- =====================================================
-- REESTRUTURAÇÃO: Análise de Jogos v2
-- Baseado na metodologia CBF Academy
-- Campos mais objetivos e quantitativos
-- =====================================================

-- ORGANIZAÇÃO OFENSIVA - Dados Quantitativos
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS finalizacoes_dentro_area INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS finalizacoes_fora_area INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS grandes_chances INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS grandes_chances_perdidas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS cruzamentos_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS cruzamentos_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_terco_final INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_progressivos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS conducoes_progressivas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS entradas_area INTEGER DEFAULT 0;

-- ORGANIZAÇÃO DEFENSIVA - Dados Quantitativos
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS recuperacoes_bola INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS recuperacoes_terco_ofensivo INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS interceptacoes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS desarmes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS desarmes_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS duelos_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS duelos_ganhos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS duelos_aereos_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS duelos_aereos_ganhos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS faltas_cometidas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS cartoes_amarelos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS cartoes_vermelhos INTEGER DEFAULT 0;

-- TRANSIÇÕES - Dados Quantitativos
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS acoes_pos_perda INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS acoes_pos_perda_sucesso INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS contra_ataques_sofridos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS gols_sofridos_contra_ataque INTEGER DEFAULT 0;

-- BOLAS PARADAS OFENSIVAS - Detalhado
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS escanteios_curto INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS escanteios_longo INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS faltas_diretas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS faltas_cruzadas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_favor INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_convertidos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS laterais_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS laterais_ofensivos INTEGER DEFAULT 0;

-- BOLAS PARADAS DEFENSIVAS - Detalhado
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS escanteios_contra INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS faltas_contra_area INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_contra INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_defendidos INTEGER DEFAULT 0;

-- GOLEIRO
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS defesas_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS defesas_dificeis INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS saidas_gol INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_gk_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_gk_certos INTEGER DEFAULT 0;

-- POSSE E TERRITÓRIO
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_terco_defensivo INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_terco_medio INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_terco_ofensivo INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS campo_ofensivo_pct INTEGER DEFAULT 0;

-- INTENSIDADE (se tiver dados de GPS/tracking)
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS distancia_total DECIMAL(6,2);
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS sprints INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS alta_intensidade_metros INTEGER DEFAULT 0;

-- EFICIÊNCIA (calculados)
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS xg_favor DECIMAL(4,2);
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS xg_contra DECIMAL(4,2);
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS ppda DECIMAL(4,2); -- Passes per Defensive Action

-- OBSERVAÇÕES POR MOMENTO (texto para análise qualitativa)
-- Já existem: org_ofensiva_obs, org_defensiva_obs, trans_ofensiva_obs, trans_defensiva_obs

-- PONTOS FORTES E FRACOS (resumo executivo)
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS pontos_fortes TEXT;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS pontos_fracos TEXT;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS jogadores_destaque TEXT;

-- =====================================================
-- COMENTÁRIOS SOBRE OS CAMPOS
-- =====================================================
--
-- CAMPOS OBRIGATÓRIOS (fáceis de coletar via vídeo):
-- - Finalizações (dentro/fora área)
-- - Escanteios
-- - Faltas
-- - Cartões
-- - Gols
-- - Sistema tático
-- - Bloco defensivo
--
-- CAMPOS INTERMEDIÁRIOS (requer atenção):
-- - Cruzamentos
-- - Recuperações de bola
-- - Duelos
-- - Passes (se tiver acesso a dados)
--
-- CAMPOS AVANÇADOS (requer plataforma de dados):
-- - xG
-- - Passes progressivos
-- - Conduções progressivas
-- - Dados de GPS/tracking
-- - PPDA
--
-- =====================================================
