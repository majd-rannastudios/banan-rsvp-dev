import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EventSlot, GuestInvite } from "./types";

const DATE_FMT = {
  en: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }),
  ar: new Intl.DateTimeFormat("ar", { weekday: "short", day: "numeric", month: "short" }),
};
const TIME_FMT = {
  en: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }),
  ar: new Intl.DateTimeFormat("ar", { hour: "numeric", minute: "2-digit" }),
};

interface RpcSlot {
  id: string;
  slot_date: string;
  starts_at: string;
  label_en: string;
  label_ar: string;
}

function mapSlot(s: RpcSlot): EventSlot {
  // Date/time labels are derived from the real timestamp rather than the
  // stored label_en/label_ar text, since the UI needs the date and time
  // as two separate strings (label_en/ar store them pre-combined).
  const startsAt = new Date(s.starts_at);
  return {
    id: s.id,
    dateLabel: { en: DATE_FMT.en.format(startsAt), ar: DATE_FMT.ar.format(startsAt) },
    timeLabel: { en: TIME_FMT.en.format(startsAt), ar: TIME_FMT.ar.format(startsAt) },
  };
}

export async function getInvite(token: string): Promise<GuestInvite | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_invite", { p_token: token });

  if (error) {
    console.error("get_invite RPC failed", error);
    return null;
  }
  if (!data?.found) return null;

  const event = data.event;

  return {
    token: data.token,
    fullName: data.full_name,
    partySize: data.party_size,
    preferredSlotId: data.preferred_slot_id,
    transferChoice: data.transfer_choice,
    rsvpStatus: data.rsvp_status,
    event: {
      // events.name/venue_name aren't bilingual columns in the schema (and
      // aren't rendered directly anywhere in the UI today - the visible
      // hero copy comes from the i18n dictionary) - duplicating the single
      // DB value into both locales is a safe placeholder until/unless that
      // changes.
      name: { en: event.name, ar: event.name },
      startsOn: event.starts_on,
      endsOn: event.ends_on,
      venueName: event.venue_name ? { en: event.venue_name, ar: event.venue_name } : null,
      slots: (event.slots as RpcSlot[]).map(mapSlot),
    },
  };
}
