import Papa from "papaparse";
import type { TransferChoice } from "@/lib/guest/types";

export interface ParsedGuestRow {
  full_name: string;
  mobile: string;
  email: string | null;
  nationality: string | null;
  party_size: number;
  preferred_slot_id: string | null;
  transfer_choice: TransferChoice;
  language_pref: "en" | "ar";
  is_vip: boolean;
  notes: string | null;
}

export interface RowIssue {
  row: number;
  field: string;
  message: string;
}

export interface ParseReport {
  totalRows: number;
  validRows: ParsedGuestRow[];
  errors: RowIssue[];
  warnings: RowIssue[];
}

const TRANSFER_VALUES: TransferChoice[] = ["none", "shuttle", "vip"];

export const CSV_TEMPLATE_HEADER =
  "full_name,mobile,email,nationality,party_size,preferred_slot_label,transfer_choice,language_pref,is_vip,notes";

export function parseGuestsCsv(csvText: string, slots: { id: string; label: string }[]): ParseReport {
  const { data } = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const slotByLabel = new Map(slots.map((s) => [s.label.toLowerCase(), s.id]));
  const validRows: ParsedGuestRow[] = [];
  const errors: RowIssue[] = [];
  const warnings: RowIssue[] = [];

  data.forEach((raw, idx) => {
    const rowNum = idx + 2; // header is row 1
    const fullName = (raw.full_name ?? "").trim();
    const mobile = (raw.mobile ?? "").trim();

    if (!fullName) {
      errors.push({ row: rowNum, field: "full_name", message: "Required" });
      return;
    }
    if (!mobile) {
      errors.push({ row: rowNum, field: "mobile", message: "Required" });
      return;
    }

    let partySize = parseInt(raw.party_size ?? "1", 10);
    if (!Number.isFinite(partySize) || partySize < 1 || partySize > 12) {
      warnings.push({ row: rowNum, field: "party_size", message: "Invalid, defaulted to 1" });
      partySize = 1;
    }

    let slotId: string | null = null;
    const slotLabelRaw = (raw.preferred_slot_label ?? "").trim();
    if (slotLabelRaw) {
      const match = slotByLabel.get(slotLabelRaw.toLowerCase());
      if (!match) {
        errors.push({ row: rowNum, field: "preferred_slot_label", message: `Unrecognized slot: "${slotLabelRaw}"` });
        return;
      }
      slotId = match;
    }

    let transfer = (raw.transfer_choice ?? "none").trim().toLowerCase() as TransferChoice;
    if (!TRANSFER_VALUES.includes(transfer)) {
      warnings.push({ row: rowNum, field: "transfer_choice", message: "Invalid, defaulted to none" });
      transfer = "none";
    }

    let language = (raw.language_pref ?? "en").trim().toLowerCase();
    if (language !== "en" && language !== "ar") {
      warnings.push({ row: rowNum, field: "language_pref", message: "Invalid, defaulted to en" });
      language = "en";
    }

    const isVip = ["true", "yes", "1"].includes((raw.is_vip ?? "").trim().toLowerCase());

    validRows.push({
      full_name: fullName,
      mobile,
      email: raw.email?.trim() || null,
      nationality: raw.nationality?.trim() || null,
      party_size: partySize,
      preferred_slot_id: slotId,
      transfer_choice: transfer,
      language_pref: language as "en" | "ar",
      is_vip: isVip,
      notes: raw.notes?.trim() || null,
    });
  });

  return { totalRows: data.length, validRows, errors, warnings };
}
