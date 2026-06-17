"use client";

import { useLocale } from "@/lib/i18n/context";
import { QrBadge } from "@/components/guest/qr-badge";
import type { EventSlot, TransferChoice } from "@/lib/guest/types";

export function ConfirmationView({
  token,
  fullName,
  partySize,
  transfer,
  slot,
}: {
  token: string;
  fullName: string;
  partySize: number;
  transfer: TransferChoice;
  slot: EventSlot | null;
}) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[340px_1fr]">
        <div className="mx-auto w-full max-w-[340px]">
          <QrBadge
            token={token}
            fullName={fullName}
            partySize={partySize}
            transfer={transfer}
            slot={slot}
          />
        </div>

        <div>
          <div className="flex h-11 w-11 items-center justify-center border border-deep text-deep">
            <CheckIcon />
          </div>
          <p className="mt-4 text-[10px] tracking-[0.3em] text-accent uppercase">
            {t("confEyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text">{t("confTitle")}</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-muted">
            {t("confLead")}
          </p>

          <ol className="mt-8 space-y-0">
            {(["next1", "next2", "next3"] as const).map((key, i) => (
              <li
                key={key}
                className="flex gap-4 border-t border-surface-muted py-4 text-sm text-text-muted first:border-t-0"
              >
                <span className="flex h-6 w-6 flex-none items-center justify-center border border-accent text-[11px] font-semibold text-accent">
                  {i + 1}
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
