# TOE-TEST-0058 Verification Note

**Target**: `QSOT2 v0.1.0.dev0 — Mathematical-Consistency Verifier (re-scoped honest successor of the 0057 slop)`
**Canonical run id**: `toe-test-0058`
**Supersedes**: `toe-test-0057` (QSOT Compiler v1.2.3 — High-Formality, Fake Physics Slop Artifact)
**Sibling line**: `toe-test-0059` (QSOT-Harness — governance-rich combined snapshot)
**Legacy alias**: `qsot2`
**Repository**: [Flamehaven-Labs/QSOT2-Compiler](https://github.com/Flamehaven-Labs/QSOT2-Compiler)
**Source SHA**: `9e1d845`
**Artifact hash (canonical LF)**: `efca2228f177634f8f0f83b93eb5a7bc9246afe55cf707e780d2791b8a685bfc`

---

## Purpose (why this record exists)

`0058` is the **mathematical-verification line** of the QSOT program and the direct, honest successor of the `0057` slop. Its purpose is to document, defect by defect, **how the errors diagnosed in `0057` were corrected in QSOT2, which quantities thereby became measurable and internally consistent, and what those results do — and do not — mean.**

`0057` documented a *High-Formality, Fake Physics Slop Artifact*: standard quantum-channel evolution wrapped in ungrounded general-relativity nomenclature, with Kirkwood-Dirac negativity and TTM non-Markovianity evaluating to exactly `0.0` and the curved-spacetime metrics named in the papers absent from execution. QSOT2's thesis is the **verifiable delta from that slop to a bounded, claim-labeled math verifier** — every fix traceable to a value in `verification_result.json`.

This record deliberately mirrors the structure of its sibling `0059` (the QSOT-Harness combined snapshot). The difference is scope: `0058` carries **only** the mathematical-consistency core (lean schema, 4-field claim boundary, no governance machinery); the governance-rich line lives at `0059`, and the reusable governance primitives are extracted separately into `flamehaven-sci-governance`.

The reference run below is supporting evidence; the slop-to-measurable map is the point.

---

## Slop-to-Measurable Map — `0057` defect → QSOT2 fix → what's measurable → meaning

| `0057` defect (documented slop) | QSOT2 correction | What is measurable now | What it means (and does not) |
|---|---|---|---|
| KD negativity and TTM non-Markovianity were **exactly `0.0`** (null placeholders) | KD reported **flat-relative** from the optimizer best objective (`kd_delta = +0.1230`); the TTM-inspired proxy **split** into a synthetic self-test (`nm = 1.41e-4` at α=0.1) and the model trajectory (`nm = 0`, Markovian by construction) | A reproducible, basis-optimized flat-relative KD comparison and a bounded backflow diagnostic, internally consistent under the implemented model | Comparative, **model-relative** signals — *not* contextuality or curvature-induced-decoherence proofs |
| Curved-spacetime metrics named in the papers were **absent from execution**; raw outputs were effectively null | Curvature drives the channel map `p = 1 - exp(-α·‖Riemann‖_F)` across six backgrounds; purity decay and entropy growth are computed and checked | Deterministic per-background purity (Schwarzschild `0.99943`, de Sitter `0.63607`, AdS5 `0.67764`, Eguchi-Hanson `0.99887`) and entropy | Internal behavior of a **phenomenological ansatz** with a free parameter α — *not* a derived spacetime result |
| Temporal and axiomatic properties were **asserted, not verified** | Five temporal-state axioms (linearity, CPTP completeness, trace preservation, conditionability, density validity) are checked to machine epsilon | Axiom deviations `<= 4.4e-16` — exact algebraic invariants of the representation | The model's quantum mechanics is **mathematically internally consistent** under the stated assumptions |

---

## Reference run (supporting evidence)

* **6-phase / 35-check pipeline (deterministic)**: 34 PASS, 0 FAIL, 0 SKIPPED, 1 DEGRADED_PASS over six backgrounds.
* **Negative result surfaced, not hidden**: the KD optimizer does not converge within its fixed step budget (`kd_optimization_converged = DEGRADED_PASS`). Stated in the artifact, not papered over.
* **Lean claim boundary** (4 fields): `external_physical_validation_provided = false`, `first_principles_derivation_provided = false`, `mathematical_consistency_scope_only = true`, `phenomenological_model = true`.
* **Reproducibility honesty**: the artifact hash anchors a specific frozen copy at source `9e1d845`; re-runs differ only by the `generated_at` timestamp, so it is *not* byte-deterministic — disclosed rather than faked.
* **Test evidence**: `pytest` 50 passed, 96% coverage (>= 90% gate) in CI; governance (phase6) moved to `experimental/` and excluded from the verdict path.

---

## Scope discipline (why this is a separate line, not a demotion)

QSOT2 is a **working, tested, provenance-hardened** phenomenological verifier. "Phenomenological" qualifies exactly one thing — the curvature→channel mapping is an ansatz, not a first-principles derivation — and is a **scope statement, not a deficiency**. The 3-line split (QSOT2 math / QSOT-Harness combined / sci-governance lib) gives each real asset its own stage rather than collapsing a math verifier, a publication harness, and a governance library into one over-claiming bundle. Numeric parity with QSOT-Harness r1 (now `0059`) is preserved through the clean migration; the differing artifact hash (`efca2228` vs `1498610f`) reflects only the **leaner schema**, not different math.

---

## Renumber provenance

QSOT2 occupies `0058` as the math-verification line. The earlier `0058` (QSOT-Harness combined r1) was **renumbered verbatim to `0059`** when the QSOT line split into three — a deliberate 3-line-split renumber, distinct from the in-place revision used for the pre-public r1 record. `0059`'s frozen `verification_result.json` and its provenance hashes (`1498610f`, superseding `69c97c92`, revision r1) are unchanged by the renumber.

---

## Reading Rule

Read `0058` as a **remediation record**: its deliverable is the auditable transformation of `0057`'s slop into a bounded, claim-labeled mathematical verifier. `Verified` (canonical artifact + reproduction receipt + source SHA), `ADVISORY` provenance, **model-consistency only**. The correction takes precedence: `0057` is the slop audit, `0058` is the honest math rebuild, and `0059` is the governance-rich combined sibling.
