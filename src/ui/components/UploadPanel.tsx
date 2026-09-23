import { useState, type ChangeEvent } from "react";

export type UploadStatus =
  | { state: "idle" }
  | { state: "file_selected"; fileName: string }
  | { state: "processing"; fileName: string }
  | { state: "success"; fileName: string }
  | { state: "error"; fileName: string; message: string };

interface UploadPanelProps {
  status: UploadStatus;
  fromPeriod: string;
  toPeriod: string;
  onFromPeriodChange: (value: string) => void;
  onToPeriodChange: (value: string) => void;
  onFileSelected: (file: File) => void;
  onRunAnalysis: () => void;
}

/**
 * Upload panel. Contains no parsing or mapping logic — it only collects
 * the file and the two period labels, and reports the user's actions
 * upward via callbacks. All processing happens in the pipeline, invoked
 * by the parent component.
 */
export function UploadPanel({
  status,
  fromPeriod,
  toPeriod,
  onFromPeriodChange,
  onToPeriodChange,
  onFileSelected,
  onRunAnalysis,
}: UploadPanelProps) {
  const [dragActive, setDragActive] = useState(false);

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  const canRun = status.state === "file_selected" && fromPeriod.trim() !== "" && toPeriod.trim() !== "";

  return (
    <section aria-labelledby="upload-heading" className="border-b border-ink/15 pb-8 mb-8">
      <h2 id="upload-heading" className="text-lg font-medium mb-1">
        1. Upload financial data
      </h2>
      <p className="text-sm text-slate mb-4">
        Excel or CSV with a line-item column and one column per reporting period.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border border-dashed rounded-sm p-6 text-center transition-colors ${
          dragActive ? "border-pine bg-pine/5" : "border-ink/25"
        }`}
      >
        <label htmlFor="file-input" className="cursor-pointer">
          <span className="block text-sm mb-2">
            {status.state === "idle" && "Drop a file here, or choose one"}
            {status.state === "file_selected" && `Selected: ${status.fileName}`}
            {status.state === "processing" && `Processing ${status.fileName}…`}
            {status.state === "success" && `Analyzed: ${status.fileName}`}
            {status.state === "error" && `Selected: ${status.fileName}`}
          </span>
          <span className="inline-block text-xs font-mono border border-ink/30 rounded-sm px-3 py-1.5 hover:bg-ink/5">
            Choose file
          </span>
        </label>
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {status.state === "error" && (
        <p role="alert" className="mt-3 text-sm text-rust">
          Couldn't read that file. {status.message}
        </p>
      )}

      <div className="flex items-end gap-4 mt-5">
        <div>
          <label htmlFor="from-period" className="block text-xs font-mono text-slate mb-1">
            Earlier period
          </label>
          <input
            id="from-period"
            type="text"
            placeholder="FY2023"
            value={fromPeriod}
            onChange={(e) => onFromPeriodChange(e.target.value)}
            className="font-mono text-sm border border-ink/30 rounded-sm px-2 py-1.5 w-28 bg-white"
          />
        </div>
        <div>
          <label htmlFor="to-period" className="block text-xs font-mono text-slate mb-1">
            Later period
          </label>
          <input
            id="to-period"
            type="text"
            placeholder="FY2024"
            value={toPeriod}
            onChange={(e) => onToPeriodChange(e.target.value)}
            className="font-mono text-sm border border-ink/30 rounded-sm px-2 py-1.5 w-28 bg-white"
          />
        </div>
        <button
          type="button"
          disabled={!canRun}
          onClick={onRunAnalysis}
          className="text-sm border border-ink rounded-sm px-4 py-1.5 bg-ink text-paper disabled:bg-transparent disabled:text-ink/30 disabled:border-ink/20 disabled:cursor-not-allowed hover:not(:disabled):bg-ink/85"
        >
          Run analysis
        </button>
      </div>
      <p className="text-xs text-slate mt-1">
        Period names must match the column headers in the uploaded file exactly.
      </p>
    </section>
  );
}
