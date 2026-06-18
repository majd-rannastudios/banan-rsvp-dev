"use client";

import { useLocale } from "@/lib/i18n/context";
import type { BroadcastHistoryItem } from "@/lib/organizer/broadcasts-data";

export function BroadcastHistory({ items }: { items: BroadcastHistoryItem[] }) {
  const { t, locale } = useLocale();

  return (
    <div className="mt-8">
      <p className="text-[10px] tracking-[0.18em] text-text-muted uppercase">{t("broadcastHistory")}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{t("noBroadcastsYet")}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="border border-surface-muted bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-text">{item.segmentLabel}</span>
                <span className="text-xs text-text-muted">
                  {new Date(item.createdAt).toLocaleString(locale === "ar" ? "ar" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{item.bodyEn}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.channels.map((c) => (
                  <span key={c} className="border border-surface-muted px-2 py-0.5 text-[10px] tracking-[0.1em] text-text-muted uppercase">
                    {c}
                  </span>
                ))}
                <span className="border border-accent px-2 py-0.5 text-[10px] tracking-[0.1em] text-accent uppercase">
                  {item.recipientCount} recipients
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
