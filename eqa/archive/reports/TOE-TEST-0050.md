# TOE-TEST-0050: Deferred Artifact Replay

Date: 2026-04-03
Scope: meta verification governance patch
Status: PASS

## Objective

Add bounded artifact replay to the deferred heavy-node tier so identical slow
delta runs can skip already-validated protein interaction/report nodes without
skipping changed fast-tier verification.

## Changes

- Added replay state handling to `src/toe/testing/meta_orchestrate.py`
- Added `--use-replay` to `cli/main.py`
- Exported replay state from `src/toe/testing/__init__.py`
- Fixed cached robustness helper in `src/toe/api/routers/physics.py` so it
  uses the full report wrapper
- Stabilized meta unit tests by replacing `tmp_path` with repo-local tempdirs in
  `tests/unit/test_meta_verify.py` and `tests/unit/test_meta_orchestrate.py`
- Fixed robustness report formatting in `src/toe/api/reports.py`

## Validation

### Unit

- `python -m pytest -q tests/unit/test_meta_verify.py tests/unit/test_meta_orchestrate.py`
- Result: `8 passed in 0.85s`

### Slow robustness node

- `python -m pytest -q --run-slow tests/integration/test_api_e2e.py::test_protein_inverse_fit_report_ensemble_robustness_endpoint_returns_stability_audit`
- Result: `1 passed in 3.39s`

### Orchestrated slow delta

Changed paths:

- `src/toe/api/reports.py`
- `src/toe/api/routers/physics.py`
- `src/toe/bio_quantum/protein_inverse_fit.py`
- `src/toe/testing/meta_orchestrate.py`

First run:

- `toe-meta --orchestrate --run-slow --write-manifest --format json`
- Result: `301 passed in 18.65s`
- Replay status: `used=false`

Second identical run:

- `toe-meta --orchestrate --run-slow --use-replay --write-manifest --format json`
- Result: `294 passed in 15.75s`
- Replay status: `used=true`
- `deferred_tests_replayed=7`

## Outcome

`0050` does not replace slow validation. It reuses the last successful slow-tier
evidence only when:

- affected surfaces match
- artifact fingerprints match
- deferred node set matches

Fast-tier selected tests still execute normally on every delta run.
