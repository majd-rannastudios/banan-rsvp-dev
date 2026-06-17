"use client";

import { useLocale } from "@/lib/i18n/context";

export function RsvpHeading() {
  const { t } = useLocale();

  return (
    <div className="text-center">
      <p className="text-[10px] tracking-[0.3em] text-accent uppercase">
        {t("rsvpEyebrow")}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-text">{t("rsvpTitle")}</h1>
    </div>
  );
}
