-- =============================================
-- MIGRATION: Estatisticas do Adversario
-- Para comparacao lado a lado estilo SofaScore
-- Execute no SQL Editor do Supabase
-- =============================================

-- Estatisticas do adversario
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_finalizacoes_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_finalizacoes_gol INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_finalizacoes_fora INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_finalizacoes_bloqueadas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_passes_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_passes_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_faltas_cometidas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_cartoes_amarelos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_cartoes_vermelhos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_escanteios INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_impedimentos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_posse_bola INTEGER DEFAULT 0;

-- Impedimentos do time (nao existia)
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS impedimentos INTEGER DEFAULT 0;

-- Garantir que campos numericos existem (podem ter sido adicionados antes)
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_bola INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_terco_final INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_progressivos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS cruzamentos_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS cruzamentos_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS conducoes_progressivas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS entradas_area INTEGER DEFAULT 0;
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
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS contra_ataques_sofridos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS gols_sofridos_contra_ataque INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS escanteios_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_favor INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_convertidos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS escanteios_contra INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_contra INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS gols_bola_parada INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS gols_sofridos_bp INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS defesas_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS defesas_dificeis INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS saidas_gol INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_gk_total INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_gk_certos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_terco_defensivo INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_terco_medio INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS posse_terco_ofensivo INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS xg_favor DECIMAL(4,2) DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS xg_contra DECIMAL(4,2) DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS ppda DECIMAL(4,1) DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS nota_geral DECIMAL(3,1) DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS indice_ofensivo DECIMAL(3,1) DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS indice_defensivo DECIMAL(3,1) DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS pontos_fortes TEXT;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS pontos_fracos TEXT;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS jogadores_destaque TEXT;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS marcacao_tipo VARCHAR(50);
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS linha_defensiva_altura VARCHAR(50);
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS qualidade_criacao INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS pressao_intensidade INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS compactacao_bloco INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS finalizacoes_dentro_area INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS finalizacoes_fora_area INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS grandes_chances INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS grandes_chances_perdidas INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS penaltis_defendidos INTEGER DEFAULT 0;

-- =============================================
-- FIM DA MIGRATION
-- =============================================
