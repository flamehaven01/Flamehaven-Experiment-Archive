# TOE-TEST-0035: Robustness Explanation and Failure Modes

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_robustness_explanation`.
>
> - It explains why bounded ranking robustness drifts through explicit failure
>   modes and fragile scenarios.
> - Exclude it from verification-run counts. This is an interpretation layer
>   over scenario robustness, not a direct verification result.

## Goal

Explain why scenario rankings drift under bounded perturbation instead of reporting only aggregate robustness scores.

## Scope

- Extend the existing robustness endpoint
- Surface explicit failure modes
- Show dominant non-baseline winners
- Mark fragile scenarios that repeatedly fall away from the top rank

## Implementation

- Extended `POST /api/protein_inverse_fit_report_ensemble_robustness`
- Added `failure_mode`
- Added `dominant_nonbaseline_best_labels`
- Added `fragile_scenarios`
- Frontend biological category now displays these explanations

## Failure Modes

- `stable_under_bounded_perturbation`
- `rank_order_drift`
- `top_label_flip`

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

Robustness output is now interpretive as well as numerical. Ranking sensitivity can be traced to concrete scenario drift patterns under the current bounded perturbation rule.
