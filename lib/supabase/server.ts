import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cookie-aware Supabase client for Server Components and Server Actions.
 * Uses the anon key — RLS (or, for guest-facing access, the SECURITY
 * DEFINER RPCs) is what actually scopes what this client can do, not the
 * key itself.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component (not a Server Action/Route
            // Handler) — cookies are read-only there. Safe to ignore since
            // the guest flow doesn't rely on Supabase setting auth cookies.
          }
        },
      },
    }
  );
}
