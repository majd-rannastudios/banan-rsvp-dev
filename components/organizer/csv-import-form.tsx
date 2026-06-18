"use client";

import { useActionState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { importGuestsCsv, type ImportState } from "@/app/organizer/(protected)/guests/import/actions";
import { CSV_TEMPLATE_HEADER } from "@/lib/csv/parse-guests";

const initialState: ImportState = {};

export function CsvImportForm() {
  const { t } = useLocale();
  const [state, formAction, pending] = useActionState(importGuestsCsv, initialState);

  function downloadTemplate() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([CSV_TEMPLATE_HEADER + "\n"], { type: "text/csv" }));
    a.download = "banan-guests-template.csv";
    a.click();
  }

  function downloadRejected() {
    if (!state.report) return;
    const rows = state.report.errors.map((e) => [String(e.row), e.field, e.message]);
    const csv = ["row,field,message", ...rows.map((r) => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "banan-import-errors.csv";
    a.click();
  }

  return (
    <div className="max-w-xl">
      <button
        type="button"
        onClick={downloadTemplate}
        className="min-h-11 border border-text px-4 text-[11px] tracking-[0.14em] text-text uppercase transition-colors hover:bg-text hover:text-white"
      >
        {t("downloadTemplate")}
      </button>

      <form action={formAction} className="mt-6 space-y-4">
        <input
          type="file"
          name="file"
          accept=".csv"
          required
          className="block w-full text-sm text-text-muted"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 bg-interactive px-6 text-[12px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-interactive-hover disabled:opacity-60"
        >
          {pending ? t("importing") : t("importSubmit")}
        </button>
      </form>

      {state.error && <p className="mt-4 text-sm text-danger">{state.error}</p>}

      {state.report && (
        <div className="mt-6 border border-surface-muted bg-surface p-5">
          <p className="text-sm text-text">
            {state.insertedCount} {t("importInserted")}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {state.report.validRows.length} {t("importRowsValid")}
            {state.report.errors.length > 0 && ` · ${state.report.errors.length} ${t("importRowsError")}`}
          </p>

          {state.report.errors.length > 0 && (
            <>
              <ul className="mt-4 space-y-1.5 text-sm text-danger">
                {state.report.errors.map((e, i) => (
                  <li key={i}>
                    {t("row")} {e.row}: {e.field} — {e.message}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={downloadRejected}
                className="mt-3 min-h-9 border border-danger px-3 text-[10px] tracking-[0.14em] text-danger uppercase"
              >
                Download rejected rows
              </button>
            </>
          )}

          {state.report.warnings.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-text-muted">
              {state.report.warnings.map((w, i) => (
                <li key={i}>
                  {t("row")} {w.row}: {w.field} — {w.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
