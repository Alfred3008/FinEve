# AI Module — Placeholder Only

This directory is a structural placeholder for the future on-device AI
reasoning layer described in the FinEve README and the FRF Master
Specification (§5, §12.6).

**No AI code is implemented in this module during Phase 1.**

Per the approved Phase 1 architecture:
- This module must consume `frf-engine` output only — it must never be
  a dependency of `frf-engine`.
- No LLM/SLM integration, RAG, embeddings, or vector database exists here.
- No model has been selected.
- On-device/NPU/Snapdragon execution is not implemented here.

This file exists so the folder boundary is established in version
control before any AI code is written, per the architecture approved
prior to implementation.
