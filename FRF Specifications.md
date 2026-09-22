# FRF Master Specification
## Complete Source-of-Truth Document — Sections 1–25

> Status note: This document consolidates the FRF information established across the project discussions and source materials. It preserves distinctions between established facts, planned/conceptual capabilities, illustrative assumptions, and information that was not established. It does not redesign or optimize FRF.

---

# 1. ORIGINAL IDEA

## 1.1 Core concept

FRF stands for Financial Relationship Framework.

The original research concept was titled:

> “A Financial Relationship Framework for Systematic Interpretation of Financial Statement Changes in Fundamental Equity Analysis.”

The central idea was to formalize the reasoning that occurs after an analyst observes a change in a financial statement parameter.

Instead of analysing financial ratios or parameters independently, FRF connects:

**Financial Parameter Change → Possible Business Explanations → Related Financial Parameters → Verification Guidance → Evidence → Business Interpretation → Investment Interpretation**

The objective was to make financial statement interpretation more systematic, reusable, evidence-based and traceable.

## 1.2 Original problem

Financial statement analysis contains abundant financial information, but the reasoning pathway connecting an observed financial change to:

- possible causes,
- related indicators,
- further investigation,
- evidence verification,
- business interpretation, and
- investment implications

is not systematically structured.

Experienced analysts may perform this reasoning implicitly through judgement and experience. FRF proposed making this reasoning explicit and reusable.

## 1.3 Original example

If reserves increase, possible explanations may include:

- higher retained earnings from profitability,
- profits retained for expansion,
- reserves associated with acquisition or strategic investment,
- transfers between reserves,
- lower dividend payout.

The framework can then connect the observation to related parameters such as:

- PAT,
- ROE,
- ROCE,
- operating margin,
- EPS,
- cash flow,
- gross block,
- capex,
- debt,
- investments,
- dividends.

The analyst can then examine relevant annual-report disclosures to determine which explanation is supported.

## 1.4 Original research objectives

1. Identify important financial parameters.
2. Develop structured relationships among them.
3. Identify possible business explanations for changes.
4. Provide annual-report verification paths.
5. Demonstrate improved consistency and quality in financial statement interpretation.

## 1.5 Original methodology

1. Collect financial parameters from NSE Academic database, company financial statements and standard reporting sources.
2. Classify parameters into categories such as profitability, liquidity, solvency, efficiency, growth, valuation, cash flow, capital structure and asset management.
3. Develop relationships for each parameter.
4. Associate each relationship with possible increase/decrease reasons.
5. Identify related parameters.
6. Define expected financial/business interpretations.
7. Define investment interpretations.
8. Identify evidence to check in annual reports and disclosures.
9. Construct the FRF.
10. Validate the framework against listed companies, industries and annual reports.
11. Conduct case-study analysis.

The exact completed validation dataset and final number of validated relationships were not established.

## 1.6 Original contribution

The original contribution was not the invention of financial ratios, financial statement analysis or investment interpretation.

The proposed contribution was the structured formalization of the reasoning chain surrounding a financial-parameter change.

The strongest formulation is:

> FRF attempts to turn implicit analyst reasoning around financial-parameter changes into an explicit, reusable, relationship-based and evidence-verifiable framework.

---

# 2. TARGET USER AND PERSONA

## 2.1 Original target users

The original target users included:

- finance students,
- new/junior equity analysts,
- investors,
- researchers,
- practitioners.

Students and new analysts were especially important in the earliest framing.

## 2.2 Later expanded users

Later discussions expanded the potential user base to:

- equity/investment analysts,
- finance professionals,
- consultants,
- auditors,
- credit analysts,
- portfolio managers,
- corporate finance teams,
- students,
- researchers,
- investors.

This was a scope expansion rather than documented abandonment of the original users.

## 2.3 Primary personas

### Persona 1 — Equity / Investment Analyst

Needs to:

- analyse company financial statements,
- identify meaningful changes,
- understand possible causes,
- investigate related parameters,
- verify explanations using company disclosures,
- document evidence,
- assess financial strength and risk.

### Persona 2 — Student / Researcher

Needs:

- structured financial-analysis guidance,
- reusable financial relationships,
- explanations of why metrics change,
- evidence locations,
- case-study support,
- educational interpretation,
- exportable research output.

### Persona 3 — Investor

Needs:

- understandable financial changes,
- explanations,
- evidence,
- financial-health assessment,
- risk,
- confidence,
- preliminary investment assessment.

### Persona 4 — Administrator

Maintains:

- financial parameters,
- categories,
- relationships,
- explanations,
- verification paths,
- investment implications,
- scoring rules,
- companies,
- users and roles.

## 2.4 User-role permissions

Later product architecture proposed:

- Analyst / Researcher: create and edit their own company analyses and evidence.
- Investor: primarily view and review.
- Administrator: maintain global FRF knowledge and scoring methodology.

The principle was to separate global FRF knowledge from analyst-specific company analysis.

---

# 3. USER JOURNEY

## 3.1 Core journey

The fundamental user journey is:

**Company → Financial Data → Financial Parameter → Observed Change → FRF Relationship → Possible Explanation → Related Parameter → Verification → Evidence → Interpretation → Score → Assessment**

## 3.2 Analyst workflow

1. Select company.
2. Import financial data.
3. Map financial data.
4. Identify financial parameters.
5. Calculate historical changes.
6. Determine direction.
7. Select a parameter.
8. Retrieve relevant FRF relationships.
9. Display possible explanations.
10. Display related parameters.
11. Display verification guidance.
12. Examine annual reports/disclosures.
13. Record evidence.
14. Record source.
15. Mark verification status.
16. Add analyst remarks.
17. Interpret the financial/business implications.
18. Interpret potential investment implications.
19. Score the finding.
20. Repeat for additional parameters.
21. Aggregate findings into category assessments.
22. Assess risk.
23. Assess confidence.
24. Produce an overall fundamental assessment.
25. Produce a preliminary investment assessment.
26. Generate a report.

## 3.3 Example journey

Example:

Revenue:

₹10,000 Cr → ₹8,800 Cr

Change:

-12%

The system can identify:

- possible reasons,
- related parameters,
- areas to investigate,
- disclosures to check.

The analyst verifies the explanation using company evidence and records the conclusion.

## 3.4 Admin workflow

Admin:

Login → FRF Management → Create/Edit Parameter → Define Directions → Define Relationships → Add Explanations → Add Verification Paths → Add Investment Implications → Save → Validate → Publish.

Published relationships become available to the reasoning engine.

---

# 4. CORE PRODUCT FEATURES

## 4.1 Original core

The original core consisted of:

- financial parameter library,
- financial parameter categories,
- parameter relationships,
- increase/decrease logic,
- possible explanations,
- related parameters,
- verification paths,
- investment interpretations.

## 4.2 Full planned MVP feature set

The documented complete MVP feature set contained 44 must-have features:

1. User registration/login
2. Role-based access
3. Company selection
4. Company profile
5. Financial data import
6. Financial data mapping
7. Financial parameter library
8. Parameter categories
9. Historical parameter view
10. Change calculation
11. Direction identification
12. FRF parameter lookup
13. Possible explanation display
14. Related-parameter recommendations
15. Relationship details
16. Verification guidance
17. Investment interpretation
18. Multi-parameter analysis workspace
19. Cross-parameter reasoning
20. Evidence entry
21. Source reference entry
22. Verification status
23. Analyst remarks
24. Finding-level scoring
25. Category scoring
26. Overall fundamental score
27. Risk assessment
28. Confidence assessment
29. Strengths/weaknesses summary
30. Preliminary investment assessment
31. Recommendation drill-down
32. Analysis history
33. Analysis dashboard
34. Financial trend charts
35. Category score visualization
36. FRF explorer
37. FRF relationship view
38. Analysis report
39. FRF administration
40. Relationship administration
41. Explanation administration
42. Verification-source administration
43. Scoring configuration
44. User/role management

## 4.3 Nice-to-have features

45. Annual-report PDF upload
46. Fiscal-year tagging
47. In-app PDF viewer
48. Document search
49. Evidence-to-page linking
50. Automatic financial-data extraction from PDFs
51. Multi-year trend analysis
52. Company comparison
53. Peer/industry comparison
54. Knowledge-graph visualization
55. Custom analysis templates
56. Custom category weights
57. Scenario analysis
58. Advanced filtering
59. Export to Excel
60. Export to PDF
61. Dashboard download/share
62. Email notifications
63. Analysis versioning

## 4.4 Later features

64. Live financial-data integration
65. Live market-price integration
66. Automated annual-report ingestion
67. AI-assisted annual-report analysis
68. AI-assisted evidence matching
69. AI-assisted FRF suggestions
70. Automated company screening
71. Portfolio tracking
72. Watchlists
73. Automated alerts
74. Collaborative analysis
75. Comments/review workflow
76. Advanced audit trail
77. Google/Microsoft social login
78. Institution/team accounts
79. Advanced AI financial-analysis agent
80. External research-data integrations

## 4.5 Core product boundary

The core product is:

**Company → Financial Change → FRF Relationship → Possible Explanation → Related Parameter → Verification → Evidence → Interpretation → Score → Fundamental Assessment**

The product is not primarily a PDF reader, live-data terminal, portfolio tracker or generic AI chatbot.

---

# 5. AI CAPABILITIES

## 5.1 Historical position

AI was not part of the original invention.

The original FRF was a structured financial relationship framework supported by deterministic calculations and rule-based reasoning.

AI appeared later as an extension:

**FRF Knowledge Base → AI Reasoning Layer → Multiple Hypotheses → Dynamic Investigation → Document Evidence → Confidence Revision → Cross-Statement Reasoning → Human Validation**

## 5.2 Planned/conceptual AI capabilities

The following were discussed as planned or conceptual:

1. AI-assisted financial reasoning
2. Parameter-first financial reasoning
3. AI hypothesis generation
4. Dynamic investigation engine
5. Annual-report verification
6. Evidence interpretation
7. Confidence revision
8. Missing-information detection
9. Contradicting-evidence detection
10. Cross-statement intelligence
11. Financial knowledge graph reasoning
12. Financial anomaly/inconsistency reasoning
13. AI summarization
14. AI report generation
15. AI investment interpretation
16. AI risk/opportunity identification
17. AI sensitivity/scenario reasoning
18. AI educational explanations
19. Document understanding
20. Table understanding

## 5.3 Not established

The following were not established as production implementations:

- specific LLM,
- specific SLM,
- GPT/Claude/Gemini production model,
- fine-tuned model,
- embeddings,
- vector database,
- reranker,
- production RAG,
- multi-agent framework,
- speech/voice,
- computer vision,
- chart-vision model,
- specialized table model,
- ML anomaly classifier,
- reinforcement learning,
- federated learning,
- on-device AI,
- NPU/edge AI.

Qualcomm/Snapdragon AI was not part of the original FRF.

## 5.4 AI design principle

The intended architecture was not:

**User question → Generic LLM → Financial answer**

Instead:

**Financial Observation → Curated FRF Knowledge → Hypotheses → Related Parameters → Evidence → Verification → Interpretation**

AI was intended to assist reasoning rather than replace the validated FRF knowledge base or human judgement.

---

# 6. FINANCIAL ANALYSIS CAPABILITIES

## 6.1 Core capabilities

Established/proposed core capabilities:

- financial statement analysis,
- income statement analysis,
- balance sheet analysis,
- cash flow analysis,
- ratio analysis,
- cross-statement analysis,
- parameter-change analysis,
- evidence-based financial interpretation.

## 6.2 Categories

The framework included or discussed:

- profitability,
- liquidity,
- solvency,
- efficiency/activity,
- growth,
- capital structure,
- cash flow,
- asset management,
- valuation.

The exact final taxonomy was not established.

## 6.3 Planned capabilities

- trend analysis,
- risk analysis,
- fundamental assessment,
- investment decision support,
- scenario analysis,
- sensitivity analysis,
- margin analysis,
- valuation,
- financial modelling.

However, valuation and financial modelling were broader capabilities rather than the strongest original FRF core.

## 6.4 Not core

The following were not established as core FRF capabilities:

- DCF,
- comparable-company valuation,
- precedent transactions,
- LBO modelling,
- comprehensive forecasting.

## 6.5 Strongest original capability

The strongest original capability was:

> Structured interpretation of relationships between financial parameters.

The core architecture is:

**Financial Statements → Financial Parameters → Parameter Changes → Relationships → Possible Business Explanations → Related Parameters → Disclosure Verification → Evidence → Business Interpretation → Investment Interpretation**

---

# 7. EXPLAINABILITY

## 7.1 Core explainability chain

**Financial Parameter Change → FRF Relationship → Possible Business Explanation → Related Financial Parameter → Verification Guidance → Company Evidence → Business Interpretation → Investment Interpretation**

## 7.2 Data lineage

**Source Financial Data → Financial Parameter → Observed Change → FRF Relationship → Possible Explanation → Evidence → Verification Status → Finding Score → Category Assessment → Overall Assessment**

## 7.3 Strongest established explainability structure

The strongest established mechanism was:

**Parameter → Observation → Related Parameter → Relationship → Possible Reason → Evidence to Check**

## 7.4 Verification workflow

1. Identify financial change.
2. Retrieve relevant FRF relationships.
3. Generate/view possible explanations.
4. Identify related parameters.
5. Identify evidence to check.
6. Examine annual report/disclosures.
7. Record supporting evidence.
8. Record source.
9. Mark verification status.
10. Add analyst remarks.
11. Interpret financial/investment implications.
12. Score the finding.

## 7.5 Confidence

Confidence was planned to reflect evidence and verification coverage.

A conceptual example was:

**Verified FRF relationships / Total relationships**

The final confidence formula was not established.

## 7.6 Hallucination control

The intended control mechanism was:

**FRF/AI Hypothesis → Evidence Requirement → Source Verification → Human Validation → Final Interpretation**

A generated explanation is not treated as proof.

## 7.7 Explainability status

Planned/conceptual:

- source citations,
- page-level references,
- evidence extraction,
- calculation visibility,
- formula visibility,
- assumptions,
- evidence drill-down,
- automated source consistency checking.

---

# 8. DOCUMENT AND DATA INPUTS

## 8.1 Core inputs

- financial statements,
- income statements,
- balance sheets,
- cash-flow statements,
- annual reports,
- company disclosures,
- Excel,
- CSV,
- structured tables,
- analyst notes,
- company filings.

## 8.2 Planned/compatible inputs

