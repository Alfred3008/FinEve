# FinEve
## Finance for Everyone
FinEve is an on-device, explainable financial research assistant evolved from the Financial Relationship Framework (FRF), a structured financial-analysis framework developed to help users interpret changes in financial statement parameters systematically. using local AI to connect financial changes, generate hypotheses, identify evidence, and support analyst decision-making on Snapdragon-powered HP AI PCs

Instead of treating financial metrics as isolated numbers, FinEve connects financial changes to related parameters, possible explanations, evidence to investigate, and potential business and investment interpretations.

The project is being developed toward an on-device AI experience for Snapdragon-powered HP AI PCs.

---

## The Problem

Financial analysis provides access to large amounts of information through spreadsheets, financial statements, annual reports and company disclosures.

However, identifying a change in a financial parameter is only the beginning.

For example:

```text
Revenue              ↑
Receivables          ↑↑
Operating Cash Flow  ↓
```

The user still needs to determine:

* Why might these changes have occurred?
* What other financial parameters should be examined?
* What evidence should be checked?
* Where can the explanation be verified?
* What might the verified evidence mean for the business?

FinEve addresses this reasoning gap by turning financial observations into structured investigation paths.

---

## The FRF Foundation

FRF stands for Financial Relationship Framework.

The original FRF concept formalizes the reasoning pathway around a financial parameter change:

```text
Financial Data
      ↓
Financial Parameter
      ↓
Observed Change
      ↓
Direction
      ↓
FRF Relationship
      ↓
Possible Explanation(s)
      ↓
Related Parameter(s)
      ↓
Evidence to Check
      ↓
Annual Report / Disclosure
      ↓
Analyst Verification
      ↓
Business Interpretation
      ↓
Investment Interpretation
```

The central question is:

> What changed? → Why might it have changed? → What should I examine next? → Where can I verify it? → What does the evidence mean?

The original FRF innovation was the structured formalization of financial reasoning around parameter changes. It does not claim that financial ratios, financial relationships, knowledge graphs or AI in finance are new inventions.

---

## Example

Consider:

```text
Revenue              +20%
Inventory            +100%
EBITDA Margin        -3 pp
Operating Cash Flow  -86.7%
```

FinEve is intended to move from observation to investigation:

```text
Revenue ↑
     +
Inventory ↑↑
     +
Margin ↓
     +
CFO ↓
     ↓
FRF Relationships
     ↓
Possible Explanations
     ↓
Evidence to Investigate
     ↓
Annual Report / Disclosure
     ↓
Verification
     ↓
Interpretation
```

Possible explanations may include inventory accumulation, weak sell-through, working-capital pressure or margin pressure.

These are investigation hypotheses, not established facts.

---

## What Makes FinEve Different

The core idea behind FinEve is to make financial reasoning more explicit and traceable.

```text
Parameter Change
      ↓
Relationship
      ↓
Possible Explanation
      ↓
Related Parameter
      ↓
Evidence to Check
      ↓
Verification
      ↓
Interpretation
```

Rather than stopping at:

> “What changed?”

FinEve is designed to help answer:

> “Why might it have changed?”

> “What should I investigate next?”

> “Where can I verify it?”

> “What does the evidence mean?”

---

## On-Device AI

FinEve is being developed to add a local AI reasoning layer to the existing FRF concept.

The intended architecture is:

```text
Financial Data
      ↓
Deterministic FRF Engine
      ↓
Parameter Changes + Relationships
      ↓
On-Device AI Reasoner
      ↓
Multiple Hypotheses
      ↓
Evidence to Investigate
      ↓
Local Document Verification
      ↓
Explainable Interpretation
      ↓
Human Review
```

The AI layer is intended to assist with:

* generating possible explanations
* interpreting contextual evidence
* summarizing financial disclosures
* suggesting further investigation
* comparing alternative hypotheses
* explaining financial relationships in natural language

Financial calculations and core FRF relationship logic remain deterministic wherever possible.

---

## Human-in-the-Loop

FinEve is designed as a decision-support system rather than an autonomous investment decision-maker.

### FRF Engine

```text
Financial calculations
Parameter mapping
Change detection
Relationship identification
Structured financial logic
```

### On-Device AI

```text
Hypothesis generation
Contextual reasoning
Evidence interpretation
Investigation suggestions
Natural-language explanation
```

### Human Analyst

```text
Evidence verification
Acceptance or rejection of hypotheses
Contextual judgment
Final financial or investment interpretation
```

A generated hypothesis is not treated as verified evidence.

---

## Snapdragon-Powered HP AI PCs

The competition-specific evolution of FRF is focused on on-device AI execution on Snapdragon-powered HP AI PCs.

The project is intended to explore:

```text
Local AI Inference
       +
NPU Acceleration
       +
Low-Latency Reasoning
       +
Reduced Dependence on Cloud Inference
```

The final AI model and deployment configuration will be selected and evaluated based on compatibility, performance and suitability for the target Snapdragon PC environment.

