import { notFound } from "next/navigation";
import { getInvite } from "@/lib/guest/get-invite";
import { GuestHeader } from "@/components/guest/guest-header";
import { DeclinedView } from "./declined-view";

export default async function DeclinedPage({
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
      <DeclinedView token={invite.token} />
    </div>
  );
}
