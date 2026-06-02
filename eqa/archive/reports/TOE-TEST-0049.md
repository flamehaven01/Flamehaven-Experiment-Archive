# TOE-TEST-0049 — LocalStore Tempdir Stabilization

- Date: 2026-04-03
- Target: `Flamehaven-TOE v4.10.0`
- Scope: `tests/unit/test_pipeline_wiring.py`

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `meta_verify_environment_stabilization`.
>
> - It removes environment-specific tempdir instability from the current delta
>   loop.
> - Exclude it from verification-run counts. This is test-environment
>   stabilization, not a new verification result.

## Goal

Remove the remaining environment-specific noise from the meta-verify delta loop.

After `0048`, the only failures left in the orchestrated delta run were not
protein/report regressions. They came from `LocalStore` wiring tests using
Python temporary directories that hit Windows ACL cleanup errors in this
environment.

## Patch Summary

Replaced the `tempfile.TemporaryDirectory()` helper used by the three
`TestStorePhysicsFields` tests with a deterministic repo-local helper:

- root: `.pytest-localstore/`
- case dir: `case_<uuid>`
- cleanup: `shutil.rmtree(..., ignore_errors=True)`

This keeps the tests fully local to the repo and avoids the failing temp ACL
path entirely.

## Verification

### LocalStore wiring tests

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\unit\test_pipeline_wiring.py -k "StorePhysicsFields"
```

Result:

- `3 passed, 10 deselected in 0.12s`

### Orchestrated meta delta

Command:

```powershell
$env:PYTHONPATH='src'
python -c "from cli.main import meta_main; meta_main()" --changed-path src/toe/api/routers/physics.py --changed-path src/toe/api/reports.py --changed-path src/toe/bio_quantum/protein_inverse_fit.py --changed-path tests/unit/test_pipeline_wiring.py --orchestrate --post-analyze --format json
```

Result:

- `294 passed in 21.44s`
- `selected_test_count = 30`
- `deferred_test_count = 7`
- `quality_grade = B`

## Conclusion

`0049` removes the last known environment-specific failure from the current
meta-verify loop. The delta pipeline is now clean on the present change set,
and remaining costs are dominated by intentional biological interaction/report
tests rather than temp-directory instability.
