import { GuestHeader } from "@/components/guest/guest-header";
import { InviteNotFoundCopy } from "./invite-not-found-copy";

export default function InviteNotFound() {
  return (
    <div className="min-h-screen">
      <GuestHeader />
      <div className="flex flex-col items-center px-5 py-24 text-center">
        <InviteNotFoundCopy />
      </div>
    </div>
  );
}
