create table messages (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id),
  segment_key text not null,
  segment_label_snapshot text not null,
  channels message_channel[] not null,
  body_en text not null,
  body_ar text,
  recipient_count int not null default 0,
  status message_status not null default 'queued',
  provider_meta jsonb,
  is_auto_reminder boolean not null default false,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table message_recipients (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  channel message_channel not null,
  status message_status not null default 'queued',
  provider_message_id text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index message_recipients_message_id_idx on message_recipients(message_id);
create index message_recipients_guest_id_idx on message_recipients(guest_id);
