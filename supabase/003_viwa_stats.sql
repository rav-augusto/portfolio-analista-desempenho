-- =============================================
-- MIGRATION: Campos estilo VIWA (Video Analysis)
-- Estatisticas de jogo para ambos os times
-- Execute no SQL Editor do Supabase
-- =============================================

-- Campos que faltam para o time
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS tiros_meta INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS lancamentos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS perdas_bola INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS goleiro_acoes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS saida_meio INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS substituicoes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS passes_errados INTEGER DEFAULT 0;

-- Campos que faltam para o adversario
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_tiros_meta INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_lancamentos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_cruzamentos INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_perdas_bola INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_contra_ataques INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_goleiro_acoes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_saida_meio INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_substituicoes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_penaltis INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_passes_errados INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_chutes INTEGER DEFAULT 0;
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS adv_passes INTEGER DEFAULT 0;

-- =============================================
-- FIM
-- =============================================
