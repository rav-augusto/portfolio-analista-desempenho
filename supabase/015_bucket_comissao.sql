-- =============================================
-- OLHAR DA BASE - Bucket de fotos da Comissao Tecnica
-- Rodar SEPARADO da 014 (que cria as tabelas). Se este arquivo der erro
-- de permissao em storage.objects, crie o bucket "comissao" manualmente
-- pelo painel: Storage > New bucket > marcar "Public bucket" — igual foi
-- feito para os buckets "atletas", "escudos" e "prints".
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('comissao', 'comissao', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "comissao_objects_select" ON storage.objects;
CREATE POLICY "comissao_objects_select" ON storage.objects FOR SELECT
USING (bucket_id = 'comissao');

DROP POLICY IF EXISTS "comissao_objects_insert" ON storage.objects;
CREATE POLICY "comissao_objects_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'comissao');

DROP POLICY IF EXISTS "comissao_objects_update" ON storage.objects;
CREATE POLICY "comissao_objects_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'comissao');

DROP POLICY IF EXISTS "comissao_objects_delete" ON storage.objects;
CREATE POLICY "comissao_objects_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'comissao');

-- =============================================
-- FIM
-- =============================================
