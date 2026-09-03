-- =============================================
-- OLHAR DA BASE - Escalacoes (montagem visual de time)
-- =============================================

CREATE TABLE IF NOT EXISTS escalacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clube_id UUID NOT NULL REFERENCES clubes(id) ON DELETE CASCADE,
    jogo_id UUID REFERENCES jogos(id) ON DELETE SET NULL,
    nome VARCHAR(255),
    formacao VARCHAR(20) NOT NULL DEFAULT '4-3-3',
    treinador VARCHAR(255),
    observacoes TEXT,
    criado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escalacao_atletas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escalacao_id UUID NOT NULL REFERENCES escalacoes(id) ON DELETE CASCADE,
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    slot_id VARCHAR(20),
    titular BOOLEAN NOT NULL DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(escalacao_id, atleta_id)
);

CREATE INDEX IF NOT EXISTS idx_escalacoes_clube ON escalacoes(clube_id);
CREATE INDEX IF NOT EXISTS idx_escalacoes_jogo ON escalacoes(jogo_id);
CREATE INDEX IF NOT EXISTS idx_escalacoes_criado_por ON escalacoes(criado_por);
CREATE INDEX IF NOT EXISTS idx_escalacao_atletas_escalacao ON escalacao_atletas(escalacao_id);
CREATE INDEX IF NOT EXISTS idx_escalacao_atletas_atleta ON escalacao_atletas(atleta_id);

-- =============================================
-- ROW LEVEL SECURITY
-- Segue o mesmo padrao baseado em role de 005_usuarios_permissoes.sql
-- =============================================

ALTER TABLE escalacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalacao_atletas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "escalacoes_select" ON escalacoes FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = get_user_atleta_id()
        AND a.clube_id = escalacoes.clube_id
    )
);

CREATE POLICY "escalacoes_insert" ON escalacoes FOR INSERT TO authenticated
WITH CHECK (is_master() OR is_analista());

CREATE POLICY "escalacoes_update" ON escalacoes FOR UPDATE TO authenticated
USING (is_master() OR criado_por = auth.uid());

CREATE POLICY "escalacoes_delete" ON escalacoes FOR DELETE TO authenticated
USING (is_master() OR criado_por = auth.uid());

CREATE POLICY "escalacao_atletas_select" ON escalacao_atletas FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM escalacoes e WHERE e.id = escalacao_atletas.escalacao_id
        AND (
            is_master() OR
            e.criado_por = auth.uid() OR
            EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = e.clube_id)
        )
    )
);

CREATE POLICY "escalacao_atletas_insert" ON escalacao_atletas FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista()
);

CREATE POLICY "escalacao_atletas_update" ON escalacao_atletas FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_atletas.escalacao_id AND (is_master() OR e.criado_por = auth.uid()))
);

CREATE POLICY "escalacao_atletas_delete" ON escalacao_atletas FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_atletas.escalacao_id AND (is_master() OR e.criado_por = auth.uid()))
);

DROP TRIGGER IF EXISTS escalacoes_updated_at ON escalacoes;
CREATE TRIGGER escalacoes_updated_at
    BEFORE UPDATE ON escalacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FIM DA MIGRACAO
-- =============================================
