import { requireRole } from "@/lib/organizer/session";
import { CsvImportForm } from "@/components/organizer/csv-import-form";
import { GuestFormHeading } from "../guest-form-heading";

export default async function ImportGuestsPage() {
  await requireRole(["admin"]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <GuestFormHeading titleKey="importTitle" />
      <div className="mt-6">
        <CsvImportForm />
      </div>
    </div>
  );
}
