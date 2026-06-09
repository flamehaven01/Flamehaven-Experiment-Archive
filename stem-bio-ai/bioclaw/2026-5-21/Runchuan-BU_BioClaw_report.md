# STEM BIO-AI Local Audit Report

**Target:** `Runchuan-BU/BioClaw`
**Execution Mode:** `LOCAL_ANALYSIS`
**Calibration Profile:** `default` (`ca-policy-1.0`, `mirror_only`, `authoritative_release`)
**Calibration Effect:** mirror-only in 1.7.8 — selected profile metadata is surfaced in artifacts, but authoritative scan scoring still follows deterministic runtime constants. Preview-only posture changes, including Stage 4 replication emphasis, do not change the formal score until a future read-through phase. Use `stem policy simulate` to preview governed score deltas and posture changes.
**Final Score:** **60 / 100**
**Formal Tier:** **T2 Caution**
**Use Scope:** Research reference and supervised non-clinical technical review only.

## Score Matrix

| Stage | Weight | Score |
| --- | ---: | ---: |
| Stage 1 README Evidence Signal | 0.40 | 70 |
| Stage 2R Repo-Local Consistency | 0.20 | 50 |
| Stage 3 Code/Bio Responsibility | 0.40 | 54 |
| Risk Penalty | -- | 0 |

## Replication Evidence Lane

**Stage 4 Replication Score:** **35 / 100**
**Replication Tier:** **R1**

## Audit Freshness

**Review After:** **45 days**
**Expires On:** `2026-07-05`
**Change-triggered re-audit recommended now:** `False`
**Current re-audit reasons:** `none`
**Trigger examples:** `git_commit_changed, readme_or_docs_claim_surface_changed, dependency_manifest_changed, dataset_or_model_reference_changed`

## Reasoning Diagnostics

Diagnostic-only heuristic `stem-bio-ai-reasoning-v1.3.2` (uncalibrated_initial_priors_pending_benchmark_calibration); lane consistency `heuristic_consistent` (0.825), uncertainty band `low_spread` (0.178), risk heuristic `within_heuristic_gate` (0.4525), confidence envelope 0.537-0.663. This heuristic layer does not override the final score.

## Regulatory Traceability Assistant

> **Regulatory basis note**
> Aligned to: EU AI Act (Regulation (EU) 2024/1689), ICH M15 (Step 4, Jan 2026), AIRI (MIT, 2024), FDA QMSR, FDA AI-enabled device guidance themes, and IMDRF SaMD/GMLP frameworks — as of Jun 2026.
> This is a traceability aid, not a compliance or clearance determination.

### Stage 1
- **EU_AI_ACT_ARTICLE_13** — signal_only (mapping confidence: weak, evidence strength: weak)
  - Boundary, intended-use, and limitation language is relevant to transparency scaffolding only.

### Stage 2R
- **IMDRF_CLINICAL_CONTEXT_BOUNDARY_SIGNAL** — signal_only (mapping confidence: weak_moderate, evidence strength: weak)
  - Repository-local contradiction and boundary signals are relevant to clinical-context traceability, not clinical validation.

### Stage 3
- **EU_AI_ACT_ARTICLE_10** — signal_only (mapping confidence: weak, evidence strength: moderate)
  - Provenance and bias signals are relevant to data-governance review, but do not verify execution quality.

### Stage 4
- **EU_AI_ACT_ARTICLE_12** — partially_aligned (mapping confidence: moderate, evidence strength: weak)
  - Reproducibility and trace manifests support record-keeping scaffolding, not operational logging completeness.

**Summary:** Structural signals partially align with traceability scaffolding. This remains a pre-audit traceability aid, not a compliance determination.

## AIRI Coverage

**Covered Risks:** **2 / 32**
**Coverage Rate:** `0.062`
**Bundle Scope:** `curated_medical_clinical_subset`
**Upstream Snapshot:** `2026-04-23`

**Examples of Covered AIRI Risks**
- `24.01.03` — Safe exploration problem with widely deployed AI assistants (covered by: C5_compliance_boundary_integrity; why: C5_compliance_boundary_integrity: Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.)
- `69.01.00` — False information (covered by: C5_compliance_boundary_integrity; why: C5_compliance_boundary_integrity: Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.)

**Known Gaps In Bundle**
- `65.03.03` — Reidentification
- `70.02.02` — Misinformation — hallucination of clinical knowledge
## Code Integrity
- **C1_hardcoded_credentials:** PASS — No direct credential patterns detected by local CLI scan.
- **C2_dependency_pinning:** PASS — Dependency manifest appears pinned or not present.
- **C3_dead_or_deprecated_patient_adjacent_paths:** PASS — No deprecated patient-adjacent metadata patterns detected.
- **C4_exception_handling_clinical_adjacent_paths:** PASS — No executable fail-open exception handler detected.
- **C5_compliance_boundary_integrity:** WARN — Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.
- **C6_mock_auth_or_fail_open_boundary:** PASS — No mock-auth or fail-open local-boundary warning detected in reviewed sources.

## Bio Deterministic Diagnostics

