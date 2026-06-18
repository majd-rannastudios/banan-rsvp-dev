"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/organizer/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listEventSlotsForFilter } from "@/lib/organizer/guests-data";
import { parseGuestsCsv, type ParseReport } from "@/lib/csv/parse-guests";

export interface ImportState {
  report?: ParseReport;
  insertedCount?: number;
  error?: string;
}

export async function importGuestsCsv(_prev: ImportState, formData: FormData): Promise<ImportState> {
  await requireRole(["admin"]);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "no_file" };
  }

  const text = await file.text();
  const slots = await listEventSlotsForFilter();
  const report = parseGuestsCsv(text, slots);

  if (report.validRows.length === 0) {
    return { report, insertedCount: 0 };
  }

  const admin = createSupabaseAdminClient();

  // Re-import dedupe: update existing guests matched by mobile rather than
  // inserting a duplicate (which would orphan their already-sent link).
  const { data: existing } = await admin.from("guests").select("id, mobile");
  const existingByMobile = new Map((existing ?? []).map((g) => [g.mobile, g.id]));

  const toInsert = report.validRows.filter((r) => !existingByMobile.has(r.mobile));
  const toUpdate = report.validRows.filter((r) => existingByMobile.has(r.mobile));

  let insertedCount = 0;
  if (toInsert.length > 0) {
    const { error, count } = await admin.from("guests").insert(toInsert, { count: "exact" });
    if (!error) insertedCount += count ?? toInsert.length;
  }
  for (const row of toUpdate) {
    const id = existingByMobile.get(row.mobile)!;
    await admin.from("guests").update(row).eq("id", id);
  }
  insertedCount += toUpdate.length;

  revalidatePath("/organizer/guests");
  return { report, insertedCount };
}
