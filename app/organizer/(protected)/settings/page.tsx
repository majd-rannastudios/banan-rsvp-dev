import { requireRole } from "@/lib/organizer/session";
import { getEventSettings, getEventSlotsSummary } from "@/lib/organizer/settings-data";
import { EventSettingsForm } from "@/components/organizer/event-settings-form";
import { SettingsHeading } from "./settings-heading";

export default async function SettingsPage() {
  await requireRole(["admin"]);
  const event = await getEventSettings();
  const slots = event ? await getEventSlotsSummary(event.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <SettingsHeading />
      <div className="mt-6">
        {event ? (
          <EventSettingsForm event={event} slots={slots} />
        ) : (
          <p className="text-sm text-text-muted">No event found.</p>
        )}
      </div>
    </div>
  );
}
