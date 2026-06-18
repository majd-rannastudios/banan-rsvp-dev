import { LogoLockup } from "@/components/brand/logo-lockup";
import { GuestHeader } from "@/components/guest/guest-header";
import { HomeCopy } from "./home-copy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <GuestHeader />

      <div className="hero-texture flex flex-1 items-center justify-center px-5 py-20 sm:py-28">
        <div className="w-full max-w-md text-center">
          <LogoLockup size="lg" tone="light" />
          <HomeCopy />
        </div>
      </div>
    </div>
  );
}
