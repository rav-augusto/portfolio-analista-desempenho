-- 012_dossie_delete.sql
-- Permite REVOGAR (apagar) um dossiê compartilhado. Aditiva: só adiciona policy + grant.

create policy dossie_pub_delete on dossies_publicos
  for delete to authenticated using (true);

grant delete on dossies_publicos to authenticated;
