import { requireSession } from "@/lib/organizer/session";
import { OrgHeader } from "@/components/organizer/org-header";
import { OrgSubnav } from "@/components/organizer/org-subnav";

export default async function OrganizerProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <OrgHeader session={session} />
      <OrgSubnav role={session.role} />
      {children}
    </div>
  );
}
