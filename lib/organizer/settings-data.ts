import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface EventSettings {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  venueName: string | null;
  venueAddress: string | null;
  venueMapsUrl: string | null;
  heroCopyEn: string | null;
  heroCopyAr: string | null;
}

export interface EventSlotSummary {
  id: string;
  labelEn: string;
  labelAr: string;
  startsAt: string;
}

export async function getEventSettings(): Promise<EventSettings | null> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("events")
    .select("*")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    startsOn: data.starts_on,
    endsOn: data.ends_on,
    venueName: data.venue_name,
    venueAddress: data.venue_address,
    venueMapsUrl: data.venue_maps_url,
    heroCopyEn: data.hero_copy_en,
    heroCopyAr: data.hero_copy_ar,
  };
}

export async function getEventSlotsSummary(eventId: string): Promise<EventSlotSummary[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("event_slots")
    .select("id, label_en, label_ar, starts_at")
    .eq("event_id", eventId)
    .order("sort_order");

  return (data ?? []).map((s) => ({ id: s.id, labelEn: s.label_en, labelAr: s.label_ar, startsAt: s.starts_at }));
}
