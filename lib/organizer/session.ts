import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MOCK_ACCOUNTS } from "./mock-accounts";
import type { OrganizerRole, OrganizerSession } from "./types";

export const SESSION_COOKIE = "banan_organizer_session";

/**
 * The "home" route for each role once logged in / when redirected away
 * from a page they can't access. checkin_staff's only screen is the
 * scanner; everyone else lands on the dashboard.
 */
export function roleHome(role: OrganizerRole): string {
  return role === "checkin_staff" ? "/organizer/checkin" : "/organizer/dashboard";
}

/** Reads the fake session cookie. Returns null if absent/invalid — never redirects. */
export async function getSession(): Promise<OrganizerSession | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;
  if (!email) return null;

  // TODO(Phase 2): replace with Supabase session lookup (auth.getUser() +
  // profiles.role), keeping the OrganizerSession shape unchanged.
  const account = MOCK_ACCOUNTS.find((a) => a.email === email);
  if (!account) return null;

  return { email: account.email, role: account.role, fullName: account.fullName };
}

/** Redirects to login if there's no session; otherwise returns it. */
export async function requireSession(): Promise<OrganizerSession> {
  const session = await getSession();
  if (!session) {
    redirect("/organizer/login");
  }
  return session;
}

/** Redirects to login (no session) or to the role's home page (wrong role); otherwise returns the session. */
export async function requireRole(allowed: OrganizerRole[]): Promise<OrganizerSession> {
  const session = await requireSession();
  if (!allowed.includes(session.role)) {
    redirect(roleHome(session.role));
  }
  return session;
}
