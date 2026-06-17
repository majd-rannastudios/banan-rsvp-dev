import { LanguageToggle } from "@/components/ui/language-toggle";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { HomeCopy } from "./home-copy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-surface-muted">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <LogoLockup size="sm" />
          <LanguageToggle />
        </div>
      </header>

      <div className="hero-texture flex flex-1 items-center justify-center px-5 py-20 sm:py-28">
        <div className="w-full max-w-md text-center">
          <LogoLockup size="lg" tone="light" />
          <HomeCopy />
        </div>
      </div>
    </div>
  );
}
