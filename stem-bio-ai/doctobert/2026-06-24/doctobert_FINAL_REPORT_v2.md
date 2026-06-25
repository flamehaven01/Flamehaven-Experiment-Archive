# doctobert Codebase Diagnostic Report

**Repository:** `doctolib-lab/doctobert`  
**Remote URL:** https://github.com/doctolib-lab/doctobert  
**Analyzed Commit:** `90a8bbe7260d9daaa64bfbd0e8a167769da7646e` (branch: main)  
**Original Audit Date:** 2026-06-24  
**Report Version:** v2.0 — 2026-06-25  
**Diagnostic Engines:** STEM-BIO-AI v1.8.4 / AI-SLOP-DETECTOR / E2E Custom Suite / AST Static Analysis / Manual Code Review  
**Evidence Sources:** Local repository checkout (`90a8bbe`) · EU AI Act OJ L 2024/1689 (local copy) · HuggingFace model card snapshot (user-provided) · Public financial disclosures (Sifted, Frontiers Health, Les Échos) · Autorité de la concurrence press release (Nov 2025)  
**Scope boundary:** `ModernBERT` Git submodule was **not initialized** in the local checkout (`git submodule status: -52abe440… ModernBERT`). Findings that depend on submodule content (pretraining scripts, training launchers) are marked [SUBMODULE-UNVERIFIED].  
**Runtime verification (partial):** Limited CLI smoke tests were executed on the local machine (Windows 11, Python 3.14.3, GTX 1050 4GB, CUDA driver 11.1) after temporary dependency installation. Results are marked [RUNTIME-VERIFIED]. All temporary packages were removed after verification (`pip uninstall -y fire mosaicml-streaming termcolor`).  
**v2 Author Note:** This revision corrects four scoring errors and two false-positive risk findings present in v1, adds one previously undetected structural defect, introduces a dedicated Claim Traceability Analysis section (§8), and adds a Strategic Context appendix (§10) connecting the repository's technical posture to Doctolib's broader ecosystem context as non-diagnostic background.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-06-24 | Initial automated diagnostic report |
| v2.0 | 2026-06-25 | Corrected P2 PASS count; upgraded C4 GLiNER to VERIFIED; reclassified `split_document.py` filter (CRITICAL→LOW); removed false-positive multiprocessing risk; added `load_local_dataset` silent-divergence finding (§5-1); added `snappy` transitive dependency finding [RUNTIME-VERIFIED] (§5-2); corrected HPC active path count 4→20 across 6 files (§6-1); added Claim Traceability Analysis (§8); rewrote §10-5 EU AI Act analysis from OJ L 2024/1689 source text (3-gate structure); integrated runtime verification results throughout (snappy, vllm, Python 3.14 mismatch); restructured §13 into genuine limits (L1–L2) + deferred scope (D0–D5) |

---

## Scope and Methodology Disclaimer

This report is an **evidence-surface pre-screen**, not a formal legal audit, clinical validation, or regulatory clearance. All findings are grounded in static code analysis, AST parsing, and file-system inspection of the local repository clone at the above commit. No full pipeline execution, model inference, training run reproduction, or external system access was performed. Limited local CLI smoke tests (import-level only) were executed after temporary dependency installation and are explicitly marked [RUNTIME-VERIFIED] throughout; all other findings are static-analysis-only. Severity ratings reflect **code-observable risk**, not judgment on intent. Where the original v1 report contained scoring errors or false positives, this version provides corrected assessments with explicit evidence citations.

This report is intended to support technical due diligence. It should be reviewed by qualified legal counsel before use in any legal or regulatory proceeding.

---

## 0. Subject Profile

### Doctolib SAS

| Field | Value |
|-------|-------|
| **Legal entity** | Doctolib SAS |
| **Founded** | 2013 |
| **Headquarters** | Levallois-Perret, France |
| **Classification** | Health-tech / e-health SaaS |
| **Primary markets** | France (core market), Germany, Italy, Netherlands. Germany represents nearly 20% of ARR and 28% of new revenues in Q1 2025 (source: Doctolib CFO via LinkedIn / Les Échos). |
| **Employees** | 2,900+ Doctolibers across France, Germany, Italy, and the Netherlands (source: Doctolib public company profile) |
| **Homepage** | https://www.doctolib.fr/ |
| **HuggingFace org** | https://huggingface.co/doctolib-lab |

### Financial Context (FY 2024)

| Metric | Value |
|--------|-------|
| ARR | €348M (+22.5% YoY) — source: Sifted / Les Échos; confirmed by Frontiers Health |
| Operating loss | €53.8M (−38% YoY; reduced from €87.1M in 2023) — same sources |
| Revenue model | ~99% subscription (medical professional SaaS) — same sources |
| Platform scale | ~80M patient accounts; ~400K healthcare-professional subscribers (source: Sifted 2024) |
| AI investment | ~€115M R&D investment in 2024; AI consultation assistant used in 2M+ consultations (source: Doctolib CFO statements) |

### DoctoBERT Release Context