- **SMILES Surface Integrity:** not_detected=1 — No malformed or suspicious SMILES-like strings detected by conservative surface checks.
- **SMILES RDKit Validation:** not_detected=1 — RDKit optional validation lane not exercised because no SMILES-like candidates were detected.
- **SMILES Parser Guard:** not_detected=1 — No missing None/invalid guards detected after SMILES parser calls.
- **Silent Mock Fallback:** not_detected=1 — No silent mock or simulated-data fallback patterns detected in production code paths.
- **Traceability Manifest Surface:** not_detected=1 — No traceability manifest or runtime audit-log schema surface detected.
- **Bio Subprocess Run Trace:** not_detected=1 — No risky subprocess or os.system bio-tool execution patterns detected.

## Top Risks
- Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.
- C5_compliance_boundary_integrity: WARN

## Stage 1 Evidence
- **baseline:** 60 — Non-nascent README evidence baseline.
- **S1_domain_readme:** 10 — README exposes bio/medical domain vocabulary.
- **R2_regulatory_framework:** -5 — CA-INDIRECT surface lacks regulatory or governance framework language.
- **R3_clinical_disclaimer:** -5 — CA-INDIRECT surface lacks explicit non-clinical or non-diagnostic boundary.
- **R4_demographic_bias_boundary:** 10 — Demographic, subgroup, fairness, bias, or validation-cohort language detected.

## Stage 2R Evidence
- **baseline:** 60 — Non-nascent local repository baseline. `[detector=stage2r_baseline | basis=repository has sufficient local structure to enter repo-local consistency review]`
- **R2R_3_readme_test_ci_alignment:** 10 — Test/CI surfaces are present and locally consistent. `[detector=R2R_3_readme_test_ci_alignment | basis=workflow/test support terms found across README and local support surfaces]`
- **R2R_D2_missing_clinical_use_boundary:** -20 — Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary. `[detector=R2R_D2_missing_clinical_use_boundary | basis=clinical_adjacent=True and explicit non-clinical boundary was not detected]`

## Stage 3 Evidence
- **T1_CI_CD:** 15 / 15 — Workflow files detected. `[detector=S3_T1_workflow_files | basis=workflow files present under .github/workflows/]`
- **T2_domain_tests:** 0 / 15 — No tests detected. `[detector=S3_T2_domain_tests | basis=no tests surface detected]`
- **T3_changelog_release_hygiene:** 0 / 15 — No changelog detected. `[detector=S3_T3_changelog_release_hygiene | basis=CHANGELOG/NEWS presence plus bug-fix or patch-entry detection]`
- **B1_data_provenance_controls:** 15 / 15 — Dependency manifest detected with data source, IRB, or dataset citation language. `[detector=S3_B1_dependency_manifest | basis=dependency or lock manifest presence plus data-source, dataset, or IRB language review]`
- **B2_bias_limitations:** 8 / 15 — Structured bias/limitations language detected; no quantitative measurement evidence found. `[detector=S3_B2_bias_limitations | basis=bias/limitations vocabulary with optional measurement-evidence escalation]`
- **B3_coi_funding:** 5 / 5 — COI, funding, sponsor, or acknowledgement language detected. `[detector=S3_B3_coi_funding | basis=COI/funding/sponsor language review across README, docs, FUNDING, CITATION, and AUTHORS surfaces]`
- **stage_3_raw_total:** 43 / 80 — Raw rubric total before normalization to 100.

## Stage 4 Replication Evidence
- **S4_container_environment:** 0 / 10 — No evidence detected for S4_container_environment.
- **S4_make_reproduce_target:** 0 / 10 — No Makefile detected.
- **S4_environment_lock_evidence:** 10 / 10 — Environment, dependency, or lock manifest detected.
- **S4_exact_dependency_pins_or_hashes:** 10 / 10 — Exact dependency pin or hash evidence detected.
- **S4_readme_reproducibility_section:** 0 / 10 — README exists but no reproducibility or replication section heading was detected.
- **S4_checksum_files:** 0 / 10 — No evidence detected for S4_checksum_files.
- **S4_dataset_url:** 0 / 10 — Documentation exists but no dataset URL or data source URL was detected.
- **S4_model_weight_url_or_checksum:** 10 / 10 — Model artifact URL or checksum evidence detected.
- **S4_citation_cff:** 0 / 5 — No evidence detected for S4_citation_cff.
- **S4_license_restriction:** 0 / 0 — No license/use restriction language detected.
- **S4_cli_entrypoint:** 5 / 5 — CLI entry point or argparse interface detected.
- **S4_seed_setting:** 0 / 5 — No deterministic seed setting detected.
- **S4_runnable_examples:** 0 / 5 — No evidence detected for S4_runnable_examples.
- **stage_4_raw_total:** 35 / 100 — Raw Stage 4 rubric total. Stage 4 is reported separately and does not alter final score.

## Method Boundary
Deterministic local CLI scan. No LLM, network, or runtime test execution is required.

## Disclaimer
This is an evidence-surface pre-screen, not clinical certification, regulatory clearance, or medical advice.
