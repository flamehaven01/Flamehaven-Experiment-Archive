# MICA Playbook: QSOT2 Mathematical-Consistency Verification

This playbook governs the reference run and claim-governance record for QSOT2 v0.1.0.dev0 (the re-scoped math-verification successor of the v1.2.3 slop artifact recorded at toe-test-0057). QSOT2 is the mathematical line of the 3-line QSOT split; the governance-rich combined snapshot is recorded at toe-test-0059, and the reusable governance primitives are extracted into flamehaven-sci-governance.

## 1. Operating Rules & Governance
* **Claim Boundaries**: All computed metrics carry `ADVISORY` provenance under a lean 4-field claim boundary (`external_physical_validation_provided=false`, `first_principles_derivation_provided=false`, `mathematical_consistency_scope_only=true`, `phenomenological_model=true`). QSOT2 never asserts external physical validity, quantum-gravity validation, or a new physical law. Gate and verdict labels are policy-derived classifications, not physical observables.
* **Scope discipline**: QSOT2 carries ONLY the mathematical-consistency core. Governance machinery (the 7-class evidence taxonomy, calibration manifest, audit/backend surfacing) is deliberately NOT part of this line; phase6 governance is moved to `experimental/` and excluded from the verdict path.
* **Honest negatives**: KD optimizer non-convergence is surfaced as `DEGRADED_PASS`; the model trajectory is Markovian by construction (`nm = 0`). Neither is hidden.
* **No hidden hardcoding or stubbed core results**: Core mathematical outputs are config-driven or directly derived from executed state/channel evolution. The model package (`src/qsot2/model/`) must not import governance.

## 2. Playbook Steps (Reproduction Path)
1. Clone and install:
   ```bash
   git clone https://github.com/Flamehaven-Labs/QSOT2-Compiler
   cd QSOT2-Compiler
   pip install -e .[dev]
   ```
2. Run the reference experiment:
   ```bash
   python run_experiment.py --config configs/experiment.yaml --out reports
   ```
3. Verify the canonical outputs against this record:
   - Overall verdict: `DEGRADED_PASS` (34 / 0 / 0 / 1)
   - `kd_delta` (de Sitter minus flat) ~ `+0.1230` (from the optimizer best objective); the flat-baseline KD optimization remains non-converged
   - memory-kernel self-test `nm ~ 1.41e-4` at `alpha = 0.1`; model trajectory `nm = 0`
   - per-background purity: Schwarzschild `0.99943`, de Sitter `0.63607`, AdS5 `0.67764`, Eguchi-Hanson `0.99887`
   - temporal-state axiom deviations `<= 4.4e-16`
4. Verify the test suite: `python -m pytest` -> 50 passed, coverage 96% (>= 90% gate).

## 3. Notes
* Source: `Flamehaven-Labs/QSOT2-Compiler` at committed source `9e1d845` (version surface `0.1.0.dev0`; no release cut yet, no DOI yet).
* Result schema: `qsot2.math_consistency.experiment_result.v1` (lean); frozen artifact `verification_result.json` canonical-LF SHA-256 `efca2228...`.
* Numeric parity with QSOT-Harness r1 (now toe-test-0059) is preserved through the clean migration; the differing artifact hash vs `1498610f...` reflects only the leaner schema, not different math.
* Re-runs are content-stable except for the `generated_at` timestamp; not byte-deterministic, disclosed rather than faked.
