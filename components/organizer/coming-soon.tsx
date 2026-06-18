"use client";

import { useLocale } from "@/lib/i18n/context";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

export function ComingSoon({ navTitleKey, bodyKey }: { navTitleKey: DictionaryKey; bodyKey: DictionaryKey }) {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <p className="text-[10px] tracking-[0.24em] text-accent uppercase">{t("orgEyebrow")}</p>
      <h1 className="mt-1.5 text-2xl font-bold text-text">{t(navTitleKey)}</h1>
      <div className="mt-8 border border-dashed border-surface-muted px-6 py-12 text-center">
        <p className="text-[10px] tracking-[0.2em] text-text-muted uppercase">{t("comingSoonTitle")}</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-muted">{t(bodyKey)}</p>
      </div>
    </div>
  );
}
