"use client";

import { useLocale } from "@/lib/i18n/context";

export function PartySizeStepper({
  value,
  onChange,
  min = 1,
  max = 12,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  const { t } = useLocale();

  return (
    <div>
      <label className="text-[10px] tracking-[0.18em] text-text uppercase">
        {t("fieldPartySize")}
      </label>
      <div className="mt-2 flex w-fit items-stretch border border-surface-muted bg-surface">
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-12 w-12 items-center justify-center text-xl text-text transition-colors hover:bg-surface-muted disabled:opacity-30"
        >
          –
        </button>
        <span className="flex h-12 w-14 items-center justify-center text-lg font-semibold text-text">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-12 w-12 items-center justify-center text-xl text-text transition-colors hover:bg-surface-muted disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
