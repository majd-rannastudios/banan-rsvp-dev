"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { EventFacts } from "@/components/guest/event-facts";
import { declineInvite } from "@/app/i/[token]/actions";
import type { GuestInvite } from "@/lib/guest/types";

export function InviteHero({ invite }: { invite: GuestInvite }) {
  const { locale, t } = useLocale();
  const { event } = invite;

  const checkedIn = invite.rsvpStatus === "checked_in";
  const confirmed = invite.rsvpStatus === "confirmed";
  const declined = invite.rsvpStatus === "declined";

  return (
    <div>
      {invite.token === "demo" && (
        <div className="bg-surface-muted px-5 py-2 text-center text-[10px] tracking-[0.2em] text-text uppercase">
          {t("demoBadge")}
        </div>
      )}

      <div className="hero-texture px-5 py-16 text-center sm:py-20">
        <p className="text-[10px] tracking-[0.32em] text-sage uppercase opacity-90">
          {t("invitePre")}
        </p>
        <h1 className="mx-auto mt-4 max-w-md text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
          {t("inviteTitle")}
        </h1>
        <p className="mx-auto mt-3 text-sm tracking-[0.05em] text-white/85">
          {t("guestGreeting")} {invite.fullName}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <p className="mx-auto max-w-md text-center text-[15px] leading-relaxed text-text-muted">
          {t("inviteLead")}
        </p>

        <div className="mx-auto mt-10 max-w-md">
          <EventFacts
            startsOn={event.startsOn}
            endsOn={event.endsOn}
            venueName={event.venueName}
          />
        </div>

        <div className="mx-auto mt-12 max-w-md">
          {checkedIn ? (
            <div className="border border-surface-muted bg-surface-muted/40 px-6 py-5 text-center">
              <p className="text-sm text-text">{t("alreadyCheckedInTitle")}</p>
              <Link
                href={`/i/${invite.token}/confirmation`}
                className="mt-3 inline-block min-h-11 text-[11px] tracking-[0.18em] text-interactive underline uppercase"
              >
                {t("viewYourPass")}
              </Link>
            </div>
          ) : confirmed ? (
            <div className="border border-surface-muted bg-surface-muted/40 px-6 py-5 text-center">
              <p className="text-sm text-text">{t("alreadyResponded")}</p>
              <div className="mt-3 flex flex-col items-center gap-2">
                <Link
                  href={`/i/${invite.token}/confirmation`}
                  className="min-h-11 text-[11px] tracking-[0.18em] text-interactive underline uppercase"
                >
                  {t("viewYourPass")}
                </Link>
                <Link
                  href={`/i/${invite.token}/rsvp`}
                  className="min-h-11 text-[11px] tracking-[0.18em] text-text-muted underline uppercase"
                >
                  {t("editRsvp")}
                </Link>
              </div>
            </div>
          ) : declined ? (
            <div className="border border-surface-muted bg-surface-muted/40 px-6 py-5 text-center">
              <p className="text-sm text-text">{t("declinedTitle")}</p>
              <Link
                href={`/i/${invite.token}/rsvp`}
                className="mt-3 inline-block text-[11px] tracking-[0.18em] text-interactive underline uppercase"
              >
                {t("changedYourMind")}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row" dir={locale === "ar" ? "rtl" : "ltr"}>
              <Link
                href={`/i/${invite.token}/rsvp`}
                className="flex min-h-12 flex-1 items-center justify-center bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover"
              >
                {t("acceptInvite")}
              </Link>
              <form action={declineInvite} className="flex-1">
                <input type="hidden" name="token" value={invite.token} />
                <button
                  type="submit"
                  className="flex min-h-12 w-full items-center justify-center border border-text px-6 text-[12px] tracking-[0.2em] text-text uppercase transition-colors hover:bg-text hover:text-white"
                >
                  {t("declineInvite")}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
