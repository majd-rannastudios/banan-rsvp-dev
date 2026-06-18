import { requireRole } from "@/lib/organizer/session";
import { listGuests } from "@/lib/organizer/guests-data";
import { listBroadcastHistory } from "@/lib/organizer/broadcasts-data";
import { BroadcastComposer } from "@/components/organizer/broadcast-composer";
import { BroadcastHistory } from "@/components/organizer/broadcast-history";
import { BroadcastsHeading } from "./broadcasts-heading";

export default async function BroadcastsPage() {
  await requireRole(["admin", "broadcast_manager"]);
  const [guests, history] = await Promise.all([listGuests(), listBroadcastHistory()]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <BroadcastsHeading />
      <div className="mt-6">
        <BroadcastComposer guests={guests} />
        <BroadcastHistory items={history} />
      </div>
    </div>
  );
}
