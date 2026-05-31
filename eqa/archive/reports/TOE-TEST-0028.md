# TOE-TEST-0028: Target Sweep Dependency Drift Map

Date: 2026-04-02  
Version: v4.10.0

## Goal

Extend inverse-fit governance from single-target analysis to target-space
stability analysis by sweeping one witness target and recording where the
dependency explanation changes.

## Scope

- Add `sweep_protein_inverse_fit_targets()`
- Add `POST /api/protein_inverse_fit_drift_map`
- Return drift-map points, transitions, and summary metadata
- Expose a minimal drift-map runner in the frontend biological category

## Result

The drift map now reports, for each sweep point:

- best driver/profile
- dominant entry
- dominant cluster
- dependency verdict
- family consistency verdict
- cluster and entry consensus ratios

It also reports:

- transition count
- entry switch count
- verdict switch count

This remains a bounded diagnostic map. It is not a real hardware phase diagram.

## Verification

```powershell
python -m pytest -q `
  tests\unit\test_protein_inverse_fit.py `
  tests\integration\test_api_e2e.py `
  -k "protein_inverse_fit"
```

Observed result:

- `7 passed, 42 deselected`

Frontend build:

```powershell
cd dashboard
npm run build
```

Observed result:

- build passed

## Interpretation

`0027` solved `single target -> family consistency`.  
`0028` solves `target sweep -> explanation drift map`.

This makes it easier to see where the current inverse-fit explanation is stable
and where it changes category as targets move.