- quarterly reports,
- earnings reports,
- investor presentations,
- earnings transcripts,
- research notes,
- PDFs.

## 8.3 Excel/CSV workflow

**Upload → Financial Data Mapping → Parameter Identification → Historical Values → Change Calculation → Direction → FRF Lookup**

## 8.4 Annual-report workflow

**Financial Change → FRF Relationship → Possible Explanation → Evidence to Check → Annual Report → Disclosure → Analyst Verification**

Potential evidence areas include:

- MD&A,
- notes to accounts,
- segment information,
- working capital,
- capex,
- inventory,
- other disclosures.

## 8.5 PDF processing

Planned:

- annual-report PDF upload,
- fiscal-year tagging,
- in-app PDF viewer,
- document search,
- evidence-to-page linking,
- automatic financial-data extraction.

These were later/nice-to-have capabilities, not established production functionality.

## 8.6 Data-quality issues

Known issues include:

- inconsistent parameter names,
- missing values,
- different reporting structures,
- different units,
- different reporting periods,
- manual entry errors,
- possible mapping errors.

A complete automated data-quality framework was not established.

---

# 9. OUTPUTS

## 9.1 Core output chain

**Financial Data → Parameter Change → FRF Explanation → Related Parameters → Verification → Evidence → Interpretation → Score → Category Assessment → Overall Assessment → Preliminary Investment Assessment**

## 9.2 Outputs

The system can conceptually produce:

- financial parameter values,
- historical values,
- parameter changes,
- direction,
- ratio/parameter analysis,
- FRF relationships,
- possible explanations,
- related-parameter recommendations,
- verification guidance,
- evidence,
- source references,
- investment interpretation,
- finding-level scores,
- category assessments,
- overall fundamental assessment,
- risk analysis,
- confidence assessment,
- strengths/weaknesses summary,
- preliminary investment assessment,
- reports,
- tables,
- charts,
- FRF relationship views,
- citations/source references,
- calculation visibility,
- formula visibility.

## 9.3 Report structure

1. Executive summary
2. Financial overview
3. Key financial findings
4. FRF reasoning summary
5. Category assessment
6. Risk assessment
7. Confidence/verification
8. Overall assessment
9. Detailed evidence appendix

## 9.4 Traceability

A report should allow the user to trace:

**Overall Score → Category → Finding → Parameter → FRF Relationship → Evidence**

## 9.5 Output generation types

### Calculated
- financial changes,
- ratios,
- scores,
- category scores,
- overall scores,
- charts.

### FRF-retrieved
- relationships,
- explanations,
- related parameters,
- verification guidance.

### Analyst-entered/retrieved
- evidence,
- source,
- remarks,
- verification.

### Combined
- investment interpretation,
- assessment,
- report.

### Future AI-generated
- hypotheses,
- evidence interpretation,
- summaries,
- reports,
- risk/opportunity analysis.

---

# 10. PRODUCT ARCHITECTURE

## 10.1 Implemented/documented prototype architecture

The documented prototype architecture was:

**React.js + TailwindCSS + SheetJS + JSON FRF Knowledge Base + Rule Engine + Financial Calculations + Dashboard + Netlify**

## 10.2 Prototype components

- React.js frontend
- TailwindCSS
- SheetJS (`xlsx`) for Excel processing
- JSON FRF knowledge base
- rule/logic engine
- deterministic financial calculations
- dashboard/visualization
- static Netlify hosting
- local/client-side processing/persistence concepts.

## 10.3 Example FRF JSON

```json
{
  "parameter_id": "P_001",
  "name": "Revenue from Operations",
  "category": "Growth",
  "is_positive_indicator": true,
  "linked_parameters": [
    "P_005 (Receivables)",
    "P_012 (Inventory)"
  ]
}
```

## 10.4 Planned production architecture

Later discussions proposed:

- React/Vite,
- modular engines,
- Supabase PostgreSQL,
- Supabase Auth,
- Supabase Storage,
- Supabase Edge Functions,
- role-based access,
- database-backed FRF knowledge layer,
- production API/server layer.

## 10.5 Proposed data model

Potential entities:

- users,
- roles,
- companies,
- financial_years,
- parameters,
- parameter_categories,
- parameter_values,
- relationships,
- explanations,
- verification_paths,
- investment_implications,
- analyses,
- analysis_findings,
- evidence,
- scores,
- category_assessments,
- overall_assessments,
- scoring_rules.

## 10.6 Architecture separation

### FRF knowledge layer

**Parameter → Relationship → Possible Explanation → Related Parameter → Verification Path → Investment Implication**

### Company analysis layer

**Company → Financial Year → Parameter Value → Observed Change → FRF Relationship → Evidence → Verification Status → Score → Assessment**

## 10.7 Conceptual AI/document architecture

Later conceptual architecture:

**Documents → Processing → Retrieval/RAG → AI Reasoning → FRF Knowledge Base → Evidence Verification → Human Validation**

No production implementation of this architecture was established.

---

# 11. CURRENT PROTOTYPE / BUILD STATUS

## 11.1 Overall status

There were multiple stages/versions rather than one continuously maintained production application.

There is no single verified current production build with a complete test report.

## 11.2 Original prototype

Documented capabilities:

- React.js,
- TailwindCSS,
- JSON FRF,
- rule/logic engine,
- financial calculations,
- Excel processing through SheetJS,
- parameter calculations,
- percentage change,
- direction identification,
- parameter lookup,
- basic scoring,
- linked parameters,
- rule-based reasoning,
- dashboard/visualization,
- static deployment architecture.

## 11.3 Partially implemented

- multi-parameter reasoning,
- basic relationship logic,
- scoring,
- local persistence.

These were not established as complete production workflows.

## 11.4 Planned/placeholder

- analysis engine,
- advanced scoring engine,
- recommendation engine,
- advanced charts,
- reporting,
- database,
- document processing,
- AI layer,
- evidence automation,
- complete confidence engine.

## 11.5 Prototype pages/modules discussed

- `index.html`
- `dashboard.html`
- `analysis.html`
- `decision.html`

Later modules included:

- `utils.js`
- `frf_engine.js`
- `analysis_engine.js`
- `scoring_engine.js`
- `recommendation_engine.js`
- `charts.js`
- `main.js`

## 11.6 Existing workflow

**Select Company → Select Parameter → Observe Change → Direction → FRF Lookup → Possible Explanations → Related Parameters → Evidence to Check**

## 11.7 Deployment

Static Netlify deployment was documented for the prototype.

Complete production deployment was not established.

## 11.8 AI status

The original prototype was primarily rule-based and deterministic.

No specific production:

- LLM,
- RAG,
- embedding model,
- vector database,
- multi-agent system

was established.

---

# 12. IDEA EVOLUTION / TIMELINE

## 12.1 Evolution

```text
ORIGINAL RESEARCH FRF
        ↓
Structured Financial Relationship Framework
for Fundamental Equity Analysis
        ↓
FRF Knowledge Base / Financial Relationship Database
        ↓
FRF Software Prototype
React + JSON + Rule Engine + Excel Processing
        ↓
Explainable Financial Intelligence Platform
        ↓
AI-Powered FRF
AI reasoning over curated FRF knowledge
        ↓
Current documented FRF concept
Interconnected, evidence-driven financial reasoning platform
```

