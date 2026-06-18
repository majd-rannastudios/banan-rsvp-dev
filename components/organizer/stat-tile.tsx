"use client";

import { useLocale } from "@/lib/i18n/context";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

export function StatTile({
  labelKey,
  descKey,
  value,
}: {
  labelKey: DictionaryKey;
  descKey: DictionaryKey;
  value: number;
}) {
  const { t } = useLocale();

  return (
    <div className="border border-surface-muted bg-surface p-5">
      <p className="text-[10px] tracking-[0.18em] text-text-muted uppercase">{t(labelKey)}</p>
      <p className="mt-2 text-4xl font-bold text-text">{value}</p>
      <p className="mt-1.5 text-xs text-accent">{t(descKey)}</p>
    </div>
  );
}
