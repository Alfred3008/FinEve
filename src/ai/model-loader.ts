/**
 * Model Loader — Local LLM Inference (Real, Experimental)
 *
 * ============================================================
 * WHAT THIS IS: a lazy-loading singleton wrapper around a real,
 * small (~77M parameter) instruction-tuned language model
 * (Xenova/LaMini-Flan-T5-77M), run entirely in the browser via
 * transformers.js (ONNX Runtime Web, WASM backend — no WebGPU
 * requirement, no server, no API key). Inference happens on the
 * user's own device; nothing here sends financial data anywhere.
 *
 * WHAT THIS IS NOT: this is not a large chat model, not a
 * production-grade financial reasoning system, and not guaranteed
 * to produce polished prose — small instruction-tuned models can
 * produce terse, repetitive, or occasionally low-quality output.
 * This is a deliberately small "smallest real thing that works"
 * choice, prioritizing an actually-running local demo over model
 * sophistication, per the Phase 2 constraints.
 *
 * The model is downloaded (once, then cached by the browser) from
 * Hugging Face on first use — NOT bundled with the app, and NOT
 * fetched until the user opens the AI panel. First use will be
 * noticeably slower than subsequent uses within the same browser.
 * ============================================================
 *
 * Dependency direction: this module is the ONLY place in the
 * codebase that imports @huggingface/transformers. frf-engine,
 * data-processing, and pipeline have no knowledge of this module
 * or this package.
 */

// Imported lazily inside getGenerator() rather than at module top
// level, so simply importing this file (e.g. in a test that never
// calls getGenerator) never triggers loading the transformers.js
// runtime or attempting a model download.
type TextToTextPipeline = (
  input: string,
  options?: { max_new_tokens?: number; temperature?: number; repetition_penalty?: number }
) => Promise<Array<{ generated_text: string }>>;

const MODEL_ID = "Xenova/LaMini-Flan-T5-77M";

export type ModelStatus =
  | { state: "idle" }
  | { state: "loading"; progress?: number }
  | { state: "ready" }
  | { state: "error"; message: string };

let cachedGenerator: TextToTextPipeline | null = null;
let loadingPromise: Promise<TextToTextPipeline> | null = null;

/**
 * Lazily loads and caches the text2text-generation pipeline. Safe to
 * call multiple times — concurrent callers share the same in-flight
 * load rather than triggering duplicate downloads.
 *
 * onStatusChange is called with progress updates during download/init
 * so the UI can show a loading state; it is optional and this function
 * works fine without it.
 */
export async function getGenerator(
  onStatusChange?: (status: ModelStatus) => void
): Promise<TextToTextPipeline> {
  if (cachedGenerator) {
    return cachedGenerator;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  onStatusChange?.({ state: "loading" });

  loadingPromise = (async () => {
    try {
      // Dynamic import: transformers.js and its WASM runtime are only
      // fetched when this function actually runs, not at app startup.
      const { pipeline } = await import("@huggingface/transformers");

      const generator = (await pipeline("text2text-generation", MODEL_ID, {
        progress_callback: (progress: { status: string; progress?: number }) => {
          if (typeof progress.progress === "number") {
            onStatusChange?.({ state: "loading", progress: progress.progress });
          }
        },
      })) as unknown as TextToTextPipeline;

      cachedGenerator = generator;
      onStatusChange?.({ state: "ready" });
      return generator;
    } catch (err) {
      loadingPromise = null;
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error loading the local language model.";
      onStatusChange?.({ state: "error", message });
      throw err;
    }
  })();

  return loadingPromise;
}

/**
 * True if the model has already been loaded and cached in this
 * browser session. Exposed so the UI can decide whether to warn the
 * user that the first request will trigger a download.
 */
export function isModelReady(): boolean {
  return cachedGenerator !== null;
}
