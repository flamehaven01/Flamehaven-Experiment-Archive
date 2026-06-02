# TOE-TEST-0045 -- Heavy-Node Tiering

Date: 2026-04-02
Engine: Flamehaven-TOE v4.10.0
Scope: Meta-verify selector refinement for heavy protein interaction/report nodes

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `meta_verify_heavy_node_tiering`.
>
> - It splits delta verification into required fast-tier tests and deferred
>   slow-tier tests.
> - Exclude it from verification-run counts. This is execution-governance
>   infrastructure, not a new verification result.

## Objective

After `0044`, the selector was no longer overreaching across unrelated API
surfaces, but the remaining protein interaction/report nodes were still too
heavy for the default day-to-day delta loop.

The goal of `0045` was to split those nodes into:

- a default fast delta tier
- an explicit slow delta tier

without losing traceability in the manifest.

## Patch

`src/toe/testing/meta_verify.py` now records two selected buckets:

- `required_tests`
- `deferred_tests`

The deferred tier currently contains the heaviest protein interaction/report
nodes:

- `test_protein_inverse_fit_report_ensemble_endpoint_returns_ranked_scenarios`
- `test_protein_inverse_fit_report_ensemble_robustness_endpoint_returns_stability_audit`
- `test_protein_inverse_fit_report_metric_attribution_endpoint_returns_metric_ranking`
- `test_protein_inverse_fit_report_pair_attribution_endpoint_returns_pair_ranking`
- `test_protein_inverse_fit_interaction_hotspot_map_endpoint_returns_hotspot_summary`
- `test_protein_inverse_fit_interaction_phase_summary_endpoint_returns_phase_summary`
- `test_protein_inverse_fit_interaction_regime_timeline_endpoint_returns_timeline_summary`

`cli/main.py` and `toe.testing.meta_orchestrate` were updated so:

- default `toe-meta --run` / `--orchestrate` executes only `required_tests`
- `--run-slow` reattaches the `deferred_tests`

## Verification

### Unit verification

`PYTHONPATH=src python -m pytest -q tests/unit/test_meta_verify.py tests/unit/test_meta_orchestrate.py`

Result:

- `7 passed`

### Manifest check

Change set:

- `src/toe/api/routers/physics.py`
- `src/toe/bio_quantum/protein_inverse_fit.py`

Observed manifest:

- `required_tests = 23`
- `deferred_tests = 7`

The required tier kept:

- protein spin-qubit endpoint checks
- protein architecture/calibration checks
- inverse-fit entry points
- drift/boundary/report/diff checks
- smoke core tests

The deferred tier kept:

- ensemble ranking
- ensemble robustness
- metric attribution
- pair attribution
- interaction hotspot
- interaction phase
- interaction timeline

### Fast orchestration run

Command:

```bash
toe-meta \
  --repo-root . \
  --changed-path src/toe/api/routers/physics.py \
  --changed-path src/toe/bio_quantum/protein_inverse_fit.py \
  --orchestrate \
  --post-analyze \
  --format json
```

Observed result:

- selected tests: `23`
- deferred tests: `7`
- pytest result: `194 passed in 71.13s`
- post-analysis: `status=ok`, `analysis_mode=lightweight_static`, `quality_grade=B`

## Interpretation

`0045` does not make the slow interaction/report family disappear. It makes the
split explicit:

- default delta verification is now bounded and documented
- heavy interaction/report nodes are still preserved in the manifest
- the slow tier is now opt-in instead of silently burdening the default loop

This moves the next optimization question away from selector design and toward
the heavy interaction/report implementations themselves.

## Verdict

`PASS`

The selector now carries an explicit fast/slow delta contract for the heaviest
protein interaction/report family, which is the correct governance shape for
the current Flamehaven-TOE verification stack.
