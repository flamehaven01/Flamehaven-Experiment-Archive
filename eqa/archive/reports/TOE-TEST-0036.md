# TOE-TEST-0036: Metric Attribution Layer

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_metric_attribution`.
>
> - It ranks single target metrics by bounded destabilizing effect.
> - Exclude it from verification-run counts. This is a diagnostic attribution
>   layer over sidecar inference, not a core-physics verification result.

## Goal

Identify which target witness metrics destabilize the current scenario ensemble most strongly under bounded perturbation.

## Scope

- Add a dedicated metric-attribution endpoint
- Perturb one target axis at a time
- Rank metrics by bounded instability score

## Implementation

- Added `POST /api/protein_inverse_fit_report_metric_attribution`
- Reused ensemble robustness as the inner primitive
- Frontend biological category now exposes a metric-attribution action

## Attribution Artifact

- Metric count
- Dominant destabilizing metric
- Ranked metric list
- Top-label stability per metric
- Exact-order match ratio per metric
- Failure mode per metric

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

The current inverse-fit stack can now say not only that ranking drift exists, but which target axis most strongly drives it under the present bounded perturbation rule.
