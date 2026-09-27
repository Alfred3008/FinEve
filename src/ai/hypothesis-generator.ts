/**
 * Hypothesis Generator — Phase 2 AI Demonstration Layer
 *
 * ============================================================
 * WHAT THIS IS: a deterministic, template-based prototype that
 * reformats already-computed FRF engine output into analyst-style
 * prose with three labeled sections (Observation / Possible
 * hypothesis / Evidence to verify).
 *
 * WHAT THIS IS NOT: this is NOT a language model, NOT an inference
 * call, and NOT on-device AI. No model is invoked here. This module
 * exists to demonstrate the SHAPE and PLACEMENT an eventual on-device
 * reasoning layer would occupy in the architecture — consuming
 * frf-engine output, producing structured hypothesis text — without
 * committing to a specific model, runtime, or inference approach.
 * Anthropic/Anthropic-adjacent, Snapdragon/NPU, and any other model
 * selection remains explicitly deferred (see src/ai/README.md).
 * ============================================================
 *
 * Dependency direction: this module imports FROM frf-engine (as a
 * consumer of its types and output). frf-engine has zero dependency
 * on this module or anything in ai/ — that boundary is unchanged from
 * Phase 1 and is not weakened by this file's existence.
 */

import type { ObservedChange } from "../frf-engine/change-detection";
import type { RelationshipMatch } from "../frf-engine/relationship-lookup";

/**
 * A single structured hypothesis, one per matched FRF relationship.
 * The three fields are a direct, non-inventive restatement of data
 * the deterministic engine already produced — no new financial claims
 * are synthesized here.
 */
export interface AnalystHypothesis {
  relationship_id: string;
  /** What was observed: the parameter, its direction, and magnitude. */
  observation: string;
  /** Why it might have happened: drawn directly from possible_explanations. */
  possible_hypothesis: string;
  /** Where to check: drawn directly from evidence_to_check. */
  evidence_to_verify: string;
}

const percentFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  signDisplay: "always",
});

/**
 * Builds one AnalystHypothesis per matched relationship for a single
 * observed change. Pure function: same input always produces the same
 * output, no randomness, no external call.
 *
 * If matches is empty, returns an empty array — this function does not
 * fabricate a hypothesis when the deterministic engine found none.
 */
export function generateHypotheses(
  change: ObservedChange,
  matches: RelationshipMatch[]
): AnalystHypothesis[] {
  return matches.map((match) => {
    const directionWord = change.direction === "increase" ? "increased" : "decreased";
    const arrow = change.direction === "increase" ? "↑" : "↓";

    const observation =
      `${match.observed_parameter.name} ${directionWord} ${arrow} by ` +
      `${percentFormatter.format(change.percent_change)}% (from ${change.from_value} to ${change.to_value}, ` +
      `${change.from_period} → ${change.to_period}).`;

    // Deliberately restates the existing possible_explanations rather than
    // generating new ones — this keeps the "hypothesis" grounded in the
    // FinEve-authored knowledge base content, not invented at runtime.
    const possible_hypothesis =
      match.relationship.possible_explanations.length > 0
        ? match.relationship.possible_explanations.join("; ")
        : "No possible explanations recorded for this relationship.";

    const evidence_to_verify =
      match.relationship.evidence_to_check.length > 0
        ? match.relationship.evidence_to_check.join("; ")
        : "No evidence locations recorded for this relationship.";

    return {
      relationship_id: match.relationship.relationship_id,
      observation,
      possible_hypothesis,
      evidence_to_verify,
    };
  });
}
