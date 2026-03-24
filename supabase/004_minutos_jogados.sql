-- Adicionar campos de minutos, gols e assistencias nas avaliacoes de atleta
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS minutos_jogados INTEGER DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS gols INTEGER DEFAULT 0;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS assistencias INTEGER DEFAULT 0;

-- Comentarios para documentacao
COMMENT ON COLUMN avaliacoes_atleta.minutos_jogados IS 'Minutos jogados pelo atleta na partida (0-120)';
COMMENT ON COLUMN avaliacoes_atleta.gols IS 'Gols marcados na partida';
COMMENT ON COLUMN avaliacoes_atleta.assistencias IS 'Assistencias na partida';