## 12.2 Stage 1 — Original research framework

The original concept focused on:

- financial statement changes,
- relationships,
- possible explanations,
- related parameters,
- evidence verification,
- business interpretation,
- investment interpretation.

AI was not the original foundation.

## 12.3 Stage 2 — Relationship database

The concept was formalized into a reusable relationship database.

The core schema was:

**Parameter → Observation/Direction → Related Parameter → Relationship → Possible Reason → Evidence to Check**

## 12.4 Stage 3 — Software prototype

The framework was translated into software using:

- React.js,
- TailwindCSS,
- SheetJS,
- JSON,
- rule/logic engine,
- financial calculations,
- dashboard,
- static deployment.

## 12.5 Stage 4 — Explainable Financial Intelligence Platform

The scope expanded to include:

- financial analysis,
- reasoning,
- evidence,
- verification,
- interpretation,
- scoring,
- confidence,
- reporting.

## 12.6 Stage 5 — AI-assisted FRF

AI became a later implementation layer.

The intended evolution was:

**Curated FRF Knowledge → AI Reasoning → Hypotheses → Investigation → Evidence → Confidence → Human Validation**

## 12.7 Name evolution

Names used/discussed included:

- Financial Relationship Framework (FRF)
- A Financial Relationship Framework for Systematic Interpretation of Financial Statement Changes in Fundamental Equity Analysis
- Financial Relationship Framework — An Explainable Financial Intelligence Platform
- AI-Powered Financial Relationship Framework (FRF) Web Application
- Financial Intelligence Platform

## 12.8 What did not change

The core remained:

**Connect financial parameters → structure reasoning → investigate evidence → interpret implications**

Exact dates separating every stage were not established.

---

# 13. ORIGINAL INNOVATION / NOVELTY

## 13.1 What FRF was not claiming

FRF did not claim to invent:

- financial ratios,
- financial statement analysis,
- relationships between financial variables,
- annual-report analysis,
- qualitative interpretation,
- investment analysis,
- knowledge graphs,
- AI in finance.

## 13.2 Original innovation claim

The strongest documented novelty claim is:

> FRF was conceived as a structured framework for formalizing the reasoning that occurs after a financial statement change is observed. Rather than stopping at individual ratios or financial metrics, it proposed mapping a parameter's change to alternative business explanations, related parameters for further investigation, specific disclosure locations for verification, and potential business and investment interpretations.

## 13.3 Core distinctive combination

The potentially distinctive combination is:

1. Parameter-level relationships.
2. Direction-specific reasoning.
3. Multiple possible business explanations.
4. Related-parameter investigation.
5. Verification paths in annual reports/disclosures.
6. Business interpretation.
7. Investment interpretation.

## 13.4 Key phrase

> **“What changed?” → “Why?” → “What next?” → “Where to verify?” → “What might it mean?”**

## 13.5 Example

Revenue increases while receivables also increase and CFO declines.

FRF can connect the observations and prompt the analyst to investigate:

- credit terms,
- collection issues,
- revenue quality,
- working capital,
- customer concentration,
- related disclosures.

The framework does not automatically establish that any explanation is true; evidence must be checked.

## 13.6 Existing frameworks considered

### Palepu et al.

Covers:

- business strategy analysis,
- accounting analysis,
- financial analysis,
- prospective analysis.

FRF differs in emphasis by operating at a more detailed parameter-level reasoning layer.

### CFA financial statement analysis

Covers:

- defining purpose/context,
- data collection,
- processing,
- analysis/interpretation,
- communication,
- follow-up.

FRF focuses more narrowly on the reasoning path following a parameter change.

### Fridson & Alvarez

Provides practitioner-oriented interpretation, accounting distortions, red flags and judgement.

FRF differs in formalizing reusable parameter relationships and verification paths.

## 13.7 Knowledge graph research

Financial knowledge graphs already exist.

Examples discussed included:

- Cai & Xie (2024): financial-statement fraud-detection knowledge graph.
- Mohsin et al. (2024): semantic-web knowledge graph from annual financial reports.

These demonstrate that financial-variable relationships and financial knowledge graphs are not themselves novel.

FRF's differentiation is the proposed human analyst workflow built around parameter changes, alternative explanations, investigation paths and verification.

## 13.8 Research-gap formulation

The defensible research-gap statement is:

> No paper was identified in the reviewed material that explicitly combined a large set of fundamental-analysis parameters, direction-specific explanations, related parameters, expected business/investment interpretation, specific annual-report sections for verification, and a reusable human-oriented reasoning framework.

This is a research-gap observation, not a universal proof of absence.

## 13.9 Important novelty caveats

Do not claim:

- “first,”
- “world’s first,”
- “unique,”
- “no one has done this,”

unless independently verified.

The strongest historical distinction is:

> **The original FRF innovation was not “using AI for finance”; it was the attempt to turn implicit analyst reasoning around financial-parameter changes into an explicit, reusable, relationship-based and evidence-verifiable framework.**

---

# 14. BUSINESS VALUE

## 14.1 Core customer problem

Financial information is abundant, but the reasoning from:

**“What changed?” → “Why?” → “What else should I examine?” → “Where can I verify it?” → “What does it mean?”**

can be difficult and experience-dependent.

## 14.2 Intended value

FRF is intended to:

- structure investigation,
- reduce unstructured searching,
- identify related parameters,
- identify relevant evidence locations,
- improve traceability,
- improve consistency,
- support learning,
- support research,
- support decision-making.

## 14.3 Productivity

Potential productivity benefits were discussed, particularly in:

- investigation initiation,
- related-parameter identification,
- evidence-location identification,
- repeated financial analysis.

However:

- time saved was not measured,
- percentage productivity improvement was not established,
- cost reduction was not measured.

## 14.4 Quality

Potential improvements include:

- research consistency,
- transparency,
- traceability,
- completeness,
- reduction of omission,
- reduced unsupported explanations.

No controlled empirical measurement was completed.

## 14.5 Decision support

The later product concept included:

- finding scores,
- category scores,
- overall fundamental score,
- risk,
- confidence,
- strengths/weaknesses,
- preliminary investment assessment.

These were intended as decision-support outputs, not autonomous stock-picking.

## 14.6 Business models discussed

Potential models:

- B2C subscription,
- B2B SaaS,
- B2B2C educational/institutional,
- enterprise licensing,
- per-user professional subscription,
- per-student institutional pricing.

No model was commercially validated.

## 14.7 Commercial status

Not established:

- paying customers,
- revenue,
- validated pricing,
- willingness-to-pay,
- CAC,
- LTV,
- conversion,
- retention,
- enterprise contracts.

## 14.8 Potential KPIs

Potential product KPIs include:

- companies analysed,
- parameters analysed,
- analyses created,
- analysis completion,
- reports generated,
- FRF relationship usage,
- verification rate,
- evidence coverage,
- source-reference coverage,
- confidence,
- analysis time,
- report preparation time.

These are proposed metrics, not validated business results.

## 14.9 Business-value conclusion

The documented value proposition is:

> FRF's value lies in structuring financial-analysis reasoning so that research can become more systematic, consistent, traceable and evidence-based.

No measured business impact has been established.

---

# 15. SECURITY AND PRIVACY

## 15.1 Original privacy principle

The original prototype emphasized client-side processing.

The intended flow was:

