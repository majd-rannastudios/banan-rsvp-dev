-- Organizer auth is a placeholder for now (cookie-based, app-layer only;
-- real Supabase Auth lands later) - there is no real auth.uid() to
-- attribute actions to yet. These two columns are audit/attribution
-- metadata only, not access-control - relaxing them to nullable doesn't
-- change who is allowed to do what, it just means some rows won't have a
-- known actor until real auth exists to populate them properly.
alter table messages alter column created_by drop not null;
alter table checkin_events alter column scanned_by drop not null;
