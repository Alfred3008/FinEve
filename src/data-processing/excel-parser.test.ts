import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { parseWorkbook } from "./excel-parser";

/** Builds an in-memory xlsx ArrayBuffer from a 2D array of rows, for testing. */
function buildWorkbookBuffer(rows: (string | number)[][]): ArrayBuffer {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return buffer as ArrayBuffer;
}

describe("parseWorkbook", () => {
  it("extracts raw line items from a well-formed sheet", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Receivables", 20, 40],
    ]);

    const result = parseWorkbook(buffer);

    expect(result.items).toHaveLength(4);
    expect(result.items).toContainEqual({ raw_label: "Total Revenue", period: "FY2023", value: 100 });
    expect(result.items).toContainEqual({ raw_label: "Total Revenue", period: "FY2024", value: 120 });
    expect(result.items).toContainEqual({ raw_label: "Receivables", period: "FY2023", value: 20 });
    expect(result.items).toContainEqual({ raw_label: "Receivables", period: "FY2024", value: 40 });
    expect(result.skipped_rows).toHaveLength(0);
  });

  it("preserves the raw label exactly as written, including casing and spacing", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2024"],
      ["  total   REVENUE (Net) ", 120],
    ]);

    const result = parseWorkbook(buffer);
    expect(result.items[0].raw_label).toBe("total   REVENUE (Net)"); // outer whitespace trimmed, inner preserved
  });

  it("skips rows with non-numeric values and reports them separately", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, "N/A"],
    ]);

    const result = parseWorkbook(buffer);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({ raw_label: "Total Revenue", period: "FY2023", value: 100 });
    expect(result.skipped_rows).toHaveLength(1);
    expect(result.skipped_rows[0]).toEqual({
      row_label: "Total Revenue",
      period: "FY2024",
      raw_value: "N/A",
    });
  });

  it("skips blank label rows without error", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2024"],
      ["", 100],
      ["Total Revenue", 120],
    ]);

    const result = parseWorkbook(buffer);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].raw_label).toBe("Total Revenue");
  });

  it("handles numeric strings by coercing to number", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2024"],
      ["Total Revenue", "120"],
    ]);

    const result = parseWorkbook(buffer);
    expect(result.items[0].value).toBe(120);
  });

  it("throws if the sheet has fewer than 2 columns", () => {
    const buffer = buildWorkbookBuffer([["Line Item"], ["Total Revenue"]]);
    expect(() => parseWorkbook(buffer)).toThrow(/at least a label column and one period column/);
  });

  it("throws if the worksheet is empty", () => {
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;

    expect(() => parseWorkbook(buffer)).toThrow(/empty/);
  });
});
