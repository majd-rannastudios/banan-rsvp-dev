create table guests (
  id uuid primary key default gen_random_uuid(),
  invite_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  full_name text not null,
  mobile text not null,
  email text,
  nationality text,
  party_size int not null default 1 check (party_size between 1 and 12),
  preferred_slot_id uuid references event_slots(id),
  transfer_choice transfer_choice not null default 'none',
  rsvp_status rsvp_status not null default 'invited',
  language_pref language_pref not null default 'en',
  consent_pdpl_at timestamptz,
  is_vip boolean not null default false,
  notes text,
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  responded_at timestamptz
);

create index guests_rsvp_status_idx on guests(rsvp_status);
create index guests_preferred_slot_id_idx on guests(preferred_slot_id);
