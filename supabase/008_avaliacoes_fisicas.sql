-- =============================================
-- OLHAR DA BASE - Avaliacao Fisica SEPARADA
-- Cria uma tabela propria para avaliacoes fisicas (cadencia periodica, feita no clube),
-- desacoplada da avaliacao de jogo. NAO apaga nada: copia o fisico ja existente.
-- Rode SOMENTE apos backup.
-- =============================================

-- ---------- 1) TABELA NOVA ----------
CREATE TABLE IF NOT EXISTS avaliacoes_fisicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atleta_id UUID REFERENCES atletas(id) ON DELETE CASCADE,
    data_avaliacao DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Antropometricos
    altura_avaliacao DECIMAL(3,2) DEFAULT NULL,
    peso_avaliacao DECIMAL(4,1) DEFAULT NULL,
    envergadura DECIMAL(3,2) DEFAULT NULL,

    -- Velocidade
    velocidade_10m DECIMAL(4,2) DEFAULT NULL,
    velocidade_30m DECIMAL(4,2) DEFAULT NULL,

    -- Potencia e agilidade
    salto_vertical DECIMAL(4,1) DEFAULT NULL,
    agilidade_teste DECIMAL(5,2) DEFAULT NULL,

    -- Resistencia
    yoyo_nivel VARCHAR(10) DEFAULT NULL,
    yoyo_distancia INTEGER DEFAULT NULL,

    -- Maturacao
    idade_biologica DECIMAL(3,1) DEFAULT NULL,
    estagio_phv VARCHAR(20) DEFAULT NULL CHECK (estagio_phv IN ('pre', 'durante', 'pos') OR estagio_phv IS NULL),

    -- Flexibilidade
    sentar_alcancar DECIMAL(4,1) DEFAULT NULL,

    observacoes TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_fisicas_atleta ON avaliacoes_fisicas(atleta_id);

-- ---------- 2) RLS (mesmo padrao das outras tabelas) ----------
ALTER TABLE avaliacoes_fisicas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'avaliacoes_fisicas'
    AND policyname = 'Usuarios autenticados tem acesso total a avaliacoes fisicas'
  ) THEN
    CREATE POLICY "Usuarios autenticados tem acesso total a avaliacoes fisicas"
      ON avaliacoes_fisicas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ---------- 3) COPIA (nao move) o fisico ja lancado ----------
-- Idempotente: nao duplica se ja houver registro para o mesmo atleta+data.
INSERT INTO avaliacoes_fisicas (
    atleta_id, data_avaliacao,
    altura_avaliacao, peso_avaliacao, envergadura,
    velocidade_10m, velocidade_30m,
    salto_vertical, agilidade_teste,
    yoyo_nivel, yoyo_distancia,
    idade_biologica, estagio_phv, sentar_alcancar
)
SELECT
    a.atleta_id, a.data_avaliacao,
    a.altura_avaliacao, a.peso_avaliacao, a.envergadura,
    a.velocidade_10m, a.velocidade_30m,
    a.salto_vertical, a.agilidade_teste,
    a.yoyo_nivel, a.yoyo_distancia,
    a.idade_biologica, a.estagio_phv, a.sentar_alcancar
FROM avaliacoes_atleta a
WHERE (
    a.altura_avaliacao IS NOT NULL OR a.peso_avaliacao IS NOT NULL OR a.envergadura IS NOT NULL
    OR a.velocidade_10m IS NOT NULL OR a.velocidade_30m IS NOT NULL
    OR a.salto_vertical IS NOT NULL OR a.agilidade_teste IS NOT NULL
    OR a.yoyo_nivel IS NOT NULL OR a.yoyo_distancia IS NOT NULL
    OR a.idade_biologica IS NOT NULL OR a.estagio_phv IS NOT NULL OR a.sentar_alcancar IS NOT NULL
)
AND NOT EXISTS (
    SELECT 1 FROM avaliacoes_fisicas f
    WHERE f.atleta_id = a.atleta_id AND f.data_avaliacao = a.data_avaliacao
);

-- =============================================
-- FIM. As colunas fisicas antigas em avaliacoes_atleta permanecem intactas (backup).
-- =============================================
