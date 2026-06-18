-- Public, safe subset of the (single, active) event + its slots.
-- No anon grant on events/event_slots tables exists - this is the only
-- public read path for event details.
create or replace function public.get_event_public_info()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'name', e.name,
    'starts_on', e.starts_on,
    'ends_on', e.ends_on,
    'venue_name', e.venue_name,
    'venue_address', e.venue_address,
    'venue_maps_url', e.venue_maps_url,
    'hero_copy_en', e.hero_copy_en,
    'hero_copy_ar', e.hero_copy_ar,
    'slots', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', s.id,
        'slot_date', s.slot_date,
        'starts_at', s.starts_at,
        'label_en', s.label_en,
        'label_ar', s.label_ar
      ) order by s.sort_order), '[]'::jsonb)
      from event_slots s
      where s.event_id = e.id and s.is_active
    )
  )
  from events e
  order by e.created_at
  limit 1;
$$;

revoke all on function public.get_event_public_info() from public;
grant execute on function public.get_event_public_info() to anon, authenticated;


-- Looks up a guest by invite token. Returns a null-shaped {found:false}
-- result (never a Postgres error) on an unknown token, so the page can
-- render a generic "invitation not found" without leaking whether the
-- token was merely malformed vs. valid-but-unknown.
create or replace function public.get_invite(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  g guests;
begin
  select * into g from guests where invite_token = p_token;

  if g.id is null then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'token', g.invite_token,
    'full_name', g.full_name,
    'party_size', g.party_size,
    'preferred_slot_id', g.preferred_slot_id,
    'transfer_choice', g.transfer_choice,
    'rsvp_status', g.rsvp_status,
    'language_pref', g.language_pref,
    'event', public.get_event_public_info()
  );
end;
$$;

revoke all on function public.get_invite(text) from public;
grant execute on function public.get_invite(text) to anon, authenticated;


-- Guest-facing RSVP submission. Validates status/party size/slot, requires
-- PDPL consent when confirming, writes atomically, returns the updated
-- record so the confirmation/QR screen can render immediately.
create or replace function public.submit_rsvp(
  p_token text,
  p_status text,
  p_party_size int,
  p_slot_id uuid,
  p_transfer text,
  p_language text,
  p_consent boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  g guests;
begin
  if p_status not in ('confirmed', 'declined') then
    return jsonb_build_object('ok', false, 'reason', 'invalid_status');
  end if;

  if p_status = 'confirmed' and not p_consent then
    return jsonb_build_object('ok', false, 'reason', 'consent_required');
  end if;

  if p_party_size < 1 or p_party_size > 12 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_party_size');
  end if;

  if p_transfer not in ('none', 'shuttle', 'vip') then
    return jsonb_build_object('ok', false, 'reason', 'invalid_transfer');
  end if;

  select * into g from guests where invite_token = p_token;
  if g.id is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid_token');
  end if;

  if p_status = 'confirmed' and not exists (
    select 1 from event_slots where id = p_slot_id and is_active
  ) then
    return jsonb_build_object('ok', false, 'reason', 'invalid_slot');
  end if;

  update guests set
    rsvp_status = p_status::rsvp_status,
    party_size = p_party_size,
    preferred_slot_id = case when p_status = 'confirmed' then p_slot_id else preferred_slot_id end,
    transfer_choice = p_transfer::transfer_choice,
    language_pref = coalesce(p_language::language_pref, language_pref),
    consent_pdpl_at = case when p_consent then now() else consent_pdpl_at end,
    responded_at = now(),
    updated_at = now()
  where id = g.id
  returning * into g;

  return jsonb_build_object(
    'ok', true,
    'token', g.invite_token,
    'full_name', g.full_name,
    'party_size', g.party_size,
    'preferred_slot_id', g.preferred_slot_id,
    'transfer_choice', g.transfer_choice,
    'rsvp_status', g.rsvp_status
  );
end;
$$;

revoke all on function public.submit_rsvp(text, text, int, uuid, text, text, boolean) from public;
grant execute on function public.submit_rsvp(text, text, int, uuid, text, text, boolean) to anon, authenticated;


-- Check-in scan. NOT anon-callable (EXECUTE grant below is authenticated
-- only) and re-checks the caller's role internally, since SECURITY
-- DEFINER functions don't automatically inherit caller-role restrictions.
-- scanned_by is always auth.uid() (the caller's own session), never a
-- client-supplied parameter, so it can't be spoofed.
create or replace function public.checkin_scan(p_token text, p_device_label text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role organizer_role;
  g guests;
begin
  caller_role := public.current_role();
  if caller_role is null or caller_role not in ('admin', 'checkin_staff') then
    return jsonb_build_object('ok', false, 'reason', 'forbidden');
  end if;

  select * into g from guests where invite_token = p_token;

  if g.id is null then
    insert into checkin_events (guest_id, scanned_by, result, device_label)
    values (null, auth.uid(), 'invalid_token', p_device_label);
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;

  if g.rsvp_status = 'checked_in' then
    insert into checkin_events (guest_id, scanned_by, result, device_label)
    values (g.id, auth.uid(), 'duplicate', p_device_label);
    return jsonb_build_object(
      'ok', false,
      'reason', 'duplicate',
      'guest', jsonb_build_object('full_name', g.full_name, 'party_size', g.party_size),
      'previous_checkin_at', g.checked_in_at
    );
  end if;

  update guests set
    rsvp_status = 'checked_in',
    checked_in_at = now(),
    checked_in_by = auth.uid(),
    updated_at = now()
  where id = g.id
  returning * into g;

  insert into checkin_events (guest_id, scanned_by, result, device_label)
  values (g.id, auth.uid(), 'admitted', p_device_label);

  return jsonb_build_object(
    'ok', true,
    'guest', jsonb_build_object(
      'full_name', g.full_name,
      'party_size', g.party_size,
      'transfer_choice', g.transfer_choice
    )
  );
end;
$$;

revoke all on function public.checkin_scan(text, text) from public;
grant execute on function public.checkin_scan(text, text) to authenticated;


-- Explicit "admit anyway" path for a duplicate scan. Same access control
-- and scanned_by handling as checkin_scan above.
create or replace function public.checkin_override(p_guest_id uuid, p_device_label text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role organizer_role;
  g guests;
begin
  caller_role := public.current_role();
  if caller_role is null or caller_role not in ('admin', 'checkin_staff') then
    return jsonb_build_object('ok', false, 'reason', 'forbidden');
  end if;

  update guests set
    rsvp_status = 'checked_in',
    checked_in_at = now(),
    checked_in_by = auth.uid(),
    updated_at = now()
  where id = p_guest_id
  returning * into g;

  if g.id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  insert into checkin_events (guest_id, scanned_by, result, device_label)
  values (g.id, auth.uid(), 'override_admitted', p_device_label);

  return jsonb_build_object(
    'ok', true,
    'guest', jsonb_build_object(
      'full_name', g.full_name,
      'party_size', g.party_size,
      'transfer_choice', g.transfer_choice
    )
  );
end;
$$;

revoke all on function public.checkin_override(uuid, text) from public;
grant execute on function public.checkin_override(uuid, text) to authenticated;
