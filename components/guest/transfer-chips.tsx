"use client";

import { useLocale } from "@/lib/i18n/context";
import type { TransferChoice } from "@/lib/guest/types";

const OPTIONS: { value: TransferChoice; key: "transferNone" | "transferShuttle" | "transferVip" }[] = [
  { value: "none", key: "transferNone" },
  { value: "shuttle", key: "transferShuttle" },
  { value: "vip", key: "transferVip" },
];

export function TransferChips({
  value,
  onChange,
}: {
  value: TransferChoice;
  onChange: (next: TransferChoice) => void;
}) {
  const { t } = useLocale();

  return (
    <fieldset>
      <legend className="text-[10px] tracking-[0.18em] text-text uppercase">
        {t("fieldTransfer")}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2.5">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={selected}
              className={`min-h-11 border px-4 text-sm transition-colors ${
                selected
                  ? "border-interactive bg-interactive text-white"
                  : "border-surface-muted bg-surface text-text-muted hover:border-text-muted"
              }`}
            >
              {t(opt.key)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
