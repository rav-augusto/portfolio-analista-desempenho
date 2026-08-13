-- =============================================
-- OLHAR DA BASE - Eventos avancados por jogo (nivel scout profissional, filtrado p/ base)
-- Adiciona 1v1/dribles, recuperacoes e toques na area — o que os tops medem e faltava.
-- MIGRACAO 100% ADITIVA (ADD COLUMN IF NOT EXISTS). Nao apaga nada. Rode apos backup.
-- Pode rodar varias vezes sem problema.
-- =============================================

-- ---------- 1v1 / DRIBLES (o traço que mais diferencia talento na base) ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS dribles_tentados INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS dribles_certos INTEGER DEFAULT NULL;

-- ---------- RECUPERACAO ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS bolas_recuperadas INTEGER DEFAULT NULL;

-- ---------- PRESENCA NA ZONA DE PERIGO ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS toques_area INTEGER DEFAULT NULL;

-- ---------- DOCUMENTACAO ----------
COMMENT ON COLUMN avaliacoes_atleta.dribles_tentados IS '1v1 / dribles tentados';
COMMENT ON COLUMN avaliacoes_atleta.dribles_certos IS '1v1 / dribles bem-sucedidos (superou o adversario)';
COMMENT ON COLUMN avaliacoes_atleta.bolas_recuperadas IS 'Bolas recuperadas (recuperacoes)';
COMMENT ON COLUMN avaliacoes_atleta.toques_area IS 'Toques na area adversaria (presenca na zona de perigo)';

-- =============================================
-- FIM (aditiva)
-- =============================================
