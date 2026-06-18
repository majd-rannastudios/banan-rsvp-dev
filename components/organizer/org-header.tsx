import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { logout } from "@/app/organizer/login/actions";
import type { OrganizerSession } from "@/lib/organizer/types";
import { SignOutLabel } from "./sign-out-label";

export function OrgHeader({ session }: { session: OrganizerSession }) {
  return (
    <header className="border-b border-surface-muted">
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4">
        <LanguageToggle />
        <LogoLockup size="sm" />
        <div className="flex items-center justify-end gap-3">
          <div className="hidden text-end sm:block">
            <p className="text-sm font-semibold text-text">{session.fullName}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="min-h-9 border border-text-muted px-3 text-[10px] tracking-[0.16em] text-text-muted uppercase transition-colors hover:border-text hover:text-text"
            >
              <SignOutLabel />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
