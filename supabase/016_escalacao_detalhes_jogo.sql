-- =============================================
-- OLHAR DA BASE - Detalhes da partida na Escalacao
-- Adversario, competicao, local e horarios, para aparecer na imagem exportada
-- =============================================

ALTER TABLE escalacoes ADD COLUMN IF NOT EXISTS adversario VARCHAR(255);
ALTER TABLE escalacoes ADD COLUMN IF NOT EXISTS competicao VARCHAR(255);
ALTER TABLE escalacoes ADD COLUMN IF NOT EXISTS local VARCHAR(255);
ALTER TABLE escalacoes ADD COLUMN IF NOT EXISTS horario_apresentacao VARCHAR(5);
ALTER TABLE escalacoes ADD COLUMN IF NOT EXISTS horario_jogo VARCHAR(5);

-- =============================================
-- FIM
-- =============================================
