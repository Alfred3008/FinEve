# AI Module — Phase 2: Real Local LLM Inference (Experimental)

This directory implements the on-device AI reasoning layer referenced
in the FinEve README and FRF Master Specification (§5, §12.6).

**As of Phase 2, this module performs real local language model
inference — it is no longer a template or placeholder.**

## What this is

- `model-loader.ts` — a lazy-loading singleton wrapper around
  [`@huggingface/transformers`](https://www.npmjs.com/package/@huggingface/transformers)
  (transformers.js), running the
  [`Xenova/LaMini-Flan-T5-77M`](https://huggingface.co/Xenova/LaMini-Flan-T5-77M)
  model — a real, small (~77M parameter) instruction-tuned
  text-to-text model — via ONNX Runtime Web (WASM backend). The model
  runs entirely in the browser, on the user's own device. No server,
  no API key, no external inference call, and no financial data is
  transmitted anywhere.
- `hypothesis-generator.ts` — builds a prompt from the FRF engine's
  deterministic output (an `ObservedChange` and its matched
  `RelationshipMatch[]`) and calls the local model to generate a short
  natural-language `possible_hypothesis`. The `observation` and
  `evidence_to_verify` fields remain deterministic, non-model-generated
  text — exact arithmetic and exact disclosure-location strings should
  never be left to a small language model to restate.

## What this is not

- Not a large chat model — 77M parameters is small by design, chosen
  to prioritize an actually-working in-browser demo over model
  sophistication, per the Phase 2 constraints.
- Not guaranteed to produce polished prose. Small instruction-tuned
  models can produce terse, repetitive, or occasionally low-quality
  output. This is disclosed directly in the UI.
- Not a stock predictor, not investment advice, and not a verified
  conclusion. The model is prompted to work only from explanations
  already recorded in the FRF knowledge base — it is explicitly
  instructed not to invent new numbers or new explanations.
- Not RAG, not a vector database, not a multi-agent system, not
  Supabase, not document processing, and not Snapdragon/NPU-specific
  — none of that exists here or is implied by this module.

## Architectural boundary (unchanged from Phase 1)

- `frf-engine/`, `data-processing/`, and `pipeline/` have zero
  dependency on this module or on `@huggingface/transformers`. This
  module consumes `frf-engine` output; the reverse is never true.
- `@huggingface/transformers` is imported in exactly one place
  (`model-loader.ts`, via a dynamic `import()` inside `getGenerator()`)
  so that simply importing other files in this module never triggers
  loading the runtime or downloading the model.

## Known installation caveat

`@huggingface/transformers` declares `onnxruntime-node` as a regular
(non-optional) dependency for its Node.js code path, even though the
browser build this project actually uses only needs
`onnxruntime-web`. `onnxruntime-node`'s postinstall script attempts to
download a native binary from `api.nuget.org`. In network-restricted
environments (including the sandbox this project was developed in),
that download fails and blocks `npm install` unless run with
`--ignore-scripts`:

```
npm install --ignore-scripts
```

This is safe for this project specifically because the browser build
never touches the Node-native binding — but it is a real constraint
worth knowing about before running `npm install` on a new machine
without unrestricted network access.

## Model loading behavior

The model is downloaded from Hugging Face's CDN on first use — not
bundled with the app, and not fetched until a user actually opens the
"On-device reasoning demo" panel. The browser caches it after that
first download, so subsequent uses within the same browser are fast.
First use will be noticeably slower (a few seconds to roughly a
minute, depending on connection speed) — this is disclosed directly in
the UI.

## Verification status

This module's pure functions (`buildObservation`, `buildEvidenceToVerify`,
`buildPrompt`) and orchestration logic (`generateHypotheses`,
`model-loader`'s caching/error-handling) are unit tested with the
actual model call mocked, because the development/test environment
used to build this module has no network access to Hugging Face's CDN
to download real model weights. This means: the code path that
prepares data for the model, and the code path that handles the
model's response (including fallback behavior on failure), are
genuinely tested — but end-to-end generation quality from the real
model has not been exercised in an automated test and must be
verified manually in an actual browser with normal internet access.
