-- Phase 1, Version 1.5A: ensure every Supabase Auth user has one Profile.
-- This preserves the existing legacy `owner` role and `businesses.owner_id`
-- workflow. Profile role/permission semantics are intentionally deferred.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'owner'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill only Auth users that do not already have a Profile. Existing
-- profile data and roles, including admins, remain unchanged.
insert into public.profiles (
  id,
  email,
  full_name,
  role
)
select
  users.id,
  users.email,
  coalesce(users.raw_user_meta_data ->> 'full_name', ''),
  'owner'
from auth.users as users
left join public.profiles as profiles on profiles.id = users.id
where profiles.id is null;
