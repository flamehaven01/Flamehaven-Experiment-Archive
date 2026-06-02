# TOE-TEST-0047 — Request-Scoped Interaction Cache Rewiring

- Date: 2026-04-03
- Target: `Flamehaven-TOE v4.10.0`
- Scope: `src/toe/api/routers/physics.py`, `src/toe/api/reports.py`

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `meta_verify_request_cache_rewire`.
>
> - It removes duplicate route-layer recomposition through request-scoped cached
>   builders.
> - Exclude it from verification-run counts. This is route/runtime
>   optimization infrastructure, not a verification run.

## Goal

Finish the `0046` artifact-first optimization by removing the remaining inline
recomposition paths inside the heavy protein interaction/report endpoints.

This is not a new modeling step. It is an execution-governance patch meant to
reduce nested recomputation and make the route layer consistent with the
artifact-first kernel already introduced in `0046`.

## Patch Summary

The following endpoints now route through request-scoped cached builders:

- `/api/protein_inverse_fit_report_ensemble`
- `/api/protein_inverse_fit_report_ensemble_robustness`
- `/api/protein_inverse_fit_report_metric_attribution`
- `/api/protein_inverse_fit_report_pair_attribution`
- `/api/protein_inverse_fit_interaction_hotspot_map`
- `/api/protein_inverse_fit_interaction_phase_summary`
- `/api/protein_inverse_fit_interaction_regime_timeline`

Behavioral intent:

- keep the same API contract
- keep the same artifact/report shapes
- remove endpoint-level duplicate rebuilds of:
  - scenario kernels
  - ensemble artifacts
  - robustness artifacts
  - attribution artifacts
  - hotspot/phase/timeline composition

An additional wrapper fix in `api/reports.py` corrected hotspot report markdown
generation so it reads `hotspot_pairs` and `stable_pairs` from the compact
artifact instead of stale local names.

## Verification

### Targeted regression

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit_report or interaction_hotspot or interaction_phase_summary or interaction_regime_timeline"
```

Result:

- `3 passed, 52 deselected in 60.80s`

### Meta unit coverage

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\unit\test_meta_verify.py tests\unit\test_meta_orchestrate.py
```

Result:

- `7 passed in 0.73s`

### Orchestrated delta verification

Command:

```powershell
$env:PYTHONPATH='src'
python -c "from cli.main import meta_main; meta_main()" --changed-path src/toe/api/routers/physics.py --changed-path src/toe/api/reports.py --orchestrate --post-analyze --format json
```

Result:

- `293 passed in 49.73s`
- `selected_test_count = 34`
- `deferred_test_count = 7`
- `Ultra-Meta-Pytest quality_grade = B`

### Direct timeline timing

Payload: same compact 2-scenario payload used by the interaction timeline API
test (`n_steps=32`, `top_k=2`, `drift_points=3`, `boundary 3x3`,
`metrics=["target_t2_star", "target_contrast"]`).

Observed:

- first call: `~138.391s`
- second identical call: `~0.01s`

## Interpretation

This patch does not materially reduce cold-start cost by itself. The heavy
timeline route is still dominated by the underlying interaction/timeline kernel.

What it does achieve:

- removes duplicated route-layer recomposition
- aligns all heavy interaction/report endpoints with one cached artifact-first
  path
- preserves the same portable/report outputs
- keeps repeated same-payload requests effectively free

## Conclusion

`0047` is complete. The route layer is now structurally consistent with the
artifact-first kernel introduced in `0046`.

Remaining bottleneck:

- cold-start interaction/timeline kernel cost

That points to the next optimization target: reducing the reduced sweep kernel
itself rather than further rewriting route wrappers.
