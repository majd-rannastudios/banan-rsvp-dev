import type { Guest } from "./guests-data";

/**
 * Pure logic, deliberately NOT server-only - used both server-side (the
 * send action, to resolve who actually gets a message) and client-side
 * (the composer, to show a live recipient count as the organizer picks a
 * segment).
 */
export type SegmentKey = "all" | "needs_transfer" | "vip" | "not_checked_in" | "confirmed";

export function filterGuestsForSegment(guests: Guest[], segment: SegmentKey): Guest[] {
  switch (segment) {
    case "needs_transfer":
      return guests.filter((g) => g.transferChoice !== "none");
    case "vip":
      return guests.filter((g) => g.isVip);
    case "not_checked_in":
      return guests.filter((g) => g.rsvpStatus !== "checked_in");
    case "confirmed":
      return guests.filter((g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "checked_in");
    default:
      return guests;
  }
}
