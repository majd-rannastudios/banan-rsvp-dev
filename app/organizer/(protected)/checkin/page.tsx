import { requireRole } from "@/lib/organizer/session";
import { ComingSoon } from "@/components/organizer/coming-soon";

export default async function CheckinPage() {
  await requireRole(["admin", "checkin_staff"]);
  return <ComingSoon navTitleKey="navCheckin" bodyKey="comingSoonCheckin" />;
}
