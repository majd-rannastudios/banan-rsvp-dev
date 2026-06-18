import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MessageChannel } from "@/lib/messaging/types";

export interface BroadcastHistoryItem {
  id: string;
  segmentLabel: string;
  channels: MessageChannel[];
  bodyEn: string;
  recipientCount: number;
  status: string;
  createdAt: string;
}

export async function listBroadcastHistory(): Promise<BroadcastHistoryItem[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("messages")
    .select("id, segment_label_snapshot, channels, body_en, recipient_count, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data.map((m) => ({
    id: m.id,
    segmentLabel: m.segment_label_snapshot,
    channels: m.channels,
    bodyEn: m.body_en,
    recipientCount: m.recipient_count,
    status: m.status,
    createdAt: m.created_at,
  }));
}
