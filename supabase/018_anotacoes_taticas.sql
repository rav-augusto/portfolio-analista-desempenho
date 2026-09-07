-- =============================================
-- OLHAR DA BASE - Anotacoes Taticas
-- Desenho (seta, circulo, linha, texto) em cima de uma imagem parada
-- (print do video/jogo), vinculado a um atleta. Substitui a
-- necessidade de programa externo pra devolutiva de video.
-- =============================================

CREATE TABLE IF NOT EXISTS anotacoes_taticas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    titulo VARCHAR(255),
    observacoes TEXT,
    imagem_original_url VARCHAR(500) NOT NULL,
    imagem_anotada_url VARCHAR(500),
    formas JSONB NOT NULL DEFAULT '[]'::jsonb,
    criado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anotacoes_taticas_atleta ON anotacoes_taticas(atleta_id);
CREATE INDEX IF NOT EXISTS idx_anotacoes_taticas_criado_por ON anotacoes_taticas(criado_por);

-- =============================================
-- ROW LEVEL SECURITY (mesmo padrao de comissao_tecnica: segue o
-- clube do atleta vinculado, inclusive pro papel professor)
-- =============================================

ALTER TABLE anotacoes_taticas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anotacoes_taticas_select" ON anotacoes_taticas FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    atleta_id = get_user_atleta_id() OR
    EXISTS (
        SELECT 1 FROM atletas a WHERE a.id = anotacoes_taticas.atleta_id
        AND (is_professor() AND a.clube_id = get_user_clube_id())
    )
);

CREATE POLICY "anotacoes_taticas_insert" ON anotacoes_taticas FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR is_analista() OR
    EXISTS (
        SELECT 1 FROM atletas a WHERE a.id = anotacoes_taticas.atleta_id
        AND (is_professor() AND a.clube_id = get_user_clube_id())
    )
);

CREATE POLICY "anotacoes_taticas_update" ON anotacoes_taticas FOR UPDATE TO authenticated
USING (
    is_master() OR criado_por = auth.uid() OR
    EXISTS (
        SELECT 1 FROM atletas a WHERE a.id = anotacoes_taticas.atleta_id
        AND (is_professor() AND a.clube_id = get_user_clube_id())
    )
);

CREATE POLICY "anotacoes_taticas_delete" ON anotacoes_taticas FOR DELETE TO authenticated
USING (
    is_master() OR criado_por = auth.uid() OR
    EXISTS (
        SELECT 1 FROM atletas a WHERE a.id = anotacoes_taticas.atleta_id
        AND (is_professor() AND a.clube_id = get_user_clube_id())
    )
);

DROP TRIGGER IF EXISTS anotacoes_taticas_updated_at ON anotacoes_taticas;
CREATE TRIGGER anotacoes_taticas_updated_at
    BEFORE UPDATE ON anotacoes_taticas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- BUCKET DE IMAGENS
-- Rodar separado se der erro de permissao em storage.objects (mesmo
-- caso do bucket "comissao" em 015_bucket_comissao.sql) — nesse caso,
-- criar manualmente pelo painel: Storage > New bucket > "anotacoes".
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('anotacoes', 'anotacoes', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anotacoes_objects_select" ON storage.objects;
CREATE POLICY "anotacoes_objects_select" ON storage.objects FOR SELECT
USING (bucket_id = 'anotacoes');

DROP POLICY IF EXISTS "anotacoes_objects_insert" ON storage.objects;
CREATE POLICY "anotacoes_objects_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'anotacoes');

DROP POLICY IF EXISTS "anotacoes_objects_update" ON storage.objects;
CREATE POLICY "anotacoes_objects_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'anotacoes');

DROP POLICY IF EXISTS "anotacoes_objects_delete" ON storage.objects;
CREATE POLICY "anotacoes_objects_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'anotacoes');

-- =============================================
-- FIM
-- =============================================
