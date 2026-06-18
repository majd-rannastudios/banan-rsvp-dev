import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageToggle } from "@/components/ui/language-toggle";

export function GuestHeader() {
  return (
    <header className="border-b border-surface-muted">
      <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4">
        <span aria-hidden />
        <LogoLockup size="sm" />
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
