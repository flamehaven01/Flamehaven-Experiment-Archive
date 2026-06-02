# TOE-TEST-0046

## Title

Lightweight Report Kernel for Meta-Verify Delta Runs

## Date

2026-04-03

## Engine

Flamehaven-TOE v4.10.0

## Scope

This patch does not add a new physics model. It reduces internal overhead in
the protein inverse-fit report stack used by delta verification.

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `meta_verify_report_kernel_optimization`.
>
> - It introduces artifact-first report builders and a lightweight scenario
>   kernel for delta verification.
> - Exclude it from verification-run counts. This is internal optimization of
>   verification/report infrastructure, not a direct EQA result.

Target path:

- `protein_inverse_fit_report`
- `protein_inverse_fit_report_ensemble`
- `protein_inverse_fit_report_ensemble_robustness`
- `protein_inverse_fit_report_metric_attribution`
- `protein_inverse_fit_report_pair_attribution`
- `protein_inverse_fit_interaction_hotspot_map`
- `protein_inverse_fit_interaction_phase_summary`
- `protein_inverse_fit_interaction_regime_timeline`

## Problem

The previous implementation repeatedly carried full portable report payloads
through nested ensemble and attribution loops. That meant:

- large cached payloads
- repeated deep-copy overhead
- repeated report-markdown generation inside paths that only needed compact
  artifacts
- high cold-start cost in delta verification

This was visible even after `0045` heavy-node tiering. The selector was no
longer the main bottleneck; the remaining cost lived inside the report stack
itself.

## Patch

### 1. Artifact-first report builders

`src/toe/api/reports.py` now exposes artifact-first builders before Markdown
wrappers:

- `protein_inverse_fit_report_artifact`
- `protein_inverse_fit_report_ensemble_artifact`
- `protein_inverse_fit_report_ensemble_robustness_artifact`
- `protein_inverse_fit_report_metric_attribution_artifact`
- `protein_inverse_fit_report_pair_attribution_artifact`
- `protein_inverse_fit_report_interaction_hotspot_map_artifact`
- `protein_inverse_fit_report_interaction_phase_summary_artifact`
- `protein_inverse_fit_report_interaction_regime_timeline_artifact`

The public report functions now follow:

`artifact builder -> report_markdown wrapper`

instead of mixing both concerns in one path.

### 2. Lightweight scenario kernel

`src/toe/api/routers/physics.py` now adds:

- `_build_protein_inverse_fit_scenario_kernel`

This computes only the compact `artifact` needed by ensemble / robustness /
attribution / interaction layers, without carrying full report payloads through
the nested loops.

### 3. Cached artifact chain

The router now reuses compact artifact builders for:

- ensemble
- robustness
- metric attribution
- pair attribution
- interaction hotspot
- interaction phase
- interaction regime timeline

This keeps external API responses intact while shrinking the internal scoring
path used by delta verification.

## Verification

### Targeted API regression

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit_report or interaction_hotspot or interaction_phase_summary or interaction_regime_timeline"
```

Result:

```text
3 passed, 52 deselected in 69.78s
```

### Meta-verify unit tests

Command:

```powershell
$env:PYTHONPATH='src'
python -m pytest -q tests\unit\test_meta_verify.py tests\unit\test_meta_orchestrate.py
```

Result:

```text
7 passed in 1.10s
```

### Orchestrated delta run

Change set:

- `src/toe/api/routers/physics.py`
- `src/toe/api/reports.py`

Command:

```powershell
$env:PYTHONPATH='src'
python -c "from cli.main import meta_main; meta_main()" `
  --changed-path src/toe/api/routers/physics.py `
  --changed-path src/toe/api/reports.py `
  --orchestrate --post-analyze --format json
```

Result:

```text
293 passed in 44.43s
```

### Direct endpoint timing

Endpoint:

- `/api/protein_inverse_fit_interaction_regime_timeline`

Measured result with the current reduced payload:

- first call: `141.06s`
- second identical call: `0.007s`

## Assessment

The patch does not eliminate the cold-start cost of the timeline path. That
cost is still dominated by nested inverse-fit / sweep computations.

What it does achieve:

- smaller internal artifacts
- less repeated report construction overhead
- a materially faster fast-tier meta-verify run
- preserved external API contract

## Conclusion

`0046` is accepted.

This is the correct next step after `0045`. The remaining bottleneck is no
longer report-shape overhead; it is the cold-start numerical workload inside
the interaction/timeline stack itself.

The next optimization target should therefore focus on:

- reducing repeated inverse-fit lattice work
- reusing reduced sweep kernels
- or adding explicit cold-start/slow-path separation for the timeline family
