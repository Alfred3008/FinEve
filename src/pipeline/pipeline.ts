/**
 * Pipeline
 *
 * Connects the full Phase 1 workflow:
 *   Excel/CSV → Parameter Mapping → Change Detection → FRF Relationship
 *   Lookup → Possible Explanations → Investigation Path
 *
 * This module is orchestration only — it contains no parsing, mapping,
 * or relationship logic itself; it composes the existing pure functions
 * from data-processing and frf-engine. It has no dependency on ui, ai,
 * or evidence.
 *
 * PLACEMENT NOTE: this module lives OUTSIDE frf-engine/, not inside it.
 * frf-engine/ is required to have zero dependency on other modules
 * (see schema.ts and the approved architecture). Since this file
 * imports from both data-processing/ and frf-engine/, it cannot live
 * inside frf-engine/ without violating that boundary — it sits at a
 * higher composition layer instead.
 */

import { parseWorkbook } from "../data-processing/excel-parser";
import { mapLineItems, type UnmappedLineItem, type MappedLineItem } from "../data-processing/parameter-mapping";
import { computeChanges, type ObservedChange } from "../frf-engine/change-detection";
import { findMatchingRelationshipsForChanges, type RelationshipMatch } from "../frf-engine/relationship-lookup";
import type { FRFKnowledgeBase } from "../frf-engine/knowledge-base/schema";

export interface PipelineResult {
  /** Line items successfully mapped to a canonical FRF parameter. */
  mapped_items: MappedLineItem[];
  /** Line items that could not be mapped to a canonical parameter — surfaced, not dropped. */
  unmapped_items: UnmappedLineItem[];
  /** Parameters skipped during change detection (e.g. missing a period, or zero base value). */
  skipped_parameter_ids: string[];
  /** Computed changes for every parameter that had values in both periods. */
  observed_changes: ObservedChange[];
  /** FRF relationships matched for each observed change, keyed by parameter_id. */
  relationship_matches: Map<string, RelationshipMatch[]>;
}

/**
 * Runs the full Phase 1 pipeline against an uploaded workbook buffer.
 *
 * @param fileBuffer   Raw bytes of the uploaded Excel/CSV file.
 * @param from_period  The earlier period column header to compare from, e.g. "FY2023".
 * @param to_period    The later period column header to compare to, e.g. "FY2024".
 * @param kb           The FRF knowledge base to map against and query.
 */
export function runPipeline(
  fileBuffer: ArrayBuffer,
  from_period: string,
  to_period: string,
  kb: FRFKnowledgeBase
): PipelineResult {
  const { items } = parseWorkbook(fileBuffer);

  const { mapped, unmapped } = mapLineItems(items, kb.parameters);

  const parameterValues = mapped.map((m) => ({
    parameter_id: m.parameter_id,
    period: m.period,
    value: m.value,
  }));

  const { changes, skipped } = computeChanges(parameterValues, from_period, to_period);

  const relationship_matches = findMatchingRelationshipsForChanges(changes, kb);

  return {
    mapped_items: mapped,
    unmapped_items: unmapped,
    skipped_parameter_ids: skipped,
    observed_changes: changes,
    relationship_matches,
  };
}

/**
 * Resolves a parameter_id to its canonical display name from the
 * knowledge base. Pure lookup, no computation — exists so UI components
 * don't need to reach into knowledge-base internals themselves to
 * display a human-readable name.
 */
export function resolveParameterName(parameter_id: string, kb: FRFKnowledgeBase): string {
  const parameter = kb.parameters.find((p) => p.parameter_id === parameter_id);
  return parameter?.name ?? parameter_id;
}
