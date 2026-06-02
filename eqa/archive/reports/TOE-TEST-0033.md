# TOE-TEST-0033: Scenario Ranking Layer

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_scenario_ranking`.
>
> - It ranks bounded inverse-fit report scenarios by present-model stability.
> - Exclude it from verification-run counts. This is a scenario-ranking layer
>   over sidecar diagnostics, not a core verification result.

## Goal

Rank multiple portable inverse-fit reports instead of evaluating each scenario in isolation.

## Scope

- Add an ensemble endpoint for multiple report scenarios
- Score current scenarios by bounded present-model stability
- Return a compact ranking artifact and Markdown summary

## Implementation

- Added `POST /api/protein_inverse_fit_report_ensemble`
- Added scenario request models
- Added `toe.api.reports.protein_inverse_fit_report_ensemble(...)`
- Frontend biological category now exposes a scenario-ranking action

## Ensemble Artifact

- Scenario count
- Best and worst labels
- Ranked scenario list
- Stability score
- Best candidate and dependency/family verdicts
- Drift and boundary burden terms

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

Portable inverse-fit diagnostics now support bounded scenario ranking. This ranking reflects current surrogate-model stability only and must not be interpreted as empirical biological performance.