| Item | Detail |
|------|--------|
| **Blog** | [*Where Does the Signal Live?*](https://huggingface.co/blog/bofenghuang/doctobert-fr-release) — published 2026-06-20 |
| **Paper** | arXiv:2606.22079v1 (2026-06-20), CC BY 4.0 |
| **Authors** | Bofeng Huang, Jacques Sun, Diane Bouchacourt, Nicolas Barascud, Fajwel Fogel (all @Doctolib) |
| **Compute** | GENCI Jean Zay HPC (allocations 2025-AD011016291, 2026-A0200617487) |
| **Public artifacts** | FineMed corpus, FineMed-rephrased, DoctoBERT-fr, DoctoModernBERT-fr (HuggingFace Hub) |

> **Context:** Doctolib operates as core infrastructure for the French healthcare system. `doctobert` is the codebase used to produce models evaluated on a **real-world proprietary clinical NER task** (Table 6, paper §5.3). This elevates the governance significance of the repository beyond typical research code.

### Model Card Cross-Reference (HuggingFace Hub)

Both released models carry **Apache-2.0** license on the Hub. The code repository carries **no LICENSE file**. This creates an indeterminate licensing posture addressed in §9.

| Field | [doctobert-fr-base](https://huggingface.co/doctolib-lab/doctobert-fr-base) | [doctomodernbert-fr-base](https://huggingface.co/doctolib-lab/doctomodernbert-fr-base) |
|-------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| **Architecture** | `RobertaForMaskedLM` (FlexBERT) | `ModernBertForMaskedLM` |
| **License** | Apache-2.0 | Apache-2.0 |
| **Context length** | 512 tokens | 8,192 tokens |
| **Pretraining data** | FineMed-fr + FineMed-rephrased-fr | FineMed-fr + FineMed-rephrased-fr |

---

## [!!] Primary Concern — Critical Structural Finding

> [!CAUTION]
> The most significant finding is a structural contradiction between the paper's formal contributions and the state of the released code. **Claims published as completed research contributions exist in the codebase in provisional (`# tmp`) or unverifiable states.** This does not constitute evidence of falsification — no published numerical result has been identified as contradicted by the code. It does indicate a publication-to-release lag that affects reproducibility and raises governance questions.

### The Core Tension: "Reproducible Pipeline" vs. Code Evidence

arXiv:2606.22079 declares as a formal contribution (§1):

> *"We release FineMed… together with **a reproducible curation pipeline** with multi-axis annotators."*

Code-observable evidence against full reproducibility:

```
Paper §5.1 "coarse pre-screen"  →  Code: # tmp pre-filter  (llm_rewrite.py:840, active)
Paper §3.3 "style dimensions"   →  Code: # tmp: v3 (default)  (llm_rewrite.py:629, active)
Paper §4.1 "best filter"        →  Code: ## tmp: keep only med01 ∧ edu4  (split_document.py:226, INACTIVE — filter block is commented out)
Paper §3.1 "pipeline control"   →  Code: # tmp control  (llm_generate.py:13, active)
```

> **v2 correction:** `split_document.py:226` was classified CRITICAL in v1. Manual review confirms the `filter(...)` block below that comment is **commented out entirely** (lines 228–233). The `## tmp` annotation is a historical note, not a tag on executing code. This item is reclassified LOW.

### Why Reproducibility Is Structurally Constrained

```
┌─────────────────────────────────────────────────────────────────────┐
│  Paper states:   "reproducible curation pipeline"                   │
│  Code provides:  CLI entry points (HPC- and GPU-bound)              │
│  External reproducibility:  Jean Zay HPC + GPU cluster holders only │
└─────────────────────────────────────────────────────────────────────┘
```

1. **No training execution script** — only `sbatch` comments remain  
2. **20 active HPC absolute paths across 6 files** (see §6-1 for full breakdown) → `FileNotFoundError` on any non-Jean-Zay machine  
3. **`p2_short_floor` dual default** (256 vs 128) → produces different corpora depending on invocation path (confirmed real bug; §7.1)  
4. **Hard `vllm` dependency** → core synthesis pipeline non-executable without GPU [RUNTIME-VERIFIED]  
5. **`snappy` undocumented transitive dependency** → `convert_to_mds.py` fails to import even with `mosaicml-streaming` installed; requires system-level `libsnappy-dev` not listed in README [RUNTIME-VERIFIED]  
6. **Python version mismatch** → `environment.yaml` requires Python ≤3.12 (PyTorch/vllm constraint); local Python 3.14.3 cannot install `mosaicml-streaming==0.13.0` (numpy<2.2 conflict) [RUNTIME-VERIFIED]  

> **Reproducibility layer distinction:** Several findings above describe infrastructure-bound constraints common in HPC-scale ML research: GPU-only inference, HPC-coupled paths, transitive native dependencies, and version-sensitive packaging. The `p2_short_floor` dual default is categorically different. It is a code-structural defect independent of environment: the same repository, on identical hardware, can produce different corpora depending solely on which invocation path is taken. Infrastructure dependence is a deployment reality. The dual-default is a correctness gap.

---

## Executive Summary

```
Final Tier:       T0 Rejected (32/100) — STEM-BIO-AI
SLOP Status:      critical_deficit (avg 52.7/100) — AI-SLOP-DETECTOR
E2E Pass Rate:    69.0% (29 PASS / 11 WARN / 2 FAIL / 42 tests)
Code Risk:        Immediate: 2 items | Short-term: 9 items | Acceptable: 92 items
Paper Fidelity:   VERIFIED 8 / PARTIAL 3 / UNVERIFIABLE 1 / CONTRADICTED 0
```

`doctobert` is Doctolib Lab's French medical-domain language model pretraining pipeline. Pipeline interface design and Pydantic schema enforcement are structurally sound. However, **governance surfaces essential to a clinical-adjacent repository are absent**, and **one confirmed reproducibility bug** affects corpus generation.

---

## 1. STEM-BIO-AI Diagnostic

### 1-1. Score Matrix

| Stage | Item | Score | Weight | Contribution |
|-------|------|------:|-------:|-------------:|
| Stage 1 | README Intent Signal | 60/100 | 40% | 24.0 |
| Stage 2R | Repo-Local Consistency | 40/100 | 20% | 8.0 |
| Stage 3 | Code / Bio Responsibility | **0/80** | 40% | **0.0** |
| — | Risk Penalty | 0 | — | 0 |
| **Total** | | | | **32/100** |

**Final Tier: T0 Rejected** *(provisional — see T2 false-negative note below; score computed on incomplete submodule checkout)*

> [!CAUTION]
> Stage 3 scores 0/80. All six rubric items (T1 CI/CD, T2 tests, T3 CHANGELOG, B1 data provenance, B2 bias/limitations, B3 COI/funding) return zero.

### 1-2. Stage-by-Stage Rationale

**Stage 1 (README Intent) — 60/100**

| Rubric | Score | Basis |
|--------|------:|-------|
| Baseline | +60 | Non-nascent README |
| S1_domain_readme | +10 | Medical vocabulary present |
| R2_regulatory_framework | −5 | CA-INDIRECT surface lacks governance language |
| R3_clinical_disclaimer | −5 | No non-clinical / non-diagnostic boundary |
| **Total** | **60** | |

**Stage 2R (Repo-Local Consistency) — 40/100**

| Rubric | Score | Basis |
|--------|------:|-------|
| Baseline | +60 | Sufficient local structure |
| R2R_D2 missing clinical boundary | −20 | `clinical_adjacent=True`; no non-clinical disclaimer detected |
| **Total** | **40** | Local contradiction flagged |

**Stage 3 (Code / Bio Responsibility) — 0/80**

| Rubric ID | Item | Score | Max | Basis |
|-----------|------|------:|----:|-------|
| T1_CI_CD | CI/CD workflows | 0 | 15 | `.github/workflows/` absent (E2E confirmed) |
| T2_domain_tests | Domain tests | 0 | 15 | **Scanner false negative** — tests exist at `data_curation/data_processing/tests/test_recursive_split.py` (3 tests, runtime-verified by external review: `pytest` → 3 passed). Scanner did not recurse into nested test directories. Score is understated. Additionally, the `ModernBERT` submodule (uninitialized) may contain further test surface. **[SUBMODULE-UNVERIFIED]** |
| T3_changelog | CHANGELOG | 0 | 15 | No CHANGELOG detected (E2E confirmed) |
| B1_data_provenance | Data provenance | 0 | 15 | No dependency/provenance manifest |
| B2_bias_limitations | Bias / limitations | 0 | 15 | No bias or limitations language in code repository. **Note:** The companion paper (arXiv:2606.22079 §6) contains a formal Limitations section (3 categories) and an Ethical Considerations section (PHI/PII disclosure). These are absent from the code repo. Users relying solely on the code repository have no in-repo access to these disclosures. |
| B3_coi_funding | COI / funding | 0 | 5 | No COI or funding disclosure in code repo. Paper acknowledgments cite GENCI HPC allocation (public compute funding). |

### 1-3. Classification

```
clinical_adjacent:              true
ca_severity:                    CA-INDIRECT
has_explicit_clinical_boundary: false
score_cap:                      69 (CA ceiling active)
t0_hard_floor:                  false
```

---

## 2. AI-SLOP-DETECTOR Diagnostic

### 2-1. Summary Metrics

| Metric | Value | Direction | Health |
|--------|------:|-----------|--------|
| **Overall status** | **critical_deficit** | — | [!] |
| Files analyzed | 29 | — | — |
| Files with deficits | 24/29 (82.8%) | Lower is better | [!] |
| **Average deficit score** | **52.7/100** | Lower is better | [!] |
| Weighted deficit score | 60.8/100 | Lower is better | [!] |
| Average LDR | 0.997 | Lower is better | [!] |
| Average inflation | 0.007 | Lower is better | [+] |
| Average DDC | 0.980 | Lower is better | [!] |
| Structural cohesion | 0.732 | Higher is better | [*] |

> **LDR Interpretation Note:** LDR=0.997 would indicate near-zero original logic density in a standalone system. `doctobert` is a **HuggingFace `Trainer`-and-`vllm`-delegation pipeline** where algorithmic logic resides in upstream libraries by architectural choice. This pattern legitimately produces low LDR scores and should not be equated with AI-generated boilerplate. The structural cohesion score of 0.732 reflects genuine internal organization.

### 2-2. Priority Hotspots (by deficit score)

| Rank | File | Deficit Score | Grade |
|------|------|-------------:|-------|
| 1 | `model_building/tokenizer/minhash_deduplication.py` | **92.3** | critical |
| 2 | `data_curation/data_synthesis/postprocess_extract.py` | **88.5** | critical |
| 3 | `model_building/mds_conversion/convert_to_mds.py` | **82.4** | critical |
| 4 | `data_curation/data_classification/postprocess_llm_annotation.py` | **76.0** | critical |
| 5 | `data_curation/data_synthesis/llm_rewrite.py` | **75.9** | critical |

> `minhash_deduplication.py` (rank 1) is a thin wrapper over the `datatrove` library's `MinhashDedupSignature` / `MinhashDedupCluster` pipeline. The high deficit score reflects delegation architecture, not code quality failure.

---

## 3. E2E 5-Pillar Diagnostic

### 3-1. Pillar Summary

> **v2 correction:** v1 reported P2 PASS = 4 (total 28). The E2E JSON source (`e2e_diagnostics_report.json`) records PASS = 29. Manual reconciliation identifies `commented_code_blocks` (P2, PASS) as the miscounted item. Corrected table below.

| Pillar | Purpose | PASS | WARN | FAIL |
|--------|---------|-----:|-----:|-----:|
| P1 — JSON artifact validation | STEM-BIO-AI output structure and integrity | 7 | 2 | 0 |
| P2 — Code AST quality | Parse errors, god functions, handlers | **5** | 3 | 0 |
| P3 — Pipeline interface | Pydantic, style sampling, JSON extraction | 13 | 0 | 0 |
| P4 — Schema / compliance | CI, tests, license | 3 | 2 | 2 |
| P5 — Reproducibility / hygiene | Seeds, telemetry, GPU dependency | 1 | 4 | 0 |
| **Total** | | **29** | **11** | **2** |

**Overall pass rate: 69.0%** (29/42; source: `e2e_diagnostics_report.json`, `pass_rate: 0.6905`)

### 3-2. Key Findings

**Failures:**
- `P4 ci_workflows_missing` — No GitHub Actions workflows present
- `P4 changelog_missing` — No CHANGELOG; release history untracked

**Notable Warnings:**
- `P1 airi_coverage_rate` — Reported `coverage_rate=0.062` (2/32, bundle-scoped) vs. E2E-computed `0.011` (2/~182, full AIRI catalog). Discrepancy reflects scope definition, not arithmetic error; denominator should be explicit in the report.
- `P1 dummy_injection_integrity` — Score field can be overridden without rubric recomputation
- `P2 god_functions` — 4 functions exceed 150 lines (see §7.3)
- `P4 license_present` — No LICENSE file (WARN, not FAIL)
- `P5 hf_telemetry_call` — `send_example_telemetry()` present in `train_classifier.py:269`. **Context:** this file is adapted from an official HuggingFace Transformers example (`run_classification.py`) and the telemetry call is part of that upstream template. Attribution: `train_classifier.py:1–4` states this explicitly. Governance concern remains valid; attribution context reduces Doctolib's direct culpability.
- `P5 vllm_hard_dependency` — No CPU fallback; core synthesis pipeline requires GPU. **[RUNTIME-VERIFIED]:** `llm_generate.py --help` and `llm_rewrite.py --help` both fail immediately with `ModuleNotFoundError: No module named 'vllm'` on any non-GPU environment. vllm==0.19.0 additionally requires Linux + CUDA 12.8 + Python ≤3.12; it is not installable on Windows, Python 3.14, or CUDA ≤11.x.
- `P5 hardcoded_internal_paths` — **[RUNTIME-VERIFIED count: 20 active]** — 20 non-commented HPC path occurrences across 6 files (corrected from initial estimate of 4; see §6-1 for full breakdown).

**Strengths:**
- P3 pipeline interface: 13/13 PASS — Pydantic schemas, JSON extraction, and style-sampling logic are robust
- AST parse errors: 0 across all 31 files
- Bare `except:` (fail-open) handlers: 0
- `environment.yaml`: complete (12,017 bytes), dependencies pinned, submodule `ModernBERT` pinned to branch

---

## 4. Code Analysis — God Functions

### 4-1. Functions >150 Lines — Full E2E Count + Manual Analysis

The E2E AST scan identified **12 functions exceeding 150 lines** across the codebase. The four below were selected for manual analysis because they appear in core production pipeline files. The remaining 8 are in visualization scripts (`plot_term_density_distribution.py`, `plot_edu_quality_distribution.py`) and are excluded from the production risk assessment.

| Function | File | Lines | Docstring | Assessment |
|----------|------|------:|-----------|------------|
| `main()` | `train_classifier.py` | **477** | None | HuggingFace example fork (see §4-2); SRP violated |
| `worker_process_one_parquet()` | `convert_to_mds.py` | 231 | Partial | Complex but coherent; multiprocessing closure concern is **not a real risk** (see §4-3) |
| `main()` | `llm_rewrite.py` | 200 | None | 40-parameter CLI; refactorable via `LLMConfig` dataclass |
| `main()` | `convert_to_mds.py` | 153 | Full | Acceptable |
| *(8 more in visualization scripts)* | `plot_*.py` | 150–400 | Varies | Visualization-only; not in production pipeline path |

### 4-2. `train_classifier.py` — HuggingFace Fork Context

`train_classifier.py:1–4` declares:
```
Adapted from https://github.com/huggingface/transformers/blob/main/
examples/pytorch/text-classification/run_classification.py
```

The 477-line `main()`, 20+ argparse dataclasses, `send_example_telemetry()`, and logging boilerplate are all **inherited from the upstream HF example**. Doctolib additions are localized to column-handling logic and the `# todo: unify columns` gap. This context does not eliminate the SRP violation, but it correctly frames authorship and the telemetry source.

Recommended decomposition (Doctolib-specific additions only):
```python
def _load_and_preprocess(data_args, tokenizer) -> DatasetDict: ...  # ~100 lines
def _build_model(model_args, data_args, num_labels) -> tuple: ...   # ~60 lines
def _build_trainer(model, args, datasets, metrics_fn) -> Trainer: ...  # ~80 lines
def main() -> None: ...  # ~30 lines (orchestration only)
```

### 4-3. Multiprocessing Closure Risk — False Positive (v1 Correction)

v1 classified internal closures in `worker_process_one_parquet()` as a short-term multiprocessing risk. **This finding is incorrect and is retracted.**

Evidence:
- `pool.starmap(worker_process_one_parquet, args)` — only the **module-level** `worker_process_one_parquet` is pickled; this is safe
- `_filter_func_p1`, `_filter_func_p1_quality`, `_filter_func_p1_universal` are defined inside the worker and consumed in the same process via `ds.filter()` — no cross-process serialization occurs
- `_process_func` (which does capture `tokenizer` via closure) is **dead code**: the `ds.map(_process_func, ...)` call block is entirely commented out (lines 226–232)

**Action: remove this item from the risk matrix.**

---

## 5. Code Analysis — Structural Defects

### 5-1. `load_local_dataset` — 16 Copies, 9 Distinct Implementations

> **This finding was absent from v1. It is the most significant structural defect identified in manual review.**

The function `load_local_dataset` is defined in **16 Python files** across the codebase. Static analysis identifies **9 distinct implementations**:

| Variant | Files | Key Divergence |
|---------|------:|----------------|
| V1 | 1 | Baseline (`eval_classifier.py`) |
| V2 | 1 | `eval_ner.py` — minor docstring diff |
| **V3** | **6** | Most common: `filter_by_domain.py`, `run_dataset_classifier.py`, `split_document.py`, `convert_to_mds.py`, `eval_tokenizer.py`, `prep_spm_input.py` |
| V4 | 2 | `gliner_annotate.py`, `postprocess_datatrove.py` |
| V5 | 2 | `llm_annotate.py`, `mix_and_sample.py` |
| V6 | 1 | `stats_dataset.py` — adds `num_proc` parameter |
| **V7** | **1** | `llm_generate.py` — adds `.zip` support via `file_generator` |
| **V8** | **1** | `llm_rewrite.py` — **directory handling diverges**: uses `glob("*.parquet")` instead of `load_dataset(dir)` |
| V9 | 1 | `postprocess_extract.py` — adds `num_proc` parameter |

**Critical divergence — V8 (`llm_rewrite.py`) vs. all others:**

```python
# V3/V4/V5/V7 — HuggingFace auto-detect
elif os.path.isdir(input_path):
    return load_dataset(input_path, split="train")

# V8 (llm_rewrite.py only) — manual parquet glob
elif os.path.isdir(input_path):
    parquet_files = sorted(glob.glob(os.path.join(input_path, "*.parquet")))
    if parquet_files:
        return load_dataset("parquet", data_files=parquet_files, split="train")
    return load_dataset(input_path, split="train")  # fallback
```

The two branches produce different Arrow schemas and caching behavior for the same input directory. A bug fix applied to one copy will not propagate to the remaining 15.

**Risk:** Silent data loading discrepancies across pipeline stages; undetected regressions when one copy is patched.

**Recommendation:** Extract a single `utils/io.py` module. Estimated effort: 2–3 hours.

### 5-2. `convert_to_mds.py` — Transitive `snappy` Dependency [RUNTIME-VERIFIED]

**Runtime test:** `fire==0.7.1` + `mosaicml-streaming==0.13.0` installed (no-deps) → `convert_to_mds.py --help` executed.

**Result:**
```
ModuleNotFoundError: No module named 'snappy'
```

`snappy` is a C extension (Python-snappy) that wraps Google's Snappy compression library. It is a transitive dependency of `mosaicml-streaming` but is not listed anywhere in the repository's README or `environment.yaml`. On Windows it requires a pre-built binary or a native Snappy installation; no wheel exists for Python 3.14. On Linux it requires `libsnappy-dev` as a system package.

**Reproducibility impact by platform:**

| Platform | `fire` only | `fire` + `streaming` (no-deps) | Full env |
|----------|:-----------:|:------------------------------:|:--------:|
| split_document.py --help | PASS [RV] | PASS [RV] | Required |
| convert_to_mds.py --help | FAIL (streaming) | FAIL (snappy) | Required |
| llm_generate.py --help | FAIL (vllm) | FAIL (vllm) | Required |

[RV] = Runtime-Verified in this audit. "Required" = full `environment.yaml` conda env mandatory; not tested.

**Finding:** `convert_to_mds.py` is more dependency-heavy than its static structure suggests. A user attempting minimal reproduction encounters a multi-layer transitive dependency chain (`streaming → snappy → libsnappy-dev`) with no documentation in the README. This is an additional undocumented external dependency beyond the `vllm` GPU requirement.

### 5-3. `p2_short_floor` Dual Default — Confirmed Reproducibility Bug

```python
# convert_to_mds.py:111
def worker_process_one_parquet(..., p2_short_floor: int = 256, ...):

# convert_to_mds.py:345
def main(..., p2_short_floor: int = 128, ...):
    args = [(..., p2_short_floor, ...) for ...]  # line 409: main's 128 is passed
    pool.starmap(worker_process_one_parquet, args)
```

**Normal execution path:** `main()` passes 128 to all workers — corpus is generated with floor=128.  
**Direct worker invocation:** default of 256 applies — different corpus produced.

Anyone attempting to reproduce a pipeline stage by invoking `worker_process_one_parquet` directly (e.g., debugging a single parquet) will get a different result than the paper pipeline. This is a concrete reproducibility defect.

**Fix:** Define `DEFAULT_P2_SHORT_FLOOR = 128` and use it in both signatures.

### 5-4. Active `# tmp` Markers on Live Code

The following markers are on **executing code paths** (not commented-out blocks):

| Location | Code | Impact |
|----------|------|--------|
| `llm_rewrite.py:840` | `# tmp pre-filter (approx has_medical_content…)` above active `dataset.filter(...)` | Coarse pre-screen (paper §5.1) tagged provisional in active pipeline |
| `llm_generate.py:13` | `# tmp control` above `gen_name = os.environ.get("GEN_NAME")` | Module-level global reads env var at import time; the `# tmp` tag signals intended refactoring |
| `run_dataset_classifier.py:62` | `# todo: tmp func` on `get_num_words` call | Production parameter relies on a function marked for replacement |

> **v1 classification of `split_document.py:226` as CRITICAL is retracted.** The `## tmp: keep only med01 ∧ edu4` comment appears above a fully commented-out `dataset.filter(...)` block (lines 228–233). The filter is **inactive**. The annotation is a historical note; reclassified to LOW.

### 5-5. Docstring Coverage

```
Total public functions (excluding analysis scripts): 217
Functions with docstrings:                          130
Coverage:                                           59.9%
```

> v1 reported 63.6% coverage from the STEM-BIO-AI scanner (which included the 30-file set with the analysis script). The 59.9% figure is for the 29 production Python files. Both figures confirm meaningful coverage gaps on large functions.

---

## 6. Hardcoded Values Analysis

### 6-1. HPC Absolute Paths — Active vs. Inactive

| Category | Count | Assessment |
|----------|------:|-----------|
| **Active code** (non-commented lines with `/lustre/` or `/projects/rech/`) | **20** across 6 files | [!] `FileNotFoundError` outside Jean Zay; see breakdown below |
| Commented paths (sbatch examples, disabled corpus entries) | ~26 | [+] Documentation/history purpose; harmless |

**Active path breakdown by file:**

| File | Active count | Context |
|------|-------------|---------|
| `plot_term_density_distribution.py` | 6 (L628–630, L804–806) | Visualization tuples |
| `plot_edu_quality_distribution.py` | 3 (L250–252) | Visualization tuples |
| `postprocess_llm_annotation.py` | 4 (L578–581) | Active corpus path list |
| `eval_tokenizer.py` | 2 (L313, L379) | root_path + tmp_output_file |
| `prep_spm_input.py` | 3 (L204, L212, L219) | Active corpus dict entries |
| `postprocess_extract.py` | 1 (L168) | Hardcoded model path string |
| `llm_rewrite.py` | 1 (L682, engine reference) | Model path in log statement |

Active path example:
```python
# plot_term_density_distribution.py:804 — executes at runtime
("fineweb-2", "/lustre/fsn1/projects/rech/ilr/commun/corpus/fineweb-2/...")
```

### 6-2. Magic Numbers — Selected

| Value | Location | Assessment |
|-------|----------|-----------|
| `p2_short_floor` 256/128 | `convert_to_mds.py:111, 345` | [!!] Confirmed bug — see §5-2 |
| `8192` (max_tokens) | CLI defaults | [*] Constant extraction recommended |
| `512` (batch_size) | CLI defaults | [+] GPU-spec dependent; acceptable |
| `300` (dpi) | Plot saves | [+] Standard value; safe |

---

## 7. Provisional Code Risk Summary

> All items below refer to the production codebase. The analysis script (`stem-bio-ai output/e2e_diagnostics.py`) is excluded.

```
Severity       Count   Items
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[!!] Immediate    2    p2_short_floor dual default (reproducibility bug)
                       load_local_dataset V8 divergence (silent data mismatch)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[!]  Short-term   9    CI/CD absent
                       LICENSE absent / CHANGELOG absent
                       20 active HPC paths across 6 files (§6-1)
                       llm_rewrite.py::main() 40 parameters
                       llm.chat migration incomplete (2 files, not synchronized)
                       Column naming inconsistency (train_classifier.py:248)
                       tmp pre-filter marker on active llm_rewrite:840 code
                       run_dataset_classifier get_num_words marked tmp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[*]  Medium-term 11    59.9% docstring coverage on public functions
                       HF telemetry undisclosed to end users (HF example inheritance)
                       vllm GPU-only dependency undocumented
                       max_tokens / batch_size constant extraction
                       convert_to_mds dead code (_process_func block) removal
                       Visualization script god functions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[+]  Acceptable  92    Commented HPC paths (reference purpose)
                       dpi=300 (standard)
                       28 visualization-only tmp comments
                       seed=42 CLI defaults
                       sbatch example comments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> **Items retracted from v1:** multiprocessing closure risk (§4-3); `split_document.py:226` CRITICAL classification (§5-3).

---

## 8. Claim Traceability Analysis

*This section systematically maps each formal contribution claim in arXiv:2606.22079 to its code-observable implementation evidence. It functions as a technical due-diligence layer on the paper's stated contributions.*

### 8-1. Methodology

For each claim, the following fields are assessed:
- **Paper verbatim** — exact wording from the paper
- **Code location** — file and line range checked
- **Evidence** — what the code shows
- **Verdict** — VERIFIED / PARTIAL / UNVERIFIABLE / CONTRADICTED
- **Legal note** — implication for due diligence

Verdicts are defined as:
- **VERIFIED** — code implementation matches the paper description; the claim is substantiated by static evidence
- **PARTIAL** — implementation exists but is incomplete, provisional, or scope-limited relative to the claim
- **UNVERIFIABLE** — claim cannot be assessed from static code analysis; runtime or external data required
- **CONTRADICTED** — code evidence directly conflicts with the paper claim (none found in this audit)

### 8-2. Claim-by-Claim Traceability Table

| # | Paper Claim | Section | Verdict | Key Evidence |
|---|-------------|---------|---------|--------------|
| C1 | MGA 2-stage (stage1/stage2) pipeline | §3.3 | **VERIFIED** | `MGAStage1Output`, `stage==1/2` branching, `mga_official` version string |
| C2 | Medical-term density ≥0.1 / ≥0.2 thresholds | §4.1 | **VERIFIED** | `convert_to_mds.py:77–78` — `med01`/`med02` lambda predicates |
| C3 | Educational quality ≥2 / ≥4 thresholds | §4.1 | **VERIFIED** | `convert_to_mds.py:75–76` — `edu2`/`edu4` lambda predicates |
| C4 | GLiNER 8-class UMLS medical entity extractor | §3.2.3 | **VERIFIED** | `gliner_annotate.py:100–109` — active `MEDICAL_ENTITIES` dict has exactly 8 classes matching paper Table 17. Earlier commented-out blocks (L58–98) are prior iteration history. |
| C5 | Reproducible curation pipeline released | §1 | **PARTIAL** | CLI entry points exist; training execution scripts absent; 4 active HPC paths constrain external execution; `# tmp` marker on active coarse pre-screen (C11) |
| C6 | PII replaced with fictional values | §3.3 | **PARTIAL** | `is_rewritable` Pydantic field + system prompt instructions; no post-hoc compliance audit code present. Paper §6 "Ethical Considerations" explicitly acknowledges: *"we do not audit instruction compliance post-hoc"* |
| C7 | Register × abbreviation style dimensions | §3.3 | **VERIFIED** | `sample_rewriting_style()` implements multiple dimensions; paper's declared dimensions plus `view` and `verbosity` are all present |
| C8 | SentencePiece BPE, vocabulary size matching | §5.2 | **VERIFIED** | `train_spm.py`, `trim_tokens.py` with round-to-64 alignment logic |
| C9 | 3-phase, 240B-token training for DoctoModernBERT | §5.2 | **UNVERIFIABLE** | No training execution script in main repo. `sbatch` comments reference phases. The `ModernBERT` Git submodule (uninitialized in this checkout) is documented as the pretraining framework and may contain `scripts/`, `main.py`, and `yamls/` — which could partially address this gap. **[SUBMODULE-UNVERIFIED]** |
| C10 | Medical-content gating (`is_rewritable`) | §3.3 | **VERIFIED** | `is_rewritable: bool` Pydantic field in `RewritingOutputV3_1`; logic in `postprocess_extract.py` |
| C11 | Coarse pre-screen (density≥0.01 AND edu≥1) | §5.1 | **PARTIAL** | Active filter at `llm_rewrite.py:842–847` is functional; `# tmp pre-filter` marker indicates the authors consider this code provisional. Paper presents it as a completed contribution. |
| C12 | Diverse (genre, audience) pairs, k=1 sampling | §3.3 | **VERIFIED** | `n_stage1_pairs=5`, `sample_stage1_output(..., k=1)` present |

### 8-3. Aggregate Fidelity

| Verdict | Count | Share |
|---------|------:|------:|
| VERIFIED | **8** | 66.7% |
| PARTIAL | **3** | 25.0% |
| UNVERIFIABLE | **1** | 8.3% |
| CONTRADICTED | **0** | 0.0% |

> **v2 correction:** C4 (GLiNER 8-class) was classified PARTIAL in v1. Manual inspection of `gliner_annotate.py:100–109` confirms an active 8-entry `MEDICAL_ENTITIES` dict that matches Table 17 of the paper exactly. Commented blocks above it are earlier taxonomy iterations. C4 is upgraded to **VERIFIED**.

### 8-4. Legal Interpretation

**No claim in the paper has been found to be directly contradicted by the code.** All numerical results (Table 1–6) are model evaluation outputs that require runtime reproduction and are outside the scope of static analysis.

The three PARTIAL verdicts share a common root cause: **publication-to-release lag**. The code was released simultaneously with the paper but contains active `# tmp` markers indicating ongoing cleanup at publication time. This is a **reproducibility quality issue**, not evidence of misrepresentation. The paper's "reproducible pipeline" contribution is qualified by the execution constraints documented in §[!!] above.

The one UNVERIFIABLE item (C9, training execution) is the most consequential: the central performance claims of the paper (Tables 5 and 6) rest on training runs whose exact configuration cannot be verified from the released code. This is a limitation of the release, not a defect in the paper itself. See D0 in §13: submodule initialization is the highest-priority deferred item because it is the concrete follow-up most likely to narrow or resolve the C9 uncertainty.

---

## 9. Governance and Legal Review

### 9-1. Licensing Posture — Indeterminate

The code repository contains **no LICENSE file**. Under the Berne Convention (applicable in France, the EU, and most jurisdictions), unpublished works default to "all rights reserved." This creates a direct tension with the paper's positioning of the codebase as an open contribution.

| Surface | License | Status |
|---------|---------|--------|
| GitHub code repository | **None** | Indeterminate — no grant of use, copy, or modification rights |
| HuggingFace model cards (both models) | **Apache-2.0** | Explicit grant |
| arXiv paper | **CC BY 4.0** | Explicit grant |

**Consequence for downstream users:** A user who trains a derivative model using the code pipeline operates in legal uncertainty. The Apache-2.0 model license does not extend to the code used to produce it. A party wishing to use the pipeline code cannot rely on the Hub model license as cover.

**Consequence for Doctolib:** The absence of a LICENSE is likely an oversight, but it technically preserves Doctolib's ability to assert copyright over the code even after public release.

**Recommended action:** Add `LICENSE` (Apache-2.0 for consistency with the models) immediately. This resolves the indeterminate posture in both directions.

### 9-2. Clinical Disclaimer Absent

`clinical_adjacent=True` (CA-INDIRECT classification). The repository README and all code files contain no non-clinical, non-diagnostic boundary statement. The paper §5.3 explicitly describes evaluation on a **"proprietary clinical NER task from a real-world production setting."**

Applicable frameworks with open gaps:

| Framework | Requirement | Status |
|-----------|------------|--------|
| EU AI Act Art. 13 (Transparency) | IFU and limitation documentation | Not detected in code repo |
| IMDRF SaMD Clinical Eval (2017) | Clinical context boundary | Not detected |
| ICH M15 §2.1.2 (Context of Use) | *"concise, clear, explicit description of role and scope"* | Not detected |

> **Note:** This analysis does not determine whether `doctobert` falls under the EU AI Act's high-risk AI system definition (Annex III). That determination requires a conformity assessment by a qualified body and is outside the scope of this audit.

### 9-3. PHI / PII Handling

Paper §6 "Ethical Considerations" states:
> *"These sources may contain PII and, in medical pages, Protected Health Information (PHI), all already publicly accessible. We do not add de-identification on the raw side."*
> *"we do not audit instruction compliance post-hoc."*

This disclosure exists **only in the paper**, not in the code repository README or any code comment. Users who access the code without reading the paper have no notice of the PHI/PII posture.

GDPR implications (France, EU): Web-scraped medical content containing PHI from French citizens may implicate GDPR Articles 9 and 17. The paper's disclosure of no raw-side de-identification is an honest acknowledgment that this processing occurred. The downstream obligation to "apply task-appropriate anonymization" is stated in the paper but is not surfaced to code users.

### 9-4. HuggingFace Telemetry

`train_classifier.py:269` calls `send_example_telemetry("run_classification", model_args, data_args)`, which transmits training configuration metadata to HuggingFace servers. This is **inherited from the upstream HF Transformers example code** and is standard HF example behavior.

In a clinical or regulated environment, any network transmission during training that is not explicitly disclosed may conflict with data handling policies. The practical risk is low (metadata, not patient data), but the absence of documentation in the README creates an undisclosed external dependency.

---

## 10. Strategic Context Appendix — Speculative, Non-Diagnostic

> **Appendix scope note:** This appendix extends the analysis beyond the code repository into strategic, regulatory, and market interpretation. It is provided as **non-diagnostic background only**. It does **not** alter the STEM-BIO-AI score, E2E counts, Paper Fidelity verdicts, Executive Summary, or Final Verdict. Items in this appendix are classified as **INFERRED**, **SUPPORTED INFERENCE**, or **SPECULATIVE** as labeled and should not be read with the same evidentiary weight as §§1–9 and §§11–14.

### 10-1. Ecosystem Map

![DoctoBERT Strategic Ecosystem Map](doctobert_ecosystem_map.png)

*Figure 1 — DoctoBERT positioned within the French healthcare AI ecosystem. Five layers: regulatory (EU AI Act, GDPR/CNIL, France 2030, Berne Convention), public infrastructure (Health Data Hub, APHP, GENCI Jean Zay, DrBenchmark), Doctolib core, competition, and downstream market. Arrow colors: regulatory pressure (blue-purple), public infra flow (blue), strategic leverage (green), risk/paradox (red).*

---

### 10-2. The Pivot Thesis — From Scheduling to Intelligence Layer

Doctolib's core business (`doctolib.fr`) serves approximately **80M patient accounts and 400K healthcare-professional subscribers** across France, Germany, Italy, and the Netherlands (source: Sifted 2024). That scheduling market has a finite ceiling: platform fee models commoditize, and domestic competitors (Maiia, Mondocteur, Keldoc) provide pricing pressure. The pivot thesis is **[SUPPORTED INFERENCE]** — Doctolib's public statements include ~€115M R&D investment and an AI consultation assistant used in 2M+ consultations (source: Doctolib CFO statements, LinkedIn / Les Échos), signaling active expansion toward clinical workflow intelligence. DoctoBERT signals a **second revenue axis**:

| Axis | Current (Scheduling) | Target (Medical AI) |
|------|---------------------|---------------------|
| **Revenue model** | Per-professional SaaS subscription | Clinical NLP licensing, B2B/B2G contracts |
| **Customer type** | Individual doctors, clinics | Hospitals, insurers, pharma, ANS/government |
| **Contract value** | €hundreds/year per professional | €hundreds of thousands per enterprise agreement |
| **Competitive moat** | Booking UX, network effects | Domain model + proprietary data pipeline |
| **Marginal cost** | ~0 per new booking | Model inference, fine-tuning support |
| **Revenue ceiling** | Bounded by French healthcare market size | Larger than scheduling; precise EU clinical NLP market size requires dedicated sourced citation — not stated here [SPECULATIVE] |

**Code evidence supporting this inference:** The paper evaluates DoctoBERT on a *"proprietary clinical NER task from a real-world production setting"* (§5.3, Table 6). This is not a generic benchmark — it implies an active internal clinical NLP pipeline. The infrastructure to train domain models at scale (Jean Zay HPC) is already in operation.

---

### 10-3. The French Healthcare AI Ecosystem — Doctolib's Position

| Actor | Relationship to Doctolib | Strategic Significance |
|-------|--------------------------|----------------------|
| **GENCI / Jean Zay HPC** | 2 confirmed public compute allocations (allocations 2025-AD011016291, 2026-A0200617487) | Public-interest research positioning; cost subsidy; government alignment signal |
| **Health Data Hub (PDS)** | France's national health data platform (SNDS, 72M patient records) | Potential future data partnership; FineMed v2 could incorporate structured clinical data |
| **APHP** | DrBenchmark evaluation infrastructure co-used; Paris hospital system | First-mover B2B customer for clinical NER licensing; reference account |
| **France 2030 plan** | National industrial policy context (€54B total investment; health AI pillar confirmed — source: info.gouv.fr) | Potential alignment signal for health-tech actors; Doctolib's direct funding eligibility is **not confirmed** [SPECULATIVE] |
| **SÉGUR du numérique** | French digital health interoperability and certification framework | May become relevant if DoctoBERT-derived functionality is embedded into certified clinical software or public-sector workflows — not a current requirement at the base-model level [SPECULATIVE] |
| **DrBenchmark / INRIA** | Evaluation framework used in paper; open French medical NLP benchmark | Doctolib achieves SOTA → benchmark ownership → standard-setting authority |
| **HuggingFace (Paris HQ)** | Models hosted on Hub; paper co-released on HF blog | Distribution partner, not competitor; HF blog amplifies reach to EU research community |

---

### 10-4. The "Open to Win" Tension — What Is and Is Not Released

DoctoBERT's public release exhibits a layered disclosure effect. The table below maps what is public vs. not demonstrated from this checkout:

| Layer | Status | Legal Posture | Observable Effect |
|-------|--------|--------------|-------------------|
| **Model weights** (DoctoBERT-fr, DoctoModernBERT-fr) | **Public** — Apache-2.0 on HuggingFace | Clear — anyone can use | Establishes Doctolib as a visible French medical NLP actor; supports adoption and citation |
| **FineMed corpus** | **Public** — HuggingFace datasets | Clear — downloadable | Supports ecosystem utility and research reuse |
| **Curation pipeline code** | **Public** — GitHub | **Ambiguous — no LICENSE** | Code is inspectable, but reuse rights remain unclear until license clarification |
| **Training execution scripts** | **Not demonstrated in main repo** — only `sbatch` comments visible here | [SUBMODULE-UNVERIFIED] | Exact external reproduction of model weights is not established from this checkout |
| **Jean Zay internal paths** | **Hardcoded** — active paths in analysis scripts | Functionally non-portable | External reproduction burden is increased by HPC-specific assumptions |
| **Proprietary clinical NER data** | **Not released** — Table 6 evaluation only | Protected | Downstream validation remains partially dependent on inaccessible internal data |

> **[SUPPORTED INFERENCE]** The missing `LICENSE` file has a clear legal effect regardless of intent: under default copyright rules, the code repository remains all-rights-reserved unless Doctolib grants explicit reuse rights. The available evidence does **not** establish whether this was oversight, release incompleteness, or deliberate retention. The observable consequence is legal ambiguity for third-party reuse, not a provable statement about motive.

---

### 10-5. EU AI Act Regulatory Analysis — Regulation (EU) 2024/1689

> **Source:** All Article and Annex citations below are from the Official Journal of the European Union, OJ L 2024/1689, 12 July 2024 (CELEX 32024R1689), the authoritative text of the EU Artificial Intelligence Act.

---

#### Gate 1 — Scope: Does the Regulation Apply?

Three scope exemptions from Article 2 are directly relevant to DoctoBERT's release posture.

**Art. 2(6) — Scientific research exemption [STRONGEST SHIELD]:**
> *"This Regulation does not apply to AI systems or AI models, including their output, specifically developed and put into service for the sole purpose of scientific research and development."*

DoctoBERT and DoctoModernBERT are released via an arXiv preprint (arXiv:2606.22079, CC BY 4.0) and positioned explicitly as research contributions. The paper's stated purpose is advancing French medical NLP, not deploying a clinical product. **This exemption is the primary legal basis for non-applicability at release time.**

**Art. 2(8) — Pre-market exemption:**
> *"This Regulation does not apply to any research, testing or development activity regarding AI systems or AI models prior to their being placed on the market or put into service."*

The repository is a codebase and set of model weights published for research reproduction, not a commercial service placed on the Union market. No pricing, API access tier, or terms-of-service for a commercial product are present.

**Art. 2(12) — Open-source exemption [PARTIAL — code gap]:**
> *"This Regulation does not apply to AI systems released under free and open-source licences, unless they are placed on the market or put into service as high-risk AI systems or as an AI system that falls under Article 5 or 50."*

| Surface | License | Art. 2(12) Applies? |
|---------|---------|---------------------|
| Model weights (HuggingFace Hub) | Apache-2.0 | **YES** — explicit open-source license |
| arXiv paper | CC BY 4.0 | **YES** |
| GitHub code repository | **None** | **NO** — no license = Berne "all rights reserved" |

> **[CRITICAL RISK]** The code repository's missing LICENSE file means it cannot claim the Art. 2(12) open-source exemption. If the codebase were later characterised as a component of a commercial AI system, the exemption that protects the models does not protect the code pipeline. **This is the single most actionable legal risk from the licensing gap.**

---

#### Gate 2 — High-Risk Classification: Does Annex III Apply?

If the Regulation applies (Gates 1 exemptions fail), the next question is whether DoctoBERT qualifies as a high-risk AI system under Art. 6.

**Art. 6(1) — Product safety component test:**
DoctoBERT is not a safety component of any product listed in Annex I (machinery, medical devices, radio equipment, etc.). Gate 1 of the high-risk test is **not met**.

**Art. 6(2) + Annex III — Listed use-case test:**

Annex III enumerates the following high-risk categories (full text, OJ L 2024/1689):

| Annex III Category | Description | Applies to DoctoBERT? |
|--------------------|-------------|----------------------|
| 1. Biometrics | Remote biometric ID, categorisation, emotion recognition | No |
| 2. Critical infrastructure | Safety components for water, gas, electricity, road | No |
| 3. Education | Access/assessment in educational institutions | No |
| 4. Employment | Recruitment, performance monitoring, work allocation | No |
| 5(a) | Public authority evaluation of eligibility for essential healthcare services | **No** — DoctoBERT is not used by public authorities for benefit eligibility |
| 5(b) | Creditworthiness / credit scoring | No |
| 5(c) | Life and health insurance risk assessment and pricing | No |
| 5(d) | Emergency healthcare patient triage systems | **No** — DoctoBERT is a pretraining encoder, not a triage system |
| 6. Law enforcement | Polygraphs, criminal profiling, evidence reliability | No |
| 7. Migration & asylum | Border risk assessment, application evaluation | No |
| 8. Justice & democratic | Legal outcome prediction, electoral influence | No |

**Finding: DoctoBERT-fr and DoctoModernBERT-fr, as general medical encoder models intended for NLP pretraining and NER fine-tuning, do not fall within any category listed in Annex III of Regulation (EU) 2024/1689.** There is no "medical AI" or "clinical NLP" category in the final adopted Annex III. The health-adjacent items (5(a), 5(c), 5(d)) require specific deployment contexts (public authority benefit evaluation, insurance pricing, emergency triage) that are not the stated intended use of DoctoBERT.

**Art. 6(3) — Derogation (safety net, even if Annex III were argued):**
> *"By derogation from paragraph 2, an AI system referred to in Annex III shall not be considered to be high-risk where it does not pose a significant risk of harm to the health, safety or fundamental rights of natural persons, including by not materially influencing the outcome of decision making."*

The derogation applies where the system is intended to:
> *(b) improve the result of a previously completed human activity; or*
> *(d) perform a preparatory task to an assessment relevant for the purposes of the use cases listed in Annex III.*

A medical encoder model used for NER fine-tuning is a preparatory tool for downstream human assessment — it does not itself make clinical decisions. Art. 6(3)(d) provides an additional basis for non-high-risk classification even if Annex III applicability were argued.

---

#### Gate 3 — General-Purpose AI Model (GPAI): Does Art. 51 Apply?

**Art. 3 definition of AI system:** DoctoBERT qualifies as an AI system (*"machine-based system... that infers, from the input it receives, how to generate outputs"*). It may also qualify as a general-purpose AI model (GPAI) that can be integrated into downstream AI systems.

**Art. 51(2) — Systemic risk threshold:**
> *"A general-purpose AI model shall be presumed to have high impact capabilities... when the cumulative amount of computation used for its training measured in floating point operations is greater than 10²⁵."*

DoctoBERT is a ~125M parameter BERT-style encoder pretrained on 240B tokens. Estimated training compute: approximately 10²⁰–10²¹ FLOP — **4–5 orders of magnitude below the 10²⁵ systemic risk threshold**. DoctoBERT is **not a systemic-risk GPAI**.

**Art. 53 — GPAI provider obligations (apply regardless of systemic risk):**

Even non-systemic GPAI providers must comply with Art. 53(1):

| Obligation | Art. 53(1) | DoctoBERT Status |
|-----------|------------|-----------------|
| (a) Technical documentation of model, training, evaluation | Art. 53(1)(a) + Annex XI | **PARTIAL** — arXiv paper covers evaluation; training configuration cannot be statically verified; no Annex XI-format documentation |
| (b) Information for downstream system providers | Art. 53(1)(b) + Annex XII | **PARTIAL** — model card present on HuggingFace; intended use limitations stated; integration guidance absent from code repository |
| (c) Copyright compliance policy | Art. 53(1)(c) | **GAP** — FineMed uses publicly crawled web data; paper §6 discloses no raw de-identification; no explicit copyright reservation compliance policy documented |
| (d) Publicly available training data summary | Art. 53(1)(d) | **SATISFIED** — FineMed corpus described in paper and released on HuggingFace Hub |

---

#### Summary Verdict Table — EU AI Act Applicability

| Question | Answer | Legal Basis |
|----------|--------|------------|
| Does the Regulation apply to DoctoBERT as released? | **Likely NO** — scientific research exemption | Art. 2(6) |
| Does Art. 2(12) open-source exemption apply to model weights? | **YES** — Apache-2.0 | Art. 2(12) |
| Does Art. 2(12) open-source exemption apply to code? | **NO** — no LICENSE file | Art. 2(12) + Berne Convention |
| Is DoctoBERT a high-risk AI system? | **NO** — Annex III has no matching category | Art. 6(2) + Annex III |
| Is DoctoBERT a systemic-risk GPAI? | **NO** — training compute ~10²¹ FLOP vs. 10²⁵ threshold | Art. 51(2) |
| Do GPAI provider obligations (Art. 53) apply? | **POTENTIALLY YES** if classified as GPAI | Art. 53(1) |
| What triggers high-risk status at product layer? | Deployment for triage, clinical decisions, public benefit eligibility evaluation | Art. 6(2) + Annex III §5(a)(d) |

**Preliminary assessment for counsel review:** Based on the OJ L 2024/1689 text analysis above, DoctoBERT's current release posture presents multiple grounds for non-applicability of EU AI Act obligations at the base-model level. The most significant open issue for legal review is the LICENSE gap on the code repository, which prevents the Art. 2(12) open-source exemption from applying to the codebase and creates downstream use uncertainty. The analysis in this section is a technical pre-brief for qualified legal counsel — it is not a legal opinion and does not constitute a finding of compliance or non-compliance.

---

### 10-6. Competitive Landscape

| Competitor | Threat Level | Doctolib's Defensive Move |
|------------|-------------|--------------------------|
| **Mistral AI** | Medium | Mistral is general-domain; no French medical corpora equivalent. If Mistral pivots to medical, DoctoBERT's FineMed corpus and DrBenchmark SOTA are first-mover barriers. |
| **Microsoft / Azure AI Health** | High | Azure has medical NLP products (Text Analytics for Health). French data sovereignty concerns (CLOUD Act) are Doctolib's primary defense. GENCI HPC usage reinforces "data stays in France" narrative. |
| **Google / Med-PaLM** | High | Same sovereignty argument. French government's preference for EU AI champions (France 2030) is structural protection. |
| **APHP internal team** | Low-Medium | APHP has its own AI research (Paris Saclay, PRAIRIE institute). A DoctoBERT-APHP partnership converts this risk into a co-development opportunity. |
| **CamemBERT / INRIA** | Low | CamemBERT is the baseline DoctoBERT explicitly outperforms. INRIA is more likely to collaborate than compete (academic vs. commercial). |
| **Owkin** | Medium | French medical AI startup (oncology focus). Different domain; potential acqui-hire interest in Doctolib's NLP pipeline. |
| **French Competition Authority (Autorité)** | Governance risk (active) | In **November 2025**, the Autorité fined Doctolib **€4,665,000** for abusing its dominant position in online medical appointment booking and remote consultation solutions (exclusive clauses, bundled sales, MonDocteur acquisition issues) — source: autoritedelaconcurrence.fr. This does not affect DoctoBERT technical findings directly, but it establishes that Doctolib operates under active regulatory scrutiny as a dominant-market actor. Any future clinical AI sales strategy may face heightened competition-law review on bundling grounds. |

---

### 10-7. Revenue Pathway Analysis

The following pathways are assessed based on DoctoBERT's technical capabilities and the French healthcare market structure:

| Pathway | Product | Target Customer | Estimated Timeline | Key Blocker |
|---------|---------|----------------|-------------------|-------------|
| **P1 — Clinical NER API** | Hosted inference of DoctoBERT for entity extraction | Private clinics, lab chains | 12–18 months | License clarity; API infrastructure |
| **P2 — Hospital AI Suite** | Fine-tuned models + pipeline for clinical documentation | APHP, CHU networks | 24–36 months | SÉGUR certification |
| **P3 — Insurer Risk Scoring** | Medical entity density scores from claims text | Mutuelle, AXA Santé | 18–24 months | GDPR Art.9 compliance layer |
| **P4 — Pharma NLP** | Clinical trial text mining, drug interaction extraction | Sanofi, Servier, Ipsen | 12–18 months | No regulatory barrier; lowest friction |
| **P5 — Government / ANS** | eHealth terminology standardization, coding assistance | ANS, Ministère de la Santé | 36–48 months | Procurement cycle; requires SÉGUR |

**TAM note [SPECULATIVE — no sourced market figure cited]:** The EU-wide or France-only clinical NLP market size is not stated here without a dedicated market research citation. What is observable: Doctolib's scheduling ARR is €348M; clinical AI contract values at enterprise hospital groups tend to be orders of magnitude larger per deal than individual professional subscriptions. The revenue expansion potential is meaningful — but the governance and reproducibility gaps identified in this audit are concrete, near-term blockers for any B2B sales process with regulated customers.

---

### 10-8. The Critical Business Risk — Reproducibility as a Sales Blocker

The single most consequential finding for Doctolib's B2B ambitions is not a code quality issue — it is a **sales engineering gap**:

> Hospital procurement teams, insurance compliance officers, and ANS certification reviewers will require a **demonstrably reproducible and auditable pipeline** as a condition of purchase. The current codebase cannot satisfy this requirement.

| Requirement | Hospital / ANS Standard | Current Codebase State | Gap |
|-------------|------------------------|----------------------|-----|
| Reproducible training | IMDRF SaMD Eval §4.3; ICH M15 §2.1 | No training execution script | **CRITICAL** |
| Auditable data pipeline | EU AI Act Art.12; FDA QMSR §820.70 | `#tmp` markers on active code | **HIGH** |
| Environment portability | Contractual due diligence | 4 active Jean Zay absolute paths | **HIGH** |
| IP clarity | Legal prerequisite for any contract | No code LICENSE | **CRITICAL** |
| Change history | ISO 13485 §4.2.4 | No CHANGELOG | **MEDIUM** |

**Remediation cost is low; delay cost is high.** The technical fixes identified in §11 (Action Plan) — particularly LICENSE addition and training script publication — could be completed in days. Every month without them is a month where a competitor can claim "production-ready" status first.

---

### 10-9. Strategic Framing Notes [SPECULATIVE, NON-DIAGNOSTIC]

| Dimension | Qualitative Reading | Basis |
|-----------|---------------------|-------|
| **Positioning intent** | Strong research signaling | DrBenchmark SOTA, released models, released corpus, and companion paper create credible visibility |
| **Ecosystem alignment** | Favorable | GENCI, APHP/DrBenchmark, and HuggingFace create an unusually strong public research distribution context |
| **Regulatory navigation** | Mixed but presently manageable at base-model layer | CA-INDIRECT posture and model-card framing avoid immediate product-level obligations, but PHI/copyright posture remains thin |
| **Open-release coherence** | Weakened by license asymmetry | Models and datasets are openly released, while code reuse rights remain unclear absent a `LICENSE` file |
| **B2B sales readiness** | Constrained | Reproducibility and auditability gaps would likely surface quickly in regulated procurement review |
| **Competitive defense** | Potentially durable, but not audit-proven | Data sovereignty and first-mover status may help, but this is market interpretation rather than code-derived fact |
| **Technical completeness** | Research-grade, not production-grade | Core pipeline appears real and substantial, but `#tmp` markers, portability issues, and unresolved reproducibility defects lower external readiness |

**Non-diagnostic strategic reading:** DoctoBERT appears to be a strong research-positioning release whose technical core is real, but whose external packaging and governance surfaces lag behind the level expected for fully reproducible or enterprise-ready infrastructure. This is an interpretive framing aid, not a scored finding.

---

### 10-10. Interpreting the Paper-to-Repository Gap

The most sensitive interpretive question is whether the gap between the paper's reproducibility language and the public repository state should be read as **bad faith**, **release immaturity**, or **strategic partial disclosure**.

This report's judgment is:

| Interpretation | Likelihood | Basis |
|----------------|------------|-------|
| **Malicious-intent hypothesis** ("the repository was intentionally made non-reproducible to mislead outsiders while preserving internal advantage") | **LOW** | Too much real pipeline logic is public: prompts, filtering code, rewriting code, `.slurm` runners, and conversion scripts are present. A party aiming primarily to mislead would more likely omit or hollow out key control surfaces entirely. No code-observable evidence of deliberate sabotage, decoy logic, or fabricated interfaces was identified. |
| **Negligence / incomplete-release hypothesis** | **HIGH** | Best fits the observed facts: active `# tmp` markers, HPC-bound absolute paths, missing root `LICENSE`, missing `CHANGELOG`, known scanner false negatives, and unresolved reproducibility defects such as the `p2_short_floor` dual default. This looks like an internal research pipeline released before full external hardening. |
| **Strategic partial-disclosure hypothesis** ("open enough for scientific signaling, not open enough for full third-party replication") | **MEDIUM-HIGH** | Also consistent with the evidence. The release discloses enough to support scientific positioning and model adoption, but key operational dependence remains tied to Doctolib's environment: Jean Zay paths, heavy GPU/`vllm` assumptions, and absent end-to-end external execution packaging. This may reflect practical expedience rather than deception, but the effect is the same: outsiders face a reproduction moat. |

#### Bottom-Line Interpretation

**This report does not find sufficient evidence to allege deliberate falsification or intentional sabotage of the public repository.** The more defensible reading is:

> DoctoBERT appears to be a **research-grade release with substantial real code disclosure, but without the external packaging discipline required to fully support the paper's third-party reproducibility framing.**

That judgment matters because it preserves analytical precision:

- The repository gap is **real and material**
- The gap is **sufficient to constrain third-party reproducibility**
- But the currently visible evidence supports **immature/partial release** more strongly than **malicious concealment**

#### Why This Matters for Downstream Review

For litigation, procurement, or adversarial peer review, the safest characterization is not:

- "Doctolib intentionally crippled the open-source release"

The safer characterization is:

- "The public release does not presently support the full level of external reproducibility implied by the paper, and the available evidence is more consistent with incomplete externalization than with provable bad faith."

This wording is both more accurate and more robust under challenge.

---

## 11. Action Plan

### Phase 0 — Immediate (same day)

| ID | Action | File | Effort |
|----|--------|------|--------|
| A1 | Unify `p2_short_floor` default via `DEFAULT_P2_SHORT_FLOOR = 128` constant | `convert_to_mds.py:111, 345` | Low |
| A2 | Add `LICENSE` file (Apache-2.0) | repository root | Low |
| A3 | Extract `load_local_dataset` into `utils/io.py` shared module | 16 files | Medium |

### Phase 1 — Short-Term (1–2 weeks)

| ID | Action | File | Effort |
|----|--------|------|--------|
| B1 | Add non-clinical / non-diagnostic disclaimer to README | `README.md` | Low |
| B2 | Add `CHANGELOG.md` (v1.0 baseline) | repository root | Low |
| B3 | Replace 20 active HPC absolute paths across 6 files with `--data-root` / `DATA_ROOT` environment variable (see §6-1 breakdown; start with `plot_term_density_distribution.py` and `postprocess_llm_annotation.py` as highest-impact files) | 6 files | Medium–High |
| B4 | Promote `# tmp pre-filter` in `llm_rewrite.py:840` to official documented logic or remove the marker | `llm_rewrite.py:840` | Low |
| B5 | Add README note: HF telemetry present in training scripts; link to HF telemetry documentation | `README.md` | Low |
| B6 | Synchronize `llm.chat` migration across `llm_annotate.py` and `llm_generate.py` | 2 files | Medium |

### Phase 2 — Medium-Term (1 month)

| ID | Action | File | Effort |
|----|--------|------|--------|
| C1 | Decompose `train_classifier.py::main()` into 4–5 focused functions | `train_classifier.py` | High |
| C2 | Add minimum GitHub Actions CI (lint + unit tests) | `.github/workflows/` | Medium |
| C3 | Add bias / limitations section to README (or link to paper §6) | `README.md` | Low |
| C4 | Extract `DEFAULT_MAX_SEQ_LEN`, `DEFAULT_BATCH_SIZE` constants | new `constants.py` | Low |
| C5 | Remove `_process_func` dead code block from `worker_process_one_parquet` | `convert_to_mds.py:139–147` | Low |

---

## 12. Final Verdict

```
┌──────────────────────────────────────────────────────────────────────┐
│                    doctobert Fitness Assessment                      │
├──────────────────────────────────────────────────────────────────────┤
│  As research codebase:            Fit (pipeline design sound)        │
│  External reproducibility:        Partial (HPC- and GPU-bound)       │
│  Clinical-adjacent production use: Unfit (governance absent)         │
│  Code maintainability:            Low (duplication, large functions) │
│  Configuration safety:            Caution (p2_short_floor drift)     │
│  Paper claim integrity:           Conditional (no contradictions;    │
│                                   3 PARTIAL claims; 1 UNVERIFIABLE)  │
└──────────────────────────────────────────────────────────────────────┘

STEM-BIO-AI:        T0 Rejected (32/100)
AI-SLOP-DETECTOR:   critical_deficit (avg 52.7)
E2E Suite:          69.0% pass rate (29/42)
Paper Fidelity:     VERIFIED 66.7% / PARTIAL 25.0% / UNVERIFIABLE 8.3% / CONTRADICTED 0%
Overall:            Research-grade but externally incomplete | Not deployable without Phase 0–1 remediation
```

---

## 13. Audit Scope Boundaries

### Inherent Analytical Limits (cannot be resolved by extending this audit)

| # | Item | Reason |
|---|------|--------|
| L1 | **Training run verification** | Static analysis cannot confirm whether 240B tokens were actually processed across 3 phases. No artifact (checkpoint hash, training log, loss curve) is present in the repository. This is the only claim in the paper that is fundamentally unverifiable from code alone. |
| L2 | **Tool score calibration** | STEM-BIO-AI v1.8.4 and AI-SLOP-DETECTOR both carry acknowledged *"uncalibrated initial priors pending benchmark calibration."* Scores are triage signals, not certified measurements. |

### Deferred Scope (addressable in a follow-on audit phase)

| # | Item | What Is Needed |
|---|------|---------------|
| D0 | **ModernBERT submodule initialization** | The `ModernBERT/` submodule was not initialized in this checkout (directory empty). Clone with `git clone --recurse-submodules` and re-audit `model_building/` scope. The submodule may contain training scripts (`scripts/`, `main.py`, `yamls/`) that would partially address or resolve C9 (training execution), which is why this is the concrete next step for the report's single most consequential UNVERIFIABLE claim. Est. effort: 30 minutes. **Highest priority deferred item.** |
| D1 | **Runtime pipeline behavior** | **Partial runtime verification completed** (Windows 11, Python 3.14.3, GTX 1050, CUDA 11.1): `split_document.py --help` → PASS (fire only). `convert_to_mds.py --help` → FAIL at `snappy` C-extension import. `llm_generate.py --help` → FAIL at `vllm` import. Full pipeline execution requires: Linux OS, CUDA 12.8+, Python 3.11–3.12, conda environment from `environment.yaml`. Est. effort on appropriate hardware: 4–8 hours. |
| D2 | **Model weight integrity** | Download Hub checkpoints; verify SHA256 hashes against model card metadata; inspect tokenizer vocabulary alignment with `trim_tokens.py` output. Est. effort: 1 hour. |
| D3 | **FineMed PHI/PII data audit** | FineMed is publicly available on HuggingFace. Sample-based PII scan (presidio or spaCy `fr_core_news_lg`) against the corpus would characterize actual residual exposure. Est. effort: 4–8 hours. |
| D4 | **DrBenchmark reproduction** | DrBenchmark is open. Reproduce at least one NER sub-task with the released `doctobert-fr-base` weights to verify Table 5/6 figures. Est. effort: 4–8 hours with GPU. |
| D5 | **EU AI Act Annex III conformity assessment** | §10-5 of this report provides a preliminary, non-diagnostic regulatory context suggesting that the base model is presently outside the high-risk threshold (model card: "not a medical device"). Formal conformity assessment becomes mandatory only if a downstream product embeds these models in a clinical decision pathway. |

> **Note on HuggingFace Hub:** Model card content (license, architecture, benchmark figures, intended-use disclaimers) was referenced throughout this report via the user-provided model card snapshot. Hub weight files were not independently downloaded.

---

## 14. Generated Artifact Index

| File | Description |
|------|-------------|
| [`doctobert_ecosystem_map.png`](doctobert_ecosystem_map.png) | Strategic ecosystem map — Figure 1 in §10 (195 KB, 1800×1240px) |
| [`doctobert_ecosystem_map.svg`](doctobert_ecosystem_map.svg) | Source SVG for ecosystem map (scalable, editable) |
| [`doctolib-lab_doctobert_experiment_results.json`](doctolib-lab_doctobert_experiment_results.json) | STEM-BIO-AI full analysis (301 KB) |
| [`slop_report.json`](slop_report.json) | AI-SLOP-DETECTOR results (270 KB) |
| [`e2e_diagnostics_report.json`](e2e_diagnostics_report.json) | E2E 42-test results (authoritative source for pass counts) |
| [`hardcoded_analysis.json`](hardcoded_analysis.json) | Hardcoded value classification (111 items) |
| [`e2e_diagnostics.py`](e2e_diagnostics.py) | E2E diagnostic script (re-runnable) |
| [`dummy_experiment_results.json`](dummy_experiment_results.json) | Dummy injection test results |
| [`doctolib-lab_doctobert_report.md`](doctolib-lab_doctobert_report.md) | STEM-BIO-AI machine report |
| [`doctolib-lab_doctobert_explain.txt`](doctolib-lab_doctobert_explain.txt) | STEM-BIO-AI evidence narrative |
| [`doctobert_FINAL_REPORT.md`](doctobert_FINAL_REPORT.md) | Original v1 report (superseded by this document) |

---

*Report v2.0 — Diagnostic engines: STEM-BIO-AI v1.8.4 + AI-SLOP-DETECTOR + Custom E2E Suite + AST Static Analysis + Manual Code Review. Includes a separate Strategic Context Appendix (§10) as non-diagnostic background.*  
*Audit freshness window: 45 days from 2026-06-24. Recommended re-audit trigger: any commit to `data_curation/`, `model_building/`, `README.md`, or `environment.yaml`.*  
*§10 Strategic Context Appendix classifications: INFERRED / SUPPORTED INFERENCE / SPECULATIVE items are non-diagnostic background judgments based on public information and code-observable context. They do not carry the same evidentiary weight as the diagnostic sections and do not constitute legal, financial, or compliance advice.*




