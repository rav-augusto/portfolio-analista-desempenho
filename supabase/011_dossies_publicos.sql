-- 011_dossies_publicos.sql
-- Snapshot do dossiê para compartilhar por link (enviar ao empresário/clube).
-- Aditiva: cria uma tabela nova. Não altera nem apaga nada existente.

CREATE TABLE IF NOT EXISTS dossies_publicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atleta_id uuid,
  atleta_nome text,
  html text NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dossies_publicos ENABLE ROW LEVEL SECURITY;

-- Leitura pública: o link é "não listado" (UUID impossível de adivinhar).
-- Quem tiver o link vê o dossiê; ninguém consegue listar/enumerar os outros.
DROP POLICY IF EXISTS dossie_pub_select ON dossies_publicos;
CREATE POLICY dossie_pub_select ON dossies_publicos
  FOR SELECT USING (true);

-- Só usuários autenticados (admin/analista logado) criam snapshots.
DROP POLICY IF EXISTS dossie_pub_insert ON dossies_publicos;
CREATE POLICY dossie_pub_insert ON dossies_publicos
  FOR INSERT TO authenticated WITH CHECK (true);

-- Privilégios de tabela (RLS ainda gate por linha acima).
GRANT SELECT ON dossies_publicos TO anon;
GRANT SELECT, INSERT ON dossies_publicos TO authenticated;
