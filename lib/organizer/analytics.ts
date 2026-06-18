import type { Guest } from "./guests-data";

export interface DashboardStats {
  totalRsvps: number;
  expectedGuests: number;
  transferRequests: number;
  checkedIn: number;
}

export function computeStats(guests: Guest[]): DashboardStats {
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

function daysAgo(createdAt: string): number {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/** Cumulative RSVP count over the last 6 days, oldest first. */
export function trendData(guests: Guest[]): TrendPoint[] {
  const responded = guests.filter((g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "checked_in");
  const days = [5, 4, 3, 2, 1, 0];
  return days.map((d) => ({
    label: d === 0 ? "Today" : `-${d}d`,
    count: responded.filter((g) => daysAgo(g.createdAt) >= d).length,
  }));
}

export interface BarDatum {
  label: string;
  value: number;
}

export function nationalityData(guests: Guest[]): BarDatum[] {
  const counts = new Map<string, number>();
  guests.forEach((g) => {
    const key = g.nationality ?? "Unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function slotData(guests: Guest[]): BarDatum[] {
  const counts = new Map<string, number>();
  guests
    .filter((g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "checked_in")
    .forEach((g) => {
      const key = g.slotLabel ?? "No slot chosen";
      counts.set(key, (counts.get(key) ?? 0) + g.partySize);
    });
  return [...counts.entries()].map(([label, value]) => ({ label, value }));
}

export function transferData(guests: Guest[], labels: Record<"none" | "shuttle" | "vip", string>): BarDatum[] {
  const order: Array<"none" | "shuttle" | "vip"> = ["none", "shuttle", "vip"];
  return order.map((choice) => ({
    label: labels[choice],
    value: guests.filter((g) => g.transferChoice === choice).length,
  }));
}
