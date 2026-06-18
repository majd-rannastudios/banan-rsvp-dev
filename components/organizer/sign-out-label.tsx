"use client";

import { useLocale } from "@/lib/i18n/context";

export function SignOutLabel() {
  const { t } = useLocale();
  return <>{t("signOut")}</>;
}
