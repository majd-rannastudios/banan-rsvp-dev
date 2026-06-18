"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function declineInvite(formData: FormData) {
  const token = String(formData.get("token") ?? "");

  const supabase = await createSupabaseServerClient();
  await supabase.rpc("submit_rsvp", {
    p_token: token,
    p_status: "declined",
    p_party_size: 1,
    p_slot_id: null,
    p_transfer: "none",
    p_language: null,
    p_consent: false,
  });

  redirect(`/i/${token}/declined`);
}
