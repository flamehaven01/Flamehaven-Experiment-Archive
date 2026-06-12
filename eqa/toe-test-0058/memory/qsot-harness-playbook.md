# MICA Playbook: QSOT-Harness v2.1.0 Verification

This playbook governs the reference run and claim-governance record for QSOT-Harness v2.1.0 (the honest reconstruction of the v1.2.3 slop artifact recorded at toe-test-0057).

## 1. Operating Rules & Governance
* **Claim Boundaries**: All computed metrics carry `ADVISORY` provenance. The harness never asserts external physical validity, quantum-gravity validation, or a new physical law. Gate and verdict labels are policy-derived classifications, not physical observables.
* **Evidence labeling**: Every major observation must declare an evidence class (mathematical invariant / phenomenological model output / policy-derived classification / synthetic-harness output / external-review signal / optional-engine check / runtime-dependency status).
* **Honest negatives**: KD optimizer non-convergence is surfaced as `DEGRADED_PASS`; the model trajectory is Markovian by construction (`nm = 0`); an absent optional backend is `SKIPPED`. None of these are hidden.

## 2. Playbook Steps (Reproduction Path)
1. Clone and install:
   ```bash
   git clone https://github.com/Flamehaven-Labs/QSOT-Harness
   cd QSOT-Harness
   pip install -e .[dev,torch]
   ```
2. Build the Rust sidecar (requires libopenblas-dev on Linux):
   ```bash
   cd src/qsot_v2/rust_sidecar && cargo build --release && cd ../../..
   ```
3. Run the reference experiment:
   ```bash
   python run_experiment.py --config configs/experiment.yaml --out reports
   ```
4. Verify the canonical outputs against this record:
   - Overall verdict: `DEGRADED_PASS` (48 / 0 / 1 / 1)
   - `kd_delta` (de Sitter minus flat) ~ `+0.1115`; both KD optimizations non-converged
   - memory-kernel self-test `nm ~ 1.41e-3`; model trajectory `nm = 0`
   - audit `backend_mode` is `external` or `mock` depending on whether `spar_framework` is installed

## 3. Notes
* Reference commit: `26c0680`; release `v2.1.0` (`4f19078`); DOI `10.5281/zenodo.20656476`.
* Re-runs are content-stable except for the `generated_at` timestamp and the audit backend mode; the frozen artifact `verification_result.json` (canonical LF SHA-256 `b1a83df5...`, identical to the v2.1.0-archived `paper/evidence/result.json`) anchors the archived copy.
