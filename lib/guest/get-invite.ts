import type { EventInfo, GuestInvite } from "./types";

/**
 * TEMPORARY mock data layer. There is no Supabase project wired up yet
 * (Phase 2 of the build plan). This stands in for the future
 * `get_invite(p_token)` security-definer RPC call so the guest-facing UI
 * can be built and demoed now; once Supabase exists, only this function's
 * body changes — every page that calls `getInvite()` stays the same.
 */

const EVENT: EventInfo = {
  name: { en: "Banan Inauguration", ar: "افتتاح بنان" },
  startsOn: "2026-09-18",
  endsOn: "2026-09-19",
  venueName: null, // TBD — see plan §12 open items
  slots: [
    {
      id: "d1-evening",
      dateLabel: { en: "Fri 18 Sep", ar: "الجمعة ١٨ سبتمبر" },
      timeLabel: { en: "6:00 PM", ar: "٦:٠٠ م" },
    },
    {
      id: "d1-night",
      dateLabel: { en: "Fri 18 Sep", ar: "الجمعة ١٨ سبتمبر" },
      timeLabel: { en: "8:30 PM", ar: "٨:٣٠ م" },
    },
    {
      id: "d2-evening",
      dateLabel: { en: "Sat 19 Sep", ar: "السبت ١٩ سبتمبر" },
      timeLabel: { en: "6:00 PM", ar: "٦:٠٠ م" },
    },
    {
      id: "d2-night",
      dateLabel: { en: "Sat 19 Sep", ar: "السبت ١٩ سبتمبر" },
      timeLabel: { en: "8:30 PM", ar: "٨:٣٠ م" },
    },
  ],
};

const MOCK_GUESTS: Record<string, GuestInvite> = {
  demo: {
    token: "demo",
    fullName: "Abdullah Al-Rashid",
    partySize: 2,
    preferredSlotId: null,
    transferChoice: "none",
    rsvpStatus: "invited",
    event: EVENT,
  },
};

export async function getInvite(token: string): Promise<GuestInvite | null> {
  // TODO(Phase 2/3): replace with `supabase.rpc('get_invite', { p_token: token })`
  return MOCK_GUESTS[token] ?? null;
}
