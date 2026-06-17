"use client";

import { useLocale } from "@/lib/i18n/context";

export function HomeCopy() {
  const { t } = useLocale();

  return (
    <div className="mt-10">
      <p className="text-[10px] tracking-[0.3em] text-accent uppercase">
        {t("inviteOnlyTitle")}
      </p>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-text-muted">
        {t("inviteOnlyBody")}
      </p>
      <a
        href="/organizer/login"
        className="mt-8 inline-block border border-interactive px-6 py-3 text-[11px] tracking-[0.2em] text-interactive uppercase transition-colors hover:bg-interactive hover:text-surface"
      >
        {t("organizerLogin")}
      </a>
    </div>
  );
}