**Raw Financial Statement → Browser → SheetJS → JSON → Calculations → Relationship Detection → Rule Engine → Interpretation → Dashboard**

The original core workflow did not require uploading financial files to a central server.

## 15.2 Privacy rationale

The project discussions identified a concern with uploading sensitive or unreleased corporate financial information to public LLM services.

The local-processing architecture was positioned as a privacy-oriented alternative.

Important distinction:

Claims such as “nothing leaves this device” or “absolute confidentiality” were source positioning statements, not the result of an independent security audit.

The narrower architectural fact is that the original Excel workflow was designed for browser-local processing.

## 15.3 Data handled

Potentially handled data includes:

- financial statements,
- company financial information,
- manually entered values,
- analysis inputs,
- analyst evidence,
- source references,
- analyst remarks.

A complete PII architecture was not established.

## 15.4 Authentication

Original prototype:

- no mandatory authentication for core processing,
- Firebase authentication was discussed as optional.

Later architecture:

- email/password authentication,
- role-based access,
- user management.

These later capabilities were planned rather than established production functionality.

## 15.5 Storage

Original:

- local/browser processing,
- JSON knowledge base,
- no central financial-file storage required for the core workflow.

Later:

- Supabase PostgreSQL,
- Supabase Storage,
- persistent analyses.

## 15.6 Security architecture not established

The following were not formally established:

- security audit,
- encryption architecture,
- formal retention policy,
- formal privacy policy,
- compliance certification,
- privacy impact assessment,
- production penetration testing,
- enterprise security architecture.

## 15.7 Known security/data risks

1. Sensitive financial data.
2. Incorrect or manipulated Excel inputs.
3. GIGO.
4. Accounting manipulation.
5. Missing qualitative context.
6. Industry-specific interpretation errors.
7. Public LLM data-transmission concerns.

## 15.8 GIGO

The framework cannot automatically guarantee that the input financial data is correct.

If incorrect or manipulated financial information is supplied, deterministic rules may interpret it as truth.

This was explicitly recognized as a limitation.

## 15.9 Privacy conclusion

The original FRF prototype was designed around local/client-side processing.

Later cloud, authentication, database and storage architecture was planned.

Formal security, compliance and privacy validation was not established.

---

# 16. LIMITATIONS AND CRITICISMS

## 16.1 Knowledge-base dependency

FRF depends heavily on the quality and completeness of its underlying relationships.

If relationships are:

- missing,
- incorrect,
- oversimplified,
- industry-inappropriate,

the resulting interpretation can be incomplete or incorrect.

## 16.2 Human judgement

FRF cannot replace experienced financial judgement.

Real-world interpretation may require:

- industry context,
- management intent,
- macroeconomic context,
- competitive dynamics,
- regulatory context,
- unusual events,
- qualitative information.

## 16.3 First-pass boundary

FRF was primarily intended as a structured first-pass financial reasoning and investigation system.

It was not intended to replace:

- detailed financial modelling,
- DCF,
- LBO analysis,
- comprehensive equity research,
- professional investment committees.

## 16.4 Technical limitations

Original client-side architecture creates limitations around:

- persistence,
- centralized storage,
- collaboration,
- multi-user access,
- enterprise administration.

Later database architecture was proposed to address these limitations.

## 16.5 AI limitations

Future AI could generate:

- plausible but unsupported explanations,
- incorrect interpretations,
- incomplete evidence links.

The intended mitigation is:

**Hypothesis → Evidence Requirement → Source Verification → Human Validation**

## 16.6 Financial-analysis limitations

Known limitations:

- GIGO,
- accounting manipulation,
- missing qualitative context,
- false positives,
- false negatives,
- industry differences,
- mapping errors,
- missing values,
- inconsistent reporting structures.

## 16.7 Industry limitations

Generic rules may not fit every industry.

For example, banks have financial statement structures and operating drivers that differ significantly from manufacturing companies.

Industry-specific modes were discussed but not comprehensively implemented.

## 16.8 Scoring limitations

The scoring system was conceptual and relatively simple.

Weights, thresholds and confidence formulas were not empirically validated.

## 16.9 Scalability limitations

No formal benchmarks established:

- maximum users,
- maximum companies,
- maximum parameters,
- maximum file size,
- concurrent users,
- throughput,
- latency.

## 16.10 Adoption criticism

An experienced analyst may already perform much of the reasoning manually.

Possible adoption objections include:

- “Experienced analysts already do this.”
- “This is just ratio analysis.”
- “Rules are too rigid.”
- “The input data may be wrong.”
- “The system cannot understand real-world context.”
- “It is not enough for serious investment analysis.”
- “Why pay for it?”
- “Why trust the score?”

## 16.11 Most important limitation

The most important historical assessment is:

> **FRF's main limitation is not the absence of financial logic, but the boundary between deterministic financial relationships and the contextual judgement required to understand why those relationships occurred and what they ultimately mean for a particular business.**

---

# 17. ORIGINAL PRODUCT POSITIONING

## 17.1 One-line pitch

> **FRF is a structured framework that connects changes in financial statement parameters to possible business explanations, related financial parameters, verification paths, and investment implications.**

## 17.2 Elevator pitch

> **FRF is a financial-analysis framework designed to help analysts move beyond individual financial ratios and numbers. When a financial parameter changes, FRF connects that observation to possible business explanations, related parameters that should be investigated, relevant annual-report or disclosure areas where the explanation can be verified, and potential business and investment implications. The objective is to make financial-analysis reasoning more systematic, reusable and evidence-based rather than relying entirely on individual analyst experience.**

## 17.3 Problem statement

> **“Financial statement analysis contains abundant financial information, but the reasoning pathway connecting an observed financial change to possible causes, related indicators, evidence verification and investment interpretation is not systematically structured.”**

## 17.4 Solution statement

> **FRF formalizes the financial-analysis reasoning process by creating relationships between financial parameters and associating those relationships with possible explanations, related parameters, verification sources and investment interpretations.**

## 17.5 Value proposition

> **FRF helps users turn a financial-number change into a structured investigation by showing why the change might have occurred, what related parameters to examine, where to verify the explanation, and what the evidence could mean for the business and investment analysis.**

## 17.6 Product vision

> **To create a comprehensive Financial Relationship Framework connecting hundreds of financial parameters into a structured knowledge system for systematic interpretation of financial statement changes.**

“Hundreds” is a conceptual scale description; the exact production count was not established.

## 17.7 Positioning evolution

- Financial Relationship Framework
- Fundamental equity-analysis framework
- Explainable Financial Intelligence Platform
- AI-Powered FRF Web Application
- Financial Intelligence Platform

The core positioning remained:

**Connect financial parameters → structure reasoning → investigate evidence → interpret implications**

## 17.8 Generic AI distinction

Generic AI:

**User Question → AI Answer**

FRF:

**Financial Observation → Structured Relationships → Possible Hypotheses → Related Parameters → Verification → Evidence → Interpretation**

---

# 18. ALL EXISTING RESEARCH

## 18.1 Nature of existing research

The research conducted around FRF included:

- literature-gap research,
- financial-analysis framework research,
- knowledge-graph research,
- competitor/alternative research,
- prototype feasibility,
- architecture research,
- AI capability exploration,
- privacy/security research,
- business-model exploration.

It did not establish commercial validation or empirical investment performance.

