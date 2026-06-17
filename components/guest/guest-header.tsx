import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageToggle } from "@/components/ui/language-toggle";

export function GuestHeader() {
  return (
    <header className="border-b border-surface-muted">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-4">
        <LogoLockup size="sm" />
        <LanguageToggle />
      </div>
    </header>
  );
}
