-- =============================================
-- OLHAR DA BASE - Sistema de Permissoes
-- Migração para controle de usuarios e roles
-- =============================================

-- =============================================
-- TABELA: usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'analista' CHECK (role IN ('master', 'analista', 'atleta')),
    atleta_id UUID REFERENCES atletas(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para busca por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
CREATE INDEX IF NOT EXISTS idx_usuarios_atleta ON usuarios(atleta_id);

-- =============================================
-- ADICIONAR COLUNA criado_por NAS TABELAS
-- =============================================
ALTER TABLE atletas ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id);
ALTER TABLE jogos ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id);
ALTER TABLE analises_jogo ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id);
ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id);
ALTER TABLE clubes ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES auth.users(id);

-- Adicionar campo email ao atleta para notificacoes
ALTER TABLE atletas ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Indices para criado_por
CREATE INDEX IF NOT EXISTS idx_atletas_criado_por ON atletas(criado_por);
CREATE INDEX IF NOT EXISTS idx_jogos_criado_por ON jogos(criado_por);
CREATE INDEX IF NOT EXISTS idx_analises_criado_por ON analises_jogo(criado_por);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_criado_por ON avaliacoes_atleta(criado_por);
CREATE INDEX IF NOT EXISTS idx_clubes_criado_por ON clubes(criado_por);

-- =============================================
-- FUNCOES HELPER PARA PERMISSOES
-- =============================================

-- Funcao para obter role do usuario atual
CREATE OR REPLACE FUNCTION get_user_role() RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM usuarios WHERE id = auth.uid()),
    'analista'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcao para verificar se eh master
CREATE OR REPLACE FUNCTION is_master() RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'master';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcao para verificar se eh analista
CREATE OR REPLACE FUNCTION is_analista() RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'analista';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcao para verificar se eh atleta
CREATE OR REPLACE FUNCTION is_atleta() RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'atleta';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funcao para obter atleta_id vinculado ao usuario atleta
CREATE OR REPLACE FUNCTION get_user_atleta_id() RETURNS UUID AS $$
  SELECT atleta_id FROM usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- HABILITAR RLS NA TABELA usuarios
-- =============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Politicas para tabela usuarios
CREATE POLICY "usuarios_select" ON usuarios FOR SELECT TO authenticated
USING (
    is_master() OR
    id = auth.uid()
);

CREATE POLICY "usuarios_insert" ON usuarios FOR INSERT TO authenticated
WITH CHECK (is_master());

CREATE POLICY "usuarios_update" ON usuarios FOR UPDATE TO authenticated
USING (is_master());

CREATE POLICY "usuarios_delete" ON usuarios FOR DELETE TO authenticated
USING (is_master());

-- =============================================
-- ATUALIZAR POLITICAS RLS PARA ATLETAS
-- =============================================

-- Remover politicas antigas
DROP POLICY IF EXISTS "Usuarios autenticados tem acesso total a atletas" ON atletas;

-- Novas politicas baseadas em role
CREATE POLICY "atletas_select" ON atletas FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    id = get_user_atleta_id()
);

CREATE POLICY "atletas_insert" ON atletas FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR
    is_analista()
);

CREATE POLICY "atletas_update" ON atletas FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

CREATE POLICY "atletas_delete" ON atletas FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

-- =============================================
-- ATUALIZAR POLITICAS RLS PARA JOGOS
-- =============================================

-- Remover politicas antigas
DROP POLICY IF EXISTS "Usuarios autenticados tem acesso total a jogos" ON jogos;

-- Novas politicas baseadas em role
CREATE POLICY "jogos_select" ON jogos FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (
        SELECT 1 FROM atletas a
        WHERE a.id = get_user_atleta_id()
        AND a.clube_id = jogos.clube_id
    )
);

CREATE POLICY "jogos_insert" ON jogos FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR
    is_analista()
);

CREATE POLICY "jogos_update" ON jogos FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

CREATE POLICY "jogos_delete" ON jogos FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

-- =============================================
-- ATUALIZAR POLITICAS RLS PARA ANALISES_JOGO
-- =============================================

-- Remover politicas antigas
DROP POLICY IF EXISTS "Usuarios autenticados tem acesso total a analises" ON analises_jogo;

