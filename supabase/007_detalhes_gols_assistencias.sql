-- Adicionar campos detalhados para gols e assistencias
-- Parte do corpo (soma deve ser igual ao total de gols)
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_pe_direito INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_pe_esquerdo INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_cabeca INTEGER DEFAULT 0;

-- Zona do gol (soma deve ser igual ao total de gols)
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_dentro_area INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_fora_area INTEGER DEFAULT 0;

-- Tipo de gol (soma deve ser igual ao total de gols)
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_jogada INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_penalti INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_falta INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS gols_contra_ataque INTEGER DEFAULT 0;

-- Tipo de assistencia (soma deve ser igual ao total de assistencias)
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS assist_passe INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS assist_cruzamento INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS assist_lancamento INTEGER DEFAULT 0;
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS assist_bola_parada INTEGER DEFAULT 0;
