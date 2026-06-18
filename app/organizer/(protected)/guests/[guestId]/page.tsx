import { notFound } from "next/navigation";
import { requireRole } from "@/lib/organizer/session";
import { getGuestById } from "@/lib/organizer/guests-data";
import { GuestForm } from "@/components/organizer/guest-form";
import { GuestFormHeading } from "../guest-form-heading";

export default async function EditGuestPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  await requireRole(["admin"]);
  const { guestId } = await params;
  const guest = await getGuestById(guestId);

  if (!guest) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <GuestFormHeading titleKey="editGuestTitle" />
      <div className="mt-6">
        <GuestForm guest={guest} />
      </div>
    </div>
  );
}
