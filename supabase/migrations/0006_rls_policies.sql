alter table events enable row level security;
alter table event_slots enable row level security;
alter table guests enable row level security;
alter table profiles enable row level security;
alter table messages enable row level security;
alter table message_recipients enable row level security;
alter table checkin_events enable row level security;

-- events / event_slots: every organizer role can read; only admin writes.
-- Anon access goes exclusively through get_event_public_info() (RPC,
-- SECURITY DEFINER) - no anon grant on these tables at all.
create policy "organizers can view events" on events
  for select to authenticated
  using (public.current_role() is not null);

create policy "admin can manage events" on events
  for all to authenticated
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "organizers can view event_slots" on event_slots
  for select to authenticated
  using (public.current_role() is not null);

create policy "admin can manage event_slots" on event_slots
  for all to authenticated
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- guests: zero anon grants. admin/broadcast_manager/viewer can read; only
-- admin writes directly. checkin_staff has no policy here at all - every
-- check-in read/write goes through the checkin_scan/checkin_override RPCs
-- (SECURITY DEFINER, so they bypass these policies by design).
create policy "admin broadcast_manager viewer can view guests" on guests
  for select to authenticated
  using (public.current_role() in ('admin', 'broadcast_manager', 'viewer'));

create policy "admin can manage guests" on guests
  for all to authenticated
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- profiles: everyone can see/update their own row; admin sees/manages all.
create policy "users can view own profile" on profiles
  for select to authenticated
  using (id = auth.uid());

create policy "users can update own profile" on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "admin can view all profiles" on profiles
  for select to authenticated
  using (public.current_role() = 'admin');

create policy "admin can manage all profiles" on profiles
  for all to authenticated
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- messages / message_recipients: admin + broadcast_manager full access,
-- viewer read-only, checkin_staff none.
create policy "admin broadcast_manager can manage messages" on messages
  for all to authenticated
  using (public.current_role() in ('admin', 'broadcast_manager'))
  with check (public.current_role() in ('admin', 'broadcast_manager'));

create policy "viewer can view messages" on messages
  for select to authenticated
  using (public.current_role() = 'viewer');

create policy "admin broadcast_manager can manage message_recipients" on message_recipients
  for all to authenticated
  using (public.current_role() in ('admin', 'broadcast_manager'))
  with check (public.current_role() in ('admin', 'broadcast_manager'));

create policy "viewer can view message_recipients" on message_recipients
  for select to authenticated
  using (public.current_role() = 'viewer');

-- checkin_events: every organizer role can read (dashboard "recent
-- arrivals" feed); nobody gets a direct write policy - inserts only ever
-- happen via the SECURITY DEFINER checkin_scan/checkin_override RPCs.
create policy "organizers can view checkin_events" on checkin_events
  for select to authenticated
  using (public.current_role() is not null);
