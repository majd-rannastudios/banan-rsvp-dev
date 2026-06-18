"use client";

import { useLocale } from "@/lib/i18n/context";

export function BackLinkLabel() {
  const { t } = useLocale();
  return <>{t("backToEvent")}</>;
}
