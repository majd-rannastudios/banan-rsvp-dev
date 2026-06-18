import type { OrganizerAccount } from "./types";

/**
 * TEMPORARY mock account list. There is no Supabase project wired up yet
 * (Phase 2 of the build plan). This stands in for Supabase Auth +
 * `profiles.role` so the organizer console can be built and demoed now;
 * once Supabase exists, the login server action's validation logic swaps
 * to `supabase.auth.signInWithPassword`, and `getSession()` reads the real
 * JWT/profile instead of this list — pages consuming `OrganizerSession`
 * stay the same.
 */
export const MOCK_ACCOUNTS: OrganizerAccount[] = [
  { email: "admin@banan.demo", password: "admin123", role: "admin", fullName: "Sara Al-Faisal" },
  { email: "checkin@banan.demo", password: "checkin123", role: "checkin_staff", fullName: "Door Team" },
  { email: "broadcast@banan.demo", password: "broadcast123", role: "broadcast_manager", fullName: "Comms Lead" },
  { email: "viewer@banan.demo", password: "viewer123", role: "viewer", fullName: "Exec Viewer" },
];
