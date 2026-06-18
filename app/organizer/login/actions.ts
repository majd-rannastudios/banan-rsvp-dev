"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MOCK_ACCOUNTS } from "@/lib/organizer/mock-accounts";
import { SESSION_COOKIE, roleHome } from "@/lib/organizer/session";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // TODO(Phase 2): replace with supabase.auth.signInWithPassword({ email, password })
  const account = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email);
  if (!account || account.password !== password) {
    return { error: "invalid" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, account.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  redirect(roleHome(account.role));
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/organizer/login");
}
