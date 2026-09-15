-- =============================================
-- 021_professor_avaliacoes.sql
-- Abre AVALIACOES (tecnica + fisica) para o papel professor, restrito ao proprio clube.
--
-- Duas coisas:
--   1) Refaz RLS de avaliacoes_atleta incluindo o professor (via clube do atleta).
--   2) Substitui a RLS aberta ("USING (true)") de avaliacoes_fisicas — que era um
--      vazamento entre analistas/atletas — por RLS por role, mesmo padrao do restante.
--
-- Aditiva onde da; nas policies antigas, DROP + CREATE (idempotente).
-- Requer os helpers is_master(), is_analista(), is_professor(), get_user_atleta_id(),
-- get_user_clube_id() ja definidos em 005/017.
-- =============================================

-- =============================================
-- 1) avaliacoes_atleta — adiciona clausula do professor via clube do atleta
-- =============================================

DROP POLICY IF EXISTS "avaliacoes_select" ON avaliacoes_atleta;
CREATE POLICY "avaliacoes_select" ON avaliacoes_atleta FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    atleta_id = get_user_atleta_id() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_atleta.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

DROP POLICY IF EXISTS "avaliacoes_insert" ON avaliacoes_atleta;
CREATE POLICY "avaliacoes_insert" ON avaliacoes_atleta FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_atleta.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

DROP POLICY IF EXISTS "avaliacoes_update" ON avaliacoes_atleta;
CREATE POLICY "avaliacoes_update" ON avaliacoes_atleta FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_atleta.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

DROP POLICY IF EXISTS "avaliacoes_delete" ON avaliacoes_atleta;
CREATE POLICY "avaliacoes_delete" ON avaliacoes_atleta FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_atleta.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

-- =============================================
-- 2) avaliacoes_fisicas — troca RLS aberta por RLS por role
--    (a antiga era USING (true) WITH CHECK (true) — qualquer autenticado lia/escrevia tudo)
-- =============================================

-- Coluna de autoria (nullable pra nao quebrar registros antigos).
ALTER TABLE avaliacoes_fisicas ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_avaliacoes_fisicas_criado_por ON avaliacoes_fisicas(criado_por);

DROP POLICY IF EXISTS "Usuarios autenticados tem acesso total a avaliacoes fisicas" ON avaliacoes_fisicas;
DROP POLICY IF EXISTS "avaliacoes_fisicas_select" ON avaliacoes_fisicas;
DROP POLICY IF EXISTS "avaliacoes_fisicas_insert" ON avaliacoes_fisicas;
DROP POLICY IF EXISTS "avaliacoes_fisicas_update" ON avaliacoes_fisicas;
DROP POLICY IF EXISTS "avaliacoes_fisicas_delete" ON avaliacoes_fisicas;

CREATE POLICY "avaliacoes_fisicas_select" ON avaliacoes_fisicas FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    atleta_id = get_user_atleta_id() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_fisicas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

CREATE POLICY "avaliacoes_fisicas_insert" ON avaliacoes_fisicas FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_fisicas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

CREATE POLICY "avaliacoes_fisicas_update" ON avaliacoes_fisicas FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_fisicas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

CREATE POLICY "avaliacoes_fisicas_delete" ON avaliacoes_fisicas FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    (is_professor() AND EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = avaliacoes_fisicas.atleta_id AND a.clube_id = get_user_clube_id()
    ))
);

-- =============================================
-- FIM. RESTA POPULAR: no codigo, ao inserir avaliacao_fisica novo, mandar criado_por.
-- Sem isso o proprio autor perde acesso ao registro (mas master continua vendo).
-- =============================================
