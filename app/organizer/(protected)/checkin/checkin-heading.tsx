"use client";

import { useLocale } from "@/lib/i18n/context";

export function CheckinHeading() {
  const { t } = useLocale();
  return (
    <div>
      <p className="text-[10px] tracking-[0.24em] text-accent uppercase">{t("orgEyebrow")}</p>
      <h1 className="mt-1.5 text-2xl font-bold text-text">{t("checkinTitle")}</h1>
    </div>
  );
}
