"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/context";
import type { OrganizerRole } from "@/lib/organizer/types";

const TABS: { href: string; labelKey: "navDashboard" | "navGuests" | "navBroadcasts" | "navCheckin" | "navTeam" | "navSettings"; roles: OrganizerRole[] }[] = [
  { href: "/organizer/dashboard", labelKey: "navDashboard", roles: ["admin", "broadcast_manager", "viewer"] },
  { href: "/organizer/guests", labelKey: "navGuests", roles: ["admin", "broadcast_manager", "viewer"] },
  { href: "/organizer/broadcasts", labelKey: "navBroadcasts", roles: ["admin", "broadcast_manager"] },
  { href: "/organizer/checkin", labelKey: "navCheckin", roles: ["admin", "checkin_staff"] },
  { href: "/organizer/team", labelKey: "navTeam", roles: ["admin"] },
  { href: "/organizer/settings", labelKey: "navSettings", roles: ["admin"] },
];

export function OrgSubnav({ role }: { role: OrganizerRole }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const visible = TABS.filter((tab) => tab.roles.includes(role));

  return (
    <nav className="border-b border-surface-muted bg-surface">
      <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-3">
        {visible.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap border-b-2 px-3 py-3.5 text-[11px] tracking-[0.14em] uppercase transition-colors ${
                active
                  ? "border-interactive text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {t(tab.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
