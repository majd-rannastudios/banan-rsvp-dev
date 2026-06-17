"use client";

import { useLocale } from "@/lib/i18n/context";

/**
 * Placeholder wordmark. No vector logo file exists yet — when one is
 * provided, swap the contents of this component only; every caller
 * (header, badge, login screen) stays unchanged.
 *
 * The secondary-logo slot is rendered but intentionally left empty (no
 * Intouch, no agency credit) — reserved in the layout for a possible future
 * TMG corporate co-branding lockup, per brand co-branding clear-space rules.
 */
export function LogoLockup({
  size = "md",
  tone = "dark",
  showSecondarySlot = false,
}: {
  size?: "sm" | "md" | "lg";
  /** "dark" = for light backgrounds (default body text colors). "light" = for dark/hero backgrounds (white text). */
  tone?: "dark" | "light";
  showSecondarySlot?: boolean;
}) {
  const dimensions = {
    sm: { crest: "h-7 w-7", name: "text-base", sub: "text-[9px]" },
    md: { crest: "h-9 w-9", name: "text-xl", sub: "text-[10px]" },
    lg: { crest: "h-12 w-12", name: "text-2xl", sub: "text-xs" },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${tone === "light" ? "text-white" : "text-text"}`}>
      <BananCrest className={dimensions.crest} />
      <div className="min-w-0">
        <BrandName className={dimensions.name} />
        <BrandSubtitle className={dimensions.sub} tone={tone} />
      </div>
      {showSecondarySlot ? (
        <>
          <span aria-hidden className="mx-2 h-6 w-px bg-current opacity-20" />
          {/* reserved secondary co-branding slot — intentionally empty */}
          <span className="sr-only">Secondary logo slot reserved</span>
        </>
      ) : null}
    </div>
  );
}

function BananCrest({ className }: { className?: string }) {
  return (
    <div
      className={`${className} flex flex-none items-center justify-center border border-current font-arabic text-[0.55em] font-semibold tracking-widest`}
      aria-hidden
    >
      B
    </div>
  );
}

function BrandName({ className }: { className?: string }) {
  const { t } = useLocale();
  return (
    <div className={`${className} font-arabic leading-none tracking-[0.28em]`}>
      {t("brandName")}
    </div>
  );
}

function BrandSubtitle({
  className,
  tone,
}: {
  className?: string;
  tone: "dark" | "light";
}) {
  const { t } = useLocale();
  return (
    <div
      className={`${className} mt-1 leading-none tracking-[0.22em] uppercase ${
        tone === "light" ? "text-white/75" : "text-text-muted"
      }`}
    >
      {t("brandSubtitle")}
    </div>
  );
}
