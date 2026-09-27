import { describe, it, expect } from "vitest";
import { generateHypotheses } from "./hypothesis-generator";
import { findMatchingRelationships } from "../frf-engine/relationship-lookup";
import type { ObservedChange } from "../frf-engine/change-detection";
import type { FRFKnowledgeBase } from "../frf-engine/knowledge-base/schema";
import seedData from "../frf-engine/knowledge-base/seed-data.json";

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

describe("generateHypotheses", () => {
  it("returns one hypothesis per matched relationship", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const hypotheses = generateHypotheses(change, matches);

    // Revenue increase matches R_001 and R_003 in the seed set
    expect(hypotheses).toHaveLength(2);
    expect(hypotheses.map((h) => h.relationship_id).sort()).toEqual(["R_001", "R_003"]);
  });

  it("labels every hypothesis with observation, possible_hypothesis, and evidence_to_verify", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const [hypothesis] = generateHypotheses(change, matches);

    expect(hypothesis.observation).toBeTruthy();
    expect(hypothesis.possible_hypothesis).toBeTruthy();
    expect(hypothesis.evidence_to_verify).toBeTruthy();
  });

  it("the observation states the parameter name, direction, and percent change", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase", percent_change: 20 });
    const matches = findMatchingRelationships(change, kb);
    const r001 = generateHypotheses(change, matches).find((h) => h.relationship_id === "R_001")!;

    expect(r001.observation).toContain("Revenue from Operations");
    expect(r001.observation).toContain("increased");
    expect(r001.observation).toContain("↑");
    expect(r001.observation).toContain("+20%");
    expect(r001.observation).toContain("FY2023");
    expect(r001.observation).toContain("FY2024");
  });

  it("uses decreased/↓ wording when the observation direction is a decrease", () => {
    // R_004 is the only seed relationship with an "increase" observed
    // parameter whose related_direction is "decrease" AND which itself
    // fires on a decrease observation elsewhere — to exercise the
    // decreased/↓ wording branch directly, construct a change on P_005
    // (Inventory) increasing, which matches R_004 (Inventory↑ -> Revenue↓).
    // The wording under test lives in how `change.direction` (the
    // OBSERVED parameter's direction) is rendered, so we instead build a
    // decrease change directly on a parameter with an outgoing
    // relationship: P_006 (Debt) has no decrease relationship, but P_009
    // (ROE) also only has "increase". To reliably exercise "decrease"
    // wording, construct the change/match pair manually instead of
    // relying on the seed set to happen to contain one.
    const decreaseChange = makeChange({
      parameter_id: "P_006",
      direction: "decrease",
      percent_change: -15,
      from_value: 100,
      to_value: 85,
    });
    const matches = findMatchingRelationships(decreaseChange, kb);
    // P_006 (Debt) has no "decrease" relationship in the seed set, so this
    // confirms the zero-match path is still safe — but to test the actual
    // wording, call generateHypotheses directly with a synthetic match.
    expect(matches).toEqual([]);

    const [manualHypothesis] = generateHypotheses(decreaseChange, [
      {
        relationship: kb.relationships[4], // R_005: Debt -> Interest Coverage
        observed_parameter: kb.parameters.find((p) => p.parameter_id === "P_006")!,
        related_parameter: kb.parameters.find((p) => p.parameter_id === "P_007")!,
      },
    ]);

    expect(manualHypothesis.observation).toContain("decreased");
    expect(manualHypothesis.observation).toContain("↓");
    expect(manualHypothesis.observation).toContain("-15%");
  });

  it("restates possible_explanations verbatim rather than inventing new text", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const r001match = matches.find((m) => m.relationship.relationship_id === "R_001")!;
    const r001hyp = generateHypotheses(change, [r001match])[0];

    for (const explanation of r001match.relationship.possible_explanations) {
      expect(r001hyp.possible_hypothesis).toContain(explanation);
    }
  });

  it("restates evidence_to_check verbatim rather than inventing new text", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const r001match = matches.find((m) => m.relationship.relationship_id === "R_001")!;
    const r001hyp = generateHypotheses(change, [r001match])[0];

    for (const evidence of r001match.relationship.evidence_to_check) {
      expect(r001hyp.evidence_to_verify).toContain(evidence);
    }
  });

  it("returns an empty array when there are no matches, without fabricating a hypothesis", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "decrease" });
    const matches = findMatchingRelationships(change, kb); // no "decrease" relationship for Revenue
    expect(matches).toEqual([]);
    expect(generateHypotheses(change, matches)).toEqual([]);
  });

  it("is deterministic: identical input produces identical output", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const first = generateHypotheses(change, matches);
    const second = generateHypotheses(change, matches);
    expect(first).toEqual(second);
  });
});
