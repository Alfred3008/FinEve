/**
 * Parameter Mapping
 *
 * Maps raw line-item labels (from an uploaded Excel/CSV file) to
 * canonical FRF parameters, using each parameter's `aliases` list from
 * the knowledge base.
 *
 * Design constraint (per approved architecture): unmapped items must be
 * surfaced explicitly, never silently guessed or dropped. This module
 * does no fuzzy/similarity matching — only case-insensitive exact and
 * substring matching against known aliases. Anything not matched is
 * returned as "unmapped" for the caller/UI to handle.
 */

import type { FRFParameter } from "../frf-engine/knowledge-base/schema";

/** A raw line item as extracted from an uploaded file, before mapping. */
export interface RawLineItem {
  /** The label exactly as it appeared in the source file, preserved verbatim. */
  raw_label: string;
  /** The period this value belongs to, e.g. "FY2023". Caller-supplied or column-derived. */
  period: string;
  /** The numeric value for this line item in this period. */
  value: number;
}

/** A raw line item successfully matched to a canonical FRF parameter. */
export interface MappedLineItem {
  raw_label: string;
  period: string;
  value: number;
  parameter_id: string;
  matched_alias: string;
}

/**
 * A raw line item that could not be confidently matched to exactly one
 * canonical FRF parameter.
 *
 * "no_matching_alias" = the label matched no known alias at all.
 * "ambiguous_match"   = the label matched aliases belonging to more than
 *                       one distinct parameter. Rather than guess which
 *                       one is intended, this is surfaced for manual
 *                       resolution, along with the candidate parameter
 *                       IDs that matched.
 */
export interface UnmappedLineItem {
  raw_label: string;
  period: string;
  value: number;
  reason: "no_matching_alias" | "ambiguous_match";
  /** Populated only when reason is "ambiguous_match". */
  candidate_parameter_ids?: string[];
}

export interface MappingResult {
  mapped: MappedLineItem[];
  unmapped: UnmappedLineItem[];
}

function normalize(label: string): string {
  return label.trim().toLowerCase();
}

/**
 * Attempts to match a single raw label against a parameter's aliases.
 * Matching is case-insensitive. A match occurs if the normalized raw
 * label equals an alias, OR the normalized raw label contains an alias
 * as a substring (handles labels like "Total Revenue (Net)").
 *
 * Returns the matched alias string if found, otherwise undefined.
 * If multiple aliases within the SAME parameter could match, the first
 * (in array order) is returned — this is deterministic, not a
 * best-match ranking, since no similarity scoring is implemented.
 */
function matchAgainstParameter(rawLabel: string, parameter: FRFParameter): string | undefined {
  const normalizedRaw = normalize(rawLabel);
  for (const alias of parameter.aliases) {
    const normalizedAlias = normalize(alias);
    if (normalizedRaw === normalizedAlias || normalizedRaw.includes(normalizedAlias)) {
      return alias;
    }
  }
  return undefined;
}

/**
 * Maps a batch of raw line items to canonical FRF parameters.
 *
 * If a raw label matches aliases belonging to MORE THAN ONE distinct
 * parameter, this is treated as ambiguous and the item is placed in
 * `unmapped` with reason "ambiguous_match" rather than guessing — this
 * is a deliberate safety behavior, not an oversight, per the
 * "no silent guessing" requirement.
 */
export function mapLineItems(items: RawLineItem[], parameters: FRFParameter[]): MappingResult {
  const mapped: MappedLineItem[] = [];
  const unmapped: UnmappedLineItem[] = [];

  for (const item of items) {
    const candidates: { parameter: FRFParameter; alias: string }[] = [];

    for (const parameter of parameters) {
      const alias = matchAgainstParameter(item.raw_label, parameter);
      if (alias) {
        candidates.push({ parameter, alias });
      }
    }

    const distinctParameterIds = new Set(candidates.map((c) => c.parameter.parameter_id));

    if (distinctParameterIds.size === 1) {
      const { parameter, alias } = candidates[0];
      mapped.push({
        raw_label: item.raw_label,
        period: item.period,
        value: item.value,
        parameter_id: parameter.parameter_id,
        matched_alias: alias,
      });
    } else if (distinctParameterIds.size === 0) {
      unmapped.push({
        raw_label: item.raw_label,
        period: item.period,
        value: item.value,
        reason: "no_matching_alias",
      });
    } else {
      // Ambiguous: raw label matched aliases belonging to more than one
      // distinct parameter. Surfaced explicitly rather than guessing.
      unmapped.push({
        raw_label: item.raw_label,
        period: item.period,
        value: item.value,
        reason: "ambiguous_match",
        candidate_parameter_ids: Array.from(distinctParameterIds),
      });
    }
  }

  return { mapped, unmapped };
}
