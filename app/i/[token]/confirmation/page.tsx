import { notFound } from "next/navigation";
import { getInvite } from "@/lib/guest/get-invite";
import { GuestHeader } from "@/components/guest/guest-header";
import { ConfirmationView } from "@/components/guest/confirmation-view";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInvite(token);

  if (!invite) {
    notFound();
  }

  const slot = invite.event.slots.find((s) => s.id === invite.preferredSlotId) ?? null;

  return (
    <div className="min-h-screen">
      <GuestHeader />
      <ConfirmationView
        token={invite.token}
        fullName={invite.fullName}
        partySize={invite.partySize}
        transfer={invite.transferChoice}
        slot={slot}
      />
    </div>
  );
}
