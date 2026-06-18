import type { MockGuest } from "./mock-guests";

export interface DashboardStats {
  totalRsvps: number;
  expectedGuests: number;
  transferRequests: number;
  checkedIn: number;
}

export function computeStats(guests: MockGuest[]): DashboardStats {
  const responded = guests.filter((g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "checked_in");
  return {
    totalRsvps: responded.length,
    expectedGuests: responded.reduce((sum, g) => sum + g.partySize, 0),
    transferRequests: guests.filter((g) => g.transferChoice !== "none").length,
    checkedIn: guests.filter((g) => g.rsvpStatus === "checked_in").length,
  };
}

export interface TrendPoint {
  label: string;
  count: number;
}

/** Cumulative RSVP count over the last 6 days, oldest first. */
export function trendData(guests: MockGuest[]): TrendPoint[] {
  const responded = guests.filter((g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "checked_in");
  const days = [5, 4, 3, 2, 1, 0];
  return days.map((daysAgo) => ({
    label: daysAgo === 0 ? "Today" : `-${daysAgo}d`,
    count: responded.filter((g) => g.daysAgo >= daysAgo).length,
  }));
}

export interface BarDatum {
  label: string;
  value: number;
}

export function nationalityData(guests: MockGuest[]): BarDatum[] {
  const counts = new Map<string, number>();
  guests.forEach((g) => counts.set(g.nationality, (counts.get(g.nationality) ?? 0) + 1));
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function slotData(guests: MockGuest[]): BarDatum[] {
  const counts = new Map<string, number>();
  guests
    .filter((g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "checked_in")
    .forEach((g) => counts.set(g.slotLabel, (counts.get(g.slotLabel) ?? 0) + g.partySize));
  return [...counts.entries()].map(([label, value]) => ({ label, value }));
}

export function transferData(guests: MockGuest[], labels: Record<"none" | "shuttle" | "vip", string>): BarDatum[] {
  const order: Array<"none" | "shuttle" | "vip"> = ["none", "shuttle", "vip"];
  return order.map((choice) => ({
    label: labels[choice],
    value: guests.filter((g) => g.transferChoice === choice).length,
  }));
}
