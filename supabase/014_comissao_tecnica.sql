-- =============================================
-- OLHAR DA BASE - Comissao Tecnica (staff do clube)
-- =============================================

CREATE TABLE IF NOT EXISTS comissao_tecnica (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clube_id UUID NOT NULL REFERENCES clubes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    funcao VARCHAR(100) NOT NULL DEFAULT 'Treinador',
    foto_url VARCHAR(500),
    telefone VARCHAR(20),
    criado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escalacao_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escalacao_id UUID NOT NULL REFERENCES escalacoes(id) ON DELETE CASCADE,
    membro_id UUID NOT NULL REFERENCES comissao_tecnica(id) ON DELETE CASCADE,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(escalacao_id, membro_id)
);

CREATE INDEX IF NOT EXISTS idx_comissao_clube ON comissao_tecnica(clube_id);
CREATE INDEX IF NOT EXISTS idx_comissao_criado_por ON comissao_tecnica(criado_por);
CREATE INDEX IF NOT EXISTS idx_escalacao_staff_escalacao ON escalacao_staff(escalacao_id);
CREATE INDEX IF NOT EXISTS idx_escalacao_staff_membro ON escalacao_staff(membro_id);

-- =============================================
-- ROW LEVEL SECURITY (mesmo padrao de atletas / escalacoes)
-- =============================================

ALTER TABLE comissao_tecnica ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalacao_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comissao_tecnica_select" ON comissao_tecnica FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = comissao_tecnica.clube_id)
);

CREATE POLICY "comissao_tecnica_insert" ON comissao_tecnica FOR INSERT TO authenticated
WITH CHECK (is_master() OR is_analista());

CREATE POLICY "comissao_tecnica_update" ON comissao_tecnica FOR UPDATE TO authenticated
USING (is_master() OR criado_por = auth.uid());

CREATE POLICY "comissao_tecnica_delete" ON comissao_tecnica FOR DELETE TO authenticated
USING (is_master() OR criado_por = auth.uid());

CREATE POLICY "escalacao_staff_select" ON escalacao_staff FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM escalacoes e WHERE e.id = escalacao_staff.escalacao_id
        AND (
            is_master() OR
            e.criado_por = auth.uid() OR
            EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = e.clube_id)
        )
    )
);

CREATE POLICY "escalacao_staff_insert" ON escalacao_staff FOR INSERT TO authenticated
WITH CHECK (is_master() OR is_analista());

CREATE POLICY "escalacao_staff_update" ON escalacao_staff FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_staff.escalacao_id AND (is_master() OR e.criado_por = auth.uid()))
);

CREATE POLICY "escalacao_staff_delete" ON escalacao_staff FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_staff.escalacao_id AND (is_master() OR e.criado_por = auth.uid()))
);

-- =============================================
-- FIM DA MIGRACAO
-- (bucket de fotos "comissao" fica no arquivo 015_bucket_comissao.sql,
--  separado de proposito para nao arriscar a criacao das tabelas acima
--  caso a permissao em storage.objects falhe)
-- =============================================
