import { notFound } from "next/navigation";
import { getInvite } from "@/lib/guest/get-invite";
import { GuestHeader } from "@/components/guest/guest-header";
import { ConfirmationView } from "@/components/guest/confirmation-view";
import type { TransferChoice } from "@/lib/guest/types";

function parseTransfer(value: string | undefined): TransferChoice | null {
  return value === "none" || value === "shuttle" || value === "vip" ? value : null;
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const invite = await getInvite(token);

  if (!invite) {
    notFound();
  }

  const partySize = Number(sp.party) || invite.partySize || 1;
  const slotId =
    typeof sp.slot === "string" && sp.slot ? sp.slot : invite.preferredSlotId;
  const transfer = parseTransfer(typeof sp.transfer === "string" ? sp.transfer : undefined) ?? invite.transferChoice;
  const slot = invite.event.slots.find((s) => s.id === slotId) ?? null;

  return (
    <div className="min-h-screen">
      <GuestHeader />
      <ConfirmationView
        token={invite.token}
        fullName={invite.fullName}
        partySize={partySize}
        transfer={transfer}
        slot={slot}
      />
    </div>
  );
}