Performance measurements will be documented after actual hardware testing.

---

## Core Use Case

The initial development focus is a single end-to-end financial research workflow:

```text
Upload Financial Data
      ↓
Detect Financial Changes
      ↓
Identify FRF Relationships
      ↓
Generate Possible Explanations
      ↓
Identify Evidence to Check
      ↓
Search / Review Financial Documents
      ↓
Verify Evidence
      ↓
Generate Explainable Interpretation
```

The goal is to make this workflow functional before expanding into additional financial-analysis modules.

---

## Existing FRF Foundation

The existing FRF work provides the foundation for FinEve:

* structured financial-analysis framework
* financial parameter relationships
* deterministic calculations
* rule-based reasoning concepts
* Excel/CSV financial-data processing
* browser-based prototype architecture
* dashboard-oriented financial analysis

The original prototype was primarily based on React.js, TailwindCSS, SheetJS, structured FRF knowledge, deterministic calculations and rule-based reasoning.

---

## Proposed Technology Stack

### Frontend

```text
React
TailwindCSS
JavaScript / TypeScript
```

### Financial Data Processing

```text
SheetJS
Structured financial data
FRF parameter mapping
```

### FRF Knowledge

```text
JSON / Structured Financial Relationships
Parameters
Relationships
Possible Reasons
Verification Paths
```

### AI

```text
Compact on-device language model
Qualcomm AI Hub / compatible open-source model ecosystem
```

### Document Intelligence

```text
Local PDF processing
Local retrieval
Evidence extraction
```

### Deployment

```text
Windows on Snapdragon
HP Snapdragon-powered AI PC
```

The final implementation may evolve during development.

---

## Project Architecture

```text
                         USER
                           │
                           ▼
                Financial Data / Documents
                           │
                           ▼
                 ┌─────────────────────┐
                 │     FRF ENGINE      │
                 │                     │
                 │ Calculations        │
                 │ Mapping             │
                 │ Change Detection    │
                 │ Relationships       │
                 └──────────┬──────────┘
                            │
                            ▼
                   Structured FRF Context
                            │
                            ▼
                 ┌─────────────────────┐
                 │   ON-DEVICE AI      │
                 │                     │
                 │ Hypotheses          │
                 │ Reasoning           │
                 │ Evidence            │
                 │ Interpretation      │
                 └──────────┬──────────┘
                            │
                            ▼
                  Explainable Investigation
                            │
                            ▼
                       HUMAN REVIEW
```

---

## What FinEve Is Not

FinEve is not intended to be:

* a stock-price prediction engine
* an autonomous stock-picking system
* a replacement for equity analysts
* an accounting system
* an auditing system
* a guarantee of investment returns
* a generic financial chatbot

FinEve is intended to support structured financial investigation and human decision-making.

---

## Research Foundation

FinEve is built on the Financial Relationship Framework, whose development explored:

```text
Financial Statement Analysis
Financial Parameter Relationships
Cross-Statement Reasoning
Explainability
Evidence Verification
Financial Knowledge Representation
Rule-Based Financial Reasoning
AI-Assisted Financial Reasoning
```

The original FRF research preceded the current Snapdragon-specific AI adaptation.

---

## Roadmap

### Phase 1 — FRF MVP

```text
Financial Data
     ↓
Parameter Mapping
     ↓
Change Detection
     ↓
FRF Relationships
     ↓
Possible Explanations
```

### Phase 2 — Local AI

```text
FRF Context
     ↓
On-Device AI
     ↓
Multiple Hypotheses
     ↓
Reasoning Explanation
```

### Phase 3 — Evidence Investigation

```text
Annual Report / Financial Document
     ↓
Local Retrieval
     ↓
Relevant Evidence
     ↓
Hypothesis ↔ Evidence
```

### Phase 4 — Snapdragon Optimization

```text
Local Model
     ↓
Snapdragon Runtime
     ↓
NPU Execution
     ↓
Performance Benchmarking
```

### Phase 5 — Validation

```text
Prototype
     ↓
Technical Testing
     ↓
User Testing
     ↓
Performance Evaluation
     ↓
Competition Demonstration
```

---

## Project Status

Early-stage development.

The repository represents the evolution of the original Financial Relationship Framework toward FinEve, an on-device AI financial research application.

Planned development includes:

* on-device AI reasoning
* local financial-document analysis
* evidence-oriented investigation
* explainable hypothesis generation
* Snapdragon-specific AI deployment
* performance benchmarking
* end-to-end financial research workflow

Planned capabilities are not represented as completed implementations unless explicitly documented in this repository.

---

## Disclaimer

FinEve is a research and development project focused on explainable financial analysis and decision support.

The project does not establish investment outcomes, financial returns or production-level performance unless such results are explicitly measured and documented in this repository.

---

## Project Name

FinEve

Finance for Everyone

Built on the Financial Relationship Framework (FRF).
