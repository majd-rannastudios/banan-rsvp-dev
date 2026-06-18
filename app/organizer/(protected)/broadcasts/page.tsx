import { requireRole } from "@/lib/organizer/session";
import { ComingSoon } from "@/components/organizer/coming-soon";

export default async function BroadcastsPage() {
  await requireRole(["admin", "broadcast_manager"]);
  return <ComingSoon navTitleKey="navBroadcasts" bodyKey="comingSoonBroadcasts" />;
}
