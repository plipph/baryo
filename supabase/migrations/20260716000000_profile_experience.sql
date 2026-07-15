-- Phase 3, Version 1.5A: profile experience fields and self-service access.
-- Existing owner/admin roles and business ownership remain unchanged.

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists bio text;

alter table public.profiles enable row level security;

create policy "profiles_select_own_v1_5a"
  on public.profiles
  for select
  using ((select auth.uid()) = id);

create policy "profiles_update_own_v1_5a"
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
