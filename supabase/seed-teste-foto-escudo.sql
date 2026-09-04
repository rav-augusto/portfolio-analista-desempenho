-- =============================================
-- Coloca o escudo do clube como foto dos atletas e da comissao de teste,
-- so pra nao ficar com o icone cinza vazio nas telas de teste.
-- =============================================

UPDATE atletas
SET foto_url = 'https://sgymdxmrnuymbxfrleee.supabase.co/storage/v1/object/public/escudos/1770771446651-aaden.png'
WHERE nome LIKE '%(Teste)%' AND foto_url IS NULL;

UPDATE comissao_tecnica
SET foto_url = 'https://sgymdxmrnuymbxfrleee.supabase.co/storage/v1/object/public/escudos/1770771446651-aaden.png'
WHERE nome LIKE '%(Teste)%' AND foto_url IS NULL;
