create table checkin_events (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests(id) on delete set null,
  scanned_by uuid not null references public.profiles(id),
  scanned_at timestamptz not null default now(),
  result text not null check (result in ('admitted', 'duplicate', 'override_admitted', 'invalid_token')),
  device_label text,
  raw_payload_hash text
);

create index checkin_events_guest_id_idx on checkin_events(guest_id);
create index checkin_events_scanned_at_idx on checkin_events(scanned_at desc);
