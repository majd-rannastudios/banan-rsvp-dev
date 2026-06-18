import Link from "next/link";

/**
 * Real lockups extracted from the Banan Corporate Master Brand Guidelines
 * 2024 PDF (vector paths, not rasterized) — see public/brand/logo-*.svg.
 * "logo-primary" = deep green wordmark for light backgrounds, "logo-secondary"
 * = white wordmark for dark backgrounds, per the guide's usage rules. The
 * lockup already includes "Al Riyadh" — per the brand guide ("no slogan
 * should appear alongside the logo"), do not add tagline text next to it.
 *
 * The secondary-logo slot is rendered but intentionally left empty (no
 * Intouch, no agency credit) — reserved for a possible future TMG corporate
 * co-branding lockup, per the brand's co-branding clear-space rules.
 */
export function LogoLockup({
  size = "md",
  tone = "dark",
  showSecondarySlot = false,
  linkToHome = true,
}: {
  size?: "sm" | "md" | "lg";
  /** "dark" = deep green mark for light backgrounds (default). "light" = white mark for dark/hero backgrounds. */
  tone?: "dark" | "light";
  showSecondarySlot?: boolean;
  /** Clicking the mark returns to the hero/home page. Set false on the home page itself if not wanted there. */
  linkToHome?: boolean;
}) {
  const heightClass = { sm: "h-8", md: "h-10", lg: "h-16" }[size];
  const src = tone === "light" ? "/brand/logo-secondary.svg" : "/brand/logo-primary.svg";

  const mark = (
    // inline-flex (not flex) so this respects an ancestor's text-align:center
    // instead of stretching block-full-width and left-aligning its content.
    <div className="inline-flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Banan Al Riyadh" className={`${heightClass} w-auto`} />
      {showSecondarySlot ? (
        <>
          <span
            aria-hidden
            className={`h-6 w-px ${tone === "light" ? "bg-white/30" : "bg-text/20"}`}
          />
          {/* reserved secondary co-branding slot — intentionally empty */}
          <span className="sr-only">Secondary logo slot reserved</span>
        </>
      ) : null}
    </div>
  );

  if (!linkToHome) return mark;

  return (
    <Link href="/" className="inline-flex transition-opacity hover:opacity-80" aria-label="Banan home">
      {mark}
    </Link>
  );
}
