# TOE-TEST-0048 — Candidate-Kernel Caching

- Date: 2026-04-03
- Target: `Flamehaven-TOE v4.10.0`
- Scope: `src/toe/bio_quantum/protein_inverse_fit.py`

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `meta_verify_candidate_kernel_cache`.
>
> - It caches target-independent candidate kernels to reduce cold-start sweep
>   cost.
> - Exclude it from verification-run counts. This is sidecar/runtime
>   optimization, not a direct verification outcome.

## Goal

Reduce the cold-start cost of the protein inverse-fit sweep stack by removing
repeated forward simulation for candidate combinations whose predicted witness
metrics do not depend on the current target.

Before this patch, the following layers repeatedly recomputed the same
`analyze_protein_spin_qubit(driver, profile, tuning, n_steps)` results:

- inverse-fit
- drift map
- boundary map
- metric attribution
- pair attribution
- interaction hotspot / phase / timeline

The target changes only affect residual scoring, not the underlying candidate
prediction kernel.

## Patch Summary

Added an internal cached kernel:

- `_cached_candidate_kernel(driver, profile_key, tuning, n_steps)`

This cache stores:

- `architecture_calibration`
- `predicted_metrics`
- `witness_verdict`

`_evaluate_candidate()` now reuses that kernel and only recomputes:

- residuals
- normalized residuals
- objective
- fit-quality label
- citation dependency weighting

## Verification

### Unit coverage

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\unit\test_protein_inverse_fit.py
```

Result:

- `6 passed in 9.87s`

Additional regression added:

- `test_inverse_fit_reuses_cached_candidate_kernel`

This test proves that two inverse-fit calls with different targets but the same
`driver/profile/tuning/n_steps` search space only evaluate the five tuning-grid
candidates once.

### Targeted interaction/report regression

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit_report or interaction_hotspot or interaction_phase_summary or interaction_regime_timeline"
```

Result:

- `3 passed, 52 deselected in 11.06s`

### Direct timeline timing

Payload: same compact 2-scenario interaction timeline request used by the API
test (`n_steps=32`, `top_k=2`, `drift_points=3`, `boundary 3x3`,
`metrics=["target_t2_star", "target_contrast"]`).

Observed:

- first call: `~12.214s`
- second identical call: `~0.009s`

Compared with the previous step:

- previous cold-start timeline: `~138s`
- current cold-start timeline: `~12s`

## Meta-Verify Observation

Command:

```powershell
$env:PYTHONPATH='src'
python -c "from cli.main import meta_main; meta_main()" --changed-path src/toe/api/routers/physics.py --changed-path src/toe/api/reports.py --changed-path src/toe/bio_quantum/protein_inverse_fit.py --orchestrate --post-analyze --format json
```

Observed:

- `291 passed`
- `3 failed`
- runtime `26.32s`

The 3 failures are **not** caused by this patch. They are the known Windows
temporary-directory ACL issue in:

- `tests/unit/test_pipeline_wiring.py::TestStorePhysicsFields::*`

## Conclusion

`0048` is the first optimization that materially reduces the cold-start cost of
the interaction/timeline kernel itself, not just route-level recomposition.

This closes the main bottleneck behind the previously observed multi-minute
protein interaction timeline path and makes the reduced sweep kernel viable for
routine delta verification.
