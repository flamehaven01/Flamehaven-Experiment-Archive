# TOE-TEST-0040: Interaction Regime Timeline

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_interaction_timeline`.
>
> - It stacks attribution, hotspot, and phase outputs into one bounded
>   progression artifact.
> - Exclude it from verification-run counts. This is a compact interpretation
>   layer over the inverse-fit stack, not a physical regime history.

## Goal

Stack the current single-axis, pairwise, hotspot, and phase interaction
diagnostics into one bounded progression artifact that is easier to read than
separate reports.

## Scope

- Add an interaction-regime timeline endpoint
- Reuse the current metric attribution, pair attribution, hotspot, and phase
  summary layers
- Surface the current regime and dominant progression in one compact artifact

## Implementation

- Added `POST /api/protein_inverse_fit_interaction_regime_timeline`
- Reused the current interaction diagnostics instead of introducing a new
  physics model
- Frontend biological category now exposes a timeline action and report view

## Timeline Artifact

- Ordered stages from `single_axis` through `phase_summary`
- Current regime
- Dominant family
- Stable family
- Scope note for bounded present-model interpretation

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "interaction_regime_timeline"
cd dashboard
npm run build
```

## Result

The current bio-quantum interaction stack can now be compressed into one
progression artifact that shows how the explanation moves from single-axis
instability to pairwise interaction, hotspot concentration, and phase-style
summary. This remains an interpretation layer over the present inverse-fit
stack, not a physical phase history.
