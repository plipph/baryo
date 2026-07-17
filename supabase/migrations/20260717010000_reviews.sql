create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text not null check (char_length(trim(review)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_profile_id_business_id_key unique (profile_id, business_id)
);

alter table public.reviews enable row level security;

create policy "reviews_select_public_v1_5b"
  on public.reviews
  for select
  using (true);

create policy "reviews_insert_own_v1_5b"
  on public.reviews
  for insert
  to authenticated
  with check (
    (select auth.uid()) = profile_id
    and not exists (
      select 1
      from public.businesses
      where businesses.id = reviews.business_id
        and businesses.owner_id = (select auth.uid())
    )
  );

create policy "reviews_update_own_v1_5b"
  on public.reviews
  for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check (
    (select auth.uid()) = profile_id
    and not exists (
      select 1
      from public.businesses
      where businesses.id = reviews.business_id
        and businesses.owner_id = (select auth.uid())
    )
  );

create policy "reviews_delete_own_v1_5b"
  on public.reviews
  for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

create function public.set_review_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_review_updated_at();

create index reviews_business_id_created_at_idx
  on public.reviews (business_id, created_at desc);
