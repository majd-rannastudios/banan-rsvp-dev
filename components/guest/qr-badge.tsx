"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useLocale } from "@/lib/i18n/context";
import type { EventSlot, TransferChoice } from "@/lib/guest/types";

const TRANSFER_KEY = {
  none: "transferNone",
  shuttle: "transferShuttle",
  vip: "transferVip",
} as const;

export function QrBadge({
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
  const { locale, t } = useLocale();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    // TODO(Phase 2/3): payload must become an HMAC-signed
    // `BANAN.v1.<guest_id>.<exp>.<sig>` token (see plan §2) once
    // lib/qr/sign.ts and a real guest_id exist. The raw invite token is
    // used here only so the badge is visually demonstrable pre-Supabase.
    QRCode.toDataURL(`BANAN-PREVIEW|${token}`, {
      width: 220,
      margin: 1,
      color: { dark: "#2e3617", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [token]);

  const badgeId = `BNN-${token.slice(0, 6).toUpperCase()}`;

  return (
    <div className="border border-surface-muted bg-surface shadow-sm">
      <div className="bg-deep px-5 py-4 text-center text-white">
        <div className="font-arabic text-base tracking-[0.3em]">
          {t("brandName")}
        </div>
        <div className="mt-1 text-[9px] tracking-[0.26em] text-sage uppercase">
          {t("badgeSub")}
        </div>
      </div>

      <div className="px-6 py-7 text-center">
        <p className="text-[9px] tracking-[0.24em] text-text-muted uppercase">
          {t("badgePre")}
        </p>
        <p className="mt-2 text-2xl font-bold text-text">{fullName}</p>
        <p className="mt-1 text-[10px] tracking-[0.16em] text-accent uppercase">
          {partySize} {t("badgeGuests")} · {t("badgeTransfer")}: {t(TRANSFER_KEY[transfer])}
        </p>

        <div className="mx-auto mt-6 flex h-[170px] w-[170px] items-center justify-center border border-surface-muted bg-white p-2.5">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR access pass" width={150} height={150} />
          ) : (
            <div className="h-full w-full animate-pulse bg-surface-muted" />
          )}
        </div>
        <p className="mt-3 text-[10px] tracking-[0.2em] text-text-muted">
          {badgeId}
        </p>

        <div className="mt-6 grid grid-cols-2 divide-x divide-dashed divide-surface-muted border-t border-dashed border-surface-muted pt-4 text-center">
          <div>
            <div className="text-[8px] tracking-[0.16em] text-text-muted uppercase">
              {t("factDate")}
            </div>
            <div className="mt-1 text-sm font-semibold text-text">
              {slot ? slot.dateLabel[locale] : "—"}
            </div>
          </div>
          <div>
            <div className="text-[8px] tracking-[0.16em] text-text-muted uppercase">
              {t("factTime")}
            </div>
            <div className="mt-1 text-sm font-semibold text-text">
              {slot ? slot.timeLabel[locale] : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
