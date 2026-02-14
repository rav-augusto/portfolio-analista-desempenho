-- =============================================
-- OLHAR DA BASE - Schema do Banco de Dados
-- Execute este SQL no SQL Editor do Supabase
-- =============================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: clubes
-- =============================================
CREATE TABLE IF NOT EXISTS clubes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    sigla VARCHAR(10),
    escudo_url VARCHAR(500),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    endereco VARCHAR(500),
    estadio_ct VARCHAR(255),
    categoria VARCHAR(255),
    instagram VARCHAR(100),
    contato_nome VARCHAR(255),
    contato_email VARCHAR(255),
    contato_telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MIGRACAO: Adicionar colunas aos clubes (executar se tabela ja existir)
-- ALTER TABLE clubes ADD COLUMN IF NOT EXISTS sigla VARCHAR(10);
-- ALTER TABLE clubes ADD COLUMN IF NOT EXISTS endereco VARCHAR(500);
-- ALTER TABLE clubes ADD COLUMN IF NOT EXISTS estadio_ct VARCHAR(255);
-- ALTER TABLE clubes ADD COLUMN IF NOT EXISTS instagram VARCHAR(100);

-- =============================================
-- TABELA: atletas
-- =============================================
CREATE TABLE IF NOT EXISTS atletas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clube_id UUID REFERENCES clubes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    foto_url VARCHAR(500),
    data_nascimento DATE,
    posicao VARCHAR(50),
    posicao_secundaria VARCHAR(50),
    categoria VARCHAR(50),
    numero_camisa INTEGER,
    pe_dominante VARCHAR(20) CHECK (pe_dominante IN ('direito', 'esquerdo', 'ambidestro')),
    altura DECIMAL(3,2),
    peso DECIMAL(4,1),
    nacionalidade VARCHAR(100),
    naturalidade VARCHAR(150),
    telefone VARCHAR(20),
    instagram VARCHAR(100),
    nome_responsavel VARCHAR(255),
    telefone_responsavel VARCHAR(20),
    clubes_anteriores TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MIGRACAO: Adicionar colunas aos atletas (executar se tabela ja existir)
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS categoria VARCHAR(50);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS posicao_secundaria VARCHAR(50);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS nacionalidade VARCHAR(100);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS naturalidade VARCHAR(150);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS instagram VARCHAR(100);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS nome_responsavel VARCHAR(255);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS telefone_responsavel VARCHAR(20);
-- ALTER TABLE atletas ADD COLUMN IF NOT EXISTS clubes_anteriores TEXT;

-- =============================================
-- TABELA: jogos
-- =============================================
CREATE TABLE IF NOT EXISTS jogos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clube_id UUID REFERENCES clubes(id) ON DELETE CASCADE,
    competicao VARCHAR(255) NOT NULL,
    fase VARCHAR(100),
    categoria VARCHAR(50),
    data_jogo DATE NOT NULL,
    local VARCHAR(255),
    adversario VARCHAR(255) NOT NULL,
    placar_clube INTEGER,
    placar_adversario INTEGER,
    video_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MIGRACAO: Adicionar campo categoria aos jogos (executar se tabela ja existir)
-- ALTER TABLE jogos ADD COLUMN IF NOT EXISTS categoria VARCHAR(50);

-- =============================================
-- TABELA: analises_jogo
-- =============================================
CREATE TABLE IF NOT EXISTS analises_jogo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogo_id UUID REFERENCES jogos(id) ON DELETE CASCADE,

    -- Organizacao Ofensiva
    sistema_tatico VARCHAR(20),
    org_ofensiva_obs TEXT,
    saida_bola TEXT,
    participacao_goleiro TEXT,
    linhas_passe TEXT,
    amplitude TEXT,
    criacao_central TEXT,
    criacao_direita TEXT,
    criacao_esquerda TEXT,
    finalizacoes_total INTEGER DEFAULT 0,
    finalizacoes_gol INTEGER DEFAULT 0,
    finalizacoes_fora INTEGER DEFAULT 0,
    finalizacoes_bloqueadas INTEGER DEFAULT 0,

    -- Organizacao Defensiva
    bloco_defensivo VARCHAR(20),
    org_defensiva_obs TEXT,
    tipo_marcacao VARCHAR(50),
    pressao VARCHAR(50),
    coberturas TEXT,
    linha_defensiva TEXT,
    vulnerabilidades TEXT,

    -- Transicao Ofensiva
    trans_ofensiva_obs TEXT,
    primeira_acao VARCHAR(50),
    velocidade_transicao VARCHAR(50),
    contra_ataques INTEGER DEFAULT 0,
    contra_ataques_finalizados INTEGER DEFAULT 0,
    gols_contra_ataque INTEGER DEFAULT 0,

    -- Transicao Defensiva
    trans_defensiva_obs TEXT,
    reacao_perda TEXT,
    tempo_reacao VARCHAR(50),

    -- Bolas Paradas Ofensivas
    escanteio_cobrador VARCHAR(100),
    escanteio_tipo VARCHAR(50),
    escanteio_movimentacoes TEXT,
    faltas_caracteristicas TEXT,

    -- Bolas Paradas Defensivas
    escanteio_def_marcacao VARCHAR(50),
    escanteio_def_posicao_gk TEXT,
    escanteio_def_primeiro_pau VARCHAR(50),
    escanteio_def_segundo_pau VARCHAR(50),
    bp_vulnerabilidades TEXT,

    -- Geral
    conclusoes TEXT,
    recomendacoes_treino TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: avaliacoes_atleta
