/**
 * Relationship Lookup
 *
 * Pure deterministic functions. No I/O, no dependency on data-processing,
 * ai, evidence, or ui modules. Consumes an ObservedChange and the
 * knowledge base, returns matching FRFRelationship objects plus their
 * resolved related-parameter details.
 */

import type { FRFKnowledgeBase, FRFParameter, FRFRelationship } from "./knowledge-base/schema";
import type { ObservedChange } from "./change-detection";

/** A relationship match, with the related parameter resolved to its full record. */
export interface RelationshipMatch {
  relationship: FRFRelationship;
  observed_parameter: FRFParameter;
  related_parameter: FRFParameter;
}

/**
 * Finds all relationships in the knowledge base that match an observed
 * change's parameter_id and direction.
 *
 * Throws if the knowledge base references a parameter_id that does not
 * exist in parameters[] — this indicates a malformed knowledge base and
 * should fail loudly rather than silently dropping the relationship.
 */
export function findMatchingRelationships(
  change: ObservedChange,
  kb: FRFKnowledgeBase
): RelationshipMatch[] {
  const parameterIndex = new Map<string, FRFParameter>(
    kb.parameters.map((p) => [p.parameter_id, p])
  );

  const matches: FRFRelationship[] = kb.relationships.filter(
    (r) => r.parameter_id === change.parameter_id && r.direction === change.direction
  );

  return matches.map((relationship) => {
    const observed_parameter = parameterIndex.get(relationship.parameter_id);
    const related_parameter = parameterIndex.get(relationship.related_parameter_id);

    if (!observed_parameter) {
      throw new Error(
        `Knowledge base error: relationship "${relationship.relationship_id}" references ` +
          `unknown parameter_id "${relationship.parameter_id}".`
      );
    }
    if (!related_parameter) {
      throw new Error(
        `Knowledge base error: relationship "${relationship.relationship_id}" references ` +
          `unknown related_parameter_id "${relationship.related_parameter_id}".`
      );
    }

    return { relationship, observed_parameter, related_parameter };
  });
}

/**
 * Convenience function: runs findMatchingRelationships for a batch of
 * observed changes, returning a map keyed by parameter_id.
 */
export function findMatchingRelationshipsForChanges(
  changes: ObservedChange[],
  kb: FRFKnowledgeBase
): Map<string, RelationshipMatch[]> {
  const result = new Map<string, RelationshipMatch[]>();
  for (const change of changes) {
    result.set(change.parameter_id, findMatchingRelationships(change, kb));
  }
  return result;
}
