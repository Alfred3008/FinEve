# FinEve — Phase 1 Technical Handoff

**Status**: Phase 1 complete. 50/50 tests passing, TypeScript strict mode clean, production build verified.

This document describes the system as it currently exists in the repository — no aspirational or planned content is presented as implemented. Where something is deferred, it is explicitly marked as not built.

---

## 1. Current Architecture

Phase 1 implements exactly one workflow end to end:

```
Excel/CSV Upload
      ↓
Excel/CSV Parsing        (src/data-processing/excel-parser.ts)
      ↓
Parameter Mapping        (src/data-processing/parameter-mapping.ts)
      ↓
Change Detection         (src/frf-engine/change-detection.ts)
      ↓
FRF Relationship Lookup  (src/frf-engine/relationship-lookup.ts)
      ↓
Possible Explanations, Evidence to Check, Investigation Path
      ↓
UI Display               (src/ui/components/*, src/App.tsx)
```

The architecture is organized around one non-negotiable boundary, enforced by folder placement and import direction rather than by convention alone:

- **`src/frf-engine/`** is the deterministic core. It has **zero dependency** on `data-processing/`, `ui/`, `ai/`, or `evidence/`. It only performs financial calculation and knowledge-base lookup, both as pure functions.
- **`src/pipeline/`** sits one layer above `frf-engine/` specifically because it needs to depend on *both* `data-processing/` and `frf-engine/` to orchestrate them. It was deliberately placed outside `frf-engine/` rather than inside it, so that `frf-engine/`'s zero-dependency rule is never violated by the module that connects it to the rest of the app.
- **`src/ui/`** and **`src/App.tsx`** consume `pipeline/` output only. No component computes a percentage change, matches a relationship, or does any financial reasoning itself — see §9 for the exact boundary.
- **`src/ai/`** and **`src/evidence/`** exist as placeholder directories only. Each contains a single `README.md` stating that no implementation exists yet and that these modules must remain consumers of `frf-engine/` output, never dependencies of it.

This separation means the deterministic core can be unit-tested, reasoned about, and eventually reused by an AI or evidence layer without ever being modified by that later work.

---

## 2. Folder Structure

```
FinEve/
├── docs/
│   ├── FRF_Master_Specification.md      # source-of-truth spec, unmodified
│   └── PHASE_1_HANDOFF.md               # this document
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts                       # includes Vitest config (jsdom, setup file)
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── src/
    ├── main.tsx                         # React entry point
    ├── App.tsx                          # app shell: owns UI state, calls runPipeline()
    ├── App.test.tsx                     # end-to-end UI tests (7 tests)
    ├── test-setup.ts                    # jest-dom matcher setup for Vitest
    ├── frf-engine/                      # DETERMINISTIC CORE — zero external dependencies
    │   ├── knowledge-base/
    │   │   ├── schema.ts                # FRFParameter, FRFRelationship, FRFKnowledgeBase types
    │   │   └── seed-data.json           # 12 parameters, 8 relationships (see §4, §6)
    │   ├── change-detection.ts          # computeChange, computeChanges
    │   ├── change-detection.test.ts     # 8 tests
    │   ├── relationship-lookup.ts       # findMatchingRelationships(ForChanges)
    │   └── relationship-lookup.test.ts  # 11 tests
    ├── data-processing/                 # Excel/CSV parsing + parameter mapping
    │   ├── excel-parser.ts
    │   ├── excel-parser.test.ts         # 9 tests
    │   ├── parameter-mapping.ts
    │   └── parameter-mapping.test.ts    # 9 tests
    ├── pipeline/                        # orchestration layer (depends on both above)
    │   ├── pipeline.ts                  # runPipeline(), resolveParameterName()
    │   └── pipeline.test.ts             # 6 tests
    ├── ui/
    │   ├── components/
    │   │   ├── UploadPanel.tsx          # file selection, period inputs, drag-and-drop
    │   │   ├── MappingPanel.tsx         # mapped / ambiguous / unmapped line items
    │   │   ├── ChangesPanel.tsx         # detected-changes table + period-mismatch diagnostics
    │   │   └── RelationshipsPanel.tsx   # explanations, evidence, investigation path
    │   └── styles/
    │       └── index.css                # Tailwind directives, font imports, design tokens
    ├── types/
    │   └── frf.types.ts                 # UI-facing type re-exports (no logic)
    ├── ai/
    │   └── README.md                    # placeholder only, no code
    └── evidence/
        └── README.md                    # placeholder only, no code
```