-- =============================================
CREATE TABLE IF NOT EXISTS avaliacoes_atleta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atleta_id UUID REFERENCES atletas(id) ON DELETE CASCADE,
    jogo_id UUID REFERENCES jogos(id) ON DELETE SET NULL,
    data_avaliacao DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo VARCHAR(20) CHECK (tipo IN ('jogo', 'treino', 'geral')) DEFAULT 'jogo',

    -- 8 Dimensoes CBF (notas 0.5 a 5.0)
    forca DECIMAL(2,1) CHECK (forca >= 0.5 AND forca <= 5.0),
    velocidade DECIMAL(2,1) CHECK (velocidade >= 0.5 AND velocidade <= 5.0),
    tecnica DECIMAL(2,1) CHECK (tecnica >= 0.5 AND tecnica <= 5.0),
    dinamica DECIMAL(2,1) CHECK (dinamica >= 0.5 AND dinamica <= 5.0),
    inteligencia DECIMAL(2,1) CHECK (inteligencia >= 0.5 AND inteligencia <= 5.0),
    um_contra_um DECIMAL(2,1) CHECK (um_contra_um >= 0.5 AND um_contra_um <= 5.0),
    atitude DECIMAL(2,1) CHECK (atitude >= 0.5 AND atitude <= 5.0),
    potencial DECIMAL(2,1) CHECK (potencial >= 0.5 AND potencial <= 5.0),

    -- Campo para descrever contexto quando não for jogo (treino/geral)
    contexto_treino VARCHAR(500),

    -- Observacoes por dimensao CBF
    obs_forca TEXT,
    obs_velocidade TEXT,
    obs_tecnica TEXT,
    obs_dinamica TEXT,
    obs_inteligencia TEXT,
    obs_um_contra_um TEXT,
    obs_atitude TEXT,
    obs_potencial TEXT,

    -- 6 Principios Ofensivos (notas 0.5 a 5.0)
    penetracao DECIMAL(2,1) CHECK (penetracao >= 0.5 AND penetracao <= 5.0),
    cobertura_ofensiva DECIMAL(2,1) CHECK (cobertura_ofensiva >= 0.5 AND cobertura_ofensiva <= 5.0),
    espaco_com_bola DECIMAL(2,1) CHECK (espaco_com_bola >= 0.5 AND espaco_com_bola <= 5.0),
    espaco_sem_bola DECIMAL(2,1) CHECK (espaco_sem_bola >= 0.5 AND espaco_sem_bola <= 5.0),
    mobilidade DECIMAL(2,1) CHECK (mobilidade >= 0.5 AND mobilidade <= 5.0),
    unidade_ofensiva DECIMAL(2,1) CHECK (unidade_ofensiva >= 0.5 AND unidade_ofensiva <= 5.0),

    -- Observacoes por principio ofensivo
    obs_penetracao TEXT,
    obs_cobertura_ofensiva TEXT,
    obs_espaco_com_bola TEXT,
    obs_espaco_sem_bola TEXT,
    obs_mobilidade TEXT,
    obs_unidade_ofensiva TEXT,

    -- 6 Principios Defensivos (notas 0.5 a 5.0)
    contencao DECIMAL(2,1) CHECK (contencao >= 0.5 AND contencao <= 5.0),
    cobertura_defensiva DECIMAL(2,1) CHECK (cobertura_defensiva >= 0.5 AND cobertura_defensiva <= 5.0),
    equilibrio_recuperacao DECIMAL(2,1) CHECK (equilibrio_recuperacao >= 0.5 AND equilibrio_recuperacao <= 5.0),
    equilibrio_defensivo DECIMAL(2,1) CHECK (equilibrio_defensivo >= 0.5 AND equilibrio_defensivo <= 5.0),
    concentracao_def DECIMAL(2,1) CHECK (concentracao_def >= 0.5 AND concentracao_def <= 5.0),
    unidade_defensiva DECIMAL(2,1) CHECK (unidade_defensiva >= 0.5 AND unidade_defensiva <= 5.0),

    -- Observacoes por principio defensivo
    obs_contencao TEXT,
    obs_cobertura_defensiva TEXT,
    obs_equilibrio_recuperacao TEXT,
    obs_equilibrio_defensivo TEXT,
    obs_concentracao_def TEXT,
    obs_unidade_defensiva TEXT,

    pontos_fortes TEXT,
    pontos_desenvolver TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MIGRACAO: Adicionar campo contexto_treino (executar se tabela ja existir)
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS contexto_treino VARCHAR(500);

