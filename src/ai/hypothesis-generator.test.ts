import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateHypotheses,
  buildObservation,
  buildEvidenceToVerify,
  buildPrompt,
} from "./hypothesis-generator";
import { findMatchingRelationships } from "../frf-engine/relationship-lookup";
import type { ObservedChange } from "../frf-engine/change-detection";
import type { RelationshipMatch } from "../frf-engine/relationship-lookup";
import type { FRFKnowledgeBase } from "../frf-engine/knowledge-base/schema";
import seedData from "../frf-engine/knowledge-base/seed-data.json";
import * as modelLoader from "./model-loader";
import type { ModelStatus } from "./model-loader";

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

function makeManualMatch(
  observedId: string,
  relationshipIndex: number,
  relatedId: string
): RelationshipMatch {
  return {
    relationship: kb.relationships[relationshipIndex],
    observed_parameter: kb.parameters.find((p) => p.parameter_id === observedId)!,
    related_parameter: kb.parameters.find((p) => p.parameter_id === relatedId)!,
  };
}

// ============================================================
// Pure, deterministic functions — no model, no mocking needed.
// These are genuinely testable end to end: same input always
// produces the same output.
// ============================================================

describe("buildObservation (pure, deterministic)", () => {
  it("states the parameter name, direction, arrow, percent change, and periods for an increase", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase", percent_change: 20 });
    const matches = findMatchingRelationships(change, kb);
    const r001 = matches.find((m) => m.relationship.relationship_id === "R_001")!;

    const observation = buildObservation(change, r001);
    expect(observation).toContain("Revenue from Operations");
    expect(observation).toContain("increased");
    expect(observation).toContain("↑");
    expect(observation).toContain("+20%");
    expect(observation).toContain("FY2023");
    expect(observation).toContain("FY2024");
  });

  it("uses decreased/↓ wording for a decrease direction", () => {
    const decreaseChange = makeChange({
      parameter_id: "P_006",
      direction: "decrease",
      percent_change: -15,
      from_value: 100,
      to_value: 85,
    });
    const manualMatch = makeManualMatch("P_006", 4, "P_007"); // R_005: Debt -> Interest Coverage

    const observation = buildObservation(decreaseChange, manualMatch);
    expect(observation).toContain("decreased");
    expect(observation).toContain("↓");
    expect(observation).toContain("-15%");
  });

  it("is deterministic: identical input produces identical output", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const r001 = matches.find((m) => m.relationship.relationship_id === "R_001")!;
    expect(buildObservation(change, r001)).toBe(buildObservation(change, r001));
  });
});

describe("buildEvidenceToVerify (pure, deterministic)", () => {
  it("restates evidence_to_check verbatim rather than inventing new text", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const r001 = matches.find((m) => m.relationship.relationship_id === "R_001")!;

    const evidence = buildEvidenceToVerify(r001);
    for (const item of r001.relationship.evidence_to_check) {
      expect(evidence).toContain(item);
    }
  });
});

describe("buildPrompt (pure, deterministic)", () => {
  it("includes the observation, related parameter, and recorded explanations", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const r001 = matches.find((m) => m.relationship.relationship_id === "R_001")!;

    const prompt = buildPrompt(change, r001);
    expect(prompt).toContain("Revenue from Operations");
    expect(prompt).toContain("Trade Receivables");
    for (const explanation of r001.relationship.possible_explanations) {
      expect(prompt).toContain(explanation);
    }
  });

  it("instructs the model not to invent new numbers or explanations", () => {
    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb);
    const r001 = matches.find((m) => m.relationship.relationship_id === "R_001")!;

    const prompt = buildPrompt(change, r001);
    expect(prompt.toLowerCase()).toContain("do not invent");
  });
});

// ============================================================
// generateHypotheses — orchestrates real model calls via
// model-loader.getGenerator(). The model itself is mocked here:
// this environment has no network access to download the actual
// ONNX weights (confirmed separately — huggingface.co is outside
// the sandbox's allowlist), so these tests verify the ORCHESTRATION
// logic (loading-state forwarding, per-match fallback on error,
// empty-match short-circuit) rather than real model output quality.
// Real end-to-end inference must be verified in an actual browser —
// see the project report for that distinction.
// ============================================================

