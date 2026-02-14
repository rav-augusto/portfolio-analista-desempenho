-- =============================================
-- MIGRACAO: Adicionar campos OFE/DEF as avaliacoes_atleta
-- Execute este SQL no SQL Editor do Supabase
-- =============================================

-- Observacoes por dimensao CBF
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_forca TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_velocidade TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_tecnica TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_dinamica TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_inteligencia TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_um_contra_um TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_atitude TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_potencial TEXT;

-- 6 Principios Ofensivos (notas 0.5 a 5.0)
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS penetracao DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS cobertura_ofensiva DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS espaco_com_bola DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS espaco_sem_bola DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS mobilidade DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS unidade_ofensiva DECIMAL(2,1);

-- Observacoes por principio ofensivo
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_penetracao TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_cobertura_ofensiva TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_espaco_com_bola TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_espaco_sem_bola TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_mobilidade TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_unidade_ofensiva TEXT;

-- 6 Principios Defensivos (notas 0.5 a 5.0)
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS contencao DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS cobertura_defensiva DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS equilibrio_recuperacao DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS equilibrio_defensivo DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS concentracao_def DECIMAL(2,1);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS unidade_defensiva DECIMAL(2,1);

-- Observacoes por principio defensivo
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_contencao TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_cobertura_defensiva TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_equilibrio_recuperacao TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_equilibrio_defensivo TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_concentracao_def TEXT;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_unidade_defensiva TEXT;

-- =============================================
-- FIM DA MIGRACAO
-- =============================================
