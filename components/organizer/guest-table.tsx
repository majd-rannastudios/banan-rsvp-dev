"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import type { DictionaryKey } from "@/lib/i18n/dictionary";
import type { Guest } from "@/lib/organizer/guests-data";
import type { OrganizerRole } from "@/lib/organizer/types";

const STATUS_KEY: Record<string, DictionaryKey> = {
  invited: "statusInvited",
  confirmed: "statusConfirmed",
  declined: "statusDeclined",
  checked_in: "statusCheckedIn",
};
const TRANSFER_KEY: Record<string, DictionaryKey> = {
  none: "transferNone",
  shuttle: "transferShuttle",
  vip: "transferVip",
};

function toCsv(guests: Guest[]): string {
  const head = ["Full name", "Mobile", "Email", "Nationality", "Party", "Slot", "Transfer", "Status", "Invite token"];
  const rows = guests.map((g) => [
    g.fullName, g.mobile, g.email ?? "", g.nationality ?? "", String(g.partySize),
    g.slotLabel ?? "", g.transferChoice, g.rsvpStatus, g.inviteToken,
  ]);
  return [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function GuestTable({
  guests,
  slots,
  role,
}: {
  guests: Guest[];
  slots: { id: string; label: string }[];
  role: OrganizerRole;
}) {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [transferFilter, setTransferFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canEdit = role === "admin";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      if (q && !(g.fullName.toLowerCase().includes(q) || g.mobile.toLowerCase().includes(q) || (g.nationality ?? "").toLowerCase().includes(q))) return false;
      if (slotFilter && g.preferredSlotId !== slotFilter) return false;
      if (transferFilter && g.transferChoice !== transferFilter) return false;
      if (statusFilter && g.rsvpStatus !== statusFilter) return false;
      return true;
    });
  }, [guests, search, slotFilter, transferFilter, statusFilter]);

  function handleExport() {
    const csv = toCsv(filtered);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "banan-guests.csv";
    a.click();
  }

  async function handleCopyLink(token: string, id: string) {
    const url = `${window.location.origin}/i/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="min-h-11 min-w-[200px] flex-1 border border-surface-muted bg-surface px-3 text-sm text-text focus:border-interactive focus:outline-none"
        />
        <select value={slotFilter} onChange={(e) => setSlotFilter(e.target.value)} className="min-h-11 border border-surface-muted bg-surface px-2 text-sm text-text">
          <option value="">{t("allSlots")}</option>
          {slots.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={transferFilter} onChange={(e) => setTransferFilter(e.target.value)} className="min-h-11 border border-surface-muted bg-surface px-2 text-sm text-text">
          <option value="">{t("allTransfer")}</option>
          <option value="none">{t("transferNone")}</option>
          <option value="shuttle">{t("transferShuttle")}</option>
          <option value="vip">{t("transferVip")}</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="min-h-11 border border-surface-muted bg-surface px-2 text-sm text-text">
          <option value="">{t("allStatus")}</option>
          <option value="invited">{t("statusInvited")}</option>
          <option value="confirmed">{t("statusConfirmed")}</option>
          <option value="declined">{t("statusDeclined")}</option>
          <option value="checked_in">{t("statusCheckedIn")}</option>
        </select>
        <button onClick={handleExport} className="min-h-11 border border-text px-3 text-[11px] tracking-[0.14em] text-text uppercase transition-colors hover:bg-text hover:text-white">
          {t("exportCsv")}
        </button>
        {canEdit && (
          <>
            <Link href="/organizer/guests/import" className="flex min-h-11 items-center border border-text px-3 text-[11px] tracking-[0.14em] text-text uppercase transition-colors hover:bg-text hover:text-white">
              {t("importCsv")}
            </Link>
            <Link href="/organizer/guests/new" className="flex min-h-11 items-center bg-interactive px-3 text-[11px] tracking-[0.14em] text-white uppercase transition-colors hover:bg-interactive-hover">
              {t("addGuest")}
            </Link>
          </>
        )}
      </div>

      {/* Mobile: cards */}
      <div className="mt-4 space-y-3 sm:hidden">
        {filtered.map((g) => (
          <div key={g.id} className="border border-surface-muted bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-text">{g.fullName}</p>
                <p className="text-xs text-text-muted">{g.mobile}</p>
              </div>
              <StatusPill status={g.rsvpStatus} labelKey={STATUS_KEY[g.rsvpStatus]} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              <span>{g.nationality ?? "—"}</span>
              <span>{g.partySize}×</span>
              <span>{g.transferChoice !== "none" ? t(TRANSFER_KEY[g.transferChoice]) : "—"}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleCopyLink(g.inviteToken, g.id)} className="min-h-9 flex-1 border border-surface-muted text-[10px] tracking-[0.14em] text-text uppercase">
                {copiedId === g.id ? t("linkCopied") : t("copyLink")}
              </button>
              {canEdit && (
                <Link href={`/organizer/guests/${g.id}`} className="flex min-h-9 flex-1 items-center justify-center border border-surface-muted text-[10px] tracking-[0.14em] text-text uppercase">
                  {t("editGuestTitle")}
                </Link>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-text-muted">{t("noGuestsFound")}</p>}
      </div>

      {/* Desktop: table */}
      <div className="mt-4 hidden overflow-x-auto border border-surface-muted bg-surface sm:block">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-surface-muted/40">
              {(["thGuest", "thContact", "thNationality", "thParty", "thSlot", "thTransfer", "thStatus"] as const).map((k) => (
                <th key={k} className="border-b border-surface-muted px-4 py-3 text-start text-[10px] tracking-[0.14em] text-text-muted uppercase">{t(k)}</th>
              ))}
              <th className="border-b border-surface-muted px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="hover:bg-surface-muted/20">
                <td className="border-b border-surface-muted px-4 py-3">
                  <p className="font-semibold text-text">{g.fullName}</p>
                  {g.isVip && <span className="text-[10px] tracking-[0.12em] text-accent uppercase">VIP</span>}
                </td>
                <td className="border-b border-surface-muted px-4 py-3 text-sm text-text-muted">{g.mobile}</td>
                <td className="border-b border-surface-muted px-4 py-3 text-sm text-text-muted">{g.nationality ?? "—"}</td>
                <td className="border-b border-surface-muted px-4 py-3 text-sm text-text-muted">{g.partySize}</td>
                <td className="border-b border-surface-muted px-4 py-3 text-sm text-text-muted">{g.slotLabel ?? "—"}</td>
                <td className="border-b border-surface-muted px-4 py-3 text-sm text-text-muted">
                  {g.transferChoice !== "none" ? t(TRANSFER_KEY[g.transferChoice]) : "—"}
                </td>
                <td className="border-b border-surface-muted px-4 py-3">
                  <StatusPill status={g.rsvpStatus} labelKey={STATUS_KEY[g.rsvpStatus]} />
                </td>
                <td className="border-b border-surface-muted px-4 py-3 text-end">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleCopyLink(g.inviteToken, g.id)} className="min-h-9 border border-surface-muted px-2.5 text-[10px] tracking-[0.12em] text-text uppercase">
                      {copiedId === g.id ? t("linkCopied") : t("copyLink")}
                    </button>
                    {canEdit && (
                      <Link href={`/organizer/guests/${g.id}`} className="flex min-h-9 items-center border border-surface-muted px-2.5 text-[10px] tracking-[0.12em] text-text uppercase">
                        {t("editGuestTitle")}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-text-muted">{t("noGuestsFound")}</p>}
      </div>

      <p className="mt-3 text-xs text-text-muted">
        {t("showingNOfM").replace("{n}", String(filtered.length)).replace("{m}", String(guests.length))}
      </p>
    </div>
  );
}

function StatusPill({ status, labelKey }: { status: string; labelKey: DictionaryKey }) {
  const { t } = useLocale();
  const tone =
    status === "checked_in" ? "border-interactive text-interactive" :
    status === "confirmed" ? "border-accent text-accent" :
    status === "declined" ? "border-danger text-danger" :
    "border-text-muted text-text-muted";
  return (
    <span className={`inline-block border px-2 py-1 text-[10px] tracking-[0.1em] uppercase ${tone}`}>
      {t(labelKey)}
    </span>
  );
}
