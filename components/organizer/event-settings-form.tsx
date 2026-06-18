"use client";

import { useActionState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { updateEventSettings, type SettingsFormState } from "@/app/organizer/(protected)/settings/actions";
import type { EventSettings, EventSlotSummary } from "@/lib/organizer/settings-data";

const initialState: SettingsFormState = {};

export function EventSettingsForm({
  event,
  slots,
}: {
  event: EventSettings;
  slots: EventSlotSummary[];
}) {
  const { locale, t } = useLocale();
  const action = updateEventSettings.bind(null, event.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="max-w-2xl">
      <form action={formAction} className="space-y-5">
        <TextField labelKey="fieldEventName" name="name" defaultValue={event.name} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField labelKey="fieldStartsOn" name="starts_on" type="date" defaultValue={event.startsOn} required />
          <TextField labelKey="fieldEndsOn" name="ends_on" type="date" defaultValue={event.endsOn} required />
        </div>
        <TextField labelKey="fieldVenueName" name="venue_name" defaultValue={event.venueName ?? ""} />
        <TextField labelKey="fieldVenueAddress" name="venue_address" defaultValue={event.venueAddress ?? ""} />
        <TextField labelKey="fieldVenueMapsUrl" name="venue_maps_url" defaultValue={event.venueMapsUrl ?? ""} />
        <TextArea labelKey="fieldHeroCopyEn" name="hero_copy_en" defaultValue={event.heroCopyEn ?? ""} />
        <TextArea labelKey="fieldHeroCopyAr" name="hero_copy_ar" defaultValue={event.heroCopyAr ?? ""} dir="rtl" />

        {state.error && <p className="text-sm text-danger">{state.error}</p>}
        {state.saved && <p className="text-sm text-interactive">{t("settingsSaved")}</p>}

        <button
          type="submit"
          disabled={pending}
          className="min-h-12 bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60"
        >
          {pending ? t("saving") : t("saveSettings")}
        </button>
      </form>

      <div className="mt-10">
        <p className="text-[10px] tracking-[0.18em] text-text-muted uppercase">{t("eventSlotsTitle")}</p>
        <div className="mt-3 space-y-2">
          {slots.map((s) => (
            <div key={s.id} className="flex items-center justify-between border border-surface-muted bg-surface px-4 py-3 text-sm">
              <span className="text-text">{locale === "ar" ? s.labelAr : s.labelEn}</span>
              <span className="text-text-muted">
                {new Date(s.startsAt).toLocaleString(locale === "ar" ? "ar" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextField({
  labelKey, name, type = "text", defaultValue, required,
}: {
  labelKey: "fieldEventName" | "fieldStartsOn" | "fieldEndsOn" | "fieldVenueName" | "fieldVenueAddress" | "fieldVenueMapsUrl";
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] tracking-[0.18em] text-text uppercase">{t(labelKey)}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="min-h-12 border border-surface-muted bg-surface px-4 text-sm text-text focus:border-interactive focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  labelKey, name, defaultValue, dir,
}: {
  labelKey: "fieldHeroCopyEn" | "fieldHeroCopyAr";
  name: string;
  defaultValue?: string;
  dir?: "rtl";
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] tracking-[0.18em] text-text uppercase">{t(labelKey)}</label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        dir={dir}
        className="min-h-[88px] border border-surface-muted bg-surface px-4 py-3 text-sm text-text focus:border-interactive focus:outline-none"
      />
    </div>
  );
}
