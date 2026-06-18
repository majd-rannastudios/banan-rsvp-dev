"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { overrideCheckin, type ScanResult } from "@/app/organizer/(protected)/checkin/actions";

export function ScanResultCard({
  result,
  onOverride,
}: {
  result: ScanResult;
  onOverride: (result: ScanResult) => void;
}) {
  const { locale, t } = useLocale();
  const [overriding, setOverriding] = useState(false);

  async function handleOverride() {
    if (!result.guestId) return;
    setOverriding(true);
    const next = await overrideCheckin(result.guestId);
    setOverriding(false);
    onOverride(next);
  }

  if (result.ok) {
    return (
      <div className="border border-interactive bg-surface p-5">
        <span className="border border-interactive px-2 py-1 text-[10px] tracking-[0.14em] text-interactive uppercase">
          {t("admitted")}
        </span>
        <p className="mt-3 text-xl font-bold text-text">{result.guest?.fullName}</p>
        <p className="mt-1 text-sm text-text-muted">
          {result.guest?.partySize} guests
          {result.guest?.slotLabel ? ` · ${result.guest.slotLabel}` : ""}
          {result.guest?.transferChoice && result.guest.transferChoice !== "none" ? ` · ${result.guest.transferChoice}` : ""}
        </p>
      </div>
    );
  }

  if (result.reason === "duplicate") {
    return (
      <div className="border border-danger bg-danger-bg p-5">
        <span className="border border-danger px-2 py-1 text-[10px] tracking-[0.14em] text-danger uppercase">
          {t("duplicateScan")}
        </span>
        <p className="mt-3 text-xl font-bold text-text">{result.guest?.fullName}</p>
        <p className="mt-1 text-sm text-text-muted">
          {result.previousCheckinAt &&
            new Date(result.previousCheckinAt).toLocaleTimeString(locale === "ar" ? "ar" : "en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <button
          onClick={handleOverride}
          disabled={overriding}
          className="mt-4 min-h-11 w-full border border-danger px-4 text-[11px] tracking-[0.16em] text-danger uppercase transition-colors hover:bg-danger hover:text-white disabled:opacity-60"
        >
          {t("admitAnyway")}
        </button>
      </div>
    );
  }

  return (
    <div className="border border-danger bg-danger-bg p-5">
      <span className="border border-danger px-2 py-1 text-[10px] tracking-[0.14em] text-danger uppercase">
        {t("invalidPass")}
      </span>
    </div>
  );
}
