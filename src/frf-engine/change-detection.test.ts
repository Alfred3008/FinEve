import { describe, it, expect } from "vitest";
import { computeChange, computeChanges } from "./change-detection";

describe("computeChange", () => {
  it("computes a positive percent change and 'increase' direction", () => {
    const result = computeChange("P_001", "FY2023", "FY2024", 100, 120);
    expect(result.percent_change).toBeCloseTo(20, 5);
    expect(result.direction).toBe("increase");
  });

  it("computes a negative percent change and 'decrease' direction", () => {
    const result = computeChange("P_003", "FY2023", "FY2024", 15, 2);
    expect(result.percent_change).toBeCloseTo(-86.6667, 3);
    expect(result.direction).toBe("decrease");
  });

  it("treats no change as 'increase' (>=  comparison)", () => {
    const result = computeChange("P_001", "FY2023", "FY2024", 100, 100);
    expect(result.percent_change).toBe(0);
    expect(result.direction).toBe("increase");
  });

  it("throws when the base value is zero", () => {
    expect(() => computeChange("P_001", "FY2023", "FY2024", 0, 50)).toThrow(
      /base value.*is 0/
    );
  });

  it("handles a negative base value using absolute value in denominator", () => {
    const result = computeChange("P_006", "FY2023", "FY2024", -50, -25);
    // moving from -50 to -25 is an improvement of 25, relative to |,-50| = 50 → +50%
    expect(result.percent_change).toBeCloseTo(50, 5);
    expect(result.direction).toBe("increase");
  });
});

describe("computeChanges", () => {
  it("computes changes for multiple parameters across two periods", () => {
    const { changes, skipped } = computeChanges(
      [
        { parameter_id: "P_001", period: "FY2023", value: 100 },
        { parameter_id: "P_001", period: "FY2024", value: 120 },
        { parameter_id: "P_002", period: "FY2023", value: 20 },
        { parameter_id: "P_002", period: "FY2024", value: 40 },
      ],
      "FY2023",
      "FY2024"
    );

    expect(changes).toHaveLength(2);
    expect(skipped).toHaveLength(0);

    const revenueChange = changes.find((c) => c.parameter_id === "P_001");
    expect(revenueChange?.percent_change).toBeCloseTo(20, 5);

    const receivablesChange = changes.find((c) => c.parameter_id === "P_002");
    expect(receivablesChange?.percent_change).toBeCloseTo(100, 5);
  });

  it("skips parameters missing a value in either period", () => {
    const { changes, skipped } = computeChanges(
      [
        { parameter_id: "P_001", period: "FY2023", value: 100 },
        { parameter_id: "P_001", period: "FY2024", value: 120 },
        { parameter_id: "P_002", period: "FY2023", value: 20 },
        // P_002 has no FY2024 value
      ],
      "FY2023",
      "FY2024"
    );

    expect(changes).toHaveLength(1);
    expect(skipped).toEqual(["P_002"]);
  });

  it("skips parameters with a zero base value rather than throwing", () => {
    const { changes, skipped } = computeChanges(
      [
        { parameter_id: "P_001", period: "FY2023", value: 0 },
        { parameter_id: "P_001", period: "FY2024", value: 50 },
      ],
      "FY2023",
      "FY2024"
    );

    expect(changes).toHaveLength(0);
    expect(skipped).toEqual(["P_001"]);
  });
});
