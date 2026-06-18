"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useLocale } from "@/lib/i18n/context";

export function ScannerView({
  active,
  onScan,
}: {
  active: boolean;
  onScan: (rawValue: string) => void;
}) {
  const { t } = useLocale();
  const [permissionError, setPermissionError] = useState(false);

  if (!active) return null;

  return (
    <div className="overflow-hidden border border-surface-muted bg-black">
      <div className="aspect-square w-full">
        {permissionError ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white">
            {t("cameraPermissionDenied")}
          </div>
        ) : (
          <Scanner
            onScan={(codes) => {
              const value = codes[0]?.rawValue;
              if (value) onScan(value);
            }}
            onError={() => setPermissionError(true)}
            constraints={{ facingMode: "environment" }}
            formats={["qr_code"]}
            scanDelay={1200}
          />
        )}
      </div>
      <p className="bg-black px-4 py-2 text-center text-[10px] tracking-[0.2em] text-white/70 uppercase">
        {t("scannerHint")}
      </p>
    </div>
  );
}
