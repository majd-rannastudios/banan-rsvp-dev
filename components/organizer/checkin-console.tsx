"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { scanGuestToken, type RecentArrival, type ScanResult } from "@/app/organizer/(protected)/checkin/actions";
import { ScannerView } from "@/components/organizer/scanner-view";
import { ScanResultCard } from "@/components/organizer/scan-result-card";
import { RecentArrivalsFeed } from "@/components/organizer/recent-arrivals-feed";

export function CheckinConsole({ initialArrivals }: { initialArrivals: RecentArrival[] }) {
  const { t } = useLocale();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualToken, setManualToken] = useState("");
  const [pending, setPending] = useState(false);
  const lastScanRef = useRef<string>("");

  async function handleScan(rawValue: string) {
    if (pending || rawValue === lastScanRef.current) return;
    lastScanRef.current = rawValue;
    setPending(true);
    const res = await scanGuestToken(rawValue);
    setResult(res);
    setPending(false);
    setTimeout(() => {
      lastScanRef.current = "";
    }, 1500);
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualToken.trim() || pending) return;
    setPending(true);
    const res = await scanGuestToken(manualToken.trim());
    setResult(res);
    setManualToken("");
    setPending(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <button
          type="button"
          onClick={() => setScanning((s) => !s)}
          className="min-h-12 w-full bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover"
        >
          {scanning ? t("stopScanning") : t("startScanning")}
        </button>

        <div className="mt-4">
          <ScannerView active={scanning} onScan={handleScan} />
        </div>

        <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder={t("manualEntryPlaceholder")}
            className="min-h-11 flex-1 border border-surface-muted bg-surface px-3 text-sm text-text focus:border-interactive focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 flex-none border border-text px-4 text-[11px] tracking-[0.14em] text-text uppercase transition-colors hover:bg-text hover:text-white disabled:opacity-60"
          >
            {t("checkInButton")}
          </button>
        </form>

        {result && (
          <div className="mt-5">
            <ScanResultCard result={result} onOverride={setResult} />
          </div>
        )}
      </div>

      <div>
        <RecentArrivalsFeed initial={initialArrivals} />
      </div>
    </div>
  );
}
