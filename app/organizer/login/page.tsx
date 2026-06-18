import Link from "next/link";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { LoginForm } from "@/components/organizer/login-form";
import { LoginHeading } from "./login-heading";
import { BackLinkLabel } from "./back-link-label";

export default function OrganizerLoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-surface-muted">
        <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4">
          <span aria-hidden />
          <LogoLockup size="sm" />
          <div className="flex justify-end">
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <LoginHeading />
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </main>

      <div className="border-t border-surface-muted px-5 py-5 text-center">
        <Link href="/" className="text-[11px] tracking-[0.16em] text-text-muted underline uppercase">
          <BackLinkLabel />
        </Link>
      </div>
    </div>
  );
}
