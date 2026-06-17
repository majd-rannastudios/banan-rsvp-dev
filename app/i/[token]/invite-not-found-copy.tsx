"use client";

import { useLocale } from "@/lib/i18n/context";

export function InviteNotFoundCopy() {
  const { t } = useLocale();

  return (
    <>
      <p className="text-[10px] tracking-[0.3em] text-danger uppercase">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-text">
        {t("inviteNotFoundTitle")}
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
        {t("inviteNotFoundBody")}
      </p>
    </>
  );
}
