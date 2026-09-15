-- 020_boletim_publico.sql
-- Reusa a tabela `dossies_publicos` (011) para armazenar tambem BOLETINS DO PAI.
-- Aditiva: so adiciona a coluna `tipo` com default 'dossie' para nao quebrar
-- links existentes. Idempotente.

alter table dossies_publicos add column if not exists tipo text not null default 'dossie';

-- Aceita apenas 'dossie' | 'boletim' (protege contra tipo errado).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'dossies_publicos_tipo_check'
  ) then
    alter table dossies_publicos
      add constraint dossies_publicos_tipo_check
      check (tipo in ('dossie', 'boletim'));
  end if;
end$$;

create index if not exists idx_dossies_publicos_tipo on dossies_publicos(tipo);
