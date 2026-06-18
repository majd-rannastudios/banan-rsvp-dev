"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { createGuest, updateGuest, type GuestFormState } from "@/app/organizer/(protected)/guests/actions";
import type { Guest } from "@/lib/organizer/guests-data";

const initialState: GuestFormState = {};

export function GuestForm({ guest }: { guest?: Guest }) {
  const { t } = useLocale();
  const action = guest ? updateGuest.bind(null, guest.id) : createGuest;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <Field labelKey="fieldFullName" name="full_name" defaultValue={guest?.fullName} required />
      <Field labelKey="fieldMobile" name="mobile" defaultValue={guest?.mobile} required />
      <Field labelKey="fieldEmail" name="email" type="email" defaultValue={guest?.email ?? ""} />
      <Field labelKey="fieldNationality" name="nationality" defaultValue={guest?.nationality ?? ""} />
      <Field labelKey="fieldPartySizeOrg" name="party_size" type="number" defaultValue={String(guest?.partySize ?? 1)} min={1} max={12} />

      <label className="flex items-center gap-2.5">
        <input type="checkbox" name="is_vip" defaultChecked={guest?.isVip} className="h-5 w-5 accent-[#405e2d]" />
        <span className="text-sm text-text">{t("fieldIsVip")}</span>
      </label>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] tracking-[0.18em] text-text uppercase">{t("fieldNotes")}</label>
        <textarea
          name="notes"
          defaultValue={guest?.notes ?? ""}
          className="min-h-[88px] border border-surface-muted bg-surface px-4 py-3 text-sm text-text focus:border-interactive focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <div className="flex gap-3">
        <Link
          href="/organizer/guests"
          className="flex min-h-12 flex-1 items-center justify-center border border-text px-6 text-[12px] tracking-[0.2em] text-text uppercase transition-colors hover:bg-text hover:text-white"
        >
          {t("cancel")}
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 flex-1 bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60"
        >
          {pending ? t("saving") : t("saveGuest")}
        </button>
      </div>
    </form>
  );
}

function Field({
  labelKey,
  name,
  type = "text",
  defaultValue,
  required,
  min,
  max,
}: {
  labelKey: "fieldFullName" | "fieldMobile" | "fieldEmail" | "fieldNationality" | "fieldPartySizeOrg";
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] tracking-[0.18em] text-text uppercase">
        {t(labelKey)}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        className="min-h-12 border border-surface-muted bg-surface px-4 text-sm text-text focus:border-interactive focus:outline-none"
      />
    </div>
  );
}
