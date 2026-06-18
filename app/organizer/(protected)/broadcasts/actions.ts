"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/organizer/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listGuests } from "@/lib/organizer/guests-data";
import { filterGuestsForSegment, type SegmentKey } from "@/lib/organizer/segments";
import { sendToGuests } from "@/lib/messaging";
import type { MessageChannel } from "@/lib/messaging/types";

export interface SendBroadcastState {
  error?: string;
  sentCount?: number;
}

const SEGMENT_LABELS: Record<SegmentKey, string> = {
  all: "All guests",
  needs_transfer: "Need transfer",
  vip: "VIP guests",
  not_checked_in: "Not yet checked in",
  confirmed: "Confirmed guests",
};

export async function sendBroadcast(
  _prev: SendBroadcastState,
  formData: FormData
): Promise<SendBroadcastState> {
  await requireRole(["admin", "broadcast_manager"]);

  const segment = String(formData.get("segment") ?? "all") as SegmentKey;
  const channels = formData.getAll("channels") as MessageChannel[];
  const bodyEn = String(formData.get("body_en") ?? "").trim();
  const bodyAr = String(formData.get("body_ar") ?? "").trim();

  if (channels.length === 0) {
    return { error: "no_channel" };
  }
  if (!bodyEn) {
    return { error: "no_body" };
  }

  const allGuests = await listGuests();
  const targeted = filterGuestsForSegment(allGuests, segment).filter((g) => g.mobile || g.email);

  const admin = createSupabaseAdminClient();
  const { data: message, error: insertError } = await admin
    .from("messages")
    .insert({
      created_by: null,
      segment_key: segment,
      segment_label_snapshot: SEGMENT_LABELS[segment],
      channels,
      body_en: bodyEn,
      body_ar: bodyAr || null,
      recipient_count: targeted.length,
      status: "sending",
    })
    .select()
    .single();

  if (insertError || !message) {
    console.error("sendBroadcast insert failed", insertError);
    return { error: "server_error" };
  }

  const results = await sendToGuests(
    targeted.map((g) => ({ guestId: g.id, to: g.mobile, locale: g.languagePref })),
    channels,
    { en: bodyEn, ar: bodyAr }
  );

  await admin.from("message_recipients").insert(
    results.map((r) => ({
      message_id: message.id,
      guest_id: r.guestId,
      channel: r.channel,
      status: r.status,
      provider_message_id: r.providerMessageId ?? null,
      error: r.error ?? null,
    }))
  );

  await admin.from("messages").update({ status: "mocked", sent_at: new Date().toISOString() }).eq("id", message.id);

  revalidatePath("/organizer/broadcasts");
  return { sentCount: targeted.length };
}
