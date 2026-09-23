import type { ObservedChange, FRFKnowledgeBase } from "../../types/frf.types";
import { resolveParameterName } from "../../pipeline/pipeline";

interface ChangesPanelProps {
  changes: ObservedChange[];
  skippedParameterIds: string[];
  kb: FRFKnowledgeBase;
  selectedParameterId: string | null;
  onSelectParameter: (parameter_id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const percentFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, signDisplay: "always" });

/**
 * Renders the table of observed parameter changes. Pure presentation —
 * all values (absolute change, percentage, direction) are read directly
 * from the ObservedChange objects computed by the deterministic engine;
 * no arithmetic happens in this component.
 */
export function ChangesPanel({
  changes,
  skippedParameterIds,
  kb,
  selectedParameterId,
  onSelectParameter,
}: ChangesPanelProps) {
  return (
    <section aria-labelledby="changes-heading" className="border-b border-ink/15 pb-8 mb-8">
      <h2 id="changes-heading" className="text-lg font-medium mb-1">
        3. Detected changes
      </h2>
      <p className="text-sm text-slate mb-4">
        Select a row to view matching FRF relationships below.
      </p>

      {changes.length === 0 ? (
        <p className="text-sm text-slate">No changes could be computed from the mapped parameters.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-mono uppercase tracking-wide text-slate border-b border-ink/15">
              <th className="py-2 pr-3 font-normal">Parameter</th>
              <th className="py-2 pr-3 font-normal text-right">Previous</th>
              <th className="py-2 pr-3 font-normal text-right">Current</th>
              <th className="py-2 pr-3 font-normal text-right">Abs. change</th>
              <th className="py-2 pr-3 font-normal text-right">% change</th>
              <th className="py-2 font-normal text-center">Direction</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((c) => {
              const isSelected = c.parameter_id === selectedParameterId;
              const isIncrease = c.direction === "increase";
              const absChange = c.to_value - c.from_value;
              return (
                <tr
                  key={c.parameter_id}
                  onClick={() => onSelectParameter(c.parameter_id)}
                  className={`border-b border-ink/10 cursor-pointer font-mono text-xs ${
                    isSelected ? "bg-ink/5" : "hover:bg-ink/[0.03]"
                  }`}
                >
                  <td className="py-2 pr-3 font-serif text-sm">
                    {resolveParameterName(c.parameter_id, kb)}
                  </td>
                  <td className="py-2 pr-3 text-right">{currencyFormatter.format(c.from_value)}</td>
                  <td className="py-2 pr-3 text-right">{currencyFormatter.format(c.to_value)}</td>
                  <td className="py-2 pr-3 text-right">{currencyFormatter.format(absChange)}</td>
                  <td
                    className={`py-2 pr-3 text-right ${isIncrease ? "text-pine" : "text-rust"}`}
                  >
                    {percentFormatter.format(c.percent_change)}%
                  </td>
                  <td className={`py-2 text-center ${isIncrease ? "text-pine" : "text-rust"}`}>
                    {isIncrease ? "↑" : "↓"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {skippedParameterIds.length > 0 && (
        <p className="text-xs text-slate mt-3">
          Skipped (missing a value in one of the selected periods, or zero base value):{" "}
          {skippedParameterIds.map((id) => resolveParameterName(id, kb)).join(", ")}
        </p>
      )}
    </section>
  );
}
