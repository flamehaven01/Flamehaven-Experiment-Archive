# STEM BIO-AI Local Audit Report

**Target:** `yorkeccak/bio`
**Execution Mode:** `LOCAL_ANALYSIS`
**Calibration Profile:** `default` (`ca-policy-1.0`, `mirror_only`, `authoritative_release`)
**Calibration Effect:** mirror-only in 1.7.9 — selected profile metadata is surfaced in artifacts, but authoritative scan scoring still follows deterministic runtime constants. Preview-only posture changes, including Stage 4 replication emphasis, do not change the formal score until a future read-through phase. Use `stem policy simulate` to preview governed score deltas and posture changes.
**Final Score:** **48 / 100**
**Formal Tier:** **T1 Quarantine**
**Tier Meaning:** T1 Quarantine = Exploratory review only; no patient-adjacent use.
**Use Scope:** Exploratory review only; no patient-adjacent use.

## Score Matrix

| Stage | Weight | Score |
| --- | ---: | ---: |
| Stage 1 README Evidence Signal | 0.40 | 75 |
| Stage 2R Repo-Local Consistency | 0.20 | 40 |
| Stage 3 Code/Bio Responsibility | 0.40 | 25 |
| Risk Penalty | -- | 0 |

## Replication Evidence Lane

**Stage 4 Replication Score:** **30 / 100**
**Replication Tier:** **R1**
**Interpretation:** Stage 4 is a separate replication lane. It improves inspectability and reproducibility review, but it does not currently change the formal tier.

## Audit Freshness

**Review After:** **45 days**
**Expires On:** `2026-07-15`
**Change-triggered re-audit recommended now:** `False`
**Current re-audit reasons:** `none`
**Trigger examples:** `git_commit_changed, readme_or_docs_claim_surface_changed, dependency_manifest_changed, dataset_or_model_reference_changed`

## Reasoning Diagnostics

Diagnostic-only heuristic `stem-bio-ai-reasoning-v1.3.2` (uncalibrated_initial_priors_pending_benchmark_calibration); lane consistency `heuristic_mixed` (0.725), uncertainty band `review_advised` (0.2789), risk heuristic `within_heuristic_gate` (0.4825), confidence envelope 0.4185-0.5415. This heuristic layer does not override the final score.
- **Interpretation:** lane coherence is mixed, which means README-facing intent and code/accountability signals do not move together cleanly. Review Stage 2R and Stage 3 evidence before treating the score as stable.
- **Interpretation:** the uncertainty band is elevated enough that manual review is recommended, especially for boundary claims, workflow support, and governance surfaces.

## Regulatory Traceability Assistant

> **Regulatory basis note**
> Aligned to: EU AI Act (Regulation (EU) 2024/1689), ICH M15 (Step 4, Jan 2026), AIRI (MIT, 2024), FDA QMSR, FDA AI-enabled device guidance themes, and IMDRF SaMD/GMLP frameworks — as of Jun 2026.
> This is a traceability aid, not a compliance or clearance determination.

### Stage 1
- **EU_AI_ACT_ARTICLE_13** — signal_only (mapping confidence: weak, evidence strength: weak)
  - Boundary, intended-use, and limitation language is relevant to transparency scaffolding only.
- **COMPLIANCE_CLAIM_GROUNDING_SIGNAL** — signal_only (mapping confidence: weak_moderate, evidence strength: weak)
  - Legal or compliance claims without supporting governance evidence are relevant to transparency and quality-system review, not compliance proof.

### Stage 2R
- **IMDRF_CLINICAL_CONTEXT_BOUNDARY_SIGNAL** — signal_only (mapping confidence: weak_moderate, evidence strength: moderate)
  - Repository-local contradiction and boundary signals are relevant to clinical-context traceability, not clinical validation.

### Stage 3
- **EU_AI_ACT_ARTICLE_10** — signal_only (mapping confidence: weak, evidence strength: weak)
  - Provenance and bias signals are relevant to data-governance review, but do not verify execution quality.

### Stage 4
- **EU_AI_ACT_ARTICLE_12** — partially_aligned (mapping confidence: moderate, evidence strength: moderate)
  - Reproducibility and trace manifests support record-keeping scaffolding, not operational logging completeness.

**Summary:** Structural signals partially align with traceability scaffolding. This remains a pre-audit traceability aid, not a compliance determination.

## AIRI Risk Triggers

