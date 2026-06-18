"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { getRecentArrivals, type RecentArrival } from "@/app/organizer/(protected)/checkin/actions";

export function RecentArrivalsFeed({ initial }: { initial: RecentArrival[] }) {
  const { locale, t } = useLocale();
  const [arrivals, setArrivals] = useState<RecentArrival[]>(initial);

  useEffect(() => {
    // No real Supabase Auth/Realtime under dummy auth yet (RLS would block
    // an anon-key subscription) - poll instead. Cheap at this scale, and
    // swappable for a real Realtime subscription once auth is real.
    const interval = setInterval(async () => {
      const next = await getRecentArrivals();
      setArrivals(next);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6">
      <p className="text-[10px] tracking-[0.18em] text-text-muted uppercase">{t("recentArrivals")}</p>
      {arrivals.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{t("noArrivalsYet")}</p>
      ) : (
        <div className="mt-2 divide-y divide-surface-muted">
          {arrivals.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-text">
                {a.fullName} <span className="text-text-muted">· {a.partySize} guests</span>
              </span>
              <span className="text-text-muted">
                {new Date(a.checkedInAt).toLocaleTimeString(locale === "ar" ? "ar" : "en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