No `tests/` directory at the repository root is in active use — all tests are colocated with the source files they test, using Vitest's default convention (`*.test.ts` / `*.test.tsx`).

---

## 3. Data Flow

End-to-end, using the file upload as the entry point:

1. **User selects a file** in `UploadPanel` and enters two period labels (e.g. `"FY2023"`, `"FY2024"`) as free-text strings that must match column headers in the file exactly (whitespace is tolerated — see §5).
2. **`App.tsx`** reads the file into an `ArrayBuffer` via `FileReader` (not `File.prototype.arrayBuffer()` — see §12 for why) and calls `runPipeline(buffer, fromPeriod, toPeriod, kb)`.
3. **`runPipeline`** (in `src/pipeline/pipeline.ts`) runs the stages in order, passing the output of each stage as the input to the next:
   - `parseWorkbook(buffer)` → raw line items + detected period column headers
   - `mapLineItems(items, kb.parameters)` → mapped items + unmapped items
   - `computeChanges(mappedValues, fromPeriod, toPeriod)` → observed changes + skipped parameter IDs
   - `findMatchingRelationshipsForChanges(changes, kb)` → a `Map<parameter_id, RelationshipMatch[]>`
4. **`App.tsx`** stores the full `PipelineResult` in React state and auto-selects the first observed change.
5. **UI panels** render directly from that state: `MappingPanel`, `ChangesPanel`, and `RelationshipsPanel` each receive already-computed data as props and perform no calculation themselves.

No network call, no database, and no AI inference happens anywhere in this flow. Everything is synchronous, in-memory, and client-side (the only asynchronous step is reading the file itself via `FileReader`).

---

## 4. FRF Engine Flow

The FRF engine (`src/frf-engine/`) is two independent pure-function modules plus a static knowledge base:

### `change-detection.ts`
- `computeChange(parameter_id, from_period, to_period, from_value, to_value)` — computes percent change as `((to - from) / |from|) * 100` and direction (`"increase"` if `to >= from`, else `"decrease"`). Throws if `from_value` is `0` (percentage change is undefined).
- `computeChanges(values, from_period, to_period)` — batches the above across many parameters. A parameter missing a value in either period, or with a zero base value, is placed in a `skipped` list rather than throwing or being silently omitted.

### `relationship-lookup.ts`
- `findMatchingRelationships(change, kb)` — filters `kb.relationships` for entries where `relationship.parameter_id === change.parameter_id` and `relationship.direction === change.direction`, then resolves both the observed and related parameter to their full `FRFParameter` records. Throws (loudly, by design) if the knowledge base references a `parameter_id` that doesn't exist in `parameters[]` — this is treated as a malformed knowledge base, not a data condition to handle gracefully.
- `findMatchingRelationshipsForChanges(changes, kb)` — batches the above into a `Map` keyed by `parameter_id`.

### Knowledge base (`knowledge-base/schema.ts` + `seed-data.json`)
The schema and current seed content are detailed in §6. In brief: the engine does not compute or infer relationships — it only looks up pre-authored ones from a static JSON file. There is no ranking, scoring, or confidence weighting of matches; every relationship whose `parameter_id` and `direction` match the observed change is returned.

---

## 5. Excel/CSV Processing

Implemented in `src/data-processing/excel-parser.ts`, using SheetJS (`xlsx`).

- Reads the **first worksheet only**. Multi-sheet files are not supported — only `workbook.SheetNames[0]` is read.
- Expects a simple layout: **first column = line-item label, every other column = a period**. There is no header-row detection or layout auto-discovery; the first row is always treated as headers.
- **Label cells** are stringified and trimmed (`String(rawLabel).trim()`).
- **Period column headers** are stringified and trimmed the same way (`String(h).trim()`). This trimming was added specifically to fix a real bug found during UI testing: an Excel file with a trailing space in a period header (e.g. `"FY2023 "`) caused every parameter mapped to that period to be silently skipped downstream, because the trimmed period string the user typed into the UI never matched the untrimmed header extracted from the file. See §11 for the regression tests covering this.
- **Non-numeric cells** are not coerced to zero or dropped silently — they are collected into a separate `skipped_rows` list with the row label, period, and the raw value that failed to parse, so the caller can report exactly what was skipped and why.
- **Blank label rows** are skipped without error (not treated as a malformed file).
- The parser also returns `detected_periods`: the exact list of trimmed column headers found in the file, in file order. This is surfaced through the full pipeline to the UI specifically so a period-name mismatch between what the user typed and what the file contains is diagnosable rather than presenting as an unexplained "all values missing" state.
- Throws if the workbook has no worksheets, if the first worksheet is empty, or if the header row has fewer than 2 columns (no period columns to read).

