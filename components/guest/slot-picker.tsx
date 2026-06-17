"use client";

import { useLocale } from "@/lib/i18n/context";
import type { EventSlot } from "@/lib/guest/types";

export function SlotPicker({
  slots,
  value,
  onChange,
}: {
  slots: EventSlot[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  const { locale, t } = useLocale();

  return (
    <fieldset>
      <legend className="text-[10px] tracking-[0.18em] text-text uppercase">
        {t("fieldSlot")}
      </legend>
      <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {slots.map((slot) => {
          const selected = value === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onChange(slot.id)}
              aria-pressed={selected}
              className={`min-h-12 border px-4 py-3 text-start transition-colors ${
                selected
                  ? "border-interactive bg-interactive text-white"
                  : "border-surface-muted bg-surface text-text hover:border-text-muted"
              }`}
            >
              <span className="block text-sm font-semibold">
                {slot.dateLabel[locale]}
              </span>
              <span
                className={`block text-xs ${
                  selected ? "text-white/80" : "text-text-muted"
                }`}
              >
                {slot.timeLabel[locale]}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