-- MIGRACAO: Adicionar campos OFE/DEF (executar se tabela ja existir)
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_forca TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_velocidade TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_tecnica TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_dinamica TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_inteligencia TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_um_contra_um TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_atitude TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_potencial TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS penetracao DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS cobertura_ofensiva DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS espaco_com_bola DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS espaco_sem_bola DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS mobilidade DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS unidade_ofensiva DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_penetracao TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_cobertura_ofensiva TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_espaco_com_bola TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_espaco_sem_bola TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_mobilidade TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_unidade_ofensiva TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS contencao DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS cobertura_defensiva DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS equilibrio_recuperacao DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS equilibrio_defensivo DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS concentracao_def DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS unidade_defensiva DECIMAL(2,1);
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_contencao TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_cobertura_defensiva TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_equilibrio_recuperacao TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_equilibrio_defensivo TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_concentracao_def TEXT;
-- ALTER TABLE avaliacoes_atleta ADD COLUMN IF NOT EXISTS obs_unidade_defensiva TEXT;

-- =============================================
-- TABELA: prints_taticos
-- =============================================
CREATE TABLE IF NOT EXISTS prints_taticos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analise_id UUID REFERENCES analises_jogo(id) ON DELETE CASCADE,
    imagem_url VARCHAR(500) NOT NULL,
    descricao TEXT,
    momento VARCHAR(20) CHECK (momento IN ('ofensiva', 'defensiva', 'transicao', 'bola_parada')),
    tempo_jogo VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDICES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_atletas_clube ON atletas(clube_id);
CREATE INDEX IF NOT EXISTS idx_jogos_clube ON jogos(clube_id);
CREATE INDEX IF NOT EXISTS idx_jogos_data ON jogos(data_jogo);
CREATE INDEX IF NOT EXISTS idx_analises_jogo ON analises_jogo(jogo_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_atleta ON avaliacoes_atleta(atleta_id);
CREATE INDEX IF NOT EXISTS idx_prints_analise ON prints_taticos(analise_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE clubes ENABLE ROW LEVEL SECURITY;
ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises_jogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_atleta ENABLE ROW LEVEL SECURITY;
ALTER TABLE prints_taticos ENABLE ROW LEVEL SECURITY;

-- Politicas para usuarios autenticados (admin)
CREATE POLICY "Usuarios autenticados podem ver clubes" ON clubes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados podem inserir clubes" ON clubes
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados podem atualizar clubes" ON clubes
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados podem deletar clubes" ON clubes
    FOR DELETE TO authenticated USING (true);

-- Politica para leitura publica de clubes ativos
CREATE POLICY "Leitura publica de clubes ativos" ON clubes
    FOR SELECT TO anon USING (ativo = true);

-- Politicas para atletas
CREATE POLICY "Usuarios autenticados tem acesso total a atletas" ON atletas
    FOR ALL TO authenticated USING (true);

-- Politicas para jogos
CREATE POLICY "Usuarios autenticados tem acesso total a jogos" ON jogos
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura publica de jogos" ON jogos
    FOR SELECT TO anon USING (true);

-- Politicas para analises
CREATE POLICY "Usuarios autenticados tem acesso total a analises" ON analises_jogo
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura publica de analises" ON analises_jogo
    FOR SELECT TO anon USING (true);

-- Politicas para avaliacoes
CREATE POLICY "Usuarios autenticados tem acesso total a avaliacoes" ON avaliacoes_atleta
    FOR ALL TO authenticated USING (true);

-- Politicas para prints
CREATE POLICY "Usuarios autenticados tem acesso total a prints" ON prints_taticos
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura publica de prints" ON prints_taticos
    FOR SELECT TO anon USING (true);

-- =============================================
-- FIM DO SCHEMA
-- =============================================