---

## 6. Parameter Mapping

Implemented in `src/data-processing/parameter-mapping.ts`.

**Matching algorithm**: for each raw line-item label, every parameter in the knowledge base is checked against its `aliases[]` list. A match occurs if the normalized (trimmed, lowercased) raw label **equals** an alias, or **contains** an alias as a substring. There is no fuzzy matching, similarity scoring, or edit-distance algorithm — matching is intentionally literal.

**Three possible outcomes per line item**:
1. **Mapped** — the label matched aliases belonging to exactly one parameter. The matched alias itself is recorded alongside the result.
2. **Unmapped, `no_matching_alias`** — the label matched no alias at all.
3. **Unmapped, `ambiguous_match`** — the label matched aliases belonging to **more than one** distinct parameter. Rather than guessing which parameter was intended, this is surfaced explicitly, along with the list of candidate parameter IDs. This is a deliberate safety behavior established early in the project ("no silent guessing"), not an oversight — and it was actually triggered once during development: an early seed-data alias of the bare word `"Cash"` on the *Cash and Cash Equivalents* parameter caused `"Cash Flow from Operations"` to ambiguously match both that parameter and *Operating Cash Flow*. The fix was to remove the overly generic alias, not to add matching logic to resolve the ambiguity silently.

**Seed knowledge base** (`seed-data.json`), current state as verified against the file directly:

- **12 parameters**: Revenue from Operations, Trade Receivables, Operating Cash Flow, Operating Margin, Inventory, Debt, Interest Coverage Ratio, Cash and Cash Equivalents, Return on Equity, Return on Capital Employed, Capital Expenditure, Depreciation.
- **8 relationships**, all traceable to FRF Master Specification §24.2:

  | ID | Pairing | Source |
  |---|---|---|
  | R_001 | Revenue ↑ → Receivables ↑ | §24.2 (Revenue ↑ + Receivables ↑ + CFO ↓) |
  | R_002 | Receivables ↑ → CFO ↓ | §24.2 (Receivables ↑ + Cash Flow ↓) |
  | R_003 | Revenue ↑ → Operating Margin ↓ | §24.2 (Revenue ↑ + Margin ↓) |
  | R_004 | Inventory ↑ → Revenue ↓ | §24.2 (Inventory ↑ + Sales ↓) |
  | R_005 | Debt ↑ → Interest Coverage ↓ | §24.2 (Debt ↑ + Interest Coverage ↓) |
  | R_006 | Cash ↑ → Debt ↑ | §24.2 (Cash ↑ + Borrowings ↑) |
  | R_007 | ROE ↑ → ROCE ↓ | §24.2 (ROE ↑ + ROCE ↓) |
  | R_008 | Capex ↑ → Depreciation ↑ | §24.2 (Capex ↑ + Depreciation ↑) |

  The seed set was expanded from the originally targeted 5–10 parameters to 12, because the 8 sourced relationship pairs collectively reference 12 distinct parameters — this is documented in `schema.ts` directly.

**Field-level provenance**: every relationship carries a `provenance` object distinguishing which parts are traceable to the specification versus authored during FinEve development:

```json
"provenance": {
  "relationship": "FRF-source",
  "possible_explanations": "FinEve-authored",
  "evidence_to_check": "FinEve-authored",
  "investigation_path": "FinEve-authored"
}
```

For all 8 seed relationships, `relationship` is `"FRF-source"` (the parameter pairing and direction is named in §24.2) but `possible_explanations`, `evidence_to_check`, and `investigation_path` are `"FinEve-authored"` — the specification names *which* parameters relate and in *which* direction, but does not supply ready-made prose for the explanatory text. This distinction is surfaced in the UI itself (see §9) so a user cannot mistake authored hypotheses for established facts.

---

## 7. Change Detection

Covered in detail in §4. Summarized behavior:

- Percent change: `((to_value - from_value) / |from_value|) * 100`.
- Direction: `"increase"` if `to_value >= from_value`, otherwise `"decrease"` (a value equal to the prior period counts as an increase, not a separate "no change" state — there is no third direction value).
- A zero `from_value` is not computed — the parameter is placed in `skipped_parameter_ids` rather than producing `Infinity` or `NaN`.
- A parameter present in only one of the two selected periods (e.g. mapped in FY2024 but not FY2023) is also skipped rather than defaulting to a synthetic 0.

