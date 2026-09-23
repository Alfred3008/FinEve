import { useState } from "react";
import { UploadPanel, type UploadStatus } from "./ui/components/UploadPanel";
import { MappingPanel } from "./ui/components/MappingPanel";
import { ChangesPanel } from "./ui/components/ChangesPanel";
import { RelationshipsPanel } from "./ui/components/RelationshipsPanel";
import { runPipeline } from "./pipeline/pipeline";
import type { PipelineResult } from "./types/frf.types";
import type { FRFKnowledgeBase } from "./frf-engine/knowledge-base/schema";
import seedData from "./frf-engine/knowledge-base/seed-data.json";

const kb = seedData as FRFKnowledgeBase;

/**
 * Reads a File as an ArrayBuffer via FileReader rather than
 * File.prototype.arrayBuffer(). FileReader has broader runtime support
 * (including in the jsdom test environment used by this project's UI
 * tests) than the newer arrayBuffer() method.
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read file as binary data."));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * App shell. Owns UI state (selected file, periods, selected parameter,
 * pipeline result) and calls runPipeline() on demand. Contains no
 * financial logic itself — all computation is delegated to the pipeline
 * module, which composes the deterministic engine and data-processing
 * modules.
 */
export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ state: "idle" });
  const [fromPeriod, setFromPeriod] = useState("");
  const [toPeriod, setToPeriod] = useState("");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);

  function handleFileSelected(f: File) {
    setFile(f);
    setStatus({ state: "file_selected", fileName: f.name });
    setResult(null);
    setSelectedParameterId(null);
  }

  async function handleRunAnalysis() {
    if (!file) return;
    setStatus({ state: "processing", fileName: file.name });
    try {
      const buffer = await readFileAsArrayBuffer(file);
      const pipelineResult = runPipeline(buffer, fromPeriod.trim(), toPeriod.trim(), kb);
      setResult(pipelineResult);
      setStatus({ state: "success", fileName: file.name });
      if (pipelineResult.observed_changes.length > 0) {
        setSelectedParameterId(pipelineResult.observed_changes[0].parameter_id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error while processing the file.";
      setStatus({ state: "error", fileName: file.name, message });
    }
  }

  const selectedChange = result?.observed_changes.find((c) => c.parameter_id === selectedParameterId);
  const selectedMatches = selectedParameterId
    ? result?.relationship_matches.get(selectedParameterId) ?? []
    : [];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/15 px-8 py-6">
        <h1 className="text-xl font-medium">FinEve</h1>
        <p className="text-sm text-slate mt-0.5">
          Financial Relationship Framework — parameter mapping, change detection, and
          investigation paths.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-10">
        <UploadPanel
          status={status}
          fromPeriod={fromPeriod}
          toPeriod={toPeriod}
          onFromPeriodChange={setFromPeriod}
          onToPeriodChange={setToPeriod}
          onFileSelected={handleFileSelected}
          onRunAnalysis={handleRunAnalysis}
        />

        {result && (
          <>
            <MappingPanel mappedItems={result.mapped_items} unmappedItems={result.unmapped_items} kb={kb} />
            <ChangesPanel
              changes={result.observed_changes}
              skippedParameterIds={result.skipped_parameter_ids}
              kb={kb}
              selectedParameterId={selectedParameterId}
              onSelectParameter={setSelectedParameterId}
            />
            <RelationshipsPanel
              selectedParameterId={selectedParameterId}
              selectedChange={selectedChange}
              matches={selectedMatches}
            />
          </>
        )}
      </main>
    </div>
  );
}
