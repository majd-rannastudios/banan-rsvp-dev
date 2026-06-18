"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/organizer/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface ScanResultGuest {
  fullName: string;
  partySize: number;
  transferChoice: string;
  slotLabel: string | null;
}

export interface ScanResult {
  ok: boolean;
  reason?: "invalid" | "duplicate" | "error";
  guest?: ScanResultGuest;
  guestId?: string;
  previousCheckinAt?: string | null;
}

function mapGuestRow(row: { full_name: string; party_size: number; transfer_choice: string; event_slots?: { label_en: string } | null }): ScanResultGuest {
  return {
    fullName: row.full_name,
    partySize: row.party_size,
    transferChoice: row.transfer_choice,
    slotLabel: row.event_slots?.label_en ?? null,
  };
}

export async function scanGuestToken(rawToken: string): Promise<ScanResult> {
  await requireRole(["admin", "checkin_staff"]);
  const token = rawToken.trim();
  if (!token) return { ok: false, reason: "invalid" };

  const admin = createSupabaseAdminClient();
  const { data: guest } = await admin
    .from("guests")
    .select("*, event_slots(label_en)")
    .eq("invite_token", token)
    .maybeSingle();

  if (!guest) {
    return { ok: false, reason: "invalid" };
  }

  if (guest.rsvp_status === "checked_in") {
    return {
      ok: false,
      reason: "duplicate",
      guestId: guest.id,
      guest: mapGuestRow(guest),
      previousCheckinAt: guest.checked_in_at,
    };
  }

  const { data: updated, error } = await admin
    .from("guests")
    .update({ rsvp_status: "checked_in", checked_in_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", guest.id)
    .select("*, event_slots(label_en)")
    .single();

  if (error || !updated) {
    console.error("scanGuestToken update failed", error);
    return { ok: false, reason: "error" };
  }

  revalidatePath("/organizer/dashboard");
  return { ok: true, guest: mapGuestRow(updated) };
}

export async function overrideCheckin(guestId: string): Promise<ScanResult> {
  await requireRole(["admin", "checkin_staff"]);
  const admin = createSupabaseAdminClient();

  const { data: updated, error } = await admin
    .from("guests")
    .update({ rsvp_status: "checked_in", checked_in_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", guestId)
    .select("*, event_slots(label_en)")
    .single();

  if (error || !updated) {
    return { ok: false, reason: "error" };
  }

  revalidatePath("/organizer/dashboard");
  return { ok: true, guest: mapGuestRow(updated) };
}

export interface RecentArrival {
  id: string;
  fullName: string;
  partySize: number;
  checkedInAt: string;
}

export async function getRecentArrivals(): Promise<RecentArrival[]> {
  await requireRole(["admin", "checkin_staff", "broadcast_manager", "viewer"]);
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("guests")
    .select("id, full_name, party_size, checked_in_at")
    .eq("rsvp_status", "checked_in")
    .order("checked_in_at", { ascending: false })
    .limit(8);

  return (data ?? []).map((g) => ({
    id: g.id,
    fullName: g.full_name,
    partySize: g.party_size,
    checkedInAt: g.checked_in_at!,
  }));
}
