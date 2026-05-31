# 🛡️ Flamehaven Verification Ledger

> Public, transparent, and authoritative public ledger of AI safety audits, mathematical and physical verification runs, bioscience repository compliance audits, and independent auditor review templates from **Flamehaven**.

[![Flamehaven Space](https://img.shields.io/badge/Flamehaven-space-000000?style=flat&logo=target&logoColor=white)](https://flamehaven.space/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Flamehaven--Verification--Ledger-181717?style=flat&logo=github)](https://github.com/flamehaven01/Flamehaven-Verification-Ledger)

This repository serves as the official public ledger of all experimental verification runs, capability evaluations, and static safety scans executed by Flamehaven core systems. All artifacts contained here represent static, offline, deterministic results.

## Snapshot summary

This repository is also the single source for the lightweight `ledger-summary.json` snapshot consumed by `flamehaven.space`.

- build command: `node scripts/build-ledger-summary.mjs`
- Windows helper: `build-ledger-summary.bat`
- output: `ledger-summary.json`

The summary file is intentionally narrow. It exists only to route users into the public archive without duplicating the underlying evidence record.

---

## 🎯 Core Verification & Audit Lanes

### 1. Equation-to-Artifact (EQA) Verification
- **Focus**: Translating high-stakes mathematical and physical proofs (such as discrete geometry conjectures) into runnable, CI-tested software artifacts.
- **Methodology**: Evaluated under rigorous, multi-precision computational verification checks, SPAR scoring, and SIDRCE Omega gate thresholds (GREEN ≥ 0.85 · AMBER [0.75, 0.85) · RED < 0.75).
- **Scope**: Active EQA ledger spanning runs TOE-TEST-0001~0056. Includes published Zenodo-archived reproduction (0055), gate-rejected hypothesis (0052), optional backend layer experiment (0056/AEFSO), governance gate verification (0054), namespace integrity scan (0053), and 51-run algebraic calibration archive (0001–0051).
- **Portal**: [`eqa.html`](./eqa.html) — dedicated EQA verification dashboard.

### 2. Bioscience Repository Compliance Scanner
- **Focus**: Local, zero-execution repository safety and compliance audits for advanced bioscience systems.
- **Methodology**: Maps observables (README intent, dependency safety, exception handling, data-provenance, clinical disclaimers) directly to structured evidence-readiness tiers (T0 Quarantine to T3 Clear), mapped to the **MIT AI Risk Repository (AIRI)**. Interactive Compliance Steering Sandbox applies Standard Prior / EU AI Act Art. 12 / MIT AI Risk Cap policy rules against live report JSON — no hardcoded scores.
- **Scope**: 2 active reports · Avg Score 54/100 · 1 T1 Quarantine · 1 T2 Caution. Each report links to a companion flamehaven.space article.

### 3. Biomolecular AI Validation (BAV)
- **Focus**: Validating whether an entire biomedical AI **pipeline** (RExSyn reasoning + NNSL resonance + LawBinder governance) deserves trust — not just whether one model looks confident. Model disagreement is treated as signal.
- **Methodology**: Multi-model structural consensus/drift (AF3, AF2, Chai-1, Boltz-2), honesty gating (SR9 cross-domain consistency >= 0.70, DI2 reasoning drift <= 0.30), end-to-end reliability `p_e2e = capture x transfer x model x clinical`, and fail-closed LawBinder escalation. All card values are live-fetched from verbatim run payloads (no hardcoding); a metrics glossary defines every acronym.
- **Scope**: 6 live experiment cards (EXP-005 Upadacitinib truthful-null, EXP-028 honesty test, EXP-031 OOD disagreement, EXP-032 adaptive gate, EXP-033 pipeline-level, EXP-034 path separation) + a foundational-iteration archive (EXP-001~030, real metrics/reports surfaced via the inspector). Pipeline-reliability heuristics only — not clinical efficacy.

> **OPSEC & credibility:** every published file passes the MICA-governed sanitizer (`sanitizer/`, CI gate) which scrubs local-workspace paths / locale-PII and flags pseudo-scientific symbol-soup or grandiose attribution before publication.

---

## 📂 Repository Structure & Collections

All experiment results and compliance logs follow a unified hierarchical layout: `[Category] / [Target Name] / [Date] / [Files]`.

```
flamehaven-verification-ledger/
├── index.html                           # Main Verification Ledger Portal
├── eqa.html                             # EQA-Dedicated Dashboard Portal
├── index.md                             # Markdown Archive Directory
├── eqa/                                 # Equation-to-Artifact Run Artifacts
│   ├── toe-test-0056/                   # AEFSO — Optional Backend Layer (SPAR: ACCEPT WITH BOUNDS)
│   ├── toe-test-0055/ → openai-erdos-eq22/  # Erdős Eq.(2.2) Reproduction (Zenodo published)
│   ├── toe-test-0054/                   # Governance Gate Verification (BLOCK / INHIBIT)
│   ├── toe-test-0053/                   # Namespace Integrity Scan (DEGRADED SIDECAR)
│   ├── toe-test-0052/                   # GTE Pedagogy Hypothesis (Gate REJECTED · SPAR 73)
│   └── [archive 0001–0051]              # 51-run algebraic calibration archive
├── stem-bio-ai/                         # Bioscience Compliance Audits
│   ├── yorkeccak-bio/2026-05-15/        # yorkeccak/bio — T1 Quarantine · Score 48
│   └── bioclaw/2026-5-21/               # Runchuan-BU/BioClaw — T2 Caution · Score 60
├── css/                                 # Styling System
├── js/                                  # Interaction Logic (portal.js, chart-engine.js)
├── memory/                              # MICA Memory Package
│   ├── verification-ledger.mica.archive.json
│   └── verification-ledger-playbook.md
├── extra/                               # Review Methodology & Frameworks
│   └── pr_action_plan_v3.html           # Agent Review Dashboard (PR Action Plan v3)
└── README.md                            # Repository Documentation
```

---

## 🚀 Quick Browse

To interactively browse this repository, run the local dev server and open the portal:
1. Run `python -m http.server 8080` inside this folder.
2. Open `http://localhost:8080` in your browser.

### 🔢 EQA — Equation-to-Artifact Runs
- **[EQA · 0056] AEFSO — Optional Backend Representation Layer** `OPTIONAL LAYER · SPAR: ACCEPT WITH BOUNDS`
  - [EQA Portal](./eqa.html#toe-test-0056) · 7-phase experiment · DO NOT PROMOTE TO CORE
- **[EQA · 0055] OpenAI Erdős Unit-Distance Disproof Eq.(2.2)** `PASS · Zenodo Published`
  - [EQA Portal](./eqa.html#openai-erdos-eq22) | [Zenodo DOI](https://doi.org/10.5281/zenodo.15487327)
- **[EQA · 0054] Governance Gate Verification** `BLOCK / INHIBIT`
  - [EQA Portal](./eqa.html#toe-test-0054)
- **[EQA · 0053] Namespace Integrity Scan** `DEGRADED SIDECAR`
  - [EQA Portal](./eqa.html#toe-test-0053)
- **[EQA · 0052] GTE Pedagogy Hypothesis** `GATE REJECTED · SPAR 73 · Omega 0.697 RED`
  - [EQA Portal](./eqa.html#toe-test-0052)

### 🧬 Bioscience Compliance Audits
- **[BSC] yorkeccak/bio (T1 Quarantine · Score 48)**
  - [Interactive Report](./stem-bio-ai/yorkeccak-bio/2026-05-15/report.html) | [Analyst Write-up](./stem-bio-ai/yorkeccak-bio/2026-05-15/audit-analysis.md) | [Markdown](./stem-bio-ai/yorkeccak-bio/2026-05-15/report.md)
- **[BSC] Runchuan-BU/BioClaw (T2 Caution · Score 60)**
  - [Interactive Report](./stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.html) | [Markdown](./stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.md)

### 📐 Methodology & Frameworks
- **[Methodology] Agent Review Dashboard (PR Action Plan v3)**
  - [Interactive Dashboard](./extra/pr_action_plan_v3.html)

---

## 🔒 Security & Reproducibility Ground Rules

- **Zero LLM & Zero Network Runtime**: All Bioscience Compliance scans execute locally with no external APIs or network requests.
- **Deterministic Constants**: Audit results are fully reproducible from repository state inputs.
- **Read-Only Safety**: The scanner has no permission to alter source code files, ensuring 100% read-only integrity.

> [!NOTE]
> These reports are archival evidence-surface and experiment-review artifacts. They do not automatically imply certification, compliance, efficacy, or deployment approval.