## 18.2 Traditional financial-analysis research

Reviewed areas included:

- profitability,
- liquidity,
- solvency,
- efficiency/activity,
- growth,
- cash flow,
- ratios,
- financial performance,
- accounting quality,
- business analysis,
- forecasting,
- valuation.

The conclusion was that these areas are extensively researched.

## 18.3 Palepu framework

Palepu and related business-analysis frameworks cover:

- business strategy analysis,
- accounting analysis,
- financial analysis,
- prospective analysis.

FRF differs by focusing on a detailed parameter-level reasoning chain.

## 18.4 CFA framework

CFA financial statement analysis frameworks cover:

1. define purpose/context,
2. collect data,
3. process data,
4. analyse/interpret,
5. communicate,
6. follow up.

FRF focuses more narrowly on the reasoning that follows a specific observed financial change.

## 18.5 Fridson & Alvarez

Practitioner-oriented financial analysis includes:

- interpretation,
- accounting distortions,
- earnings quality,
- red flags,
- credit analysis,
- judgement.

FRF's distinction is formalizing parameter-by-parameter relationship and verification paths.

## 18.6 Specific research examples

Discussed literature included:

- Yolanda et al. (2025): financial statement analysis using liquidity, solvency, activity and profitability ratios.
- Tripathi et al. (2021): financial statements supporting assessment of business performance and strategy.
- Jackson (2021): fundamental-analysis literature involving accruals, cash flows, margins and market relationships.

These demonstrate extensive existing financial-analysis research.

## 18.7 Knowledge-graph research

### Cai & Xie (2024)

A two-layer knowledge graph was discussed for financial-statement fraud detection.

It demonstrates that financial-variable relationships can be structured, but its objective differs from FRF.

### Mohsin et al. (2024)

A semantic-web knowledge graph was discussed for annual financial reports, especially banks/financial institutions.

It focuses on terminology standardization and queryability rather than the full human analyst reasoning workflow proposed by FRF.

## 18.8 Competitor research

No single commercial product was established as an exact direct competitor.

Alternatives examined included:

- Excel/manual analysis,
- financial screeners,
- financial data platforms,
- traditional frameworks,
- textbooks,
- analyst workflows,
- annual reports,
- knowledge graphs,
- financial information extraction systems,
- generic AI.

## 18.9 Validation research

A proposed validation methodology was:

1. Select listed companies across industries.
2. Identify significant financial changes.
3. Generate FRF explanations.
4. Check annual reports, MD&A and notes.
5. Determine whether explanations are supported.
6. Classify explanations as supported, partial or unsupported.
7. Refine the framework.

No completed validation dataset or statistical result was established.

## 18.10 Benchmark research

A proposed benchmark was:

**FRF-guided analysis vs traditional ratio-by-ratio analysis**

Potential measures:

- consistency,
- completeness,
- speed,
- supported interpretations,
- evidence coverage.

This benchmark was proposed, not completed.

## 18.11 Market research status

Not established:

- TAM/SAM/SOM,
- statistically significant customer survey,
- willingness-to-pay study,
- validated pricing,
- CAC,
- retention,
- market share,
- competitor revenue comparison.

## 18.12 Technical research

Prototype feasibility was demonstrated conceptually through:

**React.js + TailwindCSS + SheetJS + JSON + Rule Engine + Financial Calculations + Dashboard + Netlify**

Production feasibility was not established.

---

# 19. IMPORTANT NUMBERS / FACTS / ASSUMPTIONS

## 19.1 Core scale

“Hundreds of financial parameters” was a conceptual target.

The exact number of:

- parameters,
- relationships,
- explanations,
- verification paths

was not established.

## 19.2 Illustrative workload claim

One source described an example:

- 40 ratios,
- 4 hours of human work,
- 4 seconds for FRF.

This should be treated as an illustrative/unvalidated claim, not a benchmark.

## 19.3 Other illustrative examples

### Meridian Consumer Goods

- Revenue: $100M → $120M
- Revenue growth: +20%
- Inventory: $20M → $40M
- Inventory growth: +100%
- EBITDA margin: 15% → 12%
- CFO: $15M → $2M
- CFO change: approximately -86.67%

This was a hypothetical example.

### TCS illustration

- Revenue growth: +8%
- Employee-cost growth: +12%
- Operating margin: decreased.

Illustrative only.

## 19.4 Example confidence assumptions

Examples used:

- 50 parameters,
- 2 parameters,
- verified relationships / total relationships.

These were hypothetical.

## 19.5 Earlier scoring model

An illustrative model included:

- Solvency/Cash Flow weight: 3×
- Efficiency/Liquidity: 2×
- Growth/Asset Management: 1×
- Debt-to-Equity threshold: 3.0×
- Current Ratio threshold: 1.0
- Overall score >80: Healthy
- Overall score <40: Critical

Formula:

**Score = Σ(Parameter_Delta_Score × Category_Weight) − Relationship_Penalties**

This was proposed, not validated.

## 19.6 Later category weights

One later illustrative weighting:

- Profitability: 25%
- Growth: 20%
- Liquidity: 15%
- Solvency: 15%
- Cash Flow: 15%
- Valuation: 10%

Another earlier conceptual weighting:

- Profitability: 25%
- Growth: 20%
- Cash Flow: 20%
- Solvency: 15%
- Liquidity: 10%
- Valuation: 10%

These represent evolution/alternative proposals rather than one final validated methodology.

## 19.7 Illustrative dashboard

Example:

- Profitability: 22/25
- Liquidity: 12/15
- Solvency: 13/15
- Growth: 16/20
- Cash Flow: 15/15
- Valuation: 9/10
- Overall: 87/100
- Confidence: High
- Financial Health: Excellent
- Risk: Low
- Recommendation: BUY

All values were illustrative/demo values.

## 19.8 Illustrative recommendation thresholds

- 90–100: Strong Buy
- 80–89: Buy
- 65–79: Hold
- 50–64: Watch
- Below 50: Avoid

These were hypothetical and not validated.

## 19.9 Verification example

- 12 parameters analysed
- 10 verified
- 2 need review
- 0 not started
- Verification: 10/12 = 83.33%
- Needs review: 2/12 = 16.67%

Illustrative.

## 19.10 Subjective evaluation

An earlier subjective evaluation included:

- Ease: 9/10
- Financial Logic: 8/10
- Scalability: 10/10
- Educational Value: 9/10
- Decision Support: 8/10
- Professional Usefulness: 7/10
- Innovation: 8/10

These were subjective assessments, not empirical measurements.

## 19.11 Other facts

The prototype architecture included:

- React.js,
- TailwindCSS,
- SheetJS,
- JSON,
- Netlify/static hosting,
- no backend for the original core engine,
- optional/discussed Firebase authentication.

## 19.12 Feature counts

The documented feature prioritization contained:

- 80 total features,
- 44 must-have,
- 19 nice-to-have,
- 17 later.

## 19.13 Not established

No validated figures exist for:

- users,
- paying customers,
- revenue,
- pricing,
- WTP,
- CAC,
- LTV,
- conversion,
- retention,
- investment returns,
- Sharpe ratio,
- alpha,
- hit rate,
- drawdown,
- time improvement,
- accuracy improvement,
- analyst agreement,
- validation support rate,
- production concurrency,
- database performance,
- AI latency,
- PDF processing latency,
- operating cost.

