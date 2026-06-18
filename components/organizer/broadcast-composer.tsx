"use client";

import { useActionState, useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { sendBroadcast, type SendBroadcastState } from "@/app/organizer/(protected)/broadcasts/actions";
import { filterGuestsForSegment, type SegmentKey } from "@/lib/organizer/segments";
import type { Guest } from "@/lib/organizer/guests-data";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

const SEGMENTS: { key: SegmentKey; labelKey: DictionaryKey }[] = [
  { key: "all", labelKey: "segmentAll" },
  { key: "confirmed", labelKey: "segmentConfirmed" },
  { key: "needs_transfer", labelKey: "segmentNeedsTransfer" },
  { key: "vip", labelKey: "segmentVip" },
  { key: "not_checked_in", labelKey: "segmentNotCheckedIn" },
];

const CHANNELS: { value: string; labelKey: DictionaryKey }[] = [
  { value: "whatsapp", labelKey: "channelWhatsapp" },
  { value: "sms", labelKey: "channelSms" },
  { value: "email", labelKey: "channelEmail" },
];

const initialState: SendBroadcastState = {};

export function BroadcastComposer({ guests }: { guests: Guest[] }) {
  const { t } = useLocale();
  const [state, formAction, pending] = useActionState(sendBroadcast, initialState);
  const [segment, setSegment] = useState<SegmentKey>("all");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["whatsapp"]);

  const reach = useMemo(() => filterGuestsForSegment(guests, segment).length, [guests, segment]);

  function toggleChannel(value: string) {
    setSelectedChannels((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  }

  const error =
    state.error === "no_channel" ? t("selectChannelError") :
    state.error === "no_body" ? t("messageBodyError") :
    state.error ? t("rsvpGenericError") : "";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div>
        <p className="text-[10px] tracking-[0.18em] text-text-muted uppercase">Audience segment</p>
        <div className="mt-2 space-y-2">
          {SEGMENTS.map((s) => {
            const count = filterGuestsForSegment(guests, s.key).length;
            const active = segment === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSegment(s.key)}
                className={`flex w-full items-center justify-between border px-4 py-3 text-start text-sm transition-colors ${
                  active ? "border-interactive bg-interactive text-white" : "border-surface-muted bg-surface text-text hover:border-text-muted"
                }`}
              >
                <span>{t(s.labelKey)}</span>
                <span className="font-semibold">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border border-surface-muted bg-surface p-5">
        <p className="text-[10px] tracking-[0.18em] text-text-muted uppercase">
          {t("reachingNGuests").replace("{n}", String(reach))}
        </p>

        <form action={formAction} className="mt-4 space-y-5">
          <input type="hidden" name="segment" value={segment} />

          <div>
            <p className="text-[10px] tracking-[0.18em] text-text uppercase">{t("channels")}</p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {CHANNELS.map((c) => (
                <label
                  key={c.value}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 border px-3 text-sm transition-colors ${
                    selectedChannels.includes(c.value) ? "border-interactive bg-interactive text-white" : "border-surface-muted text-text"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="channels"
                    value={c.value}
                    checked={selectedChannels.includes(c.value)}
                    onChange={() => toggleChannel(c.value)}
                    className="sr-only"
                  />
                  {t(c.labelKey)}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.18em] text-text uppercase">{t("messageBodyEn")}</label>
            <textarea name="body_en" required className="min-h-[100px] border border-surface-muted bg-surface px-4 py-3 text-sm text-text focus:border-interactive focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.18em] text-text uppercase">{t("messageBodyAr")}</label>
            <textarea name="body_ar" dir="rtl" className="min-h-[100px] border border-surface-muted bg-surface px-4 py-3 text-sm text-text focus:border-interactive focus:outline-none" />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
          {state.sentCount !== undefined && !state.error && (
            <p className="text-sm text-interactive">Sent to {state.sentCount} guests (mocked).</p>
          )}
          <p className="text-xs text-text-muted">{t("mockSendNote")}</p>

          <button
            type="submit"
            disabled={pending}
            className="min-h-12 w-full bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60 sm:w-auto"
          >
            {pending ? t("sendingBroadcast") : t("sendBroadcast")}
          </button>
        </form>
      </div>
    </div>
  );
}
