import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RsvpStatus, TransferChoice } from "@/lib/guest/types";

/**
 * Reads via the admin (service-role) client, not the regular anon/session
 * client. Organizer auth is currently a dummy cookie session with no real
 * Supabase Auth session behind it, so RLS (which requires a real
 * authenticated user) would block these reads entirely - access control
 * for now lives in requireRole() at the call site, not in Postgres. This
 * needs tightening once real auth lands (see project memory).
 */
export interface Guest {
  id: string;
  inviteToken: string;
  fullName: string;
  mobile: string;
  email: string | null;
  nationality: string | null;
  partySize: number;
  preferredSlotId: string | null;
  slotLabel: string | null;
  transferChoice: TransferChoice;
  rsvpStatus: RsvpStatus;
  languagePref: "en" | "ar";
  isVip: boolean;
  notes: string | null;
  checkedInAt: string | null;
  createdAt: string;
}

interface RawGuestRow {
  id: string;
  invite_token: string;
  full_name: string;
  mobile: string;
  email: string | null;
  nationality: string | null;
  party_size: number;
  preferred_slot_id: string | null;
  transfer_choice: TransferChoice;
  rsvp_status: RsvpStatus;
  language_pref: "en" | "ar";
  is_vip: boolean;
  notes: string | null;
  checked_in_at: string | null;
  created_at: string;
  event_slots: { label_en: string } | null;
}

function mapGuest(row: RawGuestRow): Guest {
  return {
    id: row.id,
    inviteToken: row.invite_token,
    fullName: row.full_name,
    mobile: row.mobile,
    email: row.email,
    nationality: row.nationality,
    partySize: row.party_size,
    preferredSlotId: row.preferred_slot_id,
    slotLabel: row.event_slots?.label_en ?? null,
    transferChoice: row.transfer_choice,
    rsvpStatus: row.rsvp_status,
    languagePref: row.language_pref,
    isVip: row.is_vip,
    notes: row.notes,
    checkedInAt: row.checked_in_at,
    createdAt: row.created_at,
  };
}

export async function listGuests(): Promise<Guest[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("guests")
    .select("*, event_slots(label_en)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listGuests failed", error);
    return [];
  }
  return (data as unknown as RawGuestRow[]).map(mapGuest);
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("guests")
    .select("*, event_slots(label_en)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapGuest(data as unknown as RawGuestRow);
}

export async function listEventSlotsForFilter(): Promise<{ id: string; label: string }[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("event_slots")
    .select("id, label_en")
    .order("sort_order");
  return (data ?? []).map((s) => ({ id: s.id, label: s.label_en }));
}
