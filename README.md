# 🛡️ Flamehaven Verification Ledger

> Public, transparent, reproducible, and independently checkable ledger of AI safety audits, mathematical and physical verification runs, bioscience repository compliance audits, and independent auditor review templates from **Flamehaven**.

[![Flamehaven Space](https://img.shields.io/badge/Flamehaven-space-000000?style=flat&logo=target&logoColor=white)](https://flamehaven.space/)
[![CI](https://github.com/flamehaven01/Flamehaven-Verification-Ledger/actions/workflows/ci.yml/badge.svg)](https://github.com/flamehaven01/Flamehaven-Verification-Ledger/actions/workflows/ci.yml)
[![OPSEC Gate](https://github.com/flamehaven01/Flamehaven-Verification-Ledger/actions/workflows/opsec-sanitize.yml/badge.svg)](https://github.com/flamehaven01/Flamehaven-Verification-Ledger/actions/workflows/opsec-sanitize.yml)
[![Python 3.12](https://img.shields.io/badge/python-3.12-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Code: MIT](https://img.shields.io/badge/code-MIT-green.svg)](./LICENSE)
[![Data: CC BY-NC 4.0](https://img.shields.io/badge/data-CC%20BY--NC%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20483364.svg)](https://doi.org/10.5281/zenodo.20483364)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0009--2641--4280-A6CE39?logo=orcid&logoColor=white)](https://orcid.org/0009-0009-2641-4280)

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
- **Scope**: Active EQA ledger spanning records TOE-TEST-0001~0059. Includes the QSOT2 mathematical-consistency verifier (0058, the re-scoped math line, supersedes 0057), the QSOT-Harness v2.1.2 honest reconstruction (0059, the r1 hardening release, DOI 10.5281/zenodo.20665824, renumbered verbatim from 0058 in the 3-line QSOT split, supersedes 0057), QSOT Compiler v1.2.3 slop audit (0057), optional backend layer experiment (0055/AEFSO), published Zenodo-archived executable reproduction (0056), gate-rejected hypothesis (0052), governance gate verification (0054), namespace integrity scan (0053), and the reconstructed 0001–0051 archive. That archive is classified by provenance into **7 verification runs (0001–0007)** and **44 non-run artifacts (0008–0051)** — governance / integration / bio-quantum sidecar / `meta_verify` infrastructure, which are excluded from the verification-run count. Real Flamehaven-TOE reports, imported **append-only** (paths sanitized) with per-record point-of-use reconstruction notes (errata / parser-sensitivity / ground-truth-sensitivity), surfaced through the Ledger Inspector. Engine outputs are deterministic and locally reproducible (verified by re-running the engine); the inspector shows imported reports, it does not re-verify them. See [`memory/eqa-reconstruction-standard.md`](./memory/eqa-reconstruction-standard.md).
- **Portal**: [`eqa.html`](./eqa.html) — dedicated EQA verification dashboard.

### 2. Bioscience Repository Compliance Scanner
- **Focus**: Local, zero-execution repository safety and compliance audits for advanced bioscience systems.
- **Methodology**: Maps observables (README intent, dependency safety, exception handling, data-provenance, clinical disclaimers) directly to structured evidence-readiness tiers (T0 Quarantine to T3 Clear), mapped to the **MIT AI Risk Repository (AIRI)**. Interactive Compliance Steering Sandbox applies Standard Prior / EU AI Act Art. 12 / MIT AI Risk Cap policy rules against live report JSON — no hardcoded scores.
- **Scope**: 2 active reports · Avg Score 54/100 · 1 T1 Quarantine · 1 T2 Caution. Each report links to a companion flamehaven.space article.

### 3. Biomolecular AI Validation (BAV)
- **Focus**: Validating whether an entire biomedical AI **pipeline** (RExSyn reasoning + NNSL resonance + LawBinder governance) deserves trust — not just whether one model looks confident. Model disagreement is treated as signal.
- **Methodology**: Multi-model structural consensus/drift (AF3, AF2, Chai-1, Boltz-2), honesty gating (SR9 cross-domain consistency >= 0.70, DI2 reasoning drift <= 0.30), end-to-end reliability `p_e2e = capture x transfer x model x clinical`, and fail-closed LawBinder escalation. All card values are live-fetched from verbatim run payloads (no hardcoding); a metrics glossary defines every acronym.
- **Scope**: 34 canonical BAV experiments surfaced through **6 live cards** and a **26-entry foundational archive**. The live surface covers EXP-005~007 as one grouped truthful-null sub-series card, plus EXP-028, EXP-031, EXP-032, EXP-033, and EXP-034. Pipeline-reliability heuristics only — not clinical efficacy. The public surface now distinguishes early manual-assisted pipeline controls (EXP-005~007), tiny fallback-gated honesty pilots (EXP-028), observer-only disagreement signals (EXP-031), legacy parity anchors (EXP-032), current-repro governance collapse (EXP-033), and accepted-anchor path separation (EXP-034) instead of flattening them into one success story.

> **OPSEC & credibility:** every published file passes the MICA-governed sanitizer (`sanitizer/`, CI gate) which scrubs local-workspace paths / locale-PII and flags pseudo-scientific symbol-soup or grandiose attribution before publication.

---

## 📂 Repository Structure & Collections

All experiment results and compliance logs follow a unified hierarchical layout: `[Category] / [Target Name] / [Date] / [Files]`.

```
flamehaven-verification-ledger/
├── index.html                           # Main Verification Ledger Portal
├── eqa.html                             # EQA-Dedicated Dashboard Portal
├── index.md                             # Markdown Archive Directory
├── api/v1/                              # Static read-only API (served via GitHub Pages)
│   ├── runs.json                        # 16-entry run index (all 3 lanes)
│   ├── schema.json                      # Vocabulary: lanes, verdict codes, metric definitions
│   ├── metrics/bav.json                 # BAV aggregated metrics table
│   └── runs/{id}.json                   # Per-experiment detail (16 files)
├── eqa/                                 # Equation-to-Artifact Run Artifacts
│   ├── toe-test-0059/                   # QSOT-Harness v2.1.2 (r1) — Honest Reconstruction (DEGRADED_PASS · renumbered from 0058)
│   ├── toe-test-0058/                   # QSOT2 — Mathematical-Consistency Verifier (DEGRADED_PASS · supersedes 0057)
│   ├── toe-test-0057/                   # QSOT Compiler — Multiphase Verification (DEGRADED_PASS)
│   ├── toe-test-0055/                   # AEFSO — Optional Backend Layer (SPAR: ACCEPT WITH BOUNDS)
│   ├── toe-test-0056/                   # Erdős Eq.(2.2) Reproduction (Zenodo published)
│   ├── toe-test-0054/                   # Governance Gate Verification (BLOCK / INHIBIT)
│   ├── toe-test-0053/                   # Namespace Integrity Scan (DEGRADED SIDECAR)
│   ├── toe-test-0052/                   # GTE Pedagogy Hypothesis (Gate REJECTED · SPAR 73)
│   └── archive/                         # TOE-TEST-0001~0051 (7 verification runs + 44 non-run artifacts; real reports + manifest)
├── stem-bio-ai/                         # Bioscience Compliance Audits
│   ├── yorkeccak-bio/2026-05-15/        # yorkeccak/bio — T1 Quarantine · Score 48
│   └── bioclaw/2026-5-21/               # Runchuan-BU/BioClaw — T2 Caution · Score 60
├── scripts/
│   ├── build_api.py                     # Generates api/v1/ from manifest api_summary blocks
│   └── api_schema_static.json           # Vocabulary source for schema.json
├── tests/
│   └── test_api.py                      # API integration test suite (54 checks; run: python tests/test_api.py --live)
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

## 🔌 Public API (v1)

A static, read-only JSON API is served from GitHub Pages. No backend — all files are pre-generated from each experiment's `manifest.json`.

| Endpoint | Description |
|---|---|
| [`GET /api/v1/runs.json`](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/api/v1/runs.json) | Index of all 14 verification runs across EQA / BAV / BSC |
| `GET /api/v1/runs/{id}.json` | Per-run detail: verdict, key metrics, findings, evidence links |
| [`GET /api/v1/metrics/bav.json`](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/api/v1/metrics/bav.json) | Aggregated BAV metrics table (SR9, DI2, p_e2e, balanced_accuracy) |
| [`GET /api/v1/schema.json`](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/api/v1/schema.json) | Vocabulary: lane descriptions, 11 verdict codes, 6 metric definitions |

**Architecture:** payloads conform to the API spec — not the reverse. Each experiment's `manifest.json` carries a standardised `api_summary` block; `scripts/build_api.py` reads those blocks and writes `api/v1/`. Adding a new experiment requires no script changes:

```
1. Register in js/*-registry.js
2. Add manifest.json with api_summary block
3. python scripts/build_api.py
```

A CI gate (`API drift check`) fails if `api/v1/` is out of sync with manifests.

**Integration tests:** `python tests/test_api.py --live` runs 54 checks (local file validation + live HTTP). Last result: 54/54 PASSED.

---

## 🚀 Quick Browse

To interactively browse this repository, run the local dev server and open the portal:
1. Run `python -m http.server 8080` inside this folder.
2. Open `http://localhost:8080` in your browser.

### 🔢 EQA — Equation-to-Artifact Runs
- **[EQA · 0059] QSOT-Harness v2.1.2 (hardening r1)** `DEGRADED_PASS · Honest Reconstruction`
  - [EQA Portal](./eqa.html#toe-test-0059) | [Zenodo DOI](https://doi.org/10.5281/zenodo.20665824) · renumbered verbatim from 0058 in the 3-line QSOT split
- **[EQA · 0058] QSOT2 — Mathematical-Consistency Verifier** `DEGRADED_PASS · Re-scoped Math Line`
  - [EQA Portal](./eqa.html#toe-test-0058) | [QSOT2-Compiler](https://github.com/Flamehaven-Labs/QSOT2-Compiler) · supersedes 0057, model-output consistency only
- **[EQA · 0057] QSOT Compiler (Quantum State Over Time)** `DEGRADED_PASS · Slop Artifact`
  - [EQA Portal](./eqa.html#toe-test-0057) · multiphase verification note
- **[EQA · 0055] AEFSO — Optional Backend Representation Layer** `OPTIONAL LAYER · SPAR: ACCEPT WITH BOUNDS`
  - [EQA Portal](./eqa.html#toe-test-0055) · staged paper-to-TOE research dossier · DO NOT PROMOTE TO CORE
- **[EQA · 0056] OpenAI Erdős Unit-Distance Disproof Eq.(2.2)** `PASS · Zenodo Published`
  - [EQA Portal](./eqa.html#toe-test-0056) | [Zenodo DOI](https://doi.org/10.5281/zenodo.15487327)
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

---

## 📄 Citation & License

- **Cite**: archived on Zenodo — DOI [`10.5281/zenodo.20483364`](https://doi.org/10.5281/zenodo.20483364); maintainer ORCID [`0009-0009-2641-4280`](https://orcid.org/0009-0009-2641-4280). See [`CITATION.cff`](./CITATION.cff) and [`codemeta.json`](./codemeta.json); pages expose schema.org `Dataset` JSON-LD for indexing.
- **Dual license**: the repository **code** (portal, sanitizer, chart engine, build scripts) is **MIT** (see [`LICENSE`](./LICENSE)); the **verification runs and static evidence artifacts** are **CC BY-NC 4.0**.
- **Provenance honesty**: internal metrics (SR9, DI2, Omega, SPAR) are labelled *advisory — not externally validated*. Verification weight rests on external anchors (public MIT repos, the Zenodo DOI, and standard third-party metrics such as AlphaFold pLDDT/PAE), not on internal scores.
