-- =============================================
-- OLHAR DA BASE - Avaliação Física do Atleta
-- Campos para acompanhar evolução física na base
-- =============================================

-- =============================================
-- DADOS ANTROPOMÉTRICOS
-- =============================================
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS altura_avaliacao DECIMAL(3,2) DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS peso_avaliacao DECIMAL(4,1) DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS envergadura DECIMAL(3,2) DEFAULT NULL;

-- IMC será calculado no frontend (peso/altura²)

-- =============================================
-- TESTES FÍSICOS - VELOCIDADE
-- =============================================
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS velocidade_10m DECIMAL(4,2) DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS velocidade_30m DECIMAL(4,2) DEFAULT NULL;

-- =============================================
-- TESTES FÍSICOS - POTÊNCIA E AGILIDADE
-- =============================================
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS salto_vertical DECIMAL(4,1) DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS agilidade_teste DECIMAL(5,2) DEFAULT NULL;

-- =============================================
-- TESTES FÍSICOS - RESISTÊNCIA
-- =============================================
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS yoyo_nivel VARCHAR(10) DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS yoyo_distancia INTEGER DEFAULT NULL;

-- =============================================
-- MATURAÇÃO
-- =============================================
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS idade_biologica DECIMAL(3,1) DEFAULT NULL;

ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS estagio_phv VARCHAR(20) DEFAULT NULL
CHECK (estagio_phv IN ('pre', 'durante', 'pos') OR estagio_phv IS NULL);

-- =============================================
-- FLEXIBILIDADE
-- =============================================
ALTER TABLE avaliacoes_atleta
ADD COLUMN IF NOT EXISTS sentar_alcancar DECIMAL(4,1) DEFAULT NULL;

-- =============================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =============================================
COMMENT ON COLUMN avaliacoes_atleta.altura_avaliacao IS 'Altura no momento da avaliação em metros (ex: 1.75)';
COMMENT ON COLUMN avaliacoes_atleta.peso_avaliacao IS 'Peso no momento da avaliação em kg (ex: 65.5)';
COMMENT ON COLUMN avaliacoes_atleta.envergadura IS 'Envergadura em metros (ex: 1.80)';
COMMENT ON COLUMN avaliacoes_atleta.velocidade_10m IS 'Tempo em segundos para 10 metros (ex: 1.85)';
COMMENT ON COLUMN avaliacoes_atleta.velocidade_30m IS 'Tempo em segundos para 30 metros (ex: 4.25)';
COMMENT ON COLUMN avaliacoes_atleta.salto_vertical IS 'Altura do salto vertical em cm (ex: 45.5)';
COMMENT ON COLUMN avaliacoes_atleta.agilidade_teste IS 'Tempo do teste de agilidade em segundos (ex: 9.50)';
COMMENT ON COLUMN avaliacoes_atleta.yoyo_nivel IS 'Nível alcançado no Yo-Yo Test (ex: 15.1)';
COMMENT ON COLUMN avaliacoes_atleta.yoyo_distancia IS 'Distância percorrida no Yo-Yo Test em metros';
COMMENT ON COLUMN avaliacoes_atleta.idade_biologica IS 'Idade biológica estimada (ex: 14.5)';
COMMENT ON COLUMN avaliacoes_atleta.estagio_phv IS 'Estágio do Pico de Velocidade de Crescimento: pre, durante, pos';
COMMENT ON COLUMN avaliacoes_atleta.sentar_alcancar IS 'Teste sentar e alcançar em cm (ex: 25.0)';

-- =============================================
-- FIM DA MIGRAÇÃO
-- =============================================
