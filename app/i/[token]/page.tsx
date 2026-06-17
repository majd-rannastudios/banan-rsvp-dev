import { notFound } from "next/navigation";
import { getInvite } from "@/lib/guest/get-invite";
import { GuestHeader } from "@/components/guest/guest-header";
import { InviteHero } from "@/components/guest/invite-hero";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInvite(token);

  if (!invite) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <GuestHeader />
      <InviteHero invite={invite} />
    </div>
  );
}
