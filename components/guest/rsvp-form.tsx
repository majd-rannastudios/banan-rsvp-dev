"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/context";
import { PartySizeStepper } from "@/components/guest/party-size-stepper";
import { SlotPicker } from "@/components/guest/slot-picker";
import { TransferChips } from "@/components/guest/transfer-chips";
import type { GuestInvite, TransferChoice } from "@/lib/guest/types";

export function RsvpForm({ invite }: { invite: GuestInvite }) {
  const { t } = useLocale();
  const router = useRouter();

  const [partySize, setPartySize] = useState(invite.partySize || 1);
  const [slotId, setSlotId] = useState<string | null>(
    invite.preferredSlotId ?? invite.event.slots[0]?.id ?? null
  );
  const [transfer, setTransfer] = useState<TransferChoice>(invite.transferChoice);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError(t("consentRequired"));
      return;
    }
    setError("");
    setSubmitting(true);

    // TODO(Phase 2/3): replace with a server action calling the
    // `submit_rsvp` RPC. For now (no Supabase yet) the chosen values are
    // passed via the URL so the confirmation page can render a real badge.
    const params = new URLSearchParams({
      status: "confirmed",
      party: String(partySize),
      slot: slotId ?? "",
      transfer,
    });
    setTimeout(() => {
      router.push(`/i/${invite.token}/confirmation?${params.toString()}`);
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="pb-28 sm:pb-0">
      <div className="space-y-8">
        <PartySizeStepper value={partySize} onChange={setPartySize} />
        <SlotPicker slots={invite.event.slots} value={slotId} onChange={setSlotId} />
        <TransferChips value={transfer} onChange={setTransfer} />

        <label className="flex items-start gap-3 border-t border-surface-muted pt-6">
          <input
            type="checkbox"
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
      <div className="fixed inset-x-0 bottom-0 border-t border-surface-muted bg-surface p-4 sm:static sm:mt-10 sm:border-t-0 sm:p-0">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-12 w-full bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60"
        >
          {submitting ? t("submitting") : t("submitRsvp")}
        </button>
      </div>
    </form>
  );
}