describe("generateHypotheses (orchestration, model mocked)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an empty array immediately when there are no matches, without touching the model", async () => {
    const getGeneratorSpy = vi.spyOn(modelLoader, "getGenerator");
    const change = makeChange({ parameter_id: "P_001", direction: "decrease" });
    const matches = findMatchingRelationships(change, kb); // no "decrease" relationship for Revenue
    expect(matches).toEqual([]);

    const result = await generateHypotheses(change, matches);
    expect(result).toEqual([]);
    expect(getGeneratorSpy).not.toHaveBeenCalled();
  });

  it("returns one hypothesis per matched relationship, calling the mocked generator for each", async () => {
    const mockGenerator = vi.fn().mockResolvedValue([{ generated_text: "Mocked model output." }]);
    vi.spyOn(modelLoader, "getGenerator").mockResolvedValue(mockGenerator);

    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb); // R_001 and R_003

    const hypotheses = await generateHypotheses(change, matches);

    expect(hypotheses).toHaveLength(2);
    expect(hypotheses.map((h) => h.relationship_id).sort()).toEqual(["R_001", "R_003"]);
    expect(mockGenerator).toHaveBeenCalledTimes(2);
    for (const h of hypotheses) {
      expect(h.possible_hypothesis).toBe("Mocked model output.");
      expect(h.observation).toBeTruthy();
      expect(h.evidence_to_verify).toBeTruthy();
    }
  });

  it("forwards model loading status updates to the caller", async () => {
    const statuses: ModelStatus[] = [];
    const mockGenerator = vi.fn().mockResolvedValue([{ generated_text: "ok" }]);
    vi.spyOn(modelLoader, "getGenerator").mockImplementation(async (onStatusChange) => {
      onStatusChange?.({ state: "loading", progress: 50 });
      onStatusChange?.({ state: "ready" });
      return mockGenerator;
    });

    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb).slice(0, 1);

    await generateHypotheses(change, matches, (status) => statuses.push(status));

    expect(statuses).toContainEqual({ state: "loading", progress: 50 });
    expect(statuses).toContainEqual({ state: "ready" });
  });

  it("falls back to the recorded possible_explanations when the model call fails, rather than losing the hypothesis", async () => {
    vi.spyOn(modelLoader, "getGenerator").mockRejectedValue(new Error("model failed to load"));

    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb).filter(
      (m) => m.relationship.relationship_id === "R_001"
    );

    const hypotheses = await generateHypotheses(change, matches);
    expect(hypotheses).toHaveLength(1);
    expect(hypotheses[0].possible_hypothesis).toBe(
      matches[0].relationship.possible_explanations.join("; ")
    );
  });

  it("falls back to a generic message when the model fails AND there are no recorded explanations", async () => {
    vi.spyOn(modelLoader, "getGenerator").mockRejectedValue(new Error("model failed"));

    const change = makeChange({ parameter_id: "P_006", direction: "decrease" });
    const matchWithNoExplanations: RelationshipMatch = {
      relationship: { ...kb.relationships[4], possible_explanations: [] },
      observed_parameter: kb.parameters.find((p) => p.parameter_id === "P_006")!,
      related_parameter: kb.parameters.find((p) => p.parameter_id === "P_007")!,
    };

    const hypotheses = await generateHypotheses(change, [matchWithNoExplanations]);
    expect(hypotheses[0].possible_hypothesis).toBe("No hypothesis generated.");
  });

  it("falls back to recorded explanations when the model returns empty output", async () => {
    const mockGenerator = vi.fn().mockResolvedValue([{ generated_text: "" }]);
    vi.spyOn(modelLoader, "getGenerator").mockResolvedValue(mockGenerator);

    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb).filter(
      (m) => m.relationship.relationship_id === "R_001"
    );

    const hypotheses = await generateHypotheses(change, matches);
    expect(hypotheses[0].possible_hypothesis).toBe(
      matches[0].relationship.possible_explanations.join("; ")
    );
  });

  it("evidence_to_verify and observation remain deterministic even though possible_hypothesis comes from the model", async () => {
    const mockGenerator = vi.fn().mockResolvedValue([{ generated_text: "Some model text." }]);
    vi.spyOn(modelLoader, "getGenerator").mockResolvedValue(mockGenerator);

    const change = makeChange({ parameter_id: "P_001", direction: "increase" });
    const matches = findMatchingRelationships(change, kb).filter(
      (m) => m.relationship.relationship_id === "R_001"
    );

    const hypotheses = await generateHypotheses(change, matches);
    expect(hypotheses[0].evidence_to_verify).toBe(buildEvidenceToVerify(matches[0]));
    expect(hypotheses[0].observation).toBe(buildObservation(change, matches[0]));
  });
});
