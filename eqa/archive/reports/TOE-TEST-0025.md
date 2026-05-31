# TOE-TEST-0025: Inverse-Fit Citation Dependency Summary

Date: 2026-04-02  
Version: v4.10.0

## Goal

Expose which coefficient-level citation entries dominate the current
`protein_inverse_fit` explanation so the best candidate does not look like an
opaque optimizer output.

## Scope

- Add bounded citation-dependency weighting for inverse-fit candidates
- Include the summary in the best candidate payload
- Add SPAR traceability check `I7`
- Surface dominant entries in the frontend biological category

## Implementation

`protein_inverse_fit` now emits `citation_dependency_summary` with:

- `weighting_scheme`
- `ranked_entries`
- `dominant_entries`
- `covered_metrics`
- bounded scope note

The weighting scheme is intentionally heuristic and bounded. It expresses
interpretability support, not causal identification and not direct experimental
sensitivity.

## Verification

```powershell
python -m pytest -q `
  tests\unit\test_protein_inverse_fit.py `
  tests\integration\test_api_e2e.py `
  -k "protein_inverse_fit"
```

Observed result:

- `5 passed, 42 deselected`

## Interpretation

`0024` solved `coefficient -> citation entry`.  
`0025` solves `inverse-fit winner -> dominant citation entries`.

This reduces the risk that a top inverse-fit candidate is mistaken for a
physically unique identification when it is still a bounded diagnostic result.
