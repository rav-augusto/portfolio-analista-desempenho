-- =============================================
-- 022_avaliacoes_rapidas.sql
-- Modulo Escolinha: avaliacao rapida (5-8 dimensoes por faixa etaria, JSONB flexivel).
--
-- Tabela nova — nao mexe em avaliacoes_atleta nem em nada existente.
-- JSONB pra aceitar QUALQUER conjunto de dimensoes por faixa sem migration
-- a cada mudanca de metodologia (ver src/lib/stats/faixas.ts).
--
-- RLS espelha o padrao do resto: master ve tudo; analista ve o que criou;
-- professor ve os do proprio clube via atleta.clube_id.
-- =============================================

CREATE TABLE IF NOT EXISTS avaliacoes_rapidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    data_avaliacao DATE NOT NULL DEFAULT CURRENT_DATE,
    -- 'descoberta' | 'aprendizado' | 'aperfeicoamento' | 'formacao' (ver src/lib/stats/faixas.ts)
    faixa TEXT NOT NULL,
    -- {dimensao_key: nota_1_a_5}. Ex: {"dominio": 3, "passe_curto": 4, ...}
    notas JSONB NOT NULL DEFAULT '{}'::jsonb,
    observacoes TEXT,
    criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_rapidas_atleta ON avaliacoes_rapidas(atleta_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_rapidas_data ON avaliacoes_rapidas(data_avaliacao);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_rapidas_criado_por ON avaliacoes_rapidas(criado_por);

-- UNIQUE de seguranca (fix bug #2 revisor): sem isso, um double-tap em conexao
-- lenta gera 2 linhas pra mesma (atleta, data, autor). Cinto — a UI ja tem
-- guarda com `salvando`, mas a UNIQUE garante que o banco tambem barra.
CREATE UNIQUE INDEX IF NOT EXISTS uq_avaliacoes_rapidas_atleta_data_autor
    ON avaliacoes_rapidas(atleta_id, data_avaliacao, criado_por);

-- Trigger simples pra manter updated_at.
CREATE OR REPLACE FUNCTION set_updated_at_avaliacoes_rapidas() RETURNS trigger AS $$
BEGIN NEW.updated_at := NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_avaliacoes_rapidas_updated ON avaliacoes_rapidas;
CREATE TRIGGER trg_avaliacoes_rapidas_updated
BEFORE UPDATE ON avaliacoes_rapidas
FOR EACH ROW EXECUTE FUNCTION set_updated_at_avaliacoes_rapidas();

-- =============================================
-- RLS
-- Helpers ja existem: is_master(), is_analista(), is_professor(),
-- get_user_atleta_id(), get_user_clube_id() (definidos em 005/017)
-- =============================================
ALTER TABLE avaliacoes_rapidas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avaliacoes_rapidas_select" ON avaliacoes_rapidas;
CREATE POLICY "avaliacoes_rapidas_select" ON avaliacoes_rapidas FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    atleta_id = get_user_atleta_id() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_rapidas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

DROP POLICY IF EXISTS "avaliacoes_rapidas_insert" ON avaliacoes_rapidas;
CREATE POLICY "avaliacoes_rapidas_insert" ON avaliacoes_rapidas FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_rapidas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

DROP POLICY IF EXISTS "avaliacoes_rapidas_update" ON avaliacoes_rapidas;
CREATE POLICY "avaliacoes_rapidas_update" ON avaliacoes_rapidas FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_rapidas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

DROP POLICY IF EXISTS "avaliacoes_rapidas_delete" ON avaliacoes_rapidas;
CREATE POLICY "avaliacoes_rapidas_delete" ON avaliacoes_rapidas FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_rapidas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);
