"use client";

import { useLocale } from "@/lib/i18n/context";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

export function ChartCard({
  titleKey,
  children,
}: {
  titleKey: DictionaryKey;
  children: React.ReactNode;
}) {
  const { t } = useLocale();

  return (
    <div className="border border-surface-muted bg-surface">
      <div className="border-b border-surface-muted px-5 py-3.5">
        <h3 className="text-[11px] tracking-[0.16em] text-text uppercase">{t(titleKey)}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
