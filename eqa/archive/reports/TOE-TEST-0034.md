# TOE-TEST-0034: Scenario Robustness Layer

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_scenario_robustness`.
>
> - It audits bounded perturbation sensitivity of current scenario rankings.
> - Exclude it from verification-run counts. Its stable value is robustness
>   interpretation within the present surrogate stack, not a physical estimate.

## Goal

Audit whether current portable-report scenario rankings remain stable under bounded perturbations of target witness metrics.

## Scope

- Add a robustness endpoint for scenario ensembles
- Perturb current target metrics by bounded multiplicative factors
- Report top-label stability and exact rank-order match ratio

## Implementation

- Added `POST /api/protein_inverse_fit_report_ensemble_robustness`
- Reused current ensemble ranking artifact as the inner run primitive
- Frontend biological category now exposes a ranking-robustness audit action

## Robustness Artifact

- Run count
- Baseline best label
- Top-label stability
- Exact-order match ratio
- Best-label trace across perturbation factors

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

Portable inverse-fit scenario ranking now has a bounded sensitivity audit. This is a present-model robustness measure, not a statistical confidence interval over real biological systems.