**Covered Risks:** **7 / 32**
**Coverage Rate:** `0.219`
**Bundle Scope:** `curated_medical_clinical_subset`
**Upstream Snapshot:** `2026-04-23`
**Interpretation:** This is detector-mapped AIRI coverage inside the current runtime bundle, not a claim that unmapped risks are absent.
**Surface Note:** repeated same-file evidence may be compacted in human-readable surfaces; canonical per-finding rows remain in JSON.

**Examples of Covered AIRI Risks**
- `24.01.03` — Safe exploration problem with widely deployed AI assistants (primary: C5_compliance_boundary_integrity; why: C5_compliance_boundary_integrity: Unsupported legal/compliance claim surfaced in boundary-integrity lane.)
- `24.04.01` — Physical and Psychological Harms (primary: C2_dependency_pinning; why: C2_dependency_pinning: External operational dependency signal surfaced in code-integrity lane.)
- `33.01.05` — Privacy and security (primary: C2_dependency_pinning; why: C2_dependency_pinning: External operational dependency signal surfaced in code-integrity lane.)

**Known Gaps In Bundle**
- `65.03.03` — Reidentification
- `70.02.02` — Misinformation — hallucination of clinical knowledge
- `39.25.00` — Verifiability — black-box AI in medical healthcare
## Code Integrity
- **C1_hardcoded_credentials:** PASS — No direct credential patterns detected by local CLI scan.
- **C2_dependency_pinning:** WARN — External operational dependency signal surfaced in code-integrity lane.
  - .env.example:24 VALYU_API_KEY=valyu_your_api_key_here
  - .env.example:38 DAYTONA_API_KEY=your_daytona_api_key_here
  - README.md:23 - **One Unified Search** - Powered by Valyu's specialized biomedical data API
- **C3_dead_or_deprecated_patient_adjacent_paths:** PASS — No deprecated patient-adjacent metadata patterns detected.
- **C4_exception_handling_clinical_adjacent_paths:** PASS — No executable fail-open exception handler detected.
- **C5_compliance_boundary_integrity:** WARN — Unsupported legal/compliance claim surfaced in boundary-integrity lane.
  - README.md:262 - HIPAA-compliant architecture (when self-hosted)
  - Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.
- **C6_mock_auth_or_fail_open_boundary:** WARN — Mock-auth or auto-login boundary surfaced in code-integrity lane.
  - README.md:51 - **No authentication required** - Auto-login as dev user
  - README.md:110 You'll be automatically logged in as `dev@localhost` with full access to all features.
  - README.md:134 2. **Mock Authentication**

## Bio Deterministic Diagnostics

- **SMILES Surface Integrity:** not_detected=1 — No malformed or suspicious SMILES-like strings detected by conservative surface checks.
- **SMILES RDKit Validation:** not_detected=1 — RDKit optional validation lane not exercised because no SMILES-like candidates were detected.
- **SMILES Parser Guard:** not_detected=1 — No missing None/invalid guards detected after SMILES parser calls.
- **Silent Mock Fallback:** not_detected=1 — No silent mock or simulated-data fallback patterns detected in production code paths.
- **Traceability Manifest Surface:** not_detected=1 — No traceability manifest or runtime audit-log schema surface detected.
- **Bio Subprocess Run Trace:** not_detected=1 — No risky subprocess or os.system bio-tool execution patterns detected.

## Top Risks
- Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.
- Self-asserted compliance or privacy-governance claim requires independent verification.
- Legal, privacy, or compliance claim appears without supporting governance or security-grounding evidence in reviewed repository sources.
- Core workflow appears materially dependent on named external service providers; local or self-host claims may overstate operational independence.
- External operational dependency signal surfaced in code-integrity lane.

## Remediation Targets
- Add an explicit non-clinical/non-diagnostic boundary to README and adjacent docs before treating the repository as review-ready.
- Bring workflow, demo, and CLI claims into line with actual local support surfaces, or narrow the README claims.
- Pin production dependencies and document external-service dependence explicitly when local or self-host claims are part of the positioning.
- Remove unsupported legal/compliance language or add the governance and security evidence needed to defend it.
- Separate mock-auth or auto-login convenience flows from any production, privacy, or self-host trust boundary narrative.

