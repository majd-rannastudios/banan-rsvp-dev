"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/organizer/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface GuestFormState {
  error?: string;
}

function readGuestFields(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    mobile: String(formData.get("mobile") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    nationality: String(formData.get("nationality") ?? "").trim() || null,
    party_size: Math.max(1, Math.min(12, Number(formData.get("party_size") ?? 1))),
    is_vip: formData.get("is_vip") === "on",
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createGuest(_prev: GuestFormState, formData: FormData): Promise<GuestFormState> {
  await requireRole(["admin"]);
  const fields = readGuestFields(formData);

  if (!fields.full_name || !fields.mobile) {
    return { error: "missing_fields" };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("guests").insert(fields);

  if (error) {
    console.error("createGuest failed", error);
    return { error: "server_error" };
  }

  revalidatePath("/organizer/guests");
  redirect("/organizer/guests");
}

export async function updateGuest(
  guestId: string,
  _prev: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  await requireRole(["admin"]);
  const fields = readGuestFields(formData);

  if (!fields.full_name || !fields.mobile) {
    return { error: "missing_fields" };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("guests")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", guestId);

  if (error) {
    console.error("updateGuest failed", error);
    return { error: "server_error" };
  }

  revalidatePath("/organizer/guests");
  redirect("/organizer/guests");
}
