create extension if not exists pgcrypto;

create type language_pref as enum ('en', 'ar');
create type rsvp_status as enum ('invited', 'confirmed', 'declined', 'checked_in');
create type transfer_choice as enum ('none', 'shuttle', 'vip');
create type organizer_role as enum ('admin', 'checkin_staff', 'broadcast_manager', 'viewer');
create type message_channel as enum ('whatsapp', 'sms', 'email');
create type message_status as enum ('queued', 'sending', 'sent', 'failed', 'mocked');

create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  venue_name text,
  venue_address text,
  venue_maps_url text,
  hero_copy_en text,
  hero_copy_ar text,
  reminder_hours_before int not null default 24,
  pdpl_retention_days int not null default 90,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table event_slots (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  slot_date date not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  label_en text not null,
  label_ar text not null,
  capacity int,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create index event_slots_event_id_idx on event_slots(event_id);
