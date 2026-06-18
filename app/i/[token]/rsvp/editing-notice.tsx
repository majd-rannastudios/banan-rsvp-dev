"use client";

import { useLocale } from "@/lib/i18n/context";

export function EditingNotice() {
  const { t } = useLocale();
  return (
    <div className="mt-6 border border-accent/50 bg-surface-muted/50 px-4 py-3 text-center text-sm leading-relaxed text-text">
      {t("editingFinalNotice")}
    </div>
  );
}