## Stage 1 Evidence
- **baseline:** 60 — Non-nascent README evidence baseline.
- **S1_domain_readme:** 10 — README exposes bio/medical domain vocabulary.
- **S1_domain_package:** 5 — Package metadata exposes bio/medical domain vocabulary.
- **R2_regulatory_framework:** 5 — Self-asserted privacy/compliance language detected without stronger regulatory-framework evidence. `[partial-credit ladder=+15 strong framework | +5 weak self-asserted compliance | -5 CA-INDIRECT missing framework | -10 CA-DIRECT missing framework; current=5]`
- **R3_clinical_disclaimer:** -5 — CA-INDIRECT surface lacks explicit non-clinical or non-diagnostic boundary.

## Stage 2R Evidence
- **baseline:** 60 — Non-nascent local repository baseline. `[detector=stage2r_baseline | basis=repository has sufficient local structure to enter repo-local consistency review]`
- **R2R_1_readme_package_code_alignment:** 15 — README has domain overlap with package metadata or entry points. `[detector=R2R_1_readme_package_code_alignment | basis=shared bio-domain terms detected across README and package metadata]`
- **R2R_D2_missing_clinical_use_boundary:** -20 — Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary. `[detector=R2R_D2_missing_clinical_use_boundary | basis=clinical_adjacent=True and explicit non-clinical boundary was not detected | tier-impact=can contribute to clinical score ceilings and hard-floor review paths when stronger clinical deployment or certainty claims are also present]`
- **R2R_D4_unsupported_workflow_claim:** -15 — README/docs claim runnable workflow, CLI, test, or demo support without matching local support surfaces. `[detector=R2R_D4_unsupported_workflow_claim | basis=workflow/demo/CLI claims detected while workflow, tests, or local support entrypoints are absent]`

## Stage 3 Evidence
- **T1_CI_CD:** 0 / 15 — No workflow files detected. `[detector=S3_T1_workflow_files | basis=no workflow files present under .github/workflows/]`
- **T2_domain_tests:** 0 / 15 — No tests detected. `[detector=S3_T2_domain_tests | basis=no tests surface detected]`
- **T3_changelog_release_hygiene:** 0 / 15 — No changelog detected. `[detector=S3_T3_changelog_release_hygiene | basis=CHANGELOG/NEWS presence plus bug-fix or patch-entry detection]`
- **B1_data_provenance_controls:** 15 / 15 — Dependency manifest detected with data source, IRB, or dataset citation language. `[detector=S3_B1_dependency_manifest | basis=dependency or lock manifest presence plus data-source, dataset, or IRB language review]`
- **B2_bias_limitations:** 0 / 15 — No bias/limitations language detected by local CLI scan. `[detector=S3_B2_bias_limitations | basis=bias/limitations vocabulary with optional measurement-evidence escalation]`
- **B3_coi_funding:** 5 / 5 — COI, funding, sponsor, or acknowledgement language detected. `[detector=S3_B3_coi_funding | basis=COI/funding/sponsor language review across README, docs, FUNDING, CITATION, and AUTHORS surfaces]`
- **stage_3_raw_total:** 20 / 80 — Raw rubric total before normalization to 100.

## Stage 4 Replication Evidence
- **S4_container_environment:** 10 / 10 — Container or compose file exists.
- **S4_make_reproduce_target:** 0 / 10 — No Makefile detected.
- **S4_environment_lock_evidence:** 10 / 10 — Environment, dependency, or lock manifest detected.
- **S4_exact_dependency_pins_or_hashes:** 10 / 10 — Exact dependency pin or hash evidence detected.
- **S4_readme_reproducibility_section:** 0 / 10 — README exists but no reproducibility or replication section heading was detected.
- **S4_checksum_files:** 0 / 10 — No evidence detected for S4_checksum_files.
- **S4_dataset_url:** 0 / 10 — Documentation exists but no dataset URL or data source URL was detected.
- **S4_model_weight_url_or_checksum:** 0 / 10 — Documentation exists but no model artifact URL/checksum evidence was detected.
- **S4_citation_cff:** 0 / 5 — No evidence detected for S4_citation_cff.
- **S4_license_restriction:** 0 / 0 — No license/use restriction language detected.
- **S4_cli_entrypoint:** 0 / 5 — No package metadata or Python AST surface detected.
- **S4_seed_setting:** 0 / 5 — No deterministic seed setting detected.
- **S4_runnable_examples:** 0 / 5 — No evidence detected for S4_runnable_examples.
- **stage_4_raw_total:** 30 / 100 — Raw Stage 4 rubric total. Stage 4 is reported separately and does not alter final score.

## Method Boundary
Deterministic local CLI scan. No LLM, network, or runtime test execution is required.

## Disclaimer
This is an evidence-surface pre-screen, not clinical certification, regulatory clearance, or medical advice.