---

# 20. SECTION 20 — STATUS / SOURCE-OF-TRUTH CLASSIFICATION

This section consolidates how information in the FRF specification should be interpreted.

## 20.1 Established / clearly documented

- FRF name.
- Fundamental equity-analysis scope.
- Parameter-level financial relationships.
- Possible explanations.
- Related parameters.
- Verification paths.
- Evidence-based interpretation.
- Human-in-the-loop principle.
- Original rule-based architecture.
- React/Tailwind/SheetJS/JSON prototype.
- Local/client-side processing.
- Financial parameter change calculation.
- Direction identification.
- Basic scoring.
- Dashboard/prototype concept.
- Research-gap focus.
- Known limitations.

## 20.2 Planned / conceptual

- Full production web application.
- Supabase database.
- Authentication and role management.
- Advanced evidence management.
- PDF ingestion.
- OCR.
- RAG.
- Embeddings.
- AI reasoning.
- Dynamic investigation.
- Automated evidence matching.
- Confidence engine.
- Knowledge graph visualization.
- Live financial APIs.
- Automated report generation.
- Advanced AI financial analyst.

## 20.3 Illustrative / hypothetical

- Hundreds of parameters.
- 4-hour/40-ratio/4-second comparison.
- Example scoring thresholds.
- Example category weights.
- 87/100 dashboard.
- Meridian example.
- TCS example.
- 12-parameter verification example.
- Subjective 1–10 evaluations.

## 20.4 Not established

- Exact FRF database size.
- Exact production relationship count.
- Production AI model.
- Production RAG.
- Production vector database.
- Production multi-agent system.
- Commercial validation.
- User-study results.
- Investment backtest.
- Security audit.
- Formal compliance certification.
- Validated scoring accuracy.
- Validated productivity improvement.

---

# 21. COMPETITOR / ALTERNATIVE LANDSCAPE

## 21.1 Direct competitors

No single exact direct commercial competitor was established in the documented research.

## 21.2 Excel / manual analysis

### Strengths

- flexible,
- familiar,
- strong calculation capability,
- easy data manipulation.

### Overlap with FRF

- financial calculations,
- financial statement analysis.

### FRF distinction

FRF adds a structured reasoning layer connecting:

**Change → Explanation → Related Parameter → Verification → Evidence → Interpretation**

## 21.3 Financial screeners and data platforms

### Strengths

- financial data,
- ratios,
- trends,
- filters,
- market information.

### FRF distinction

FRF focuses on why a parameter may have changed and what should be investigated next.

## 21.4 Traditional financial-analysis frameworks

### Strengths

- established methodology,
- broad financial-analysis coverage,
- professional educational value.

### FRF distinction

FRF operates at a more detailed parameter-level reasoning layer.

## 21.5 Manual analyst workflow

### Strengths

- contextual judgement,
- flexibility,
- qualitative understanding,
- industry knowledge.

### FRF distinction

FRF attempts to make parts of this reasoning:

- structured,
- reusable,
- traceable,
- teachable.

FRF does not eliminate human judgement.

## 21.6 Knowledge graphs

### Strengths

- relationship representation,
- queryability,
- semantic structure.

### FRF distinction

The proposed FRF knowledge graph is oriented toward financial investigation and analyst reasoning rather than only data representation or queryability.

## 21.7 Generic AI

Generic AI:

**Question → Answer**

FRF:

**Financial Observation → Structured Financial Relationships → Hypotheses → Related Parameters → Evidence → Verification → Interpretation**

The distinction is methodological rather than a claim that generic AI cannot perform financial analysis.

## 21.8 Annual reports

Annual reports are a primary evidence source.

They are not themselves an analysis engine.

FRF uses disclosures as evidence for verifying hypotheses.

## 21.9 Market positioning

The documented strategic positioning was around the intersection of:

**Financial Analysis + Parameter Relationships + Analyst Reasoning + Evidence Verification + Educational/Research Use**

The market is not uncontested; adjacent literature, workflows and tools already exist.

---

# 22. WHAT FRF IS NOT

FRF is not:

- a standalone accounting system,
- a replacement for annual reports,
- a generic financial data terminal,
- merely a ratio calculator,
- only a dashboard,
- a DCF platform,
- an LBO platform,
- a comprehensive forecasting engine,
- a fully autonomous equity analyst,
- an autonomous stock picker,
- a guaranteed fraud detector,
- a substitute for professional judgement,
- a generic AI chatbot,
- an established production RAG system,
- an established production agent system,
- a guarantee of investment returns,
- a guarantee of financial-data accuracy,
- a substitute for industry research,
- a substitute for auditors,
- a substitute for analysts,
- a substitute for portfolio managers,
- a substitute for investment committees.

The appropriate output terminology is:

**Preliminary Investment Assessment / Decision Support**

rather than a claim of guaranteed investment advice or autonomous stock selection.

---

# 23. DECISIONS, REJECTIONS AND TRADE-OFFS

## 23.1 Major decisions

1. Structure financial analysis around relationships rather than isolated ratios.
2. Use human-oriented decision support rather than autonomous AI.
3. Focus on fundamental equity analysis rather than fraud detection.
4. Use rule-based reasoning in the original prototype.
5. Keep LLMs out of the original core engine.
6. Use deterministic financial calculations.
7. Process Excel locally in the original prototype.
8. Use React.js and TailwindCSS.
9. Use SheetJS for Excel processing.
10. Use JSON for the initial knowledge base.
11. Use static hosting for the original prototype.
12. Keep authentication optional in the early prototype.
13. Later move toward database-backed production architecture.
14. Separate FRF knowledge from company-specific analysis.
15. Use manual evidence verification initially.
16. Defer PDF/OCR.
17. Defer live financial-market APIs.
18. Add AI as a later layer over curated FRF knowledge.
19. Introduce scoring/assessment later.
20. Keep recommendation as preliminary decision support.
21. Recognize the need for industry-specific logic.
22. Separate core features from broader future features.

## 23.2 Trade-offs

### Local processing

Benefit:

- privacy,
- simplicity,
- low infrastructure requirements.

Trade-off:

- limited persistence,
- collaboration,
- centralized administration.

### Rules vs LLM

Rules:

- deterministic,
- explainable,
- controlled.

LLMs:

- flexible,
- contextual,
- capable of generating hypotheses.

Trade-off:

- LLMs introduce uncertainty and potential hallucination.

### Manual verification vs automation

Manual:

- human validation,
- higher control.

Automation:

- faster,
- scalable.

Trade-off:

- automated document interpretation can introduce extraction and reasoning errors.

### JSON vs database

JSON:

- lightweight,
- simple,
- suitable for prototype.

Database:

- persistent,
- multi-user,
- scalable,
- administrable.

## 23.3 What was not explicitly rejected

There is no strong documented evidence that the following technologies were formally rejected:

- GPT,
- Claude,
- Gemini,
- RAG,
- vector databases,
- OCR,
- backend systems.

Their status was generally:

**Not implemented / not established / planned**

rather than formally rejected.

---

# 24. RAW KNOWLEDGE DUMP

## 24.1 Core conceptual sequence

> **What changed? → Why? → What next? → Where to verify? → What might it mean?**

## 24.2 Example relationships

