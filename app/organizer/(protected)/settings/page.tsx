import { requireRole } from "@/lib/organizer/session";
import { ComingSoon } from "@/components/organizer/coming-soon";

export default async function SettingsPage() {
  await requireRole(["admin"]);
  return <ComingSoon navTitleKey="navSettings" bodyKey="comingSoonSettings" />;
}
