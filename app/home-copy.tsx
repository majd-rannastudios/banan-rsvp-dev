"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";

export function HomeCopy() {
  const { t } = useLocale();

  return (
    <div className="mt-10">
      <p className="text-[10px] tracking-[0.3em] text-sage uppercase">
        {t("inviteOnlyTitle")}
      </p>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/85">
        {t("inviteOnlyBody")}
      </p>

      <Link
        href="/i/demo"
        className="mt-9 inline-block min-h-12 w-full max-w-xs bg-white px-6 py-3.5 text-[12px] tracking-[0.2em] text-deep uppercase transition-colors hover:bg-white/90"
      >
        {t("previewSampleInvite")}
      </Link>
      <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-white/60">
        {t("previewSampleHint")}
      </p>

      <a
        href="/organizer/login"
        className="mt-8 inline-block border border-white/40 px-6 py-3 text-[11px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-white/10"
      >
        {t("organizerLogin")}
      </a>
    </div>
  );
}
