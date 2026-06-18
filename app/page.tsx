import { LogoLockup } from "@/components/brand/logo-lockup";
import { GuestHeader } from "@/components/guest/guest-header";
import { YouTubeBackground } from "@/components/ui/youtube-background";
import { HomeCopy } from "./home-copy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <GuestHeader />

      <div className="hero-texture relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20 sm:py-28">
        <YouTubeBackground videoId="y9j-BL5ocW8" startSeconds={13} endSeconds={117} />
        {/* tints the clip toward the brand palette and keeps text legible over it */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep/75 via-deep/55 to-deep/80" />

        <div className="relative z-10 w-full max-w-md text-center">
          <LogoLockup size="lg" tone="light" linkToHome={false} />
          <HomeCopy />
        </div>
      </div>
    </div>
  );
}
