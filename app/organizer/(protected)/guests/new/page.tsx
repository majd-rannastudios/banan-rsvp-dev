import { requireRole } from "@/lib/organizer/session";
import { GuestForm } from "@/components/organizer/guest-form";
import { GuestFormHeading } from "../guest-form-heading";

export default async function NewGuestPage() {
  await requireRole(["admin"]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <GuestFormHeading titleKey="addGuestTitle" />
      <div className="mt-6">
        <GuestForm />
      </div>
    </div>
  );
}
