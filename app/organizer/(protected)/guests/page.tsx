import { requireRole } from "@/lib/organizer/session";
import { listGuests, listEventSlotsForFilter } from "@/lib/organizer/guests-data";
import { GuestTable } from "@/components/organizer/guest-table";
import { GuestsHeading } from "./guests-heading";

export default async function GuestsPage() {
  const session = await requireRole(["admin", "broadcast_manager", "viewer"]);
  const [guests, slots] = await Promise.all([listGuests(), listEventSlotsForFilter()]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <GuestsHeading />
      <div className="mt-6">
        <GuestTable guests={guests} slots={slots} role={session.role} />
      </div>
    </div>
  );
}
