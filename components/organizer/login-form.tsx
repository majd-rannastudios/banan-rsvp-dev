"use client";

import { useActionState, useRef } from "react";
import { useLocale } from "@/lib/i18n/context";
import { login, type LoginState } from "@/app/organizer/login/actions";
import { MOCK_ACCOUNTS } from "@/lib/organizer/mock-accounts";

const ROLE_KEY = {
  admin: "roleAdmin",
  checkin_staff: "roleCheckinStaff",
  broadcast_manager: "roleBroadcastManager",
  viewer: "roleViewer",
} as const;

const initialState: LoginState = {};

export function LoginForm() {
  const { t } = useLocale();
  const [state, formAction, pending] = useActionState(login, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  function applyDemoAccount(email: string, password: string) {
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem("email") as HTMLInputElement).value = email;
    (form.elements.namedItem("password") as HTMLInputElement).value = password;
    form.requestSubmit();
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <form ref={formRef} action={formAction} className="space-y-5">
        <div className="flex flex-col gap-1.5 text-start">
          <label htmlFor="email" className="text-[10px] tracking-[0.18em] text-text uppercase">
            {t("fieldEmail")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="min-h-12 border border-surface-muted bg-surface px-4 text-sm text-text focus:border-interactive focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5 text-start">
          <label htmlFor="password" className="text-[10px] tracking-[0.18em] text-text uppercase">
            {t("fieldPassword")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="min-h-12 border border-surface-muted bg-surface px-4 text-sm text-text focus:border-interactive focus:outline-none"
          />
        </div>

        {state.error && <p className="text-sm text-danger">{t("invalidCredentials")}</p>}

        <button
          type="submit"
          disabled={pending}
          className="min-h-12 w-full bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60"
        >
          {t("signIn")}
        </button>
      </form>

      <div className="mt-10 border-t border-surface-muted pt-6">
        <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
          {t("demoAccountsTitle")}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-text-muted">{t("demoAccountsHint")}</p>
        <ul className="mt-4 space-y-2">
          {MOCK_ACCOUNTS.map((acc) => (
            <li
              key={acc.email}
              className="flex items-center justify-between gap-3 border border-surface-muted px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text">{t(ROLE_KEY[acc.role])}</p>
                <p className="truncate text-xs text-text-muted">{acc.email}</p>
              </div>
              <button
                type="button"
                onClick={() => applyDemoAccount(acc.email, acc.password)}
                className="min-h-9 flex-none border border-text px-3 text-[10px] tracking-[0.16em] text-text uppercase transition-colors hover:bg-text hover:text-white"
              >
                {t("useThisAccount")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
