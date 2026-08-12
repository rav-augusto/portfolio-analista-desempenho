-- =============================================
-- OLHAR DA BASE - Contexto e Impacto do jogo
-- Permite medir "decisivo" de verdade: nao so SE participou de gol,
-- mas o PESO daquilo (reserva que entrou, virou o jogo, contra time forte, em decisao...).
-- MIGRACAO 100% ADITIVA (ADD COLUMN IF NOT EXISTS). Nao apaga nada. Rode apos backup.
-- =============================================

-- ---------- CONTEXTO DO JOGO ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS condicao_entrada VARCHAR(20)
  CHECK (condicao_entrada IN ('titular', 'reserva') OR condicao_entrada IS NULL);

ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS situacao_jogo VARCHAR(20)
  CHECK (situacao_jogo IN ('ganhando', 'empatando', 'perdendo') OR situacao_jogo IS NULL);

ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS resultado_jogo VARCHAR(20)
  CHECK (resultado_jogo IN ('vitoria', 'empate', 'derrota') OR resultado_jogo IS NULL);

ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS nivel_adversario VARCHAR(20)
  CHECK (nivel_adversario IN ('forte', 'medio', 'fraco') OR nivel_adversario IS NULL);

ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS importancia_jogo VARCHAR(20)
  CHECK (importancia_jogo IN ('amistoso', 'campeonato', 'decisao') OR importancia_jogo IS NULL);

-- ---------- IMPACTO ----------
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_decisivos INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS assistencias_decisivas INTEGER DEFAULT NULL;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS virou_jogo BOOLEAN DEFAULT NULL;

-- ---------- DOCUMENTACAO ----------
COMMENT ON COLUMN avaliacoes_atleta.condicao_entrada IS 'titular ou reserva (entrou do banco)';
COMMENT ON COLUMN avaliacoes_atleta.situacao_jogo IS 'Placar quando o atleta jogou/entrou: ganhando, empatando ou perdendo';
COMMENT ON COLUMN avaliacoes_atleta.resultado_jogo IS 'Resultado final: vitoria, empate ou derrota';
COMMENT ON COLUMN avaliacoes_atleta.nivel_adversario IS 'Forca do adversario: forte, medio ou fraco';
COMMENT ON COLUMN avaliacoes_atleta.importancia_jogo IS 'amistoso, campeonato ou decisao (mata-mata/final)';
COMMENT ON COLUMN avaliacoes_atleta.gols_decisivos IS 'Gols que mudaram o placar de forma decisiva (empate, virada, vitoria)';
COMMENT ON COLUMN avaliacoes_atleta.assistencias_decisivas IS 'Assistencias em lances decisivos';
COMMENT ON COLUMN avaliacoes_atleta.virou_jogo IS 'O atleta virou/salvou o jogo (ex: reserva que entrou e mudou o resultado)';

-- =============================================
-- FIM (aditiva)
-- =============================================
