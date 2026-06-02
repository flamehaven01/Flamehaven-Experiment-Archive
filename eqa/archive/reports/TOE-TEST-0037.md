# TOE-TEST-0037: Pairwise Interaction Attribution

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_pair_attribution`.
>
> - It ranks metric pairs by bounded destabilizing interaction strength.
> - Exclude it from verification-run counts. Its stable claim is pairwise
>   attribution within the present inverse-fit stack, not a new EQA run.

## Goal

Identify which target-metric pairs destabilize the current scenario ensemble most strongly under bounded perturbation.

## Scope

- Add a pairwise attribution endpoint
- Perturb two target axes together
- Rank metric pairs by bounded instability score

## Implementation

- Added `POST /api/protein_inverse_fit_report_pair_attribution`
- Reused ensemble robustness as the inner primitive
- Frontend biological category now exposes a pairwise-attribution action

## Pair Attribution Artifact

- Pair count
- Dominant destabilizing pair
- Ranked pair list
- Top-label stability per pair
- Exact-order match ratio per pair
- Failure mode per pair

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "protein_inverse_fit"
cd dashboard
npm run build
```

## Result

The current inverse-fit stack can now say not only which single axis matters most, but which metric interactions most strongly destabilize the present ensemble under bounded pairwise perturbation.
