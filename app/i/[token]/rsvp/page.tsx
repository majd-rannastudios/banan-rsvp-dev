import { notFound } from "next/navigation";
import { getInvite } from "@/lib/guest/get-invite";
import { GuestHeader } from "@/components/guest/guest-header";
import { RsvpForm } from "@/components/guest/rsvp-form";
import { RsvpHeading } from "./rsvp-heading";

export default async function RsvpPage({
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
      <div className="mx-auto max-w-xl px-5 py-10 sm:py-14">
        <RsvpHeading />
        <div className="mt-8">
          <RsvpForm invite={invite} />
        </div>
      </div>
    </div>
  );
}
