-- =============================================
-- OLHAR DA BASE - Eventos por Jogo (analise de desempenho profunda)
-- MIGRACAO 100% ADITIVA: apenas ADD COLUMN IF NOT EXISTS.
-- NAO apaga, NAO altera e NAO trunca nenhum dado existente.
-- Rode SOMENTE apos tirar backup (Table Editor > exportar CSV, ou Database > Backups).
-- =============================================

-- ---------- FINALIZACOES ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS finalizacoes_no_alvo INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS finalizacoes_fora INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS finalizacoes_bloqueadas INTEGER DEFAULT NULL;

-- ---------- PASSES ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS passes_certos INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS passes_errados INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS passes_decisivos INTEGER DEFAULT NULL;

-- ---------- DUELOS ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS duelos_ganhos INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS duelos_perdidos INTEGER DEFAULT NULL;

-- ---------- ACOES DEFENSIVAS ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS desarmes INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS interceptacoes INTEGER DEFAULT NULL;

-- ---------- PERDA / DISCIPLINA ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS perdas_posse INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS faltas_cometidas INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS faltas_sofridas INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS cartoes_amarelos INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS cartoes_vermelhos INTEGER DEFAULT NULL;

-- ---------- DOCUMENTACAO ----------
COMMENT ON COLUMN avaliacoes_atleta.finalizacoes_no_alvo IS 'Chutes no alvo (inclui gols)';
COMMENT ON COLUMN avaliacoes_atleta.finalizacoes_fora IS 'Chutes para fora';
COMMENT ON COLUMN avaliacoes_atleta.finalizacoes_bloqueadas IS 'Chutes bloqueados pela defesa';
COMMENT ON COLUMN avaliacoes_atleta.passes_certos IS 'Passes completados';
COMMENT ON COLUMN avaliacoes_atleta.passes_errados IS 'Passes errados';
COMMENT ON COLUMN avaliacoes_atleta.passes_decisivos IS 'Passes decisivos / key passes (geraram finalizacao)';
COMMENT ON COLUMN avaliacoes_atleta.duelos_ganhos IS 'Duelos ganhos (chao + aereo)';
COMMENT ON COLUMN avaliacoes_atleta.duelos_perdidos IS 'Duelos perdidos';
COMMENT ON COLUMN avaliacoes_atleta.desarmes IS 'Desarmes / tackles';
COMMENT ON COLUMN avaliacoes_atleta.interceptacoes IS 'Interceptacoes';
COMMENT ON COLUMN avaliacoes_atleta.perdas_posse IS 'Perdas de posse de bola';
COMMENT ON COLUMN avaliacoes_atleta.faltas_cometidas IS 'Faltas cometidas';
COMMENT ON COLUMN avaliacoes_atleta.faltas_sofridas IS 'Faltas sofridas';
COMMENT ON COLUMN avaliacoes_atleta.cartoes_amarelos IS 'Cartoes amarelos';
COMMENT ON COLUMN avaliacoes_atleta.cartoes_vermelhos IS 'Cartoes vermelhos';

-- =============================================
-- FIM DA MIGRACAO (aditiva)
-- =============================================
