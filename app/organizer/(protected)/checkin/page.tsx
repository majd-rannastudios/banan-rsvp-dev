import { requireRole } from "@/lib/organizer/session";
import { getRecentArrivals } from "./actions";
import { CheckinConsole } from "@/components/organizer/checkin-console";
import { CheckinHeading } from "./checkin-heading";

export default async function CheckinPage() {
  await requireRole(["admin", "checkin_staff"]);
  const arrivals = await getRecentArrivals();

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <CheckinHeading />
      <div className="mt-6">
        <CheckinConsole initialArrivals={arrivals} />
      </div>
    </div>
  );
}
