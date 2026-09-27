import { generateHypotheses } from "../../ai/hypothesis-generator";
import type { RelationshipMatch, ObservedChange } from "../../types/frf.types";

interface AIHypothesisPanelProps {
  selectedParameterId: string | null;
  selectedChange: ObservedChange | undefined;
  matches: RelationshipMatch[];
}

/**
 * Renders the Phase 2 AI demonstration layer: a concise, labeled
 * analyst-style summary (Observation / Possible hypothesis / Evidence
 * to verify) for the currently selected parameter's matched
 * relationships.
 *
 * This panel calls generateHypotheses(), a deterministic template
 * function — NOT a language model. The heading and disclaimer below
 * are intentional: this is a prototype demonstrating where an
 * eventual on-device reasoning layer would sit in the UI, not a
 * working AI feature or a market/investment signal.
 */
export function AIHypothesisPanel({ selectedParameterId, selectedChange, matches }: AIHypothesisPanelProps) {
  if (!selectedParameterId || !selectedChange) {
    return null;
  }

  const hypotheses = generateHypotheses(selectedChange, matches);

  return (
    <section aria-labelledby="ai-hypothesis-heading" className="mt-8 pt-8 border-t border-ink/15">
      <div className="flex items-baseline gap-2 mb-1">
        <h2 id="ai-hypothesis-heading" className="text-lg font-medium">
          5. On-device reasoning demo
        </h2>
        <span className="text-xs font-mono uppercase tracking-wide text-gold border border-gold/40 rounded-sm px-1.5 py-0.5">
          Prototype
        </span>
      </div>
      <p className="text-sm text-slate mb-4">
        This section demonstrates how a future on-device AI layer would summarize the FRF
        engine's own output. It is a deterministic template running locally in your browser —
        no language model, no external call, no prediction. It restates the same possible
        explanations and evidence shown above in labeled analyst-style form.
      </p>

      {hypotheses.length === 0 && (
        <p className="text-sm text-slate">No matched relationship to summarize for this parameter.</p>
      )}

      {hypotheses.length > 0 && (
        <div className="space-y-4">
          {hypotheses.map((h) => (
            <article key={h.relationship_id} className="border border-gold/30 rounded-sm p-4 bg-gold/[0.04]">
              <header className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wide text-slate">
                  Analyst-style summary
                </span>
                <span className="text-xs font-mono text-slate">{h.relationship_id}</span>
              </header>

              <dl className="text-sm space-y-2">
                <div>
                  <dt className="text-xs font-mono uppercase tracking-wide text-slate">Observation</dt>
                  <dd>{h.observation}</dd>
                </div>
                <div>
                  <dt className="text-xs font-mono uppercase tracking-wide text-slate">
                    Possible hypothesis
                  </dt>
                  <dd>{h.possible_hypothesis}</dd>
                </div>
                <div>
                  <dt className="text-xs font-mono uppercase tracking-wide text-slate">
                    Evidence to verify
                  </dt>
                  <dd>{h.evidence_to_verify}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-slate mt-4">
        This is not a stock prediction, investment recommendation, or verified conclusion —
        it is an unverified hypothesis generated from the FRF knowledge base and requires
        analyst confirmation against actual disclosures.
      </p>
    </section>
  );
}
