# TOE-TEST-0039: Interaction Phase Summary

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_interaction_phase_summary`.
>
> - It compresses hotspot output into a bounded phase-style summary.
> - Exclude it from verification-run counts. This remains a present-model
>   interpretation layer, not a physical phase summary.

## Goal

Compress interaction-hotspot output into a bounded phase-style summary that is easier to read than the full hotspot listing.

## Scope

- Add an interaction-phase summary endpoint
- Reuse current interaction-hotspot output
- Surface dominant family, stable family, and transition onset score

## Implementation

- Added `POST /api/protein_inverse_fit_interaction_phase_summary`
- Reused interaction-hotspot output as the inner primitive
- Frontend biological category now exposes an interaction-phase summary action

## Phase Summary Artifact

- Interaction regime
- Dominant family
- Stable family
- Dominant pair
- Transition onset score
- Hotspot and stable pair counts

## Verification

```bash
python -m pytest -q tests\integration\test_api_e2e.py -k "interaction_phase_summary"
cd dashboard
npm run build
```

## Result

The current pairwise interaction layer can now be compressed into a bounded phase-style summary. This remains a present-model interpretation layer, not a physical phase diagram.
