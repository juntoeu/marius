-- ============================================================================
--  Supabase-Einrichtung für den geteilten Sitzplan.
--  Ausführen in Supabase: linkes Menü → "SQL Editor" → New query → einfügen → Run.
-- ============================================================================

-- 1) Tabelle für den geteilten Plan (ein Datensatz pro Tag, Belegung als JSON)
create table if not exists public.seating_plans (
  id          text primary key,
  assignments jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 2) Startzeile anlegen (leerer Plan für Samstag)
insert into public.seating_plans (id, assignments)
values ('samstag', '{}'::jsonb)
on conflict (id) do nothing;

-- 3) Zugriffsregeln (Row Level Security).
--    Der Schutz vor Fremden läuft über das App-Passwort; die App selbst
--    darf mit dem anon-Key lesen und schreiben.
alter table public.seating_plans enable row level security;

drop policy if exists "sitzplan read"  on public.seating_plans;
drop policy if exists "sitzplan write" on public.seating_plans;
drop policy if exists "sitzplan insert" on public.seating_plans;

create policy "sitzplan read"   on public.seating_plans for select using (true);
create policy "sitzplan write"  on public.seating_plans for update using (true) with check (true);
create policy "sitzplan insert" on public.seating_plans for insert with check (true);

-- 4) Live-Updates (Realtime) für die Tabelle aktivieren,
--    damit ihr beide Änderungen sofort seht.
alter publication supabase_realtime add table public.seating_plans;
