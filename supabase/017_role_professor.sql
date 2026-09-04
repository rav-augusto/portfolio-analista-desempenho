-- =============================================
-- OLHAR DA BASE - Papel "professor"
-- Acesso restrito a UM clube: atletas, comissao tecnica e escalacoes
-- (nao ve jogos, analises, avaliacoes, outros clubes etc.)
-- =============================================

-- Permite o novo valor de role
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_role_check;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_role_check CHECK (role IN ('master', 'analista', 'atleta', 'professor'));

-- Vincula o professor a um unico clube (mesmo padrao do atleta_id pro role atleta)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS clube_id UUID REFERENCES clubes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_clube ON usuarios(clube_id);

CREATE OR REPLACE FUNCTION is_professor() RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'professor';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_clube_id() RETURNS UUID AS $$
  SELECT clube_id FROM usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- ATLETAS — professor ve/cria/edita so do proprio clube
-- =============================================
DROP POLICY IF EXISTS "atletas_select" ON atletas;
CREATE POLICY "atletas_select" ON atletas FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    id = get_user_atleta_id() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "atletas_insert" ON atletas;
CREATE POLICY "atletas_insert" ON atletas FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "atletas_update" ON atletas;
CREATE POLICY "atletas_update" ON atletas FOR UPDATE TO authenticated
USING (
    is_master() OR criado_por = auth.uid() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

-- =============================================
-- COMISSAO TECNICA — mesmo padrao
-- =============================================
DROP POLICY IF EXISTS "comissao_tecnica_select" ON comissao_tecnica;
CREATE POLICY "comissao_tecnica_select" ON comissao_tecnica FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = comissao_tecnica.clube_id) OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "comissao_tecnica_insert" ON comissao_tecnica;
CREATE POLICY "comissao_tecnica_insert" ON comissao_tecnica FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "comissao_tecnica_update" ON comissao_tecnica;
CREATE POLICY "comissao_tecnica_update" ON comissao_tecnica FOR UPDATE TO authenticated
USING (
    is_master() OR criado_por = auth.uid() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

-- =============================================
-- ESCALACOES — mesmo padrao
-- =============================================
DROP POLICY IF EXISTS "escalacoes_select" ON escalacoes;
CREATE POLICY "escalacoes_select" ON escalacoes FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = escalacoes.clube_id) OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "escalacoes_insert" ON escalacoes;
CREATE POLICY "escalacoes_insert" ON escalacoes FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "escalacoes_update" ON escalacoes;
CREATE POLICY "escalacoes_update" ON escalacoes FOR UPDATE TO authenticated
USING (
    is_master() OR criado_por = auth.uid() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

DROP POLICY IF EXISTS "escalacoes_delete" ON escalacoes;
CREATE POLICY "escalacoes_delete" ON escalacoes FOR DELETE TO authenticated
USING (
    is_master() OR criado_por = auth.uid() OR
    (is_professor() AND clube_id = get_user_clube_id())
);

-- =============================================
-- ESCALACAO_ATLETAS — segue a escalacao "pai"
-- =============================================
DROP POLICY IF EXISTS "escalacao_atletas_select" ON escalacao_atletas;
CREATE POLICY "escalacao_atletas_select" ON escalacao_atletas FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM escalacoes e WHERE e.id = escalacao_atletas.escalacao_id
        AND (
            is_master() OR
            e.criado_por = auth.uid() OR
            EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = e.clube_id) OR
            (is_professor() AND e.clube_id = get_user_clube_id())
        )
    )
);

DROP POLICY IF EXISTS "escalacao_atletas_insert" ON escalacao_atletas;
CREATE POLICY "escalacao_atletas_insert" ON escalacao_atletas FOR INSERT TO authenticated
WITH CHECK (is_master() OR is_analista() OR is_professor());

DROP POLICY IF EXISTS "escalacao_atletas_update" ON escalacao_atletas;
CREATE POLICY "escalacao_atletas_update" ON escalacao_atletas FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_atletas.escalacao_id AND (is_master() OR e.criado_por = auth.uid() OR (is_professor() AND e.clube_id = get_user_clube_id())))
);

DROP POLICY IF EXISTS "escalacao_atletas_delete" ON escalacao_atletas;
CREATE POLICY "escalacao_atletas_delete" ON escalacao_atletas FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_atletas.escalacao_id AND (is_master() OR e.criado_por = auth.uid() OR (is_professor() AND e.clube_id = get_user_clube_id())))
);

-- =============================================
-- ESCALACAO_STAFF — mesmo padrao
-- =============================================
DROP POLICY IF EXISTS "escalacao_staff_select" ON escalacao_staff;
CREATE POLICY "escalacao_staff_select" ON escalacao_staff FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM escalacoes e WHERE e.id = escalacao_staff.escalacao_id
        AND (
            is_master() OR
            e.criado_por = auth.uid() OR
            EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = e.clube_id) OR
            (is_professor() AND e.clube_id = get_user_clube_id())
        )
    )
);

DROP POLICY IF EXISTS "escalacao_staff_insert" ON escalacao_staff;
CREATE POLICY "escalacao_staff_insert" ON escalacao_staff FOR INSERT TO authenticated
WITH CHECK (is_master() OR is_analista() OR is_professor());

DROP POLICY IF EXISTS "escalacao_staff_update" ON escalacao_staff;
CREATE POLICY "escalacao_staff_update" ON escalacao_staff FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_staff.escalacao_id AND (is_master() OR e.criado_por = auth.uid() OR (is_professor() AND e.clube_id = get_user_clube_id())))
);

DROP POLICY IF EXISTS "escalacao_staff_delete" ON escalacao_staff;
CREATE POLICY "escalacao_staff_delete" ON escalacao_staff FOR DELETE TO authenticated
USING (
    EXISTS (SELECT 1 FROM escalacoes e WHERE e.id = escalacao_staff.escalacao_id AND (is_master() OR e.criado_por = auth.uid() OR (is_professor() AND e.clube_id = get_user_clube_id())))
);

-- =============================================
-- JOGOS — professor so LE (pra vincular na escalacao), nao cria/edita
-- =============================================
DROP POLICY IF EXISTS "jogos_select" ON jogos;
CREATE POLICY "jogos_select" ON jogos FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = jogos.clube_id) OR
    (is_professor() AND clube_id = get_user_clube_id())
);

-- =============================================
-- FIM
-- =============================================
