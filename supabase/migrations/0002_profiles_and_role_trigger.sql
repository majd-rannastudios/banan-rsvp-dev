create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role organizer_role not null default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Populates profiles on signup. Role/full_name come from raw_user_meta_data
-- when set by the inviting admin's server action; defaults to 'viewer'.
create function public.handle_new_organizer_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::organizer_role, 'viewer'::organizer_role)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_organizer_user();

-- SECURITY DEFINER so this can be called from RLS policies on OTHER tables
-- without recursively re-evaluating RLS on profiles itself. Returns null
-- (and therefore fails every role check) for deactivated accounts.
create function public.current_role()
returns organizer_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;
