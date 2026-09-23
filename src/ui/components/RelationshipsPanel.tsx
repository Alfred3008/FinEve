import type { RelationshipMatch, ObservedChange } from "../../types/frf.types";

interface RelationshipsPanelProps {
  selectedParameterId: string | null;
  selectedChange: ObservedChange | undefined;
  matches: RelationshipMatch[];
}

/**
 * Renders FRF relationships matched for the selected parameter's
 * observed change: possible explanations, related parameter, evidence
 * to check, and investigation path. Pure presentation of data already
 * computed by the deterministic engine — no relationship logic here.
 */
export function RelationshipsPanel({ selectedParameterId, selectedChange, matches }: RelationshipsPanelProps) {
  return (
    <section aria-labelledby="relationships-heading">
      <h2 id="relationships-heading" className="text-lg font-medium mb-1">
        4. FRF relationships &amp; investigation path
      </h2>

      {!selectedParameterId && (
        <p className="text-sm text-slate mt-4">
          Select a parameter above to see its matching FRF relationships.
        </p>
      )}

      {selectedParameterId && matches.length === 0 && (
        <p className="text-sm text-slate mt-4">
          No FRF relationship in the knowledge base matches this parameter's observed direction.
        </p>
      )}

      {selectedParameterId && matches.length > 0 && (
        <div className="space-y-6 mt-4">
          {matches.map((match) => (
            <article
              key={match.relationship.relationship_id}
              className="border border-ink/15 rounded-sm p-5"
            >
              <header className="flex items-baseline justify-between mb-3 pb-3 border-b border-ink/10">
                <h3 className="text-base font-medium">
                  {match.observed_parameter.name}{" "}
                  <span className={selectedChange?.direction === "increase" ? "text-pine" : "text-rust"}>
                    {selectedChange?.direction === "increase" ? "↑" : "↓"}
                  </span>{" "}
                  <span className="text-slate">→</span> {match.related_parameter.name}
                  {match.relationship.related_direction && (
                    <span className={match.relationship.related_direction === "increase" ? "text-pine" : "text-rust"}>
                      {" "}
                      {match.relationship.related_direction === "increase" ? "↑" : "↓"}
                    </span>
                  )}
                </h3>
                <span className="text-xs font-mono text-slate">
                  {match.relationship.relationship_id}
                </span>
              </header>

              <div className="grid gap-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
                    Possible explanations
                  </h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {match.relationship.possible_explanations.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
                    Evidence to check
                  </h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {match.relationship.evidence_to_check.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
                    Investigation path
                  </h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    {match.relationship.investigation_path.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <footer className="mt-4 pt-3 border-t border-ink/10 text-xs text-slate">
                Relationship pairing:{" "}
                <span className="font-mono">{match.relationship.provenance.relationship}</span>
                {match.relationship.source_reference && (
                  <> — {match.relationship.source_reference}</>
                )}
                . Explanations, evidence, and investigation guidance are FinEve-authored, not
                established facts — treat them as hypotheses to verify.
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
