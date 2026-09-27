import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { runPipeline } from "./pipeline";
import type { FRFKnowledgeBase } from "../frf-engine/knowledge-base/schema";
import seedData from "../frf-engine/knowledge-base/seed-data.json";

const kb = seedData as FRFKnowledgeBase;

function buildWorkbookBuffer(rows: (string | number)[][]): ArrayBuffer {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  return XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}

describe("runPipeline — end to end", () => {
  it("connects Excel → mapping → change detection → relationship lookup for the worked example", () => {
    // The exact worked example from the approved architecture:
    // Revenue ↑ → Receivables ↑ → related parameter: Operating Cash Flow
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120], // +20%, increase
      ["Debtors", 20, 40], // +100%, increase
      ["Cash Flow from Operations", 15, 2], // -86.67%, decrease
    ]);

    const result = runPipeline(buffer, "FY2023", "FY2024", kb);

    expect(result.unmapped_items).toHaveLength(0);
    expect(result.skipped_parameter_ids).toHaveLength(0);
    expect(result.observed_changes).toHaveLength(3);
    expect(result.mapped_items).toHaveLength(6); // 3 line items x 2 periods each

    const revenueChange = result.observed_changes.find((c) => c.parameter_id === "P_001");
    expect(revenueChange?.direction).toBe("increase");
    expect(revenueChange?.percent_change).toBeCloseTo(20, 5);

    const receivablesChange = result.observed_changes.find((c) => c.parameter_id === "P_002");
    expect(receivablesChange?.direction).toBe("increase");
    expect(receivablesChange?.percent_change).toBeCloseTo(100, 5);

    const cfoChange = result.observed_changes.find((c) => c.parameter_id === "P_003");
    expect(cfoChange?.direction).toBe("decrease");
    expect(cfoChange?.percent_change).toBeCloseTo(-86.6667, 3);

    // R_001: Revenue↑ → Receivables↑ should be matched
    const revenueMatches = result.relationship_matches.get("P_001");
    expect(revenueMatches?.map((m) => m.relationship.relationship_id)).toContain("R_001");
    const r001 = revenueMatches?.find((m) => m.relationship.relationship_id === "R_001");
    expect(r001?.related_parameter.name).toBe("Trade Receivables");
    expect(r001?.relationship.possible_explanations.length).toBeGreaterThan(0);
    expect(r001?.relationship.evidence_to_check.length).toBeGreaterThan(0);
    expect(r001?.relationship.investigation_path.length).toBeGreaterThan(0);

    // R_002: Receivables↑ → CFO↓ should also be matched
    const receivablesMatches = result.relationship_matches.get("P_002");
    expect(receivablesMatches?.map((m) => m.relationship.relationship_id)).toContain("R_002");
    const r002 = receivablesMatches?.find((m) => m.relationship.relationship_id === "R_002");
    expect(r002?.related_parameter.name).toBe("Operating Cash Flow");
  });

  it("surfaces unmapped line items rather than dropping them", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Some Unrecognized Line", 5, 6],
    ]);

    const result = runPipeline(buffer, "FY2023", "FY2024", kb);

    expect(result.unmapped_items).toHaveLength(2); // one per period column
    expect(result.unmapped_items.every((u) => u.raw_label === "Some Unrecognized Line")).toBe(true);
    expect(result.observed_changes).toHaveLength(1); // only Revenue made it through
  });

  it("surfaces skipped parameters when a period is missing for a mapped item", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 100, 120],
      ["Debtors", "", 40], // FY2023 blank/non-numeric → skipped by parser, so only FY2024 value exists
    ]);

    const result = runPipeline(buffer, "FY2023", "FY2024", kb);

    // Debtors only has an FY2024 value after parsing, so change-detection
    // should skip it for missing the FY2023 side.
    expect(result.skipped_parameter_ids).toContain("P_002");
    expect(result.observed_changes.map((c) => c.parameter_id)).not.toContain("P_002");
  });

  it("regression: does not skip parameters when the Excel header has a trailing space (originally reported bug)", () => {
    // Reproduces the exact reported scenario: mapping succeeds, but a
    // trailing space on the FY2023 column header meant computeChanges
    // could never match the "FY2023" from_period the user typed, so
    // every mapped parameter was silently skipped as "missing a value".
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023 ", "FY2024"], // trailing space on FY2023
      ["Total Revenue", 100, 120],
      ["Debtors", 20, 40],
      ["Cash Flow from Operations", 15, 2],
      ["Completely Unknown Line Item", 50, 65],
    ]);

    const result = runPipeline(buffer, "FY2023", "FY2024", kb);

    expect(result.detected_periods).toEqual(["FY2023", "FY2024"]);
    expect(result.skipped_parameter_ids).toHaveLength(0);
    expect(result.observed_changes).toHaveLength(3);
    expect(result.observed_changes.map((c) => c.parameter_id).sort()).toEqual(["P_001", "P_002", "P_003"]);
    // The unrecognized line item is correctly unmapped for a different
    // reason (no matching alias), not related to the period bug.
    expect(result.unmapped_items.length).toBeGreaterThan(0);
  });

  it("exposes detected_periods so a genuine period-name mismatch (not just whitespace) is diagnosable", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY23", "FY24"], // different naming convention than what caller queries
      ["Total Revenue", 100, 120],
    ]);

    const result = runPipeline(buffer, "FY2023", "FY2024", kb);

    expect(result.detected_periods).toEqual(["FY23", "FY24"]);
    expect(result.skipped_parameter_ids).toContain("P_001");
    expect(result.observed_changes).toHaveLength(0);
  });

  it("returns no relationship matches when an observed change has no corresponding relationship", () => {
    const buffer = buildWorkbookBuffer([
      ["Line Item", "FY2023", "FY2024"],
      ["Total Revenue", 120, 100], // decrease — no "decrease" relationship exists for Revenue in the seed set
    ]);

    const result = runPipeline(buffer, "FY2023", "FY2024", kb);
    expect(result.observed_changes[0].direction).toBe("decrease");
    expect(result.relationship_matches.get("P_001")).toEqual([]);
  });
});