---

## 8. Relationship Lookup

Covered in detail in §4 and §6. Summarized behavior:

- Lookup is a **direct match** on `(parameter_id, direction)` against the static seed relationships — no ranking, no partial matches, no confidence scores.
- A single observed change can match **more than one** relationship (e.g. Revenue increasing matches both R_001 to Receivables and R_003 to Margin) — all matches are returned and all are displayed.
- An observed change with no corresponding relationship in the seed set (e.g. Revenue *decreasing*, for which no relationship exists) returns an empty match list, not an error.

---

## 9. UI Flow

Four components plus the `App.tsx` shell, built with React + TypeScript + Tailwind CSS. **No component performs financial computation** — every number, direction, match, and piece of explanatory text displayed is read directly from `PipelineResult`, never derived in a component.

1. **`UploadPanel`** — file selection (click or drag-and-drop), two period-label text inputs, and a "Run analysis" button that stays disabled until both a file and both period values are present. Shows upload status (idle / file selected / processing / success / error).
2. **`MappingPanel`** — three sections: successfully mapped items (raw label → resolved parameter name), ambiguous matches (raw label + the candidate parameters it matched, explicitly not auto-resolved), and unmapped items (no match found). All three lists are deduplicated by raw label before display, since the same label typically appears once per period column in the underlying data and would otherwise be shown multiple times for a single logical line item.
3. **`ChangesPanel`** — a table of every observed change: parameter name, previous value, current value, absolute change, percentage change, and direction (↑/↓, color-coded). Rows are clickable to select a parameter for the relationships panel below. Also renders a diagnostic message when parameters were skipped: if the skip is attributable to a period-name mismatch (the entered period doesn't appear in `detected_periods`), a specific `role="alert"` message names the mismatched period(s) and lists the actual column headers found in the file; otherwise a more generic "missing a value" message is shown.
4. **`RelationshipsPanel`** — for the selected parameter, renders every matched relationship as a card: the relationship pairing with direction arrows, possible explanations (bulleted), evidence to check (bulleted), and investigation path (numbered). Each card's footer states the relationship's provenance (`FRF-source` and its `source_reference`) and reminds the user that the explanation/evidence/investigation text is FinEve-authored, not verified fact.

**Design language**: a "financial working paper" aesthetic rather than a generic dashboard — serif type (Source Serif 4) for prose, monospace (JetBrains Mono) for all numeric/data values, a muted paper/ink/pine/rust/slate/gold palette, hairline rules instead of card shadows. This was a deliberate choice documented at implementation time, not a framework default.

---

## 10. Test Coverage (50 tests)

All passing as of the last full run. Breakdown by file:

| File | Tests | Covers |
|---|---|---|
| `frf-engine/change-detection.test.ts` | 8 | Percent/direction math, zero-base-value handling, negative-base-value handling, batch skip behavior |
| `frf-engine/relationship-lookup.test.ts` | 11 | Direct matches, multi-relationship matches, no-match cases, malformed-knowledge-base error handling, seed-data integrity (unique IDs, no dangling references, every sourced relationship has a citation) |
| `data-processing/excel-parser.test.ts` | 9 | Well-formed sheets, label trimming, non-numeric cell skipping, blank-row handling, numeric-string coercion, malformed-file errors, **period-header trimming (regression test for the bug described in §5)**, `detected_periods` exposure |
| `data-processing/parameter-mapping.test.ts` | 9 | Exact match, case-insensitivity, substring match, label preservation, no-match case, no-fuzzy-guessing behavior, ambiguous-match detection (including a deliberately constructed alias collision), mixed-batch mapping |
| `pipeline/pipeline.test.ts` | 6 | Full worked-example flow (the Revenue↑→Receivables↑→CFO↓ chain), unmapped-item surfacing, skipped-parameter surfacing, no-match case, **the trailing-space period-header regression reproduced end to end**, a genuine period-naming-convention mismatch (e.g. `"FY23"` vs `"FY2023"`) confirming `detected_periods` reports what was actually found |
| `App.test.tsx` | 7 | Initial render, full pipeline run through the UI with every required field visible (mapped/unmapped items, previous/current/absolute/percentage/direction, relationship cards with explanations/evidence/investigation path), unmapped-item display, Run-analysis button enable/disable logic, row selection updating the relationships panel, **the period-header trailing-space regression rendered through the actual UI**, **the diagnostic alert message for a genuine period-name mismatch** |

Two categories of test worth noting specifically:
- **Regression tests for the trailing-space period-header bug** exist at three levels (parser, pipeline, UI) — this was a real bug found during manual testing after Phase 1 was initially reported complete, and coverage was added retroactively once found, not written in advance.
- **The ambiguous-alias test** in `parameter-mapping.test.ts` is a deliberately constructed collision, added after a real collision (the `"Cash"` alias, described in §6) was found and fixed during development — the test exists specifically so that class of bug cannot silently reappear.

---

## 11. Known Limitations

Stated plainly, without minimizing:

- **Matching is literal, not fuzzy.** A label that doesn't exactly equal or contain a known alias will not map, even if it's an obvious human-readable variant (e.g. a typo, an abbreviation not in the alias list, or a differently-ordered phrase). This is a deliberate Phase 1 choice (no silent guessing), not an oversight, but it means real-world files with inconsistent labeling will require alias-list maintenance.
- **Single worksheet only.** A workbook with financial data spread across multiple sheets will only have its first sheet read; there is no sheet-selection UI.
- **Exactly two periods per analysis.** The engine computes change between one `from_period` and one `to_period` per run. Multi-year trend analysis across more than two periods is not supported.
- **Period matching depends on the user typing the exact (trimmed) column header text.** Whitespace differences are now tolerated (§5), but a genuinely different naming convention (e.g. file uses `"FY23"`, user types `"FY2023"`) will still result in a skip — the UI surfaces this diagnostically (§9) but does not auto-correct or suggest a match.
- **No persistence.** Every analysis is in-memory only; refreshing the page loses all state. There is no save, export, or session history.
- **The 8-relationship, 12-parameter seed set is intentionally small.** It covers every relationship pair explicitly named in FRF Master Specification §24.2, and nothing beyond that — it is not a comprehensive financial-parameter knowledge base.
- **`possible_explanations`, `evidence_to_check`, and `investigation_path` text is FinEve-authored prose**, grounded in but not extracted from the specification (§6). It should be read as investigation hypotheses, not verified financial fact — this is stated directly in the UI itself, not just in this document.
- **No accessibility audit has been performed.** Basic semantic HTML and `aria-labelledby`/`role="alert"` usage exists, but no formal screen-reader or keyboard-navigation testing has been done.
- **Production bundle size warning.** The Vite production build emits an informational (non-blocking) warning that the JS bundle exceeds 500 kB after minification (~501 kB / ~167 kB gzipped), largely attributable to the bundled SheetJS library. No code-splitting has been applied.

---

## 12. Notable Implementation Details Worth Knowing

- **File reading uses `FileReader`, not `File.prototype.arrayBuffer()`.** This was a deliberate choice made after `File.prototype.arrayBuffer()` was found to be unsupported in the jsdom test environment used by the UI test suite. `FileReader` has broader compatibility and was chosen as a fix rather than working around the test environment.
- **CSS `@import` ordering.** The Google Fonts `@import` in `src/ui/styles/index.css` must precede the `@tailwind` directives — `@import` is required by the CSS specification to come before all other rules except `@charset`. This was initially ordered incorrectly (Vite built successfully anyway, but it was a real spec violation) and was corrected during Phase 1.

---

## 13. What Is Explicitly Deferred to Phase 2

None of the following exist in the current codebase in any form — not stubbed with real logic, not partially implemented. The `ai/` and `evidence/` directories contain only placeholder `README.md` files stating this explicitly.

- AI-assisted hypothesis generation (LLM/SLM of any kind)
- RAG, embeddings, or vector database
- On-device / NPU / Snapdragon execution
- PDF ingestion, OCR, or any document/evidence processing
- Fuzzy or similarity-based parameter matching
- Multi-period / multi-year trend analysis (beyond the current two-period comparison)
- Multi-worksheet Excel support
- Authentication or user accounts
- A database or any server-side persistence
- Live market data or financial API integration
- Scoring, weighting, or confidence formulas of any kind (finding-level, category-level, or overall)
- DCF, LBO, or other valuation/forecasting models
- Stock prediction or autonomous investment recommendations
- Portfolio tracking or management
- Report export (PDF/Excel/shareable link)
- A knowledge base beyond the current 12-parameter, 8-relationship seed set

Phase 1's architectural boundaries (§1) were specifically designed so that when this work begins, it can consume `frf-engine/` and `pipeline/` output without requiring changes to either.