-- Novas politicas baseadas em role
CREATE POLICY "analises_select" ON analises_jogo FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    EXISTS (
        SELECT 1 FROM jogos j
        JOIN atletas a ON a.clube_id = j.clube_id
        WHERE j.id = analises_jogo.jogo_id
        AND a.id = get_user_atleta_id()
    )
);

CREATE POLICY "analises_insert" ON analises_jogo FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR
    is_analista()
);

CREATE POLICY "analises_update" ON analises_jogo FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

CREATE POLICY "analises_delete" ON analises_jogo FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

-- =============================================
-- ATUALIZAR POLITICAS RLS PARA AVALIACOES_ATLETA
-- =============================================

-- Remover politicas antigas
DROP POLICY IF EXISTS "Usuarios autenticados tem acesso total a avaliacoes" ON avaliacoes_atleta;

-- Novas politicas baseadas em role
CREATE POLICY "avaliacoes_select" ON avaliacoes_atleta FOR SELECT TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid() OR
    atleta_id = get_user_atleta_id()
);

CREATE POLICY "avaliacoes_insert" ON avaliacoes_atleta FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR
    is_analista()
);

CREATE POLICY "avaliacoes_update" ON avaliacoes_atleta FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

CREATE POLICY "avaliacoes_delete" ON avaliacoes_atleta FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

-- =============================================
-- ATUALIZAR POLITICAS RLS PARA CLUBES
-- =============================================

-- Remover politicas antigas (mantendo leitura publica)
DROP POLICY IF EXISTS "Usuarios autenticados podem ver clubes" ON clubes;
DROP POLICY IF EXISTS "Usuarios autenticados podem inserir clubes" ON clubes;
DROP POLICY IF EXISTS "Usuarios autenticados podem atualizar clubes" ON clubes;
DROP POLICY IF EXISTS "Usuarios autenticados podem deletar clubes" ON clubes;

-- Novas politicas baseadas em role
CREATE POLICY "clubes_select_auth" ON clubes FOR SELECT TO authenticated
USING (true);

CREATE POLICY "clubes_insert" ON clubes FOR INSERT TO authenticated
WITH CHECK (
    is_master() OR
    is_analista()
);

CREATE POLICY "clubes_update" ON clubes FOR UPDATE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

CREATE POLICY "clubes_delete" ON clubes FOR DELETE TO authenticated
USING (
    is_master() OR
    criado_por = auth.uid()
);

-- =============================================
-- INSERIR USUARIO MASTER INICIAL
-- =============================================

-- Criar usuario master baseado no email especificado
DO $$
DECLARE
    master_user_id UUID;
BEGIN
    -- Buscar ID do usuario master pelo email
    SELECT id INTO master_user_id
    FROM auth.users
    WHERE email = 'rav.augusto@gmail.com';

    -- Se existir, inserir ou atualizar na tabela usuarios
    IF master_user_id IS NOT NULL THEN
        INSERT INTO usuarios (id, email, nome, role, ativo)
        VALUES (master_user_id, 'rav.augusto@gmail.com', 'Raul Augusto', 'master', true)
        ON CONFLICT (id) DO UPDATE SET
            role = 'master',
            ativo = true,
            updated_at = NOW();
    END IF;
END $$;

-- =============================================
-- MIGRAR DADOS EXISTENTES PARA O MASTER
-- =============================================

-- Atualizar registros existentes sem criado_por
DO $$
DECLARE
    master_id UUID;
BEGIN
    -- Buscar ID do master
    SELECT id INTO master_id FROM usuarios WHERE role = 'master' LIMIT 1;

    -- Se existir master, atribuir dados orfaos a ele
    IF master_id IS NOT NULL THEN
        UPDATE atletas SET criado_por = master_id WHERE criado_por IS NULL;
        UPDATE jogos SET criado_por = master_id WHERE criado_por IS NULL;
        UPDATE analises_jogo SET criado_por = master_id WHERE criado_por IS NULL;
        UPDATE avaliacoes_atleta SET criado_por = master_id WHERE criado_por IS NULL;
        UPDATE clubes SET criado_por = master_id WHERE criado_por IS NULL;
    END IF;
END $$;

-- =============================================
-- TRIGGER PARA ATUALIZAR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS usuarios_updated_at ON usuarios;
CREATE TRIGGER usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FIM DA MIGRACAO
-- =============================================
