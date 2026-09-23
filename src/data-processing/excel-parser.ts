/**
 * Excel / CSV Parser
 *
 * Reads an uploaded workbook (xlsx or csv, both handled by SheetJS) and
 * extracts raw line items: a label column plus one or more period
 * columns of numeric values.
 *
 * Expected input shape (Phase 1, deliberately simple — no auto-detection
 * of arbitrary layouts):
 *
 *   | Line Item      | FY2023 | FY2024 |
 *   |----------------|--------|--------|
 *   | Total Revenue  | 100    | 120    |
 *   | Receivables    | 20     | 40     |
 *
 * The first column is treated as the label column. Every other column
 * header is treated as a period identifier. This module does NOT map
 * labels to canonical parameters — that is parameter-mapping.ts's job.
 * This module only extracts raw (label, period, value) triples,
 * preserving the original label text verbatim.
 */

import * as XLSX from "xlsx";
import type { RawLineItem } from "./parameter-mapping";

export interface ParseResult {
  items: RawLineItem[];
  /** Rows skipped because their value cell was not a valid number. */
  skipped_rows: { row_label: string; period: string; raw_value: unknown }[];
}

/**
 * Parses a workbook buffer (from a File/ArrayBuffer) into raw line items.
 * Uses the first worksheet only in Phase 1.
 *
 * Throws if the workbook has no worksheets, or if the first worksheet
 * has fewer than 2 columns (no period columns to read).
 */
export function parseWorkbook(fileBuffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(fileBuffer, { type: "array" });

  if (workbook.SheetNames.length === 0) {
    throw new Error("Uploaded file contains no worksheets.");
  }

  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  // sheet_to_json with header: 1 gives an array of row arrays, preserving
  // column order exactly as it appears in the sheet.
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });

  if (rows.length === 0) {
    throw new Error("Uploaded file's first worksheet is empty.");
  }

  const headerRow = rows[0];
  if (headerRow.length < 2) {
    throw new Error(
      "Uploaded file's first worksheet must have at least a label column and one period column."
    );
  }

  const periodColumns = headerRow.slice(1).map((h) => String(h));

  const items: RawLineItem[] = [];
  const skipped_rows: ParseResult["skipped_rows"] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rawLabel = row[0];
    if (rawLabel === undefined || rawLabel === null || String(rawLabel).trim() === "") {
      continue; // blank label row — nothing to extract, not an error
    }
    const label = String(rawLabel).trim();

    for (let colIdx = 0; colIdx < periodColumns.length; colIdx++) {
      const period = periodColumns[colIdx];
      const rawValue = row[colIdx + 1];

      const numericValue =
        typeof rawValue === "number" ? rawValue : typeof rawValue === "string" ? Number(rawValue.trim()) : NaN;

      if (Number.isNaN(numericValue)) {
        skipped_rows.push({ row_label: label, period, raw_value: rawValue });
        continue;
      }

      items.push({ raw_label: label, period, value: numericValue });
    }
  }

  return { items, skipped_rows };
}
