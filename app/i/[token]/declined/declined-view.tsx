"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";

export function DeclinedView({ token }: { token: string }) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center border border-text-muted text-text-muted">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </div>
      <h1 className="mt-5 text-2xl font-bold text-text">{t("declinedTitle")}</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        {t("declinedBody")}
      </p>
      <Link
        href={`/i/${token}/rsvp`}
        className="mt-8 inline-block min-h-11 border border-text px-6 py-3 text-[11px] tracking-[0.18em] text-text uppercase transition-colors hover:bg-text hover:text-white"
      >
        {t("changedYourMind")}
      </Link>
    </div>
  );
}
