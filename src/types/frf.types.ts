/**
 * UI-facing type re-exports.
 *
 * The UI imports types through this module rather than reaching directly
 * into frf-engine/data-processing internals in every component. This is
 * a convenience boundary, not a logic layer — no computation happens
 * here, only re-exports.
 */

export type { PipelineResult } from "../pipeline/pipeline";
export type { ObservedChange } from "../frf-engine/change-detection";
export type { RelationshipMatch } from "../frf-engine/relationship-lookup";
export type { UnmappedLineItem, MappedLineItem } from "../data-processing/parameter-mapping";
export type { FRFParameter, FRFRelationship, FRFKnowledgeBase, Direction } from "../frf-engine/knowledge-base/schema";
