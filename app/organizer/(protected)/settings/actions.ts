"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/organizer/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface SettingsFormState {
  error?: string;
  saved?: boolean;
}

export async function updateEventSettings(
  eventId: string,
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireRole(["admin"]);

  const name = String(formData.get("name") ?? "").trim();
  const startsOn = String(formData.get("starts_on") ?? "");
  const endsOn = String(formData.get("ends_on") ?? "");

  if (!name || !startsOn || !endsOn) {
    return { error: "missing_fields" };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("events")
    .update({
      name,
      starts_on: startsOn,
      ends_on: endsOn,
      venue_name: String(formData.get("venue_name") ?? "").trim() || null,
      venue_address: String(formData.get("venue_address") ?? "").trim() || null,
      venue_maps_url: String(formData.get("venue_maps_url") ?? "").trim() || null,
      hero_copy_en: String(formData.get("hero_copy_en") ?? "").trim() || null,
      hero_copy_ar: String(formData.get("hero_copy_ar") ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    console.error("updateEventSettings failed", error);
    return { error: "server_error" };
  }

  revalidatePath("/organizer/settings");
  revalidatePath("/i", "layout");
  return { saved: true };
}
