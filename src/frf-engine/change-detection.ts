/**
 * Change Detection
 *
 * Pure deterministic functions. No I/O, no dependency on data-processing,
 * ai, evidence, or ui modules. Consumes structured parameter values,
 * produces observed changes with direction.
 */

import type { Direction } from "./knowledge-base/schema";

/** A single parameter's value at a given period, after mapping. */
export interface ParameterValue {
  parameter_id: string;
  period: string; // e.g. "FY2023", "FY2024" — caller-defined, not validated here
  value: number;
}

/** The result of comparing a parameter's value across two periods. */
export interface ObservedChange {
  parameter_id: string;
  from_period: string;
  to_period: string;
  from_value: number;
  to_value: number;
  percent_change: number; // e.g. 12.5 means +12.5%
  direction: Direction;
}

/**
 * Computes percentage change and direction between two values for the
 * same parameter across two periods.
 *
 * Throws if from_value is 0, since percentage change is undefined —
 * the caller must handle this case rather than receiving a silent
 * Infinity or NaN.
 */
export function computeChange(
  parameter_id: string,
  from_period: string,
  to_period: string,
  from_value: number,
  to_value: number
): ObservedChange {
  if (from_value === 0) {
    throw new Error(
      `Cannot compute percentage change for parameter "${parameter_id}": ` +
        `base value in period "${from_period}" is 0.`
    );
  }

  const percent_change = ((to_value - from_value) / Math.abs(from_value)) * 100;
  const direction: Direction = to_value >= from_value ? "increase" : "decrease";

  return {
    parameter_id,
    from_period,
    to_period,
    from_value,
    to_value,
    percent_change,
    direction,
  };
}

/**
 * Computes changes for a full set of parameter values across exactly
 * two periods. Parameters missing a value in either period are skipped
 * (returned separately) rather than causing the whole batch to fail.
 */
export function computeChanges(
  values: ParameterValue[],
  from_period: string,
  to_period: string
): { changes: ObservedChange[]; skipped: string[] } {
  const byParameter = new Map<string, Map<string, number>>();

  for (const v of values) {
    if (!byParameter.has(v.parameter_id)) {
      byParameter.set(v.parameter_id, new Map());
    }
    byParameter.get(v.parameter_id)!.set(v.period, v.value);
  }

  const changes: ObservedChange[] = [];
  const skipped: string[] = [];

  for (const [parameter_id, periodMap] of byParameter) {
    const fromValue = periodMap.get(from_period);
    const toValue = periodMap.get(to_period);

    if (fromValue === undefined || toValue === undefined) {
      skipped.push(parameter_id);
      continue;
    }

    if (fromValue === 0) {
      skipped.push(parameter_id);
      continue;
    }

    changes.push(computeChange(parameter_id, from_period, to_period, fromValue, toValue));
  }

  return { changes, skipped };
}
