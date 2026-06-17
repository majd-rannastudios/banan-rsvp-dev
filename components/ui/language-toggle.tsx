"use client";

import { useLocale } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="border border-current px-3 py-2 text-[10px] tracking-[0.18em] text-text uppercase transition-colors hover:bg-text hover:text-surface"
    >
      {t("toggleLanguage")}
    </button>
  );
}
