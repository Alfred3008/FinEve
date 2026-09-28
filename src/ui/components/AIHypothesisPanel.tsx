import { useEffect, useState } from "react";
import { generateHypotheses, type AnalystHypothesis } from "../../ai/hypothesis-generator";
import type { ModelStatus } from "../../ai/model-loader";
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
 * This panel calls generateHypotheses(), which performs REAL local
 * language model inference (Xenova/LaMini-Flan-T5-77M via
 * transformers.js, running on-device in the browser via WASM — no
 * server, no API call). The disclosure text below states this
 * plainly, including that the model downloads on first use and that
 * its output is experimental and unverified.
 */
export function AIHypothesisPanel({ selectedParameterId, selectedChange, matches }: AIHypothesisPanelProps) {
  const [hypotheses, setHypotheses] = useState<AnalystHypothesis[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus>({ state: "idle" });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!selectedParameterId || !selectedChange) {
      setHypotheses([]);
      return;
    }

    let cancelled = false;
    setGenerating(true);

    generateHypotheses(selectedChange, matches, (status) => {
      if (!cancelled) setModelStatus(status);
    })
      .then((result) => {
        if (!cancelled) {
          setHypotheses(result);
          setGenerating(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGenerating(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // matches is a new array reference on every pipeline run, but its
    // content for a given parameter_id is stable within one analysis —
    // re-keying on selectedParameterId/selectedChange (which changes
    // together) is sufficient and avoids re-running generation on
    // every unrelated re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParameterId, selectedChange]);

  if (!selectedParameterId || !selectedChange) {
    return null;
  }

  return (
    <section aria-labelledby="ai-hypothesis-heading" className="mt-8 pt-8 border-t border-ink/15">
      <div className="flex items-baseline gap-2 mb-1">
        <h2 id="ai-hypothesis-heading" className="text-lg font-medium">
          5. On-device reasoning demo
        </h2>
        <span className="text-xs font-mono uppercase tracking-wide text-gold border border-gold/40 rounded-sm px-1.5 py-0.5">
          Local &amp; experimental
        </span>
      </div>
      <p className="text-sm text-slate mb-4">
        This section runs a real, small language model (Xenova/LaMini-Flan-T5-77M, ~77M
        parameters) entirely in your browser via WebAssembly — no server, no API call, no data
        leaves your device. The model downloads on first use (a few seconds to a minute
        depending on your connection) and its output is an unverified, experimental
        restatement of the possible explanations shown above — not a fact, not investment
        advice, and not a stock prediction.
      </p>

      {modelStatus.state === "loading" && (
        <p className="text-sm text-gold mb-3" role="status">
          Loading local model
          {typeof modelStatus.progress === "number" ? ` (${Math.round(modelStatus.progress)}%)` : "…"}
          {" "}— this happens once per browser session.
        </p>
      )}

      {modelStatus.state === "error" && (
        <p className="text-sm text-rust mb-3" role="alert">
          The local model failed to load ({modelStatus.message}). Showing the recorded
          explanations directly instead.
        </p>
      )}

      {generating && modelStatus.state !== "loading" && (
        <p className="text-sm text-slate mb-3" role="status">
          Generating…
        </p>
      )}

      {!generating && hypotheses.length === 0 && (
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
        it is an unverified hypothesis generated by a small local language model and requires
        analyst confirmation against actual disclosures.
      </p>
    </section>
  );
}
