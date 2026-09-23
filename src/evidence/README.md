# Evidence / Document Processing Module — Placeholder Only

This directory is a structural placeholder for future document and
evidence processing capability described in the FRF Master
Specification (§8.5, §4.3 items 45–50).

**No document processing code is implemented in this module during Phase 1.**

Per the approved Phase 1 architecture:
- This module must consume `frf-engine` output only — it must never be
  a dependency of `frf-engine`.
- No PDF upload, OCR, in-app viewer, or evidence-to-page linking exists here.
- No RAG or retrieval system exists here.

This file exists so the folder boundary is established in version
control before any evidence-processing code is written, per the
architecture approved prior to implementation.