- Revenue ↑ + Receivables ↑ + CFO ↓
- Revenue ↑ + Margin ↓
- Inventory ↑ + Sales ↓
- Debt ↑ + Interest Coverage ↓
- Cash ↑ + Borrowings ↑
- ROE ↑ + ROCE ↓
- Capex ↑ + Depreciation ↑
- Receivables ↑ + Cash Flow ↓

## 24.3 Cross-statement principle

FRF is fundamentally cross-statement:

**Income Statement ↔ Balance Sheet ↔ Cash Flow Statement**

## 24.4 Relationship database schema

The core schema was:

- Parameter
- Observation / Direction
- Related Parameter
- Relationship
- Possible Reason
- Evidence to Check

## 24.5 Financial knowledge graph

The financial knowledge graph was a later formalization/extension of the FRF relationship database.

It should not automatically be treated as the original name of the invention.

## 24.6 Categories discussed

- profitability,
- liquidity,
- solvency,
- efficiency/activity,
- growth,
- capital structure,
- cash flow,
- asset management,
- valuation.

The final taxonomy was not established.

## 24.7 Knowledge-base scale

“Hundreds of parameters” was an intended scale, not a confirmed production count.

## 24.8 Prototype implementation details

- React.js
- TailwindCSS
- SheetJS
- JSON
- Rule engine
- Financial calculation engine
- Dashboard
- Netlify

## 24.9 Mapping

Fuzzy mapping was discussed for connecting uploaded Excel line items to FRF parameters.

Potential risk:

- incorrect mapping.

## 24.10 State management

Redux/Zustand were discussed as possible options.

No final state-management choice was established as a source-of-truth requirement.

## 24.11 Additional future ideas

The broader idea backlog included:

- multi-year upload,
- PDF parsing,
- quarterly analysis,
- currency normalization,
- XBRL,
- fuzzy matching,
- TTM,
- common-size analysis,
- DuPont,
- Altman Z,
- Piotroski,
- Beneish,
- operating leverage,
- financial leverage,
- FCFF,
- FCFE,
- working-capital cycle,
- scenarios,
- PDF/PPT reports,
- red flags,
- charts,
- peer benchmarking,
- industry modes,
- custom rule builder,
- accounts,
- collaboration,
- backtesting,
- natural-language queries,
- valuation,
- compliance checking,
- macro overlays,
- educational videos,
- API/webhooks.

These should be treated as ideas/future enhancements unless otherwise established.

## 24.12 Educational use

Potential educational users:

- finance students,
- professors,
- researchers,
- junior analysts.

## 24.13 Professional use

Potential professional users:

- equity analysts,
- credit analysts,
- investment bankers,
- FP&A teams,
- portfolio managers,
- consultants,
- auditors,
- corporate finance teams.

## 24.14 Important limitations

- GIGO.
- Accounting manipulation.
- Missing qualitative context.
- Industry differences.
- False positives.
- False negatives.
- Mapping errors.
- Missing values.
- Inconsistent reporting structures.

## 24.15 Other illustrative examples

Meridian Consumer Goods:

- Revenue: $100M → $120M
- Inventory: $20M → $40M
- EBITDA margin: 15% → 12%
- CFO: $15M → $2M

TCS:

- Revenue growth: +8%
- Employee-cost growth: +12%
- Operating margin: decreased.

Sample company names such as Titan Precision Ltd. and Vantage Financial Services appeared in demonstration concepts and were not established as customers.

## 24.16 Additional product principles

- The FRF knowledge base should be the source of truth for validated relationships.
- AI should assist rather than replace validated FRF knowledge.
- A hypothesis should not be treated as verified evidence.
- Analyst judgement remains part of the workflow.
- Global FRF rules should be separated from company-specific evidence and remarks.
- Reports should preserve traceability back to the underlying financial parameter and evidence.

---

# 25. FINAL FACT / CONFIDENCE CHECK

## 25.1 Clearly established

The following are strongly established:

- FRF means Financial Relationship Framework.
- The original scope is fundamental equity analysis.
- The central idea is parameter-level relationship reasoning.
- Financial changes lead to possible explanations.
- Related parameters should be investigated.
- Annual-report/disclosure evidence should be used for verification.
- Business and investment interpretation follows verification.
- Human judgement remains important.
- The original prototype was rule-based and deterministic.
- React.js, TailwindCSS, SheetJS and JSON were part of the prototype architecture.
- Local/client-side processing was a core architectural principle.
- AI came later and was not the original invention.
- The research focused on formalizing analyst reasoning.
- The main limitation is the boundary between encoded relationships and contextual human judgement.

## 25.2 Uncertain / version-dependent

The following are not final or consistently established:

- exact number of parameters,
- exact number of relationships,
- final categories,
- final frontend implementation,
- final database implementation,
- final authentication implementation,
- final scoring formula,
- final confidence formula,
- final recommendation thresholds,
- exact deployment status,
- exact evidence automation,
- final knowledge-base size,
- companies/industries actually validated,
- production performance.

## 25.3 Missing

The following were not established:

- empirical validation results,
- user-study results,
- statistically significant usability study,
- commercial validation,
- customer contracts,
- technical benchmarks,
- security audit,
- AI benchmark,
- investment backtest,
- validated investment performance.

## 25.4 Illustrative assumptions

Treat the following as illustrative:

- hundreds of parameters,
- 4-hour / 40-ratio / 4-second comparison,
- scoring weights,
- score thresholds,
- 87/100 example,
- Meridian example,
- TCS example,
- confidence examples,
- 12-parameter verification example,
- subjective 1–10 evaluation,
- zero hosting-cost claims,
- unlimited/infinite scalability claims.

## 25.5 Claims that should not be made without independent verification

Do not present the following as validated facts:

- hundreds of implemented parameters,
- 4-second production performance,
- absolute privacy,
- infinite scalability,
- productivity improvement,
- investment-return improvement,
- stock-prediction accuracy,
- fraud-detection capability,
- replacement of analysts,
- automatic annual-report understanding,
- GPT/Claude/Gemini integration,
- production RAG,
- production vector database,
- production autonomous agent,
- first/world's first/unique,
- validated scoring,
- paying customers,
- revenue,
- validated market demand.

## 25.6 Final source-of-truth definition

> **FRF (Financial Relationship Framework) is a structured financial-analysis and decision-support concept that formalizes the reasoning around changes in financial statement parameters. It connects an observed financial change to possible business explanations, related financial parameters, evidence and disclosure locations for verification, and potential business and investment interpretations. The original prototype implemented this idea primarily through deterministic financial calculations, structured FRF relationships, rule-based reasoning, Excel/CSV processing and client-side browser execution. Later iterations expanded the concept toward a database-backed, explainable financial intelligence platform with evidence management, scoring, confidence assessment, document processing and AI-assisted reasoning, but many of those later capabilities remained planned or conceptual rather than established production functionality.**

## 25.7 Most important historical distinction

> **The original FRF innovation was the structured financial reasoning framework — not the later AI layer.**

## 25.8 Most important implementation distinction

> **The prototype demonstrated the deterministic/rule-based core; the broader AI, document intelligence, production infrastructure and empirical validation remained incomplete or planned.**

---

# END OF FRF MASTER SPECIFICATION

This document is the consolidated source-of-truth version of Sections 1–25. Where multiple versions existed, they are preserved as evolution, alternatives, illustrative examples or unresolved status rather than silently reconciled.
