-- =============================================
-- SEED DE TESTE — 22 atletas ficticios (2 por posicao) pro Esporte Clube Laranja Mecanica
-- Nome = a propria posicao, pra saber na hora pra onde arrastar no campo.
-- O "2" de cada posicao sobra pra testar o banco de suplentes.
-- Para remover: DELETE FROM atletas WHERE nome LIKE '%(Teste)%';
-- =============================================

INSERT INTO atletas (clube_id, nome, posicao, numero_camisa, categoria, ativo)
VALUES
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Goleiro 1 (Teste)', 'Goleiro', 78, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Goleiro 2 (Teste)', 'Goleiro', 79, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Lateral Direito 1 (Teste)', 'Lateral Direito', 80, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Lateral Direito 2 (Teste)', 'Lateral Direito', 81, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Lateral Esquerdo 1 (Teste)', 'Lateral Esquerdo', 82, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Lateral Esquerdo 2 (Teste)', 'Lateral Esquerdo', 83, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Zagueiro 1 (Teste)', 'Zagueiro', 84, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Zagueiro 2 (Teste)', 'Zagueiro', 85, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Volante 1 (Teste)', 'Volante', 86, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Volante 2 (Teste)', 'Volante', 87, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Meio-Campo 1 (Teste)', 'Meio-Campo', 88, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Meio-Campo 2 (Teste)', 'Meio-Campo', 89, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Meia Atacante 1 (Teste)', 'Meia Atacante', 90, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Meia Atacante 2 (Teste)', 'Meia Atacante', 91, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Ponta Direita 1 (Teste)', 'Ponta Direita', 92, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Ponta Direita 2 (Teste)', 'Ponta Direita', 93, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Ponta Esquerda 1 (Teste)', 'Ponta Esquerda', 94, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Ponta Esquerda 2 (Teste)', 'Ponta Esquerda', 95, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Centroavante 1 (Teste)', 'Centroavante', 96, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Centroavante 2 (Teste)', 'Centroavante', 97, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Atacante 1 (Teste)', 'Atacante', 98, 'Sub-14', true),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Atacante 2 (Teste)', 'Atacante', 99, 'Sub-14', true);

-- =============================================
-- Comissao tecnica de teste, se quiser testar aquela parte tambem
-- Para remover: DELETE FROM comissao_tecnica WHERE nome LIKE '%(Teste)%';
-- =============================================

INSERT INTO comissao_tecnica (clube_id, nome, funcao)
VALUES
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Treinador (Teste)', 'Treinador'),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Auxiliar Técnico (Teste)', 'Auxiliar Técnico'),
  ('6f5d634e-db2a-41b5-9aca-c21f27810f11', 'Preparador Físico (Teste)', 'Preparador Físico');

-- =============================================
-- FIM DO SEED
-- =============================================
