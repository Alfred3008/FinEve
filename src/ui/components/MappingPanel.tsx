import type { MappedLineItem, UnmappedLineItem, FRFKnowledgeBase } from "../../types/frf.types";
import { resolveParameterName } from "../../pipeline/pipeline";

interface MappingPanelProps {
  mappedItems: MappedLineItem[];
  unmappedItems: UnmappedLineItem[];
  kb: FRFKnowledgeBase;
}

/**
 * Displays parameter mapping outcomes. Pure presentation — receives
 * already-computed mapped/unmapped lists from the pipeline and only
 * resolves display names via the pure resolveParameterName helper.
 * No matching or mapping logic lives here.
 */
export function MappingPanel({ mappedItems, unmappedItems, kb }: MappingPanelProps) {
  const ambiguous = unmappedItems.filter((u) => u.reason === "ambiguous_match");
  const unrecognized = unmappedItems.filter((u) => u.reason === "no_matching_alias");

  // De-duplicate mapped and unmapped items by raw_label for summary lists —
  // the same label typically appears once per period column, and the
  // mapping/unmapped outcome for a given label is the same across periods.
  const uniqueMapped = Array.from(
    new Map(mappedItems.map((m) => [`${m.raw_label}::${m.parameter_id}`, m])).values()
  );
  const uniqueAmbiguous = Array.from(new Map(ambiguous.map((u) => [u.raw_label, u])).values());
  const uniqueUnrecognized = Array.from(new Map(unrecognized.map((u) => [u.raw_label, u])).values());

  return (
    <section aria-labelledby="mapping-heading" className="border-b border-ink/15 pb-8 mb-8">
      <h2 id="mapping-heading" className="text-lg font-medium mb-1">
        2. Parameter mapping
      </h2>
      <p className="text-sm text-slate mb-4">
        How raw line items from the file were matched to canonical FRF parameters.
      </p>

      {uniqueMapped.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wide text-slate mb-2">
            Mapped ({uniqueMapped.length})
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {uniqueMapped.map((m) => (
                <tr key={`${m.raw_label}::${m.parameter_id}`} className="border-t border-ink/10">
                  <td className="py-1.5 pr-3 font-mono text-xs text-slate">{m.raw_label}</td>
                  <td className="py-1.5 pr-3 text-pine">→</td>
                  <td className="py-1.5">
                    {resolveParameterName(m.parameter_id, kb)}{" "}
                    <span className="font-mono text-xs text-slate">({m.parameter_id})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {uniqueAmbiguous.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wide text-gold mb-2">
            Ambiguous — needs review ({uniqueAmbiguous.length})
          </h3>
          <ul className="text-sm space-y-1">
            {uniqueAmbiguous.map((u, i) => (
              <li key={i} className="border-l-2 border-gold pl-3 py-0.5">
                <span className="font-mono text-xs">{u.raw_label}</span>
                <span className="text-slate">
                  {" "}
                  matched more than one parameter:{" "}
                  {u.candidate_parameter_ids
                    ?.map((id) => resolveParameterName(id, kb))
                    .join(", ")}
                  . Not auto-assigned.
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uniqueUnrecognized.length > 0 && (
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wide text-slate mb-2">
            Unmapped ({uniqueUnrecognized.length})
          </h3>
          <ul className="text-sm space-y-1">
            {uniqueUnrecognized.map((u, i) => (
              <li key={i} className="border-l-2 border-ink/20 pl-3 py-0.5 font-mono text-xs text-slate">
                {u.raw_label}{" "}
                <span className="font-serif">— no matching FRF parameter</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uniqueMapped.length === 0 && unmappedItems.length === 0 && (
        <p className="text-sm text-slate">No line items processed yet.</p>
      )}
    </section>
  );
}
