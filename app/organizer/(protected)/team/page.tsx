import { requireRole } from "@/lib/organizer/session";
import { ComingSoon } from "@/components/organizer/coming-soon";

export default async function TeamPage() {
  await requireRole(["admin"]);
  return <ComingSoon navTitleKey="navTeam" bodyKey="comingSoonTeam" />;
}
