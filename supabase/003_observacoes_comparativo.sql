-- =============================================
-- MIGRACAO: Tabela de Observacoes de Comparativo
-- Execute este SQL no SQL Editor do Supabase
-- =============================================

-- Tabela para armazenar observacoes feitas durante analise comparativa
CREATE TABLE IF NOT EXISTS observacoes_comparativo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atleta_id UUID REFERENCES atletas(id) ON DELETE CASCADE,
    data_observacao DATE NOT NULL DEFAULT CURRENT_DATE,
    pontos_fortes TEXT,
    pontos_desenvolver TEXT,
    observacoes_gerais TEXT,
    categoria_analise VARCHAR(10) CHECK (categoria_analise IN ('geral', 'cbf', 'ofe', 'def')) DEFAULT 'geral',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice para buscar observacoes por atleta
CREATE INDEX IF NOT EXISTS idx_observacoes_atleta ON observacoes_comparativo(atleta_id);
CREATE INDEX IF NOT EXISTS idx_observacoes_data ON observacoes_comparativo(data_observacao);

-- RLS
ALTER TABLE observacoes_comparativo ENABLE ROW LEVEL SECURITY;

-- Politica para usuarios autenticados
CREATE POLICY "Usuarios autenticados tem acesso total a observacoes_comparativo" ON observacoes_comparativo
    FOR ALL TO authenticated USING (true);

-- =============================================
-- FIM DA MIGRACAO
-- =============================================
