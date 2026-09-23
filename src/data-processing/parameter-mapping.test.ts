import { describe, it, expect } from "vitest";
import { mapLineItems } from "./parameter-mapping";
import type { RawLineItem } from "./parameter-mapping";
import type { FRFParameter } from "../frf-engine/knowledge-base/schema";
import seedData from "../frf-engine/knowledge-base/seed-data.json";
import type { FRFKnowledgeBase } from "../frf-engine/knowledge-base/schema";

const kb = seedData as FRFKnowledgeBase;
const parameters: FRFParameter[] = kb.parameters;

describe("mapLineItems", () => {
  it("maps an exact alias match to the correct parameter", () => {
    const items: RawLineItem[] = [{ raw_label: "Total Revenue", period: "FY2024", value: 120 }];
    const result = mapLineItems(items, parameters);

    expect(result.mapped).toHaveLength(1);
    expect(result.mapped[0].parameter_id).toBe("P_001");
    expect(result.mapped[0].matched_alias).toBe("Total Revenue");
    expect(result.unmapped).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const items: RawLineItem[] = [{ raw_label: "total revenue", period: "FY2024", value: 120 }];
    const result = mapLineItems(items, parameters);
    expect(result.mapped).toHaveLength(1);
    expect(result.mapped[0].parameter_id).toBe("P_001");
  });

  it("matches via substring for labels with extra qualifiers", () => {
    const items: RawLineItem[] = [{ raw_label: "Total Revenue (Net)", period: "FY2024", value: 120 }];
    const result = mapLineItems(items, parameters);
    expect(result.mapped).toHaveLength(1);
    expect(result.mapped[0].parameter_id).toBe("P_001");
  });

  it("preserves the original raw label verbatim, including casing", () => {
    const items: RawLineItem[] = [{ raw_label: "TOTAL REVENUE (as reported)", period: "FY2024", value: 120 }];
    const result = mapLineItems(items, parameters);
    expect(result.mapped[0].raw_label).toBe("TOTAL REVENUE (as reported)");
  });

  it("returns unmapped with reason 'no_matching_alias' for unrecognized labels", () => {
    const items: RawLineItem[] = [{ raw_label: "Goodwill Impairment", period: "FY2024", value: 5 }];
    const result = mapLineItems(items, parameters);

    expect(result.mapped).toHaveLength(0);
    expect(result.unmapped).toHaveLength(1);
    expect(result.unmapped[0].reason).toBe("no_matching_alias");
    expect(result.unmapped[0].raw_label).toBe("Goodwill Impairment");
  });

  it("does not silently guess — returns unmapped rather than a low-confidence match", () => {
    // "Total" alone should not fuzzy-match "Total Revenue" or "Total Debt" —
    // no fuzzy matching is implemented, so this must be unmapped.
    const items: RawLineItem[] = [{ raw_label: "Total", period: "FY2024", value: 10 }];
    const result = mapLineItems(items, parameters);
    expect(result.mapped).toHaveLength(0);
    expect(result.unmapped).toHaveLength(1);
  });

  it("flags ambiguous matches (label matching aliases of >1 parameter) rather than guessing", () => {
    // Construct a deliberately ambiguous label: "Debt" appears as a
    // substring match candidate for P_006 (Debt / Total Debt / Borrowings)
    // AND we add a synthetic second parameter sharing an overlapping alias
    // to force real ambiguity, since the seed set alone has no overlap.
    const ambiguousParams: FRFParameter[] = [
      ...parameters,
      {
        parameter_id: "P_999",
        name: "Test Overlap Parameter",
        aliases: ["Total Debt Servicing Cost"],
        category: "Test",
        is_positive_indicator: false,
      },
    ];
    const items: RawLineItem[] = [{ raw_label: "Total Debt Servicing Cost", period: "FY2024", value: 3 }];
    const result = mapLineItems(items, ambiguousParams);

    // "Total Debt Servicing Cost" contains alias "Total Debt" (P_006) as a
    // substring AND exactly matches "Total Debt Servicing Cost" (P_999).
    expect(result.mapped).toHaveLength(0);
    expect(result.unmapped).toHaveLength(1);
    expect(result.unmapped[0].reason).toBe("ambiguous_match");
    expect(result.unmapped[0].candidate_parameter_ids?.sort()).toEqual(["P_006", "P_999"]);
  });

  it("maps a batch with a mix of mapped and unmapped items", () => {
    const items: RawLineItem[] = [
      { raw_label: "Net Sales", period: "FY2024", value: 120 },
      { raw_label: "Debtors", period: "FY2024", value: 40 },
      { raw_label: "Unrecognized Line Item XYZ", period: "FY2024", value: 1 },
    ];
    const result = mapLineItems(items, parameters);

    expect(result.mapped).toHaveLength(2);
    expect(result.unmapped).toHaveLength(1);
    expect(result.mapped.map((m) => m.parameter_id).sort()).toEqual(["P_001", "P_002"]);
  });

  it("returns an empty result for an empty input array", () => {
    const result = mapLineItems([], parameters);
    expect(result.mapped).toEqual([]);
    expect(result.unmapped).toEqual([]);
  });
});
