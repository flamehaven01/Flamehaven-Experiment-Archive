# TOE-TEST-0058 Verification Note

**Target**: `QSOT-Harness v2.1.0 — Bounded, Epistemically-Labeled Verification Harness (Honest Reconstruction)`
**Canonical run id**: `toe-test-0058`
**Supersedes**: `toe-test-0057` (QSOT Compiler v1.2.3 — High-Formality, Fake Physics Slop Artifact)
**Legacy alias**: `qsot-harness`
**Repository**: [Flamehaven-Labs/QSOT-Harness](https://github.com/Flamehaven-Labs/QSOT-Harness)
**Paper**: [manuscript @ v2.1.0](https://github.com/Flamehaven-Labs/QSOT-Harness/tree/v2.1.0/paper) (`paper/main.tex`)
**Zenodo Record**: [10.5281/zenodo.20656476](https://doi.org/10.5281/zenodo.20656476)
**Release**: [v2.1.0](https://github.com/Flamehaven-Labs/QSOT-Harness/releases/tag/v2.1.0)

---

## Purpose (why this record exists)

`0058` is not, primarily, "another clean reproduction." Its purpose is to be a **reproducible, auditable record of how each defect diagnosed in `0057` was remediated and evolved into a bounded, honest harness.**

`0057` documented a *High-Formality, Fake Physics Slop Artifact*: standard quantum-channel evolution wrapped in ungrounded general-relativity nomenclature, with Kirkwood-Dirac negativity and TTM non-Markovianity evaluating to exactly `0.0`. `0058`'s thesis is the **verifiable delta from that slop to an honest, claim-bounded artifact** — defect by defect, each fix traceable to a location in the result artifact.

The reference run below is supporting evidence; the remediation map is the point.

---

## Remediation Map — `0057` defect → `0058` fix → evidence

| `0057` defect (documented slop) | `0058` remediation | Evidence (in `verification_result.json`) |
|---|---|---|
| Curved-spacetime metrics named in the papers were **absent from the code** | Curvature drives the channel map `p = 1 - exp(-α·‖Riemann‖_F)` across six backgrounds, labeled a phenomenological ansatz | `observations.{schwarz,desitter,ads,eguchi}_purity/entropy`; `calibration.sensitivity_alpha` |
| KD negativity and TTM non-Markovianity were **exactly `0.0`** (null placeholders) | KD reported **flat-relative** (`kd_delta = +0.1115`), a non-converged proxy, *not* a contextuality proof; TTM **split** into a synthetic self-test (`nm = 1.41e-3`) and the model trajectory (`nm = 0`, Markovian by construction) | `observations.kd_delta`; `observations.memory_kernel` (synthetic) and `memory_kernel_model_trajectory` (model) |
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

## Reading Rule

Read `0058` as a **remediation record**: its deliverable is the auditable transformation of `0057`'s slop into a bounded, epistemically-labeled honest harness. `Verified` (canonical artifact + reproduction receipt + source SHA + DOI), `ADVISORY` provenance, model-consistency only. The correction takes precedence: `0057` is the slop audit, `0058` is the published honest rebuild.
