# TOE-TEST-0059 Verification Note

**Target**: `QSOT-Harness v2.1.1 (+ hardening r1) — Bounded, Epistemically-Labeled Verification Harness (Honest Reconstruction)`
**Canonical run id**: `toe-test-0059`
**Supersedes**: `toe-test-0057` (QSOT Compiler v1.2.3 — High-Formality, Fake Physics Slop Artifact)
**Legacy alias**: `qsot-harness`
**Repository**: [Flamehaven-Labs/QSOT-Harness](https://github.com/Flamehaven-Labs/QSOT-Harness)
**Paper**: [public manuscript baseline @ v2.1.1](https://github.com/Flamehaven-Labs/QSOT-Harness/tree/v2.1.1/paper) (`paper/main.tex`)
**Zenodo Record**: [10.5281/zenodo.20665824](https://doi.org/10.5281/zenodo.20665824)
**Release**: [public baseline v2.1.1](https://github.com/Flamehaven-Labs/QSOT-Harness/releases/tag/v2.1.1)

---

## Purpose (why this record exists)

`0059` is not, primarily, "another clean reproduction." Its purpose is to be a **reproducible, auditable record of how each defect diagnosed in `0057` was remediated and evolved into a bounded, honest harness.** In this refreshed copy (revision **r1**, committed source `c0f6c6a`), it also records the R0-R2 source/schema hardening: the KD reported value is now the optimizer **best objective** (not a last-step snapshot), deprecated KD booleans are removed, and threshold / policy-reason / toy-curvature / coverage provenance are surfaced. Phase 4 state preparation and Phase 5 memory-proxy sensitivity remain config-driven.

`0057` documented a *High-Formality, Fake Physics Slop Artifact*: standard quantum-channel evolution wrapped in ungrounded general-relativity nomenclature, with Kirkwood-Dirac negativity and TTM non-Markovianity evaluating to exactly `0.0`. `0059`'s thesis is the **verifiable delta from that slop to an honest, claim-bounded artifact** — defect by defect, each fix traceable to a location in the result artifact.

The reference run below is supporting evidence; the remediation map is the point.

---

## Remediation Map — `0057` defect → `0059` fix → evidence

| `0057` defect (documented slop) | `0059` remediation | Evidence (in `verification_result.json`) |
|---|---|---|
| Curved-spacetime metrics named in the papers were **absent from the code** | Curvature drives the channel map `p = 1 - exp(-α·‖Riemann‖_F)` across six backgrounds, labeled a phenomenological ansatz | `observations.{schwarz,desitter,ads,eguchi}_purity/entropy`; `calibration.sensitivity_alpha` |
| KD negativity and TTM non-Markovianity were **exactly `0.0`** (null placeholders) | KD reported **flat-relative** (`kd_delta = +0.1230`, from the optimizer best objective), a comparative proxy, *not* a contextuality proof; the TTM-inspired proxy **split** into a synthetic self-test (`nm = 1.41e-4` at $\alpha=0.1$) and the model trajectory (`nm = 0`, Markovian by construction) | `observations.kd_delta`; `observations.memory_kernel` (synthetic) and `memory_kernel_model_trajectory` (model) |
| Time dilation (γ) modeled as an **arbitrary** Kraus deformation with no derivation | Still phenomenological, but **disclosed**: free params and magic constants (e.g. Schwarzschild `g00`) listed in a calibration manifest with what they govern; claim boundary disclaims first-principles status | `claim_boundary`; `calibration.notable_magic_constants.schwarzschild_g00` (H4); `calibration.free_parameters.boost_beta` |
| **Jargon** dressed a single-qubit toy as curved-space quantum gravity | Every observation carries an **evidence class**; gate/verdict marked **policy-derived classifications** (not physical observables); env-dependent backends surfaced | `evidence_classes` (7-class taxonomy); `audit_context.scientific_audit.backend_mode` |

---

## New slop pattern caught (contributed to the catalog)

During remediation, a **fabricated citation** was found and removed: a placeholder reference (`LeeFullwood2025`) carried specific Physical Review Letters coordinates (vol 134, p.100401, 2025) while the prose called it a "conceptual placeholder," and its title echoed the project's own internal acronym ("Quantum Geometry Bridge").

- **Detection**: independent web verification found no such paper.
- **Fix**: replaced with the verified Pikovski et al. 2015, *Nature Physics* 11:668–672 (DOI 10.1038/nphys3366), cited inspiration-only.
- **Reusable lesson**: specific journal/volume/page coordinates on a self-described "placeholder/inspiration" reference are a fabrication red flag — verify externally before publication.

---

## Reference run (supporting evidence)

* **8-phase / 50-check pipeline (deterministic)**: 48 PASS, 0 FAIL, 1 SKIPPED, 1 DEGRADED_PASS over six backgrounds.
* **Negative results surfaced, not hidden**: the KD optimizer does not converge within its fixed 50-step budget (`kd_optimization_converged = DEGRADED_PASS`); the optional governance backend is absent (`dqe_covenant_validated = SKIPPED`). Both causes are stated in the abstract and the artifact.
* **Claim boundary**: `external_physical_validity_claimed = false`, `execution_proves_new_law = false`, `model_output_consistency_only = true`.
* **Reproducibility honesty**: the artifact hash anchors a specific frozen copy; re-runs differ by the `generated_at` timestamp and the audit `backend_mode` (external vs mock), so it is *not* byte-deterministic — disclosed rather than faked.

---

## Revision r1 — R0-R2 source/schema hardening

This copy supersedes the previous `0059` (output_hash `69c97c92`) with `1498610f`, produced at committed source `c0f6c6a`. The only **numerical** change is R0.1; the rest is provenance/presentation:

* **R0.1** KD reported value is the optimizer **best observed objective** (best/last recorded separately). This corrected `kd_desitter` from a last-step snapshot (`+0.0002`) to its best (`-0.0005`), moving `kd_delta` from `+0.1237` to `+0.1230`.
* **R0.2 / R0.3** deprecated KD booleans (`is_negative`, `contextuality_proxy`) removed in favour of `raw_kd_negative_in_optimized_basis`; pure-state entropy clamped (no `-0.0`).
* **R2.1 / R2.2** TTM-threshold and `coverage_rate` provenance surfaced (source + semantics).
* **R1.1 / R1.2 / R1.3** policy `reason_code` + `failed_checks`, toy-curvature `riemann_source` / `riemann_is_toy`, and `gs_anomaly_reason` propagated into the verify blocks.

Mechanically gated by `scripts/check_eqa_invariants.py` (R3.1) and the sanitizer `deprecated_kd_field` rule (R3.2). See `analysis_result.json -> ledger_revision` for the supersedes hashes.

---

## Reading Rule

Read `0059` as a **remediation record**: its deliverable is the auditable transformation of `0057`'s slop into a bounded, epistemically-labeled honest harness. `Verified` (canonical artifact + reproduction receipt + source SHA + DOI), `ADVISORY` provenance, model-consistency only. The correction takes precedence: `0057` is the slop audit, `0059` is the published honest rebuild.

For the current refreshed copy, the public `v2.1.1` release and DOI remain the nearest published baseline, while this ledger entry records **revision r1** — the R0-R2 source/schema hardening committed at `c0f6c6a` (not yet in a public release).
