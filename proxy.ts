import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/organizer/session";

// Next.js 16 renamed `middleware.ts` -> `proxy.ts` (exported fn `proxy`).
// This is an optimistic, cookie-presence-only check — it only decides
// "are you logged in," never role. Fine-grained role access is enforced
// server-side per page via lib/organizer/session.ts's requireRole(), which
// is the real boundary (this is just a fast redirect for the common case).
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    return NextResponse.redirect(new URL("/organizer/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/organizer/((?!login).*)"],
};
