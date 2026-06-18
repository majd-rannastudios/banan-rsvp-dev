"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface RsvpFormState {
  error?: string;
}

export async function submitRsvp(
  _prev: RsvpFormState,
  formData: FormData
): Promise<RsvpFormState> {
  const token = String(formData.get("token") ?? "");
  const partySize = Number(formData.get("party_size") ?? 1);
  const slotId = String(formData.get("slot_id") ?? "") || null;
  const transfer = String(formData.get("transfer") ?? "none");
  const language = String(formData.get("language") ?? "en");
  const consent = formData.get("consent") === "on";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("submit_rsvp", {
    p_token: token,
    p_status: "confirmed",
    p_party_size: partySize,
    p_slot_id: slotId,
    p_transfer: transfer,
    p_language: language,
    p_consent: consent,
  });

  if (error) {
    console.error("submit_rsvp RPC failed", error);
    return { error: "server_error" };
  }
  if (!data?.ok) {
    return { error: data?.reason ?? "unknown" };
  }

  redirect(`/i/${token}/confirmation`);
}
