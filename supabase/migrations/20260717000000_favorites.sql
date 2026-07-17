create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_profile_id_business_id_key unique (profile_id, business_id)
);

alter table public.favorites enable row level security;

create policy "favorites_select_own_v1_5b"
  on public.favorites
  for select
  using ((select auth.uid()) = profile_id);

create policy "favorites_insert_own_v1_5b"
  on public.favorites
  for insert
  with check ((select auth.uid()) = profile_id);

create policy "favorites_delete_own_v1_5b"
  on public.favorites
  for delete
  using ((select auth.uid()) = profile_id);

create index favorites_profile_id_created_at_idx
  on public.favorites (profile_id, created_at desc);

create index favorites_business_id_idx
  on public.favorites (business_id);
