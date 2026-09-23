/**
 * FRF Knowledge Base Schema
 *
 * Source of truth: docs/FRF_Master_Specification.md
 * This schema encodes the FRF core relationship chain (spec §24.4):
 *   Parameter → Observation/Direction → Related Parameter → Relationship
 *   → Possible Reason → Evidence to Check
 *
 * This file defines STRUCTURE only. It contains no financial content itself.
 * All financial content lives in seed-data.json and must be traceable to
 * the FRF Master Specification, or explicitly marked as newly proposed.
 *
 * SEED SIZE NOTE: the Phase 1 seed dataset contains 12 parameters rather
 * than the originally targeted 5–10. This expansion was necessary to
 * represent all 8 relationship pairs named in spec §24.2 without omitting
 * any of them — each pair requires two distinct parameters, and the 8
 * pairs collectively reference 12 distinct parameters. The seed set was
 * expanded to preserve full coverage of the sourced examples rather than
 * cutting relationships to fit an arbitrary parameter count.
 */

/** Direction of an observed or expected parameter change. */
export type Direction = "increase" | "decrease";

/**
 * A canonical financial parameter the FRF engine can recognize.
 *
 * `aliases` is the mapping surface used by data-processing/parameter-mapping.ts
 * to match raw line-item names from uploaded financial data to this parameter.
 */
export interface FRFParameter {
  /** Stable identifier, e.g. "P_001". Referenced by relationships. */
  parameter_id: string;

  /** Canonical display name, e.g. "Revenue from Operations". */
  name: string;

  /**
   * Raw line-item names this parameter may appear as in uploaded
   * financial statements, e.g. ["Total Revenue", "Net Sales"].
   * Matching is case-insensitive exact/substring match in Phase 1 —
   * no fuzzy matching algorithm is implemented yet.
   */
  aliases: string[];

  /**
   * Category label, e.g. "Growth", "Cash Flow". Per spec §6.2, the
   * final taxonomy was not established — this is a free-text field,
   * not a constrained enum, to avoid inventing a taxonomy the source
   * material does not finalize.
   */
  category: string;

  /**
   * Whether an increase in this parameter is generally a favorable
   * signal in isolation. This is a directional framing label only —
   * it is NOT a score, weight, or health assessment (those are
   * explicitly out of scope for Phase 1).
   */
  is_positive_indicator: boolean;
}

/**
 * A directional relationship between an observed parameter change and
 * a related parameter worth investigating.
 *
 * This is intentionally PAIRWISE (one parameter → one related parameter),
 * matching the FRF core schema in spec §24.4. Multi-parameter scenarios
 * (e.g. Revenue↑ + Receivables↑ + CFO↓ in spec §24.2) are represented as
 * chained pairwise relationships, not as a single multi-way object.
 */
export interface FRFRelationship {
  /** Stable identifier, e.g. "R_001". */
  relationship_id: string;

  /** The parameter whose change is being observed. References FRFParameter.parameter_id. */
  parameter_id: string;

  /** The observed direction of change in the parameter above. */
  direction: Direction;

  /** The related parameter worth investigating. References FRFParameter.parameter_id. */
  related_parameter_id: string;

  /**
   * The expected direction of the related parameter, if the source
   * material specifies one. OPTIONAL: some relationships in the FRF
   * source material identify a related parameter as relevant for
   * investigation without asserting a specific expected direction
   * for it (e.g. spec §1.3's reserves example lists related parameters
   * without per-parameter directional claims). Omit this field rather
   * than guessing a direction the source does not state.
   */
  related_direction?: Direction;

  /**
   * Plain-language investigation hypotheses. These are possible
   * explanations to investigate, NOT established facts (spec §7.6:
   * "A generated explanation is not treated as proof").
   */
  possible_explanations: string[];

  /** Disclosure locations where evidence for the hypotheses above might be found. */
  evidence_to_check: string[];

  /** Ordered next steps for the analyst investigating this relationship. */
  investigation_path: string[];

  /**
   * Field-level provenance. The FRF Master Specification (§24.2 and
   * others) names relationship PAIRS AND DIRECTIONS (e.g. "Debt ↑ +
   * Interest Coverage ↓") but does not supply ready-made prose for
   * explanations, evidence locations, or investigation steps. Those
   * fields were authored during FinEve development, grounded in the
   * sourced pairing but not extracted or paraphrased from spec text.
   *
   * This object makes that distinction explicit and machine-checkable
   * per-field, rather than applying one blanket label to the whole
   * relationship object.
   *
   * "FRF-source"     = directly traceable to spec content.
   * "FinEve-authored" = newly written for FinEve, not present in the
   *                     FRF Master Specification, but consistent with
   *                     and derived from the sourced relationship.
   * "FinEve-proposed" = a relationship, direction, or field introduced
   *                     with no basis in the sourced pairing at all —
   *                     reserved for future additions that go beyond
   *                     what the spec names. Not used in the Phase 1
   *                     seed set.
   */
  provenance: {
    relationship: "FRF-source" | "FinEve-proposed";
    possible_explanations: "FinEve-authored" | "FRF-source";
    evidence_to_check: "FinEve-authored" | "FRF-source";
    investigation_path: "FinEve-authored" | "FRF-source";
  };

  /**
   * Where in the FRF Master Specification the relationship PAIRING/
   * DIRECTION is documented, e.g. "§24.2". Required when
   * provenance.relationship is "FRF-source". Omitted when
   * provenance.relationship is "FinEve-proposed".
   *
   * This citation covers the pairing and direction only — it does not
   * imply the explanation/evidence/investigation prose is quoted from
   * this section. See `provenance` above for those fields individually.
   */
  source_reference?: string;
}

export interface FRFKnowledgeBase {
  parameters: FRFParameter[];
  relationships: FRFRelationship[];
}
