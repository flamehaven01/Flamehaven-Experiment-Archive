# TOE-TEST-0038: Interaction Hotspot Map

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_interaction_hotspots`.
>
> - It summarizes pairwise attribution into hotspot and stable-pair views.
> - Exclude it from verification-run counts. This is a bounded interaction-map
>   interpretation layer, not a physical hotspot measurement.

## Goal

Interpret pairwise metric-attribution output as hotspot pairs, stable pairs, and an overall interaction regime.

## Scope

- Add an interaction-hotspot endpoint
- Reuse current pairwise attribution results
- Surface hotspot pairs and stable pairs in a compact artifact

## Implementation

- Added `POST /api/protein_inverse_fit_interaction_hotspot_map`
- Reused pairwise attribution as the inner primitive
- Frontend biological category now exposes an interaction-hotspot action

## Hotspot Artifact

- Pair count
- Interaction regime
- Dominant pair
- Hotspot pairs
- Stable pairs

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "interaction_hotspot"
cd dashboard
npm run build
```

## Result

The current inverse-fit stack now provides an interpretation layer on top of pairwise attribution, making it easier to see where interaction-driven instability concentrates under the present bounded perturbation rule.
