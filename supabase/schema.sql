-- =============================================
-- SCHEMA DO BANCO DE DADOS - OLHAR DA BASE
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela de Clubes
CREATE TABLE IF NOT EXISTS clubes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  escudo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Jogos
CREATE TABLE IF NOT EXISTS jogos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clube_id UUID NOT NULL REFERENCES clubes(id) ON DELETE CASCADE,
  adversario VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  local VARCHAR(255),
  competicao VARCHAR(255) NOT NULL,
  placar_clube INTEGER,
  placar_adversario INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Analises
CREATE TABLE IF NOT EXISTS analises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jogo_id UUID NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  dados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para melhor performance
CREATE INDEX IF NOT EXISTS idx_jogos_clube_id ON jogos(clube_id);
CREATE INDEX IF NOT EXISTS idx_jogos_data ON jogos(data DESC);
CREATE INDEX IF NOT EXISTS idx_analises_jogo_id ON analises(jogo_id);

-- RLS (Row Level Security)
ALTER TABLE clubes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises ENABLE ROW LEVEL SECURITY;

-- Politicas de acesso - Leitura publica
CREATE POLICY "Clubes sao visiveis publicamente" ON clubes
  FOR SELECT USING (true);

CREATE POLICY "Jogos sao visiveis publicamente" ON jogos
  FOR SELECT USING (true);

CREATE POLICY "Analises sao visiveis publicamente" ON analises
  FOR SELECT USING (true);

-- Politicas de acesso - Escrita apenas para usuarios autenticados
CREATE POLICY "Usuarios autenticados podem inserir clubes" ON clubes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem atualizar clubes" ON clubes
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem deletar clubes" ON clubes
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem inserir jogos" ON jogos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem atualizar jogos" ON jogos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem deletar jogos" ON jogos
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem inserir analises" ON analises
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem atualizar analises" ON analises
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados podem deletar analises" ON analises
  FOR DELETE USING (auth.role() = 'authenticated');
