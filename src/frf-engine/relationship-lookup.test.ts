import { describe, it, expect } from "vitest";
import { findMatchingRelationships, findMatchingRelationshipsForChanges } from "./relationship-lookup";
import type { ObservedChange } from "./change-detection";
import type { FRFKnowledgeBase } from "./knowledge-base/schema";
import seedData from "./knowledge-base/seed-data.json";

const kb = seedData as FRFKnowledgeBase;

function makeChange(overrides: Partial<ObservedChange>): ObservedChange {
  return {
    parameter_id: "P_001",
    from_period: "FY2023",
    to_period: "FY2024",
    from_value: 100,
    to_value: 120,
    percent_change: 20,
    direction: "increase",
    ...overrides,
  };
}

describe("findMatchingRelationships", () => {
  it("finds the Revenue↑ → Receivables↑ relationship (R_001) from the worked example", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);

    const r001 = matches.find((m) => m.relationship.relationship_id === "R_001");
    expect(r001).toBeDefined();
    expect(r001?.observed_parameter.name).toBe("Revenue from Operations");
    expect(r001?.related_parameter.name).toBe("Trade Receivables");
    expect(r001?.relationship.provenance.relationship).toBe("FRF-source");
    expect(r001?.relationship.provenance.possible_explanations).toBe("FinEve-authored");
  });

  it("finds multiple relationships when a parameter has more than one match", () => {
    // P_001 (Revenue) increase matches both R_001 (→ Receivables) and R_003 (→ Margin)
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const ids = matches.map((m) => m.relationship.relationship_id).sort();
    expect(ids).toEqual(["R_001", "R_003"]);
  });

  it("returns an empty array when no relationship matches the direction", () => {
    // P_001 (Revenue) has no "decrease" relationship in the seed set
    const change = makeChange({ parameter_id: "P_001", direction: "decrease" });
    const matches = findMatchingRelationships(change, kb);
    expect(matches).toEqual([]);
  });

  it("returns an empty array for a parameter_id with no relationships at all", () => {
    const change = makeChange({ parameter_id: "P_099", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    expect(matches).toEqual([]);
  });

  it("throws if the knowledge base references an unknown parameter_id", () => {
    const brokenKb: FRFKnowledgeBase = {
      parameters: [
        { parameter_id: "P_001", name: "X", aliases: [], category: "Growth", is_positive_indicator: true },
      ],
      relationships: [
        {
          relationship_id: "R_BROKEN",
          parameter_id: "P_001",
          direction: "increase",
          related_parameter_id: "P_DOES_NOT_EXIST",
          possible_explanations: [],
          evidence_to_check: [],
          investigation_path: [],
          provenance: {
            relationship: "FinEve-proposed",
            possible_explanations: "FinEve-authored",
            evidence_to_check: "FinEve-authored",
            investigation_path: "FinEve-authored",
          },
        },
      ],
    };
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    expect(() => findMatchingRelationships(change, brokenKb)).toThrow(/unknown related_parameter_id/);
  });
});

describe("findMatchingRelationshipsForChanges", () => {
  it("returns a map of matches keyed by parameter_id for a batch of changes", () => {
    const changes = [
      makeChange({ parameter_id: "P_001", direction: "increase" }),
      makeChange({ parameter_id: "P_005", direction: "increase" }),
    ];
    const result = findMatchingRelationshipsForChanges(changes, kb);

    expect(result.get("P_001")?.map((m) => m.relationship.relationship_id).sort()).toEqual([
      "R_001",
      "R_003",
    ]);
    expect(result.get("P_005")?.map((m) => m.relationship.relationship_id)).toEqual(["R_004"]);
  });
});

describe("seed knowledge base integrity", () => {
  it("every related_parameter_id resolves to a known parameter", () => {
    const ids = new Set(kb.parameters.map((p) => p.parameter_id));
    for (const r of kb.relationships) {
      expect(ids.has(r.parameter_id)).toBe(true);
      expect(ids.has(r.related_parameter_id)).toBe(true);
    }
  });

  it("every relationship has a unique relationship_id", () => {
    const ids = kb.relationships.map((r) => r.relationship_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every parameter has a unique parameter_id", () => {
    const ids = kb.parameters.map((p) => p.parameter_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every FRF-source relationship has a source_reference", () => {
    for (const r of kb.relationships) {
      if (r.provenance.relationship === "FRF-source") {
        expect(r.source_reference).toBeTruthy();
      }
    }
  });

  it("every relationship's authored fields are explicitly marked FinEve-authored", () => {
    for (const r of kb.relationships) {
      expect(r.provenance.possible_explanations).toBe("FinEve-authored");
      expect(r.provenance.evidence_to_check).toBe("FinEve-authored");
      expect(r.provenance.investigation_path).toBe("FinEve-authored");
    }
  });
});
