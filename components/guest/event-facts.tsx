"use client";

import { useLocale } from "@/lib/i18n/context";

function formatRange(startsOn: string, endsOn: string, locale: "en" | "ar") {
  const start = new Date(startsOn);
  const end = new Date(endsOn);
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "long",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function EventFacts({
  startsOn,
  endsOn,
  venueName,
}: {
  startsOn: string;
  endsOn: string;
  venueName: { en: string; ar: string } | null;
}) {
  const { locale, t } = useLocale();

  return (
    <dl className="grid grid-cols-1 gap-6 border-t border-surface-muted pt-6 sm:grid-cols-3">
      <div>
        <dt className="text-[10px] tracking-[0.26em] text-accent uppercase">
          {t("factDate")}
        </dt>
        <dd className="mt-1.5 text-lg font-semibold text-text">
          {formatRange(startsOn, endsOn, locale)}
        </dd>
      </div>
      <div>
        <dt className="text-[10px] tracking-[0.26em] text-accent uppercase">
          {t("factTime")}
        </dt>
        <dd className="mt-1.5 text-lg font-semibold text-text">6:00 PM</dd>
      </div>
      <div>
        <dt className="text-[10px] tracking-[0.26em] text-accent uppercase">
          {t("factVenue")}
        </dt>
        <dd className="mt-1.5 text-lg font-semibold text-text">
          {venueName ? venueName[locale] : t("venueTbd")}
        </dd>
      </div>
    </dl>
  );
}
