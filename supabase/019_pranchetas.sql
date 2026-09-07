-- =============================================
-- OLHAR DA BASE - Prancheta Tatica
-- Campo em branco pra desenhar jogada/esquema do zero (fichas de
-- jogador, setas de passe/conducao/corrida, area) — diferente da
-- Anotacao Tatica, que desenha em cima de uma foto real.
-- =============================================

CREATE TABLE IF NOT EXISTS pranchetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clube_id UUID NOT NULL REFERENCES clubes(id) ON DELETE CASCADE,
    titulo VARCHAR(255),
    observacoes TEXT,
    formas JSONB NOT NULL DEFAULT '[]'::jsonb,
    imagem_url VARCHAR(500),
    criado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pranchetas_clube ON pranchetas(clube_id);
CREATE INDEX IF NOT EXISTS idx_pranchetas_criado_por ON pranchetas(criado_por);

-- =============================================
-- ROW LEVEL SECURITY (mesmo padrao de escalacoes; fora do escopo do
-- papel professor por enquanto, igual anotacoes_taticas)
-- =============================================

ALTER TABLE pranchetas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pranchetas_select" ON pranchetas FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (SELECT 1 FROM atletas a WHERE a.id = get_user_atleta_id() AND a.clube_id = pranchetas.clube_id)
);

CREATE POLICY "pranchetas_insert" ON pranchetas FOR INSERT TO authenticated
WITH CHECK (is_master() OR is_analista());

CREATE POLICY "pranchetas_update" ON pranchetas FOR UPDATE TO authenticated
USING (is_master() OR criado_por = auth.uid());

CREATE POLICY "pranchetas_delete" ON pranchetas FOR DELETE TO authenticated
USING (is_master() OR criado_por = auth.uid());

DROP TRIGGER IF EXISTS pranchetas_updated_at ON pranchetas;
CREATE TRIGGER pranchetas_updated_at
    BEFORE UPDATE ON pranchetas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- BUCKET DE IMAGENS EXPORTADAS
-- Rodar separado se der erro de permissao em storage.objects (mesmo
-- caso dos buckets anteriores) — nesse caso, criar manualmente pelo
-- painel: Storage > New bucket > "pranchetas".
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('pranchetas', 'pranchetas', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "pranchetas_objects_select" ON storage.objects;
CREATE POLICY "pranchetas_objects_select" ON storage.objects FOR SELECT
USING (bucket_id = 'pranchetas');

DROP POLICY IF EXISTS "pranchetas_objects_insert" ON storage.objects;
CREATE POLICY "pranchetas_objects_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pranchetas');

DROP POLICY IF EXISTS "pranchetas_objects_update" ON storage.objects;
CREATE POLICY "pranchetas_objects_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pranchetas');

DROP POLICY IF EXISTS "pranchetas_objects_delete" ON storage.objects;
CREATE POLICY "pranchetas_objects_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pranchetas');

-- =============================================
-- FIM
-- =============================================
