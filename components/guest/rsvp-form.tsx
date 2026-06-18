"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { PartySizeStepper } from "@/components/guest/party-size-stepper";
import { SlotPicker } from "@/components/guest/slot-picker";
import { TransferChips } from "@/components/guest/transfer-chips";
import { submitRsvp, type RsvpFormState } from "@/app/i/[token]/rsvp/actions";
import type { GuestInvite, TransferChoice } from "@/lib/guest/types";

const initialState: RsvpFormState = {};

export function RsvpForm({ invite }: { invite: GuestInvite }) {
  const { locale, t } = useLocale();
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);

  const [partySize, setPartySize] = useState(invite.partySize || 1);
  const [slotId, setSlotId] = useState<string | null>(
    invite.preferredSlotId ?? invite.event.slots[0]?.id ?? null
  );
  const [transfer, setTransfer] = useState<TransferChoice>(invite.transferChoice);
  const [consent, setConsent] = useState(false);

  const error = !consent && state.error === "consent_required" ? t("consentRequired") : state.error ? t("rsvpGenericError") : "";

  return (
    <form action={formAction} className="pb-28 sm:pb-0">
      <input type="hidden" name="token" value={invite.token} />
      <input type="hidden" name="party_size" value={partySize} />
      <input type="hidden" name="slot_id" value={slotId ?? ""} />
      <input type="hidden" name="transfer" value={transfer} />
      <input type="hidden" name="language" value={locale} />

      <div className="space-y-8">
        <PartySizeStepper value={partySize} onChange={setPartySize} />
        <SlotPicker slots={invite.event.slots} value={slotId} onChange={setSlotId} />
        <TransferChips value={transfer} onChange={setTransfer} />

        <label className="flex items-start gap-3 border-t border-surface-muted pt-6">
          <input
            type="checkbox"
            name="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-none accent-[#405e2d]"
          />
          <span className="text-sm leading-relaxed text-text-muted">
            {t("consentLabel")}
          </span>
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {/* Sticky on mobile so the primary action stays reachable on long forms;
          inline on larger screens where the whole form fits in view. */}
      <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-surface-muted bg-surface p-4 sm:static sm:mt-10 sm:border-t-0 sm:p-0">
        <Link
          href={`/i/${invite.token}`}
          className="flex min-h-12 flex-none items-center justify-center border border-text px-6 text-[12px] tracking-[0.2em] text-text uppercase transition-colors hover:bg-text hover:text-white"
        >
          {t("back")}
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 flex-1 bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60"
        >
          {pending ? t("submitting") : t("submitRsvp")}
        </button>
      </div>
    </form>
  );
}
