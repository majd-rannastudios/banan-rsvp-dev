import { requireRole } from "@/lib/organizer/session";
import { ComingSoon } from "@/components/organizer/coming-soon";

export default async function GuestsPage() {
  await requireRole(["admin", "broadcast_manager", "viewer"]);
  return <ComingSoon navTitleKey="navGuests" bodyKey="comingSoonGuests" />;
}
