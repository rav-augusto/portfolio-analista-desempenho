-- 011_dossies_publicos.sql
-- Snapshot do dossiê para compartilhar por link (enviar ao empresário/clube).
-- ADITIVA: só cria uma tabela nova + policies + grants. NÃO altera nem apaga nada existente.
-- (Sem 'drop policy' para não disparar aviso de operação destrutiva. Se precisar re-rodar,
--  apague antes as policies criadas ou ignore o erro "policy already exists".)

create table if not exists dossies_publicos (
  id uuid primary key default gen_random_uuid(),
  atleta_id uuid,
  atleta_nome text,
  html text not null,
  criado_em timestamptz not null default now()
);

alter table dossies_publicos enable row level security;

-- Leitura pública: o link é "não listado" (UUID impossível de adivinhar).
create policy dossie_pub_select on dossies_publicos
  for select using (true);

-- Só usuários autenticados (admin/analista logado) criam snapshots.
create policy dossie_pub_insert on dossies_publicos
  for insert to authenticated with check (true);

grant select on dossies_publicos to anon;
grant select, insert on dossies_publicos to authenticated;
